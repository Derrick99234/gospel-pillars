import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: All sections with outlet & pending submission counts
export async function GET() {
  try {
    const [
      { data: sections, error: secErr },
      { data: outlets, error: outErr },
      { data: pendingSubs, error: subErr },
    ] = await Promise.all([
      supabase.from('sections').select('*').order('created_at'),
      supabase.from('outlets').select('id, section_id'),
      supabase.from('submissions').select('section_id').eq('status', 'pending'),
    ]);

    if (secErr) throw secErr;
    if (outErr) throw outErr;
    if (subErr) throw subErr;

    const sectionsWithStats = (sections || []).map((sec) => ({
      ...sec,
      outletCount: (outlets || []).filter((o) => o.section_id === sec.id).length,
      pendingCount: (pendingSubs || []).filter((s) => s.section_id === sec.id).length,
    }));

    return NextResponse.json({ success: true, sections: sectionsWithStats });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST: Create new section & manager login
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, display_name, manager_username, manager_password, manager_name } = body;

    if (!name || !manager_username || !manager_password) {
      return NextResponse.json(
        { success: false, message: 'Name, manager username, and password are required' },
        { status: 400 }
      );
    }

    // Check username uniqueness
    const { data: existing } = await supabase
      .from('sections')
      .select('id')
      .ilike('manager_username', manager_username.trim())
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Username is already taken. Please choose another.' },
        { status: 400 }
      );
    }

    // Also block 'admin' username
    if (manager_username.trim().toLowerCase() === 'admin') {
      return NextResponse.json(
        { success: false, message: 'Username is already taken. Please choose another.' },
        { status: 400 }
      );
    }

    const newId = (display_name || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `section-${Date.now()}`;

    const newSection = {
      id: newId,
      name: name.trim(),
      display_name: (display_name || name).trim(),
      manager_username: manager_username.trim(),
      manager_password: manager_password.trim(),
      manager_name: (manager_name || `${display_name || name} Coordinator`).trim(),
      created_at: new Date().toISOString(),
    };

    const { data: inserted, error: insErr } = await supabase
      .from('sections')
      .insert(newSection)
      .select()
      .single();

    if (insErr) throw insErr;

    return NextResponse.json({
      success: true,
      message: `Section "${inserted.display_name}" and manager login created successfully!`,
      section: inserted,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update section manager credentials
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, name, display_name, manager_username, manager_password, manager_name } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Section id is required' },
        { status: 400 }
      );
    }

    const updates = {};
    if (name) updates.name = name.trim();
    if (display_name) updates.display_name = display_name.trim();
    if (manager_username) updates.manager_username = manager_username.trim();
    if (manager_password) updates.manager_password = manager_password.trim();
    if (manager_name) updates.manager_name = manager_name.trim();

    const { data: updated, error: updErr } = await supabase
      .from('sections')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updErr) throw updErr;
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Section updated successfully',
      section: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
