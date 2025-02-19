import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken');

    if (!token) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 });
    }

    return NextResponse.json({ token: token.value });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get token' }, { status: 500 });
  }
}
