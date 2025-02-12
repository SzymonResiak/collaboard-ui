import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  return NextResponse.json({ message: `Get group ${params.name}` });
}

export async function PUT(
  request: Request,
  { params }: { params: { name: string } }
) {
  return NextResponse.json({ message: `Update group ${params.name}` });
}

export async function DELETE(
  request: Request,
  { params }: { params: { name: string } }
) {
  return NextResponse.json({ message: `Delete group ${params.name}` });
}
