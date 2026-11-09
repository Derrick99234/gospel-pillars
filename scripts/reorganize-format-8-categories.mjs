// scripts/reorganize-format-8-categories.mjs
// Updates Supabase sections and outlets according to the user's requested 8-tier hierarchy:
// 1. Int HQ
// 2. Lagos HQ
// 3. Lagos churches
// 4. Nigerian churches
// 5. Uk/ Europe churches (including Dubai, Philippines, Pakistan)
// 6. American churches
// 7. Canada churches
// 8. African churches

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envFile = readFileSync(join(__dirname, '..', '.env.local'), 'utf-8');
const getVar = (name) => {
  const m = envFile.match(new RegExp('^' + name + '=(.*)$', 'm'));
  return m ? m[1].trim() : '';
};

const supabaseUrl = getVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getVar('SUPABASE_SERVICE_ROLE_KEY') || getVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const newSections = [
  {
    id: 'int_hq',
    name: 'Int HQ',
    display_name: 'Int HQ',
    manager_name: 'International HQ Manager',
    manager_username: 'int_hq',
    manager_password: 'GPC-iH9#xP4!qL2@wR7$Nz1-INTHQ',
    created_at: new Date().toISOString(),
  },
  {
    id: 'lagos_hq',
    name: 'Lagos HQ',
    display_name: 'Lagos HQ',
    manager_name: 'Lagos HQ Manager',
    manager_username: 'lagos_hq',
    manager_password: 'GPC-lH7$vK2!zQ5#mR9@Yb3-LAGOSHQ',
    created_at: new Date().toISOString(),
  },
  {
    id: 'lagos_churches',
    name: 'Lagos churches',
    display_name: 'Lagos churches',
    manager_name: 'Lagos Churches Manager',
    manager_username: 'lagos',
    manager_password: 'GPC-lC4#mP8!vQ2@rS7$Jw9-LAGOS',
    created_at: new Date().toISOString(),
  },
  {
    id: 'nigerian_churches',
    name: 'Nigerian churches',
    display_name: 'Nigerian churches',
    manager_name: 'Nigerian Churches Manager',
    manager_username: 'nigeria',
    manager_password: 'GPC-nC9#bK3@zW7!nF5$Qx2-NIGERIA',
    created_at: new Date().toISOString(),
  },
  {
    id: 'uk_europe_churches',
    name: 'Uk/ Europe churches',
    display_name: 'Uk/ Europe churches',
    manager_name: 'UK / Europe Churches Manager',
    manager_username: 'uk_europe',
    manager_password: 'GPC-uE7!qL2#Xn9@Tz4$Kp8-UKEUROPE',
    created_at: new Date().toISOString(),
  },
  {
    id: 'american_churches',
    name: 'American churches',
    display_name: 'American churches',
    manager_name: 'American Churches Manager',
    manager_username: 'americas',
    manager_password: 'GPC-aC7@Xk3#Dm9!Ts5$Jv8-AMERICA',
    created_at: new Date().toISOString(),
  },
  {
    id: 'canada_churches',
    name: 'Canada churches',
    display_name: 'Canada churches',
    manager_name: 'Canada Churches Manager',
    manager_username: 'canada',
    manager_password: 'GPC-cD5#yN8!xQ2@wK4$Zv7-CANADA',
    created_at: new Date().toISOString(),
  },
  {
    id: 'african_churches',
    name: 'African churches',
    display_name: 'African churches',
    manager_name: 'African Churches Manager',
    manager_username: 'africa',
    manager_password: 'GPC-aF6@wZ9!rQ2#hY7$Nc5-AFRICA',
    created_at: new Date().toISOString(),
  },
];

