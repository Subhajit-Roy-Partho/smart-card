import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { success: false, message: 'This API route is deprecated.' },
    { status: 404 }
  );
}
