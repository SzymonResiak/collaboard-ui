import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/boards?${searchParams}`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Cache-Control': 'no-store, must-revalidate',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to fetch boards' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: 'An error occurred while fetching boards', err },
      { status: 500 }
    );
  }
}
