import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/db';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    const result = authenticateUser(username, password);

    if (!result.authenticated) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: result,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
