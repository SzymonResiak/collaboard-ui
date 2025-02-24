import { io, Socket } from 'socket.io-client';
import { Board } from '@/types/board';
import { Task } from '@/types/task';
import { Group } from '@/types/group';
import { updateCache } from '@/hooks/useResourceCache';
import { debounce } from 'lodash';
import { BoardOrder } from '@/types/board';

interface WebSocketMessage {
  type: string;
  data: {
    task: Task;
    operation: 'CREATE' | 'UPDATE';
  };
  source?: 'websocket' | 'local';
}

interface TaskUpdateData {
  operation: 'CREATE' | 'UPDATE';
  task: Task;
  source?: 'websocket' | 'local';
}

/**
 * Service handling real-time communication with the server using WebSocket.
 * Manages board updates, task changes, and connection state.
 *
 * Flow:
 * 1. Initialize with auth token
 * 2. Connect to WebSocket server
 * 3. Join specific board room
 * 4. Listen for updates (board changes, task updates)
 * 5. Clean up on disconnect
 */
export class WebSocketService {
  private socket: Socket | null = null;
  private static instance: WebSocketService;
  private currentBoardId: string | null = null;
  private groupsSocket: Socket;
  private boardsSocket: Socket;
  private taskCreatedCallbacks: Set<(task: Task) => void> = new Set();
  private taskUpdatedCallbacks: Set<
    (data: {
      type: 'CREATE' | 'UPDATE';
      task: Task;
      source?: 'websocket' | 'local';
    }) => void
  > = new Set();
  private isConnecting: boolean = false;
  private boardState: Board | null = null;
  private boardUpdateCallbacks: Set<(board: Board) => void> = new Set();

  // Dodajemy buforowanie dla częstych aktualizacji
  private updateBuffer = new Map<string, Task>();
  private flushTimeout: NodeJS.Timeout | null = null;

  // Dodajmy stan dla ostatnio otrzymanych tasków
  private lastReceivedTasks = new Map<string, Task>();
  private updateTimeout: NodeJS.Timeout | null = null;

  // Dodajmy referencje do wszystkich subskrypcji
  private taskSubscription: (() => void) | null = null;
  private boardSubscription: (() => void) | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  // Dodajemy nowe pole do śledzenia aktualnego orderMap
  private currentOrderMap: BoardOrder = {};

  // Dodajemy pole na token
  private authToken: string | null = null;
  private tokenExpiryTime: number | null = null;

  private flushUpdates = debounce(() => {
    if (this.updateBuffer.size > 0) {
      const updates = Array.from(this.updateBuffer.values());
      this.updateBuffer.clear();
      this.taskUpdatedCallbacks.forEach((cb) =>
        updates.forEach((update) =>
          cb({
            type: 'UPDATE',
            task: update,
            source: 'websocket',
          })
        )
      );
    }
  }, 100);

