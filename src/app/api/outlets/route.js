import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const [{ data: sections, error: secErr }, { data: outlets, error: outErr }] =
      await Promise.all([
        supabase.from('sections').select('*').order('created_at'),
        supabase.from('outlets').select('*').order('index'),
      ]);

    if (secErr) throw secErr;
    if (outErr) throw outErr;

    return NextResponse.json({
      success: true,
      sections: sections || [],
      outlets: outlets || [],
      total: (outlets || []).length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
