import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST /api/ark-bookings — submit a new booking (public)
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, check_in, check_out, room_type, guests, message } = body;

    if (!name || !email || !phone || !check_in || !check_out || !room_type) {
      return NextResponse.json({ success: false, message: 'Please fill in all required fields.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('ark_garden_bookings')
      .insert([{ name, email, phone, check_in, check_out, room_type, guests: guests || 1, message: message || null }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, booking: data });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// GET /api/ark-bookings — list all bookings (admin only)
export async function GET(request) {
  const auth = request.headers.get('x-admin-token');
  if (auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('ark_garden_bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, bookings: data });
}
