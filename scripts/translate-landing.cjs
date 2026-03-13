/**
 * Translate the `landing` section of all locale JSON files.
 * Uses Google Translate informal API via fetch.
 * 
 * Usage: node scripts/translate-landing.cjs
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'src', 'lib', 'i18n', 'locales');
const EN_FILE = path.join(LOCALES_DIR, 'en.json');

// All non-English locales
const TARGET_LOCALES = [
  'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh', 'ko', 'ar', 'he',
  'hi', 'bn', 'ur', 'sw', 'id', 'vi', 'th', 'tl', 'pl', 'tr'
];

// Flatten nested object to dot-notation keys
function flatten(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flatten(value, fullKey));
    } else if (typeof value === 'string') {
      result[fullKey] = value;
    }
  }
  return result;
}

// Unflatten dot-notation keys back to nested object
function unflatten(obj) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const keys = key.split('.');
    let current = result;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }
  return result;
}

// Google Translate via informal API
async function translateText(text, targetLang) {
  if (!text || text.trim() === '') return text;
  
  // Don't translate technical terms, URLs, codes
  if (/^(STAGE \d|RR-|DC|SHA-256|Ed25519|RFC 3161|DATACENDIA|NVIDIA|Apache 2\.0|DDGI|SSO|SAML|RBAC|HIPAA|GDPR|SOC 2|ISO \d|NIST|ABA|SR \d|docker compose|openssl|GitHub|TypeScript|React|Node\.js|Ollama|OpenAI|Groq|Together AI|GPT-4o|Llama 3|Mistral|Phi-3|Gemma|CISO|CFO|CTO|CRO)$/i.test(text.trim())) {
    return text;
  }

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    if (data && data[0]) {
      return data[0].map(segment => segment[0]).join('');
    }
    return text;
  } catch (err) {
    console.error(`  ✗ Failed to translate: "${text.substring(0, 40)}..." → ${targetLang}: ${err.message}`);
    return text;
  }
}

// Rate limit helper
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateLandingForLocale(landingFlat, targetLocale) {
  const translated = {};
  const entries = Object.entries(landingFlat);
  
  console.log(`  Translating ${entries.length} keys to ${targetLocale}...`);
  
  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];
    translated[key] = await translateText(value, targetLocale);
    
    // Rate limit: 100ms between requests
    if (i % 5 === 4) await sleep(200);
  }
  
  return translated;
}

async function main() {
  // Read English source
  const enData = JSON.parse(fs.readFileSync(EN_FILE, 'utf-8'));
  const landingEn = enData.landing;
  
  if (!landingEn) {
    console.error('No "landing" section found in en.json');
    process.exit(1);
  }
  
  const landingFlat = flatten(landingEn);
  console.log(`Found ${Object.keys(landingFlat).length} landing keys to translate.\n`);
  
  for (const locale of TARGET_LOCALES) {
    const localeFile = path.join(LOCALES_DIR, `${locale}.json`);
    
    if (!fs.existsSync(localeFile)) {
      console.log(`⚠ ${locale}.json not found, skipping.`);
      continue;
    }
    
    console.log(`\n🌐 Processing ${locale}.json...`);
    
    // Translate
    const translatedFlat = await translateLandingForLocale(landingFlat, locale);
    const translatedNested = unflatten(translatedFlat);
    
    // Read existing locale file and replace landing section
    const localeData = JSON.parse(fs.readFileSync(localeFile, 'utf-8'));
    localeData.landing = translatedNested;
    
    // Write back
    fs.writeFileSync(localeFile, JSON.stringify(localeData, null, 2) + '\n', 'utf-8');
    console.log(`  ✓ ${locale}.json updated.`);
    
    // Pause between locales to avoid rate limiting
    await sleep(1000);
  }
  
  console.log('\n✅ All landing translations complete!');
}

main().catch(console.error);