async function run() {
  console.log('🚀 Reorganizing sections and outlets in Supabase...\n');

  // Step 1: Temporarily update section_id in outlets to null or temp so foreign key constraints won't block section updates
  // Actually outlets.section_id is just a text field, let's fetch all outlets first
  const { data: outlets, error: outErr } = await supabase.from('outlets').select('*');
  if (outErr) {
    console.error('❌ Error fetching outlets:', outErr.message);
    process.exit(1);
  }

  // Step 2: Clear old sections to avoid username uniqueness conflict
  console.log('🧹 Clearing old sections...');
  const { error: delErr } = await supabase.from('sections').delete().neq('id', '___non_existent___');
  if (delErr) {
    console.error('❌ Error clearing sections:', delErr.message);
    process.exit(1);
  }

  // Step 3: Insert new 8 sections
  console.log('📦 Inserting 8 sections...');
  const { error: secErr } = await supabase.from('sections').insert(newSections);
  if (secErr) {
    console.error('❌ Error inserting sections:', secErr.message);
    process.exit(1);
  }
  console.log('   ✅ 8 sections created.');

  // Step 4: Reclassify outlets
  console.log(`📦 Reclassifying ${outlets.length} outlets...`);

  const lagosCities = [
    'Ikorodu',
    'Okota',
    'Ikotun',
    'Akute',
    'Alimosho / Dopemu',
    'Sangotedo',
    'Epe',
    'Yaba / Bariga',
    'Akoka / Yaba',
    'Iju Ishaga',
    'Isheri North / OPIC',
  ];

  const updates = [];

  for (const o of outlets) {
    let newSectionId = 'nigerian_churches';
    let newCategory = 'Nigerian churches';
    let updatedAddress = o.address;
    let updatedName = o.name;
    let updatedVenue = o.venue;

    // 1. Int HQ: Ikeja
    if (o.id === 'lagos-ikeja') {
      newSectionId = 'int_hq';
      newCategory = 'Int HQ';
      updatedName = 'Gospel Pillars Church, Ikeja';
      updatedAddress = 'H4, Ark of Light for All Nations, 11c Kudirat Abiola Way, Ikeja, Lagos';
      updatedVenue = 'H4, Ark of Light for All Nations';
    }
    // 2. Lagos HQ: Lekki
    else if (o.id === 'lagos-lekki') {
      newSectionId = 'lagos_hq';
      newCategory = 'Lagos HQ';
    }
    // 7. Canada churches
    else if (o.country === 'Canada') {
      newSectionId = 'canada_churches';
      newCategory = 'Canada churches';
    }
    // 6. American churches
    else if (['United States', 'Mexico', 'Peru'].includes(o.country)) {
      newSectionId = 'american_churches';
      newCategory = 'American churches';
    }
    // 5. Uk/ Europe churches (including UAE, Philippines, Pakistan)
    else if (
      [
        'United Kingdom',
        'Ireland',
        'Belgium',
        'North Cyprus',
        'United Arab Emirates',
        'Philippines',
        'Pakistan',
      ].includes(o.country)
    ) {
      newSectionId = 'uk_europe_churches';
      newCategory = 'Uk/ Europe churches';
    }
    // 8. African churches
    else if (
      ['Ghana', 'Uganda', 'South Africa', 'Kenya', 'Benin Republic', 'Cameroon'].includes(
        o.country
      )
    ) {
      newSectionId = 'african_churches';
      newCategory = 'African churches';
    }
    // Nigeria locations
    else if (o.country === 'Nigeria') {
      const isLagos =
        ['mainland', 'island', 'lagos_churches'].includes(o.section_id) ||
        o.state_or_province === 'Lagos State' ||
        lagosCities.includes(o.city);

      if (isLagos) {
        newSectionId = 'lagos_churches';
        newCategory = 'Lagos churches';
      } else {
        newSectionId = 'nigerian_churches';
        newCategory = 'Nigerian churches';
      }
    }

    updates.push({
      ...o,
      name: updatedName,
      address: updatedAddress,
      venue: updatedVenue,
      section_id: newSectionId,
      region_category: newCategory,
      updated_at: new Date().toISOString(),
    });
  }

  // Upsert updated outlets in batches
  const batchSize = 50;
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);
    const { error: batchErr } = await supabase
      .from('outlets')
      .upsert(batch, { onConflict: 'id' });

    if (batchErr) {
      console.error(`❌ Error updating batch ${i}:`, batchErr.message);
      process.exit(1);
    }
    console.log(`   ✅ Batch ${Math.floor(i / batchSize) + 1} updated (${batch.length} outlets).`);
  }

  // Step 5: Sync db.json
  const { data: finalSecs } = await supabase.from('sections').select('*').order('name');
  const { data: finalOuts } = await supabase.from('outlets').select('*').order('index');

  const dbJson = {
    admin: {
      username: 'admin',
      password: 'adminpassword',
      name: 'Super Admin',
      role: 'super_admin',
    },
    sections: finalSecs,
    outlets: finalOuts,
  };

  writeFileSync(
    join(__dirname, '..', 'src', 'data', 'db.json'),
    JSON.stringify(dbJson, null, 2),
    'utf-8'
  );
  console.log('   ✅ src/data/db.json synced locally.');

  console.log('\n🎉 ALL UPDATES COMPLETED SUCCESSFULLY!');
}

run();
