import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: List all submissions with section stats
export async function GET() {
  try {
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      submissions: submissions || [],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST: Approve or Reject a submission
export async function POST(request) {
  try {
    const { submission_id, action, notes, admin_name } = await request.json();

    if (!submission_id || !action) {
      return NextResponse.json(
        { success: false, message: 'submission_id and action are required' },
        { status: 400 }
      );
    }

    // Fetch submission
    const { data: submission, error: fetchErr } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', submission_id)
      .single();

    if (fetchErr || !submission) {
      return NextResponse.json(
        { success: false, message: 'Submission not found' },
        { status: 404 }
      );
    }

    const reviewedAt = new Date().toISOString();
    const reviewedBy = admin_name || 'Super Admin';

    if (action === 'approve') {
      // Apply each change to outlets table
      const updates = (submission.changes || []).map((item) => {
        const updatedOutlet = {
          ...item.updated,
          status: 'approved',
          updated_at: reviewedAt,
        };
        return supabase
          .from('outlets')
          .upsert(updatedOutlet, { onConflict: 'id' });
      });
      const results = await Promise.all(updates);
      const firstErr = results.find((r) => r.error)?.error;
      if (firstErr) throw firstErr;

      // Update submission status
      const { data: updated, error: updErr } = await supabase
        .from('submissions')
        .update({
          status: 'approved',
          reviewed_at: reviewedAt,
          admin_notes: notes || 'Approved and published to live directory.',
        })
        .eq('id', submission_id)
        .select()
        .single();

      if (updErr) throw updErr;

      return NextResponse.json({
        success: true,
        message: `Changes for ${submission.display_name} have been approved and published live!`,
        submission: updated,
      });
    } else if (action === 'reject') {
      const { data: updated, error: updErr } = await supabase
        .from('submissions')
        .update({
          status: 'rejected',
          reviewed_at: reviewedAt,
          admin_notes: notes || 'Changes rejected by Super Admin.',
        })
        .eq('id', submission_id)
        .select()
        .single();

      if (updErr) throw updErr;

      return NextResponse.json({
        success: true,
        message: `Changes for ${submission.display_name} have been rejected.`,
        submission: updated,
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
