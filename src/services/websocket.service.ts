import { io, Socket } from 'socket.io-client';
import { Board } from '@/types/board';
import { Task } from '@/types/task';

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
  private socket: Socket;
  private static instance: WebSocketService;
  private currentBoardId: string | null = null;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;

  private constructor() {
    const socketUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    this.socket = io(socketUrl, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      transports: ['websocket'],
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.socket.on('connect_error', (err) => {
      console.error(
        '❌ Connection error. Please check your internet connection.',
        err
      );
    });

    this.socket.on('error', (err) => {
      console.error('❌ Connection error. Please try again later.', err);
    });
  }

  static async initialize(): Promise<WebSocketService> {
    if (!this.instance) {
      const response = await fetch('/api/auth/token');
      if (!response.ok) throw new Error('Failed to authenticate');
      const data = await response.json();

      this.instance = new WebSocketService();
      this.instance.socket.auth = { token: data.token };
      this.instance.socket.connect();
    }
    return this.instance;
  }

  joinBoard(boardId: string) {
    this.currentBoardId = boardId;
    this.socket.emit('joinBoard', boardId);
  }

  leaveBoard(boardId: string) {
    this.currentBoardId = null;
    this.socket.emit('leaveBoard', boardId);
  }

  onBoardUpdate(callback: (board: Board) => void) {
    this.socket.on('boardUpdate', callback);
  }

  onTaskUpdate(
    callback: (data: { type: 'CREATE' | 'UPDATE'; task: Task }) => void
  ) {
    this.socket.on('taskUpdated', (data) => {
      callback({
        type: data.operation as 'CREATE' | 'UPDATE',
        task: data.task,
      });
    });
  }

  cleanup() {
    this.currentBoardId = null;
    this.socket.off('boardUpdate');
    this.socket.off('taskUpdated');
    this.socket.off('joinedBoard');
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
