import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Get all boards' });
}

export async function POST() {
  return NextResponse.json({ message: 'Create new board' });
}
