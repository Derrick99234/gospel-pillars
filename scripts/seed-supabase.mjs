// scripts/seed-supabase.mjs
// Run this ONCE to migrate your db.json data into Supabase.
// Usage: node scripts/seed-supabase.mjs
//
// Requires:
//   NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or ANON key)
//   set in your .env.local file, OR as environment variables.

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase env vars. Check .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Read db.json
const dbPath = join(__dirname, '..', 'src', 'data', 'db.json');
const db = JSON.parse(readFileSync(dbPath, 'utf-8'));

async function seed() {
  console.log('🌱 Starting Supabase seed...\n');

  // ─── 1. Sections ─────────────────────────────────────────────────────────
  console.log('📦 Seeding sections...');
  const sections = db.sections.map((sec) => ({
    id: sec.id,
    name: sec.name,
    display_name: sec.display_name,
    manager_username: sec.manager?.username || sec.manager_username,
    manager_password: sec.manager?.password || sec.manager_password,
    manager_name: sec.manager?.name || sec.manager_name || sec.display_name,
    created_at: sec.created_at || new Date().toISOString(),
  }));

  const { error: secErr } = await supabase
    .from('sections')
    .upsert(sections, { onConflict: 'id' });

  if (secErr) {
    console.error('❌ Sections error:', secErr.message);
    process.exit(1);
  }
  console.log(`   ✅ ${sections.length} sections seeded.`);

  // ─── 2. Outlets ──────────────────────────────────────────────────────────
  console.log('📦 Seeding outlets...');
  const outlets = (db.outlets || []).map((o) => ({
    id: o.id,
    index: o.index || 0,
    name: o.name,
    original_heading: o.original_heading || null,
    region_category: o.region_category || '',
    branch_type: o.branch_type || null,
    venue: o.venue || null,
    address: o.address || '',
    city: o.city || null,
    state_or_province: o.state_or_province || null,
    country: o.country || null,
    postal_code: o.postal_code || null,
    phone_numbers: o.phone_numbers || [],
    landmarks: o.landmarks || null,
    raw_text: o.raw_text || null,
    section_id: o.section_id || null,
    status: o.status || 'approved',
    updated_at: o.updated_at || new Date().toISOString(),
    draft_updated_at: o.draft_updated_at || null,
  }));

  // Upsert in batches of 100 to avoid request size limits
  const batchSize = 100;
  for (let i = 0; i < outlets.length; i += batchSize) {
    const batch = outlets.slice(i, i + batchSize);
    const { error: outErr } = await supabase
      .from('outlets')
      .upsert(batch, { onConflict: 'id' });
    if (outErr) {
      console.error(`❌ Outlets batch ${Math.floor(i / batchSize) + 1} error:`, outErr.message);
      process.exit(1);
    }
    console.log(`   ✅ Batch ${Math.floor(i / batchSize) + 1}: ${batch.length} outlets seeded.`);
  }

  // ─── 3. Submissions ──────────────────────────────────────────────────────
  const subs = db.submissions || [];
  if (subs.length > 0) {
    console.log('📦 Seeding submissions...');
    const { error: subErr } = await supabase
      .from('submissions')
      .upsert(subs, { onConflict: 'id' });
    if (subErr) {
      console.error('❌ Submissions error:', subErr.message);
    } else {
      console.log(`   ✅ ${subs.length} submissions seeded.`);
    }
  }

  console.log('\n🎉 Seed complete! Your Supabase DB is ready.');
}

seed().catch((err) => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
