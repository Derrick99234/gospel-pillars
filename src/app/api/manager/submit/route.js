import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { sectionId, submitterName } = await request.json();

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

    // Get all outlets for this section to find matching drafts
    const { data: sectionOutlets, error: outErr } = await supabase
      .from('outlets')
      .select('*')
      .eq('section_id', sectionId);

    if (outErr) throw outErr;

    const outletIds = (sectionOutlets || []).map((o) => o.id);

    // Fetch drafts for this section
    const { data: drafts, error: draftErr } = await supabase
      .from('drafts')
      .select('*')
      .in('outlet_id', outletIds.length > 0 ? outletIds : ['__none__']);

    if (draftErr) throw draftErr;
    if (!drafts || drafts.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No draft edits to submit for approval' },
        { status: 400 }
      );
    }

    // Build diff of changes
    const outletMap = {};
    (sectionOutlets || []).forEach((o) => {
      outletMap[o.id] = o;
    });

    const keysToCheck = [
      'name', 'venue', 'address', 'city', 'state_or_province',
      'country', 'postal_code', 'phone_numbers', 'landmarks',
    ];

    const changes = drafts.map((d) => {
      const original = outletMap[d.outlet_id] || {};
      const updated = d.draft_data;

      const diffFields = keysToCheck
        .filter((k) => JSON.stringify(original[k]) !== JSON.stringify(updated[k]))
        .map((k) => ({
          field: k,
          old_value: original[k] ?? null,
          new_value: updated[k] ?? null,
        }));

      return {
        outlet_id: d.outlet_id,
        outlet_name: updated.name || original.name,
        original,
        updated,
        diff_fields: diffFields,
      };
    });

    const submissionId = `sub-${Date.now()}`;
    const newSubmission = {
      id: submissionId,
      section_id: sectionId,
      section_name: section.name,
      display_name: section.display_name,
      submitted_by: submitterName || section.manager_name || 'Section Coordinator',
      submitted_at: new Date().toISOString(),
      status: 'pending',
      changes,
      admin_notes: null,
      reviewed_at: null,
    };

    // Insert submission
    const { error: subErr } = await supabase
      .from('submissions')
      .insert(newSubmission);

    if (subErr) throw subErr;

    // Delete drafts for this section
    const { error: delErr } = await supabase
      .from('drafts')
      .delete()
      .in('outlet_id', drafts.map((d) => d.outlet_id));

    if (delErr) throw delErr;

    return NextResponse.json({
      success: true,
      message: 'Changes submitted for admin approval successfully!',
      submission: newSubmission,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
