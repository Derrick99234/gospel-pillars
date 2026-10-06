import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';

export async function GET() {
  try {
    const db = getDatabase();
    return NextResponse.json({
      success: true,
      submissions: db.submissions || [],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Approve or Reject submission
export async function POST(request) {
  try {
    const { submission_id, action, notes, admin_name } = await request.json();

    if (!submission_id || !action) {
      return NextResponse.json(
        { success: false, message: 'submission_id and action are required' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const subIndex = (db.submissions || []).findIndex((s) => s.id === submission_id);

    if (subIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Submission not found' },
        { status: 404 }
      );
    }

    const submission = db.submissions[subIndex];

    if (action === 'approve') {
      // Merge each approved outlet into db.outlets
      submission.changes.forEach((item) => {
        const outletIndex = db.outlets.findIndex((o) => o.id === item.outlet_id);
        if (outletIndex !== -1) {
          db.outlets[outletIndex] = {
            ...db.outlets[outletIndex],
            ...item.updated,
            status: 'approved',
            updated_at: new Date().toISOString(),
          };
        } else {
          // If it was a new outlet, push it
          db.outlets.push({
            ...item.updated,
            status: 'approved',
            updated_at: new Date().toISOString(),
          });
        }
      });

      submission.status = 'approved';
      submission.reviewed_at = new Date().toISOString();
      submission.reviewed_by = admin_name || 'Super Admin';
      submission.admin_notes = notes || 'Approved and published to live directory.';
      
      saveDatabase(db);

      return NextResponse.json({
        success: true,
        message: `Changes for ${submission.display_name} have been approved and published live!`,
        submission,
      });
    } else if (action === 'reject') {
      submission.status = 'rejected';
      submission.reviewed_at = new Date().toISOString();
      submission.reviewed_by = admin_name || 'Super Admin';
      submission.admin_notes = notes || 'Changes rejected by Super Admin.';

      saveDatabase(db);

      return NextResponse.json({
        success: true,
        message: `Changes for ${submission.display_name} have been rejected.`,
        submission,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
