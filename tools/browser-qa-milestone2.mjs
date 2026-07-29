import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('.');
const artifactsDir = path.join(root, 'docs', 'milestone-2-browser-qa');
const bundledRequire = createRequire('C:/Users/hassan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/');
const { chromium } = bundledRequire('playwright');

const results = [];
const processes = [];

function record(name, status, detail = '') {
  results.push({ name, status, detail });
  console.log(`${status === 'PASS' ? 'PASS' : 'FAIL'} ${name}${detail ? ` - ${detail}` : ''}`);
}

function start(command, args, cwd, env = {}) {
  const child = spawn(command, args, { cwd, env: { ...process.env, ...env }, shell: true, stdio: ['ignore', 'pipe', 'pipe'] });
  processes.push(child);
  child.stdout.on('data', (chunk) => process.stdout.write(chunk));
  child.stderr.on('data', (chunk) => process.stderr.write(chunk));
  return child;
}

async function waitFor(url, label, timeoutMs = 60000) {
  const started = Date.now();
  let lastError = '';
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        record(label, 'PASS', `${url} responded ${response.status}`);
        return;
      }
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = error.message;
    }
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  throw new Error(`${label} not ready: ${lastError}`);
}

async function screenshot(page, name) {
  await page.screenshot({ path: path.join(artifactsDir, `${name}.png`), fullPage: true });
}

async function findBrowserExecutable() {
  const candidates = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  ];
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Continue to the next installed browser candidate.
    }
  }
  return undefined;
}

async function main() {
  await mkdir(artifactsDir, { recursive: true });

  try {
    const response = await fetch('http://localhost:4000/api/v1/health');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  } catch {
    start('pnpm.cmd', ['--filter', '@nova/api', 'start'], root);
  }

  try {
    const response = await fetch('http://localhost:3006');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  } catch {
    start('pnpm.cmd', ['exec', 'next', 'start', '-p', '3006'], path.join(root, 'apps', 'web'));
  }

  await waitFor('http://localhost:4000/api/v1/health', 'API health');
  await waitFor('http://localhost:3006', 'Frontend home');

  const executablePath = await findBrowserExecutable();
  const browser = await chromium.launch({ headless: true, executablePath });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  page.on('console', (message) => console.log(`BROWSER_CONSOLE ${message.type()}: ${message.text()}`));
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('/api/v1/auth') || url.includes('/api/v1/users')) {
      console.log(`API_RESPONSE ${response.status()} ${url}`);
      if (response.status() >= 400) {
        console.log(await response.text().catch(() => ''));
      }
    }
  });
  const stamp = Date.now();
  const email = `browserqa+${stamp}@nova.test`;
  const password = 'SmokePass1';

  try {
    await page.goto('http://localhost:3006/login', { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'Sign in' }).waitFor();
    await screenshot(page, '01-login');
    record('Login page renders', 'PASS');

    await page.goto('http://localhost:3006/register', { waitUntil: 'networkidle' });
    await page.getByLabel('First name').fill('Browser');
    await page.getByLabel('Last name').fill('QA');
    await page.getByLabel('Email').fill(email);
    await page.getByRole('textbox', { name: /Password/ }).fill(password);
    await screenshot(page, '02-register-filled');
    await page.getByRole('button', { name: 'Create account' }).click();
    try {
      await page.waitForURL('**/profile', { timeout: 20000 });
    } catch (error) {
      await screenshot(page, '02-register-failed');
      console.log('REGISTER_PAGE_TEXT=' + (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 1000));
      throw error;
    }
    await page.getByRole('heading', { name: 'Profile' }).waitFor();
    await screenshot(page, '03-profile-after-register');
    record('Register redirects to protected profile', 'PASS', email);

    await page.getByRole('link', { name: 'Settings' }).click();
    await page.getByRole('heading', { name: 'Profile settings' }).waitFor({ timeout: 15000 });
    await page.locator('input[name="firstName"]').fill('Browser');
    await page.locator('input[name="lastName"]').fill('Verified');
    await page.getByRole('button', { name: 'Save profile' }).click();
    await page.getByText('Profile updated.').waitFor({ timeout: 15000 });
    await screenshot(page, '04-settings-updated');
    record('Profile update succeeds', 'PASS');

    await page.getByRole('link', { name: 'Addresses' }).click();
    await page.getByRole('heading', { name: 'Add address' }).waitFor({ timeout: 15000 });
    await page.locator('input[name="title"]').fill('Home');
    await page.locator('input[name="fullName"]').fill('Browser Verified');
    await page.locator('input[name="phone"]').fill('+14155550124');
    await page.locator('input[name="country"]').fill('United States');
    await page.locator('input[name="province"]').fill('CA');
    await page.locator('input[name="city"]').fill('Los Angeles');
    await page.locator('input[name="postalCode"]').fill('90001');
    await page.locator('input[name="addressLine1"]').fill('100 QA Street');
    await page.locator('input[name="isDefault"]').check();
    await screenshot(page, '05-address-form-filled');
    await page.getByRole('button', { name: 'Add address' }).click();
    await page.getByText('100 QA Street').waitFor({ timeout: 15000 });
    await screenshot(page, '06-address-created');
    record('Address create/list/default succeeds', 'PASS');

    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByText('No addresses yet.').waitFor({ timeout: 15000 });
    await screenshot(page, '07-address-deleted');
    record('Address delete succeeds', 'PASS');

    await page.evaluate(async () => {
      const response = await fetch('http://localhost:4000/api/v1/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
      });
      if (!response.ok) throw new Error(`logout failed ${response.status}`);
      localStorage.removeItem('nova-auth-safe-state');
    });
    await page.goto('http://localhost:3006/profile', { waitUntil: 'networkidle' });
    await page.waitForURL('**/login', { timeout: 15000 });
    await screenshot(page, '08-protected-redirect');
    record('Protected route redirects when logged out', 'PASS');

    await page.goto('http://localhost:3006/login', { waitUntil: 'networkidle' });
    await page.getByLabel('Email').fill(email);
    await page.getByRole('textbox', { name: /Password/ }).fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL('**/profile', { timeout: 20000 });
    await screenshot(page, '09-login-success');
    record('Login succeeds after registration', 'PASS');
  } finally {
    await browser.close();
    for (const child of processes) child.kill();
  }

  const report = [
    '# NOVA Commerce Milestone 2 Browser QA',
    '',
    `Date: ${new Date().toISOString()}`,
    '',
    '| Check | Status | Detail |',
    '|---|---|---|',
    ...results.map((item) => `| ${item.name} | ${item.status} | ${item.detail.replaceAll('|', '\\|')} |`),
    '',
    `Screenshots: ${artifactsDir}`,
  ].join('\n');
  await writeFile(path.join(artifactsDir, 'report.md'), report);
  process.exit(0);
}

main().catch((error) => {
  record('Browser QA run', 'FAIL', error.message);
  for (const child of processes) child.kill();
  process.exitCode = 1;
});
