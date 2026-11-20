import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function isAdmin(request) {
  return request.headers.get('x-admin-token') === process.env.ADMIN_PASSWORD;
}

// DELETE /api/ark-bookings/[id]
export async function DELETE(request, { params }) {
  if (!isAdmin(request)) return NextResponse.json({ success: false }, { status: 401 });

  const { error } = await supabase
    .from('ark_garden_bookings')
    .delete()
    .eq('id', params.id);

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

// PATCH /api/ark-bookings/[id] — update status
export async function PATCH(request, { params }) {
  if (!isAdmin(request)) return NextResponse.json({ success: false }, { status: 401 });

  const { status } = await request.json();

  const { data, error } = await supabase
    .from('ark_garden_bookings')
    .update({ status })
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, booking: data });
}