  private constructor() {
    const socketUrl = process.env.NEXT_PUBLIC_API_URL;

    this.boardsSocket = io(`${socketUrl}/boards`, {
      autoConnect: false,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    this.groupsSocket = io(`${socketUrl}/groups`, {
      autoConnect: false,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.boardsSocket.on('connect', () => {
      console.log('Connected to boards socket');
    });

    this.groupsSocket.on('connect', () => {
      console.log('Connected to groups socket');
    });

    this.boardsSocket.on('boardsUpdate', (boards: Board[]) => {
      console.log('Received boards update:', boards);
      boards.forEach((board) => {
        updateCache(`/api/boards/${board.id}`, board);
      });
    });

    this.groupsSocket.on('groupsUpdate', (groups: Group[]) => {
      console.log('Received groups update:', groups);
      groups.forEach((group) => {
        updateCache(`/api/groups/${group.id}`, group);
      });
    });
  }

  private setupTasksUpdateHandler() {
    this.socket?.on(
      'tasks:update',
      (data: {
        operation: 'CREATE' | 'UPDATE';
        task: Task;
        boardId: string;
      }) => {
        if (data.boardId === this.currentBoardId) {
          if (data.operation === 'CREATE') {
            // Aktualizujemy boardState
            if (this.boardState) {
              this.boardState = {
                ...this.boardState,
                tasks: [...this.boardState.tasks, data.task],
              };
            }

            // Powiadamiamy callbacki z zachowaniem orderMap
            this.taskUpdatedCallbacks.forEach((callback) =>
              callback({
                type: data.operation,
                task: data.task,
                source: 'websocket',
              })
            );
          }
        }
      }
    );
  }

  async joinBoard(boardId: string): Promise<void> {
    if (!this.socket?.connected) {
      console.error('[WebSocket] Cannot join board - socket not connected');
      throw new Error('WebSocket not connected');
    }

    console.log('[WebSocket] Joining board:', boardId);
    this.currentBoardId = boardId;

    // Usuń poprzednie nasłuchiwacze przed dodaniem nowych
    this.socket.off('boardUpdated');
    this.socket.off('tasks:update');

    // Dołącz do pokoju
    this.socket.emit('joinBoard', boardId);

    // Nasłuchuj na zmiany w boardzie
    this.socket.on('boardUpdated', (updatedBoard: Board) => {
      console.log('[WebSocket] Board updated:', updatedBoard.id);
      if (updatedBoard.id === this.currentBoardId) {
        this.boardState = updatedBoard;
        this.boardUpdateCallbacks.forEach((cb) => cb(updatedBoard));
      }
    });

    // Nasłuchuj na zmiany w taskach
    this.socket.on('tasks:update', (data: TaskUpdateData) => {
      console.log('[WebSocket] Task update received:', data);

      if (data.operation === 'CREATE') {
        this.taskCreatedCallbacks.forEach((cb) => cb(data.task));
      } else {
        this.taskUpdatedCallbacks.forEach((cb) =>
          cb({
            type: data.operation,
            task: data.task,
            source: 'websocket',
          })
        );
      }
    });
  }

  private async fetchCurrentBoard() {
    if (!this.currentBoardId) return;

    try {
      const response = await fetch(`/api/boards/${this.currentBoardId}`);
      if (!response.ok) throw new Error('Failed to fetch board');
      const board = await response.json();
      this.boardState = board;
      this.boardUpdateCallbacks.forEach((cb) => cb(board));
    } catch (error) {
      console.error('Failed to fetch updated board:', error);
    }
  }

  leaveBoard(boardId: string) {
    console.log('[WebSocket] Leaving board:', boardId);
    this.isConnecting = false;

    this.taskCreatedCallbacks.clear();
    this.taskUpdatedCallbacks.clear();

    if (this.socket) {
      this.socket.emit('leaveBoard', boardId);
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.currentBoardId = null;
    this.boardState = null;

    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    window.removeEventListener('offline', this.handleOffline);
    window.removeEventListener('online', this.handleOnline);
  }

  private handleBeforeUnload = () => {
    if (this.currentBoardId) {
      this.leaveBoard(this.currentBoardId);
    }
  };

  private handleOffline = () => {
    if (this.currentBoardId) {
      this.leaveBoard(this.currentBoardId);
    }
  };

  private handleOnline = () => {
    if (this.currentBoardId) {
      this.joinBoard(this.currentBoardId);
    }
  };

  onBoardUpdate(callback: (board: Board) => void) {
    console.log('[WebSocket] Adding board update callback');
    this.boardUpdateCallbacks.add(callback);
    return () => {
      console.log('[WebSocket] Removing board update callback');
      this.boardUpdateCallbacks.delete(callback);
    };
  }

  onTaskCreated(callback: (task: Task) => void) {
    console.log('[WebSocket] Adding onTaskCreated callback');
    this.taskCreatedCallbacks.add(callback);
    return () => {
      console.log('[WebSocket] Removing onTaskCreated callback');
      this.taskCreatedCallbacks.delete(callback);
    };
  }

  onTaskUpdated(
    callback: (data: {
      type: 'CREATE' | 'UPDATE';
      task: Task;
      source?: 'websocket' | 'local';
    }) => void
  ) {
    this.taskUpdatedCallbacks.add(callback);
    return () => {
      this.taskUpdatedCallbacks.delete(callback);
    };
  }

  // Dodajemy buforowanie dla częstych aktualizacji
  private handleTaskUpdate(data: {
    operation: 'CREATE' | 'UPDATE';
    task: Task;
  }) {
    // Zapisujemy najnowszy stan taska
    this.lastReceivedTasks.set(data.task.id!, data.task);

    // Czekamy na więcej aktualizacji przed wysłaniem
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    this.updateTimeout = setTimeout(() => {
      // Pobieramy aktualny stan tablicy tylko raz dla wszystkich aktualizacji
      this.fetchAndUpdateBoard();
    }, 100);
  }

  private async fetchAndUpdateBoard() {
    if (!this.currentBoardId || !this.boardState) return;

    try {
      const response = await fetch(`/api/boards/${this.currentBoardId}`);
      if (!response.ok) throw new Error('Failed to fetch board');

      const currentBoard = await response.json();

      // Aktualizujemy tylko jeśli są różnice
      const hasChanges = this.checkForChanges(currentBoard);

      if (hasChanges) {
        this.boardState = currentBoard;
        this.boardUpdateCallbacks.forEach((cb) => cb(currentBoard));
      }
    } catch (error) {
      console.error('Failed to fetch board:', error);
    } finally {
      this.lastReceivedTasks.clear();
      this.updateTimeout = null;
    }
  }

  private checkForChanges(newBoard: Board): boolean {
    if (!this.boardState) return true;

    // Sprawdzamy czy są nowe taski lub zmiany w istniejących
    return newBoard.tasks.some((newTask) => {
      const existingTask = this.boardState!.tasks.find(
        (t) => t.id === newTask.id
      );
      return (
        !existingTask ||
        JSON.stringify(existingTask) !== JSON.stringify(newTask)
      );
    });
  }

  cleanup(clearOrderMap = true) {
    this.isConnecting = false;

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.currentBoardId = null;
    this.boardState = null;
    this.taskCreatedCallbacks.clear();
    this.taskUpdatedCallbacks.clear();
    this.boardUpdateCallbacks.clear();
    this.clearAuthToken();

    if (clearOrderMap) {
      this.currentOrderMap = {};
    }
  }

  disconnect() {
    this.cleanup();
    this.boardsSocket.disconnect();
    this.groupsSocket.disconnect();
  }

  handleMessage(message: MessageEvent) {
    const data: WebSocketMessage = JSON.parse(message.data);
    data.source = 'websocket';
  }

  private handleConnectionError = (err: Error) => {
    console.error(
      '❌ Connection error. Please check your internet connection.',
      err
    );
  };

  private handleError = (err: Error) => {
    console.error('❌ Connection error. Please try again later.', err);
  };

  // Modyfikujemy updateOrderMap aby zachowywać poprzedni stan
  updateOrderMap(orderMap: BoardOrder) {
    // Zachowujemy istniejące kolumny
    this.currentOrderMap = {
      ...this.currentOrderMap,
      ...orderMap,
    };
  }

  static async initialize(): Promise<WebSocketService> {
    if (!this.instance) {
      this.instance = new WebSocketService();
      await this.instance.initializeSocket();
    } else {
      // Jeśli instancja istnieje, ale socket jest rozłączony, zainicjalizuj ponownie
      if (!this.instance.socket?.connected) {
        await this.instance.initializeSocket();
      }
    }

    return this.instance;
  }

  private async getAuthToken(): Promise<string> {
    // Jeśli mamy token i nie wygasł, używamy go
    if (
      this.authToken &&
      this.tokenExpiryTime &&
      Date.now() < this.tokenExpiryTime
    ) {
      return this.authToken;
    }

    // W przeciwnym razie pobieramy nowy
    try {
      const response = await fetch('/api/auth/token');
      if (!response.ok) {
        throw new Error(`Failed to fetch auth token: ${response.status}`);
      }
      const { token } = await response.json();

      this.authToken = token;
      // Ustawiamy czas wygaśnięcia na np. 6 dni (token ważny 7 dni)
      this.tokenExpiryTime = Date.now() + 6 * 24 * 60 * 60 * 1000;

      return token;
    } catch (error) {
      console.error('[WebSocket] Failed to get auth token:', error);
      throw error;
    }
  }

  private async initializeSocket() {
    try {
      const token = await this.getAuthToken();
      const socketUrl = process.env.NEXT_PUBLIC_API_URL;

      // Zamknij istniejące połączenie, jeśli istnieje
      if (this.socket) {
        this.socket.close();
      }

      this.socket = io(socketUrl, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
      });

      // Czekamy na połączenie
      await new Promise<void>((resolve, reject) => {
        this.socket!.once('connect', () => {
          console.log('[WebSocket] Connected successfully');
          resolve();
        });

        this.socket!.once('connect_error', (error) => {
          console.error('[WebSocket] Connection error:', error);
          reject(error);
        });

        this.socket!.connect();
      });

      this.setupSocketListeners();
    } catch (error) {
      console.error('[WebSocket] Initialization error:', error);
      throw error;
    }
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('[WebSocket] Connected successfully');
      console.log('[WebSocket] Socket ID:', this.socket?.id);
    });

    this.socket.on('connect_error', (error) => {
      console.error('[WebSocket] Connection error:', error);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[WebSocket] Disconnected:', reason);
    });

    this.socket.on('error', (error) => {
      console.error('[WebSocket] Socket error:', error);
    });

    this.socket.on('joinedBoard', (data) => {
      console.log('[WebSocket] Joined board:', data);
    });

    this.socket.on('viewersUpdated', (data) => {
      console.log('[WebSocket] Active viewers updated:', data);
    });

    this.socket.on('tasks:update', (data: TaskUpdateData) => {
      console.log('[WebSocket] Received task update:', data);

      if (data.operation === 'CREATE') {
        this.taskCreatedCallbacks.forEach((cb) => cb(data.task));
      } else {
        this.taskUpdatedCallbacks.forEach((cb) =>
          cb({
            type: data.operation,
            task: data.task,
            source: 'websocket',
          })
        );
      }
    });
  }

  // Dodajemy metodę do czyszczenia tokenu przy wylogowaniu
  clearAuthToken() {
    this.authToken = null;
    this.tokenExpiryTime = null;
  }
}
