import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';

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

    const db = getDatabase();
    const section = db.sections.find((s) => s.id === sectionId);
    if (!section) {
      return NextResponse.json(
        { success: false, message: 'Section not found' },
        { status: 404 }
      );
    }

    // Get live outlets for this section
    const baseOutlets = db.outlets.filter((o) => o.section_id === sectionId);

    // Get active drafts for this section
    const drafts = db.drafts[sectionId] || {};

    // Merge base outlets with any drafts
    const mergedOutlets = baseOutlets.map((outlet) => {
      const draft = drafts[outlet.id];
      if (draft) {
        return {
          ...outlet,
          ...draft,
          has_draft: true,
        };
      }
      return {
        ...outlet,
        has_draft: false,
      };
    });

    // Check if there is an active pending submission
    const pendingSubmission = db.submissions.find(
      (sub) => sub.section_id === sectionId && sub.status === 'pending'
    );

    return NextResponse.json({
      success: true,
      section,
      outlets: mergedOutlets,
      hasDrafts: Object.keys(drafts).length > 0,
      draftCount: Object.keys(drafts).length,
      pendingSubmission: pendingSubmission || null,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Save draft edit for an outlet
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

    const db = getDatabase();
    if (!db.drafts[sectionId]) {
      db.drafts[sectionId] = {};
    }

    // Find original outlet
    const original = db.outlets.find((o) => o.id === outletId);
    if (!original) {
      return NextResponse.json(
        { success: false, message: 'Outlet not found' },
        { status: 404 }
      );
    }

    // Save updated fields into draft
    db.drafts[sectionId][outletId] = {
      ...original,
      ...updatedData,
      id: outletId,
      section_id: sectionId,
      draft_updated_at: new Date().toISOString(),
    };

    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: 'Draft saved successfully',
      draftCount: Object.keys(db.drafts[sectionId]).length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
