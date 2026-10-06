import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Fetch outlets + drafts for a section
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('sectionId');

    if (!sectionId) {
      return NextResponse.json(
        { success: false, message: 'sectionId is required' },
        { status: 400 }
      );
    }

    // Fetch section
    const { data: section, error: secErr } = await supabase
      .from('sections')
      .select('*')
      .eq('id', sectionId)
      .single();

    if (secErr || !section) {
      return NextResponse.json(
        { success: false, message: 'Section not found' },
        { status: 404 }
      );
    }

    // Fetch live outlets for this section
    const { data: baseOutlets, error: outErr } = await supabase
      .from('outlets')
      .select('*')
      .eq('section_id', sectionId)
      .order('index');

    if (outErr) throw outErr;

    // Fetch active drafts for this section
    const outletIds = (baseOutlets || []).map((o) => o.id);
    let draftsMap = {};
    if (outletIds.length > 0) {
      const { data: drafts, error: draftErr } = await supabase
        .from('drafts')
        .select('*')
        .in('outlet_id', outletIds);

      if (draftErr) throw draftErr;
      (drafts || []).forEach((d) => {
        draftsMap[d.outlet_id] = d.draft_data;
      });
    }

    // Merge drafts into outlets
    const mergedOutlets = (baseOutlets || []).map((outlet) => {
      const draft = draftsMap[outlet.id];
      if (draft) {
        return { ...outlet, ...draft, has_draft: true };
      }
      return { ...outlet, has_draft: false };
    });

    const draftCount = Object.keys(draftsMap).length;

    // Check for active pending submission
    const { data: pendingSubs } = await supabase
      .from('submissions')
      .select('*')
      .eq('section_id', sectionId)
      .eq('status', 'pending')
      .limit(1);

    return NextResponse.json({
      success: true,
      section,
      outlets: mergedOutlets,
      hasDrafts: draftCount > 0,
      draftCount,
      pendingSubmission: (pendingSubs && pendingSubs[0]) || null,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST: Save draft edit for an outlet
export async function POST(request) {
  try {
    const body = await request.json();
    const { sectionId, outletId, updatedData } = body;

    if (!sectionId || !outletId || !updatedData) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify outlet exists
    const { data: original, error: origErr } = await supabase
      .from('outlets')
      .select('*')
      .eq('id', outletId)
      .single();

    if (origErr || !original) {
      return NextResponse.json(
        { success: false, message: 'Outlet not found' },
        { status: 404 }
      );
    }

    const draftData = {
      ...original,
      ...updatedData,
      id: outletId,
      section_id: sectionId,
      draft_updated_at: new Date().toISOString(),
    };

    // Upsert draft
    const { error: upsertErr } = await supabase.from('drafts').upsert({
      outlet_id: outletId,
      draft_data: draftData,
      updated_at: new Date().toISOString(),
    });

    if (upsertErr) throw upsertErr;

    // Count current drafts for this section
    const { data: allOutlets } = await supabase
      .from('outlets')
      .select('id')
      .eq('section_id', sectionId);
    const outletIds = (allOutlets || []).map((o) => o.id);
    const { count } = await supabase
      .from('drafts')
      .select('outlet_id', { count: 'exact', head: true })
      .in('outlet_id', outletIds);

    return NextResponse.json({
      success: true,
      message: 'Draft saved successfully',
      draftCount: count || 1,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
