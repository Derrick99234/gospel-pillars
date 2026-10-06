import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    const cleanU = (username || '').trim().toLowerCase();
    const cleanP = (password || '').trim();

    // Check super admin (stored in env or a hardcoded check)
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'adminpassword';

    if (cleanU === adminUser.toLowerCase() && cleanP === adminPass) {
      return NextResponse.json({
        success: true,
        user: {
          authenticated: true,
          role: 'super_admin',
          name: 'Super Admin',
          username: adminUser,
        },
      });
    }

    // Check section managers
    const { data: sections, error } = await supabase
      .from('sections')
      .select('*')
      .ilike('manager_username', cleanU)
      .single();

    if (error || !sections) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    if (sections.manager_password !== cleanP) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        authenticated: true,
        role: 'section_manager',
        section_id: sections.id,
        section_name: sections.name,
        display_name: sections.display_name,
        name: sections.manager_name || sections.display_name,
        username: sections.manager_username,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
