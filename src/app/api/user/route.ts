import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Get user profile' });
}

export async function PUT() {
  return NextResponse.json({ message: 'Update user profile' });
}
