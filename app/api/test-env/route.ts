import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || null,
  });
}

