import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');
const INITIAL_OUTLETS_PATH = path.join(process.cwd(), 'src', 'data', 'outlets.json');

// Default initial sections with credentials
const DEFAULT_SECTIONS = [
  {
    id: 'lagos',
    name: 'Church Locations Across Lagos',
    display_name: 'Lagos',
    manager: {
      username: 'lagos',
      password: 'lagos123',
      name: 'Lagos Section Manager',
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'nigeria',
    name: 'Nigeria',
    display_name: 'Nigeria',
    manager: {
      username: 'nigeria',
      password: 'nigeria123',
      name: 'Nigeria State Branches Manager',
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    display_name: 'United Kingdom',
    manager: {
      username: 'uk',
      password: 'uk123',
      name: 'United Kingdom Manager',
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'americas',
    name: 'North and South America',
    display_name: 'North and South America',
    manager: {
      username: 'americas',
      password: 'americas123',
      name: 'Americas Manager',
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'asia_europe',
    name: 'Asia and Europe',
    display_name: 'Asia and Europe',
    manager: {
      username: 'asia_europe',
      password: 'europe123',
      name: 'Asia & Europe Manager',
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'africa',
    name: 'Africa',
    display_name: 'Africa',
    manager: {
      username: 'africa',
      password: 'africa123',
      name: 'Africa Outlets Manager',
    },
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'adminpassword',
  name: 'Super Admin',
  role: 'super_admin',
};

export function getDatabase() {
  if (fs.existsSync(DB_PATH)) {
    try {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.error('Error reading db.json, falling back to seed:', e);
    }
  }

  // Seed from outlets.json
  let initialOutlets = [];
  if (fs.existsSync(INITIAL_OUTLETS_PATH)) {
    try {
      const raw = JSON.parse(fs.readFileSync(INITIAL_OUTLETS_PATH, 'utf-8'));
      initialOutlets = raw.outlets || [];
    } catch (e) {
      console.error('Error reading initial outlets:', e);
    }
  }

  // Ensure each outlet has section_id
  const enrichedOutlets = initialOutlets.map((o) => {
    let sId = 'other';
    const reg = o.region_category?.toLowerCase() || '';
    if (reg.includes('lagos')) sId = 'lagos';
    else if (reg === 'nigeria') sId = 'nigeria';
    else if (reg.includes('kingdom')) sId = 'uk';
    else if (reg.includes('america')) sId = 'americas';
    else if (reg.includes('asia')) sId = 'asia_europe';
    else if (reg.includes('africa')) sId = 'africa';

    return {
      ...o,
      section_id: sId,
      status: 'approved',
      updated_at: new Date().toISOString(),
    };
  });

  const initialDb = {
    admin: DEFAULT_ADMIN,
    sections: DEFAULT_SECTIONS,
    outlets: enrichedOutlets,
    drafts: {}, // { [sectionId]: { outletId: { ...updatedOutlet } } }
    submissions: [], // pending approvals
  };

  saveDatabase(initialDb);
  return initialDb;
}

export function saveDatabase(data) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing db.json:', e);
  }
}

// Authentication
export function authenticateUser(username, password) {
  const db = getDatabase();
  const cleanU = (username || '').trim().toLowerCase();
  const cleanP = (password || '').trim();

  // Super Admin
  if (
    cleanU === db.admin.username.toLowerCase() &&
    cleanP === db.admin.password
  ) {
    return {
      authenticated: true,
      role: 'super_admin',
      name: db.admin.name,
      username: db.admin.username,
    };
  }

  // Section Managers
  const sec = db.sections.find(
    (s) =>
      s.manager &&
      s.manager.username.toLowerCase() === cleanU &&
      s.manager.password === cleanP
  );

  if (sec) {
    return {
      authenticated: true,
      role: 'section_manager',
      section_id: sec.id,
      section_name: sec.name,
      display_name: sec.display_name,
      name: sec.manager.name || sec.display_name,
      username: sec.manager.username,
    };
  }

  return { authenticated: false };
}
