#!/usr/bin/env node
/**
 * Generate PDF pitch decks from HTML files using Puppeteer.
 * Renders each HTML deck in a headless browser and exports to PDF.
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const htmlDir = path.join(__dirname, 'html');
const pdfDir = path.join(__dirname, 'pdf');
const cssPath = path.resolve(__dirname, '..', 'pitch-deck.css');

if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

async function main() {
  const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html')).sort();
  console.log(`Generating ${files.length} PDF investor decks...\n`);

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

  for (const file of files) {
    const htmlPath = path.join(htmlDir, file);
    const pdfFile = file.replace('.html', '.pdf');
    const pdfPath = path.join(pdfDir, pdfFile);

    const page = await browser.newPage();

    // Load HTML with proper CSS path
    let html = fs.readFileSync(htmlPath, 'utf8');
    // Fix CSS path to absolute file URL
    html = html.replace('href="../pitch-deck.css"', `href="file:///${cssPath.replace(/\\/g, '/')}"`);

    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: pdfPath,
      width: '13.33in',
      height: '7.5in',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    await page.close();
    console.log(`  ${pdfFile}`);
  }

  await browser.close();
  console.log(`\nDone! ${files.length} PDF decks in ${pdfDir}`);
}

main().catch(e => { console.error(e); process.exit(1); });
