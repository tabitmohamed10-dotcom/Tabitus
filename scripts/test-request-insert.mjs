/**
 * Test script: verifies the full request-publication flow
 * Run with: node scripts/test-request-insert.mjs
 * Requires NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
 * and TEST_USER_EMAIL + TEST_USER_PASSWORD in the environment.
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const TEST_EMAIL = process.env.TEST_USER_EMAIL
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}
if (!TEST_EMAIL || !TEST_PASSWORD) {
  console.error('❌  Set TEST_USER_EMAIL and TEST_USER_PASSWORD to run this test')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function run() {
  console.log('── 1. Sign in ────────────────────────────────')
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: TEST_EMAIL, password: TEST_PASSWORD,
  })
  if (authErr) { console.error('❌  Auth failed:', authErr.message); process.exit(1) }
  const user = authData.user
  console.log('✅  Signed in as', user.id)

  console.log('\n── 2. Check categories ───────────────────────')
  const { data: cats, error: catsErr } = await supabase
    .from('categories').select('id, name, slug').order('sort_order').limit(5)
  if (catsErr) { console.error('❌  Categories fetch failed:', catsErr.message); process.exit(1) }
  if (!cats || cats.length === 0) {
    console.error('❌  Categories table is EMPTY — run migration 004 in the Supabase SQL editor')
    process.exit(1)
  }
  console.log(`✅  ${cats.length} categories found (first 5):`)
  cats.forEach(c => console.log(`    [${c.id}] ${c.slug} — ${c.name}`))
  const testCategoryId = cats[0].id

  console.log('\n── 3. Check profile exists ───────────────────')
  const { data: profile, error: profileErr } = await supabase
    .from('profiles').select('id, email, role').eq('id', user.id).single()
  if (profileErr || !profile) {
    console.error('❌  No profile for user', user.id)
    console.error('    Run migration 004 to backfill profiles.')
    process.exit(1)
  }
  console.log('✅  Profile:', profile.role, profile.email)

  console.log('\n── 4. Insert test request ────────────────────')
  const insertData = {
    buyer_id: user.id,
    title: '[TEST] Demande de test — à supprimer',
    description: 'Script de vérification automatique',
    category_id: testCategoryId,
    city: 'Casablanca',
    budget_min: null,
    budget_max: 5000,
    currency: 'MAD',
    urgent: false,
    is_urgent: false,
    delivery_needed: true,
    payment_methods: [],
    deadline: null,
    status: 'open',
  }
  console.log('    Sending:', JSON.stringify(insertData, null, 6))

  const { data: inserted, error: insertErr } = await supabase
    .from('requests').insert(insertData).select().single()

  if (insertErr) {
    console.error('\n❌  INSERT FAILED')
    console.error('    code   :', insertErr.code)
    console.error('    message:', insertErr.message)
    console.error('    details:', insertErr.details)
    console.error('    hint   :', insertErr.hint)
    console.error('    full   :', JSON.stringify(insertErr))
    process.exit(1)
  }
  console.log('\n✅  REQUEST INSERTED SUCCESSFULLY')
  console.log('    id     :', inserted.id)
  console.log('    title  :', inserted.title)
  console.log('    status :', inserted.status)

  console.log('\n── 5. Cleaning up test row ───────────────────')
  await supabase.from('requests').delete().eq('id', inserted.id)
  console.log('✅  Test row deleted')
  console.log('\n🎉  All checks passed — request publication is working correctly.')
}

run().catch(err => { console.error('Unhandled error:', err); process.exit(1) })
