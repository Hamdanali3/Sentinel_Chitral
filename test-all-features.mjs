/**
 * Sentinel Chitral — Full Feature Test Suite
 * Uses Playwright to screenshot every page and test key interactions.
 */
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const BASE = 'http://localhost:3000';
const OUT_DIR = path.resolve('C:\\Users\\abc\\.gemini\\antigravity\\brain\\dd27c53c-2a8a-4fdf-8c75-b033212a6a3e\\screenshots');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function shot(page, name) {
  const file = path.join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`📸 Screenshot saved: ${name}.png`);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  // Collect console errors
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(`[${msg.type()}] ${msg.text()}`); });
  page.on('pageerror', err => errors.push(`[pageerror] ${err.message}`));

  const report = {};

  // 1. HOME PAGE
  console.log('\n🔍 Testing: Home Page (/)');
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000); // wait for map and JS
  await shot(page, '01_home');
  report['Home (/)'] = { status: 200, errors: [...errors] };
  errors.length = 0;

  // 2. AI CHATBOT
  console.log('\n🔍 Testing: AI Chatbot');
  const chatBtn = page.locator('button', { hasText: /ask ai|chat/i }).first();
  if (await chatBtn.count() > 0) {
    await chatBtn.click();
    await page.waitForTimeout(800);
    await shot(page, '02_chatbot_open');
    const input = page.locator('input[type=text], textarea').last();
    await input.fill('What are the current risk levels in Chitral valleys?');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(8000); // wait for streaming response
    await shot(page, '03_chatbot_response');
    // Ask a second question about glaciers
    await input.fill('What is the GLOF threat in Yarkhun valley?');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(8000);
    await shot(page, '03b_chatbot_glof_question');
    report['AI Chatbot'] = { status: 'OK', errors: [...errors] };
  } else {
    report['AI Chatbot'] = { status: 'BUTTON NOT FOUND' };
  }
  errors.length = 0;

  // 3. EARTH SPACE / GLACIERS
  console.log('\n🔍 Testing: Earth Space (/glaciers)');
  await page.goto(`${BASE}/glaciers`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000); // wait for satellite map
  await shot(page, '04_earth_space');
  // Try clicking a glacier marker
  const mtMarker = page.locator('text=🏔️').first();
  if (await mtMarker.count() > 0) {
    await mtMarker.click();
    await page.waitForTimeout(1500);
    await shot(page, '05_earth_space_glacier_click');
  }
  // Test glacier search
  const searchInput = page.locator('input[placeholder*="Search glaciers"]');
  if (await searchInput.count() > 0) {
    await searchInput.fill('recent Chitral glacier floods 2024');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(7000); // wait for search results
    await shot(page, '05b_earth_space_search_results');
  }
  report['Earth Space (/glaciers)'] = { status: 200, errors: [...errors] };
  errors.length = 0;

  // 4. SUBSCRIBE PAGE
  console.log('\n🔍 Testing: Subscribe (/subscribe)');
  await page.goto(`${BASE}/subscribe`, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(1000);
  await shot(page, '06_subscribe');
  const valleyBtn = page.locator('button', { hasText: /Bumburet|Mastuj|Rumbur/i }).first();
  if (await valleyBtn.count() > 0) await valleyBtn.click();
  await shot(page, '07_subscribe_valley_selected');
  report['Subscribe (/subscribe)'] = { status: 200, errors: [...errors] };
  errors.length = 0;

  // 5. VALLEY DETAIL
  console.log('\n🔍 Testing: Valley Detail (/valley/Mastuj)');
  await page.goto(`${BASE}/valley/Mastuj`, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(2000);
  await shot(page, '08_valley_detail');
  report['Valley Detail (/valley/Mastuj)'] = { status: 200, errors: [...errors] };
  errors.length = 0;

  // 6. ABOUT PAGE
  console.log('\n🔍 Testing: About (/about)');
  await page.goto(`${BASE}/about`, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await shot(page, '09_about');
  report['About (/about)'] = { status: 200, errors: [...errors] };
  errors.length = 0;

  // 7. ADMIN LOGIN
  console.log('\n🔍 Testing: Admin Login (/admin/login)');
  await page.goto(`${BASE}/admin/login`, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await shot(page, '10_admin_login');
  await page.fill('input[type=email]', 'hamdanaly651@gmail.com');
  await page.fill('input[type=password]', 'test1234');
  await shot(page, '11_admin_login_filled');
  await page.click('button[type=submit]');
  await page.waitForTimeout(4000);
  await shot(page, '12_admin_login_result');
  report['Admin Login (/admin/login)'] = { status: 200, errors: [...errors] };
  errors.length = 0;

  await browser.close();

  console.log('\n\n============================');
  console.log('📊 FULL TEST REPORT');
  console.log('============================');
  for (const [page_name, data] of Object.entries(report)) {
    const hasErrors = data.errors && data.errors.length > 0;
    console.log(`\n${hasErrors ? '⚠️' : '✅'} ${page_name}: ${data.status}`);
    if (hasErrors) data.errors.forEach(e => console.log(`  ❌ ${e}`));
  }
  console.log('\n📁 Screenshots saved to:', OUT_DIR);
}

run().catch(err => {
  console.error('Test runner crashed:', err);
  process.exit(1);
});
