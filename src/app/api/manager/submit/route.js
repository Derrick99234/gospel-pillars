import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';

export async function POST(request) {
  try {
    const { sectionId, submitterName } = await request.json();

    if (!sectionId) {
      return NextResponse.json(
        { success: false, message: 'sectionId is required' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const section = db.sections.find((s) => s.id === sectionId);
    if (!section) {
      return NextResponse.json(
        { success: false, message: 'Section not found' },
        { status: 404 }
      );
    }

    const drafts = db.drafts[sectionId] || {};
    const draftOutletIds = Object.keys(drafts);

    if (draftOutletIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No draft edits to submit for approval' },
        { status: 400 }
      );
    }

    // Build diff of changes
    const changes = draftOutletIds.map((outletId) => {
      const original = db.outlets.find((o) => o.id === outletId) || {};
      const updated = drafts[outletId];
      
      const diffFields = [];
      const keysToCheck = ['name', 'venue', 'address', 'city', 'state_or_province', 'country', 'postal_code', 'phone_numbers', 'landmarks'];
      keysToCheck.forEach((k) => {
        if (JSON.stringify(original[k]) !== JSON.stringify(updated[k])) {
          diffFields.push({
            field: k,
            old_value: original[k] ?? null,
            new_value: updated[k] ?? null,
          });
        }
      });

      return {
        outlet_id: outletId,
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
      submitted_by: submitterName || section.manager?.name || 'Section Coordinator',
      submitted_at: new Date().toISOString(),
      status: 'pending',
      changes,
      admin_notes: null,
      reviewed_at: null,
    };

    if (!db.submissions) {
      db.submissions = [];
    }
    db.submissions.unshift(newSubmission);

    // Clear drafts for this section
    delete db.drafts[sectionId];
    saveDatabase(db);

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
