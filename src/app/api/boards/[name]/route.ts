import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  return NextResponse.json({ message: `Get board ${params.name}` });
}

export async function PUT(
  request: Request,
  { params }: { params: { name: string } }
) {
  return NextResponse.json({ message: `Update board ${params.name}` });
}

export async function DELETE(
  request: Request,
  { params }: { params: { name: string } }
) {
  return NextResponse.json({ message: `Delete board ${params.name}` });
}
