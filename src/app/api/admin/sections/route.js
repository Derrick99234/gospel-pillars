import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';

export async function GET() {
  try {
    const db = getDatabase();
    
    // Enrich sections with outlet counts
    const sectionsWithStats = db.sections.map((sec) => {
      const outletCount = db.outlets.filter((o) => o.section_id === sec.id).length;
      const pendingCount = (db.submissions || []).filter(
        (s) => s.section_id === sec.id && s.status === 'pending'
      ).length;

      return {
        ...sec,
        outletCount,
        pendingCount,
      };
    });

    return NextResponse.json({
      success: true,
      sections: sectionsWithStats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Create new section & manager login
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

    const db = getDatabase();

    // Check username uniqueness
    const exists = db.sections.some(
      (s) => s.manager?.username.toLowerCase() === manager_username.trim().toLowerCase()
    );
    if (exists || manager_username.trim().toLowerCase() === db.admin.username.toLowerCase()) {
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
      manager: {
        username: manager_username.trim(),
        password: manager_password.trim(),
        name: (manager_name || `${display_name || name} Coordinator`).trim(),
      },
      created_at: new Date().toISOString(),
    };

    db.sections.push(newSection);
    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: `Section "${newSection.display_name}" and manager login created successfully!`,
      section: newSection,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Update section manager credentials
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, name, display_name, manager_username, manager_password, manager_name } = body;

    const db = getDatabase();
    const secIndex = db.sections.findIndex((s) => s.id === id);

    if (secIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Section not found' },
        { status: 404 }
      );
    }

    if (name) db.sections[secIndex].name = name.trim();
    if (display_name) db.sections[secIndex].display_name = display_name.trim();
    if (manager_username) db.sections[secIndex].manager.username = manager_username.trim();
    if (manager_password) db.sections[secIndex].manager.password = manager_password.trim();
    if (manager_name) db.sections[secIndex].manager.name = manager_name.trim();

    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: 'Section updated successfully',
      section: db.sections[secIndex],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
