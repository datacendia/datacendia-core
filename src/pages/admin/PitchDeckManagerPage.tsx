import React, { useState, useMemo, useCallback } from 'react';
import {
  Search, FileText, Upload, Download, Trash2, Plus, Edit3,
  ChevronRight, ChevronLeft, ChevronDown, Eye, Copy, Filter, Globe,
  Building2, Users, Briefcase, Image, Type, Layers,
  MoreVertical, X, Check, ArrowLeft, Maximize2, Minimize2,
  FolderOpen, Tag, Calendar, Mail, ExternalLink, RefreshCw,
  Grid, List, SortAsc, Presentation,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────
type DeckCategory = 'investor' | 'investor-50' | 'investor-100' | 'investor-500' | 'sales' | 'design-partner' | 'gamma' | 'enterprise' | 'regional' | 'main';
type DeckStatus = 'draft' | 'ready' | 'sent' | 'viewed' | 'follow-up' | 'closed';
type Region = 'us' | 'eu' | 'asia' | 'global' | 'middle-east' | 'latam' | 'africa';

interface SlideData {
  id: string;
  number: number;
  title: string;
  texts: string[];
  hasImage: boolean;
  imageName?: string;
  thumbnailColor: string;
}

interface DeckFile {
  id: string;
  filename: string;
  category: DeckCategory;
  status: DeckStatus;
  targetName: string;
  targetType: string;
  region: Region;
  location: string;
  aum: string;
  website: string;
  contactName: string;
  contactEmail: string;
  portfolioCompanies: string[];
  thesisAngle: string;
  slideCount: number;
  slides: SlideData[];
  hasPdf: boolean;
  lastModified: Date;
  sentDate?: Date;
  notes: string;
}

// ─── Category Config ────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<DeckCategory, { label: string; color: string; icon: React.ReactNode }> = {
  main:              { label: 'Main Decks',       color: 'text-white bg-neutral-600',     icon: <Presentation className="w-4 h-4" /> },
  investor:          { label: 'Investor',         color: 'text-amber-400 bg-amber-500/10', icon: <Briefcase className="w-4 h-4" /> },
  'investor-50':     { label: 'Investor-50',      color: 'text-blue-400 bg-blue-500/10',   icon: <Briefcase className="w-4 h-4" /> },
  'investor-100':    { label: 'Investor-100',     color: 'text-purple-400 bg-purple-500/10', icon: <Building2 className="w-4 h-4" /> },
  'investor-500':    { label: 'Investor-500',     color: 'text-orange-400 bg-orange-500/10', icon: <Building2 className="w-4 h-4" /> },
  sales:             { label: 'Sales',            color: 'text-green-400 bg-green-500/10', icon: <Users className="w-4 h-4" /> },
  'design-partner':  { label: 'Design Partner',   color: 'text-cyan-400 bg-cyan-500/10',   icon: <Globe className="w-4 h-4" /> },
  gamma:             { label: 'Gamma',            color: 'text-pink-400 bg-pink-500/10',   icon: <Layers className="w-4 h-4" /> },
  enterprise:        { label: 'Enterprise',       color: 'text-emerald-400 bg-emerald-500/10', icon: <Building2 className="w-4 h-4" /> },
  regional:          { label: 'Regional',         color: 'text-sky-400 bg-sky-500/10',     icon: <Globe className="w-4 h-4" /> },
};

const STATUS_CONFIG: Record<DeckStatus, { label: string; color: string }> = {
  draft:      { label: 'Draft',     color: 'text-neutral-400 bg-neutral-500/10 border-neutral-500/20' },
  ready:      { label: 'Ready',     color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  sent:       { label: 'Sent',      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  viewed:     { label: 'Viewed',    color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  'follow-up': { label: 'Follow-Up', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  closed:     { label: 'Closed',    color: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

const REGION_CONFIG: Record<Region, { label: string; flag: string }> = {
  us:           { label: 'United States', flag: '🇺🇸' },
  eu:           { label: 'Europe',        flag: '🇪🇺' },
  asia:         { label: 'Asia-Pacific',  flag: '🌏' },
  global:       { label: 'Global',        flag: '🌐' },
  'middle-east': { label: 'Middle East',  flag: '🌍' },
  latam:        { label: 'Latin America', flag: '🌎' },
  africa:       { label: 'Africa',        flag: '🌍' },
};

// ─── Deck builder helper ─────────────────────────────────────────────────────
function mkDeck(id: number, cat: DeckCategory, num: string, slug: string, name: string, type: string, region: Region, loc = '', aum = '', web = '', thesis = '', portfolio: string[] = []): DeckFile {
  const gradients = ['from-neutral-800 to-neutral-900','from-amber-900/30 to-neutral-900','from-red-900/30 to-neutral-900','from-blue-900/30 to-neutral-900','from-green-900/30 to-neutral-900','from-purple-900/30 to-neutral-900','from-cyan-900/30 to-neutral-900','from-neutral-700 to-neutral-900','from-amber-900/40 to-neutral-900','from-neutral-800 to-neutral-950'];
  const titles = [`Prepared for ${name}`, 'Alignment & Opportunity', 'The Problem', 'The Solution', 'Platform Proof', 'Multi-Agent Decision Engine', 'Decision Audit Trail', 'Founder & Team', 'The Ask', 'Next Steps'];
  const texts = [['Cover slide'], [`Why Datacendia aligns with ${name}`], ['Enterprise AI has no accountability layer'], ['Multi-agent deliberation with cryptographic evidence'], ['205K+ tests, 156 endpoints, live platform'], ['Role-specific agents: CFO, CISO, Legal, Strategy, Risk'], ['Every decision tracked with full evidence chain'], ['Stuart Rainey — 7 years at TCS/PGIM'], ['$1.5M Pre-Seed — $7M Pre-Money'], ['Schedule deep dive, technical demo, data room']];
  const slides: SlideData[] = titles.map((t, i) => ({ id: String(i+1), number: i+1, title: t, texts: texts[i], hasImage: i === 5 || i === 6, imageName: i === 5 ? '02-council-deliberation.png' : i === 6 ? '05-decisions.png' : undefined, thumbnailColor: `bg-gradient-to-br ${gradients[i]}` }));
  return { id: String(id), filename: `${num}-${slug}.pptx`, category: cat, status: 'ready', targetName: name, targetType: type, region, location: loc, aum, website: web, contactName: '', contactEmail: '', portfolioCompanies: portfolio, thesisAngle: thesis, slideCount: 10, slides, hasPdf: true, lastModified: new Date(), notes: '' };
}

function batchDecks(items: string[], cat: DeckCategory, type: string, region: Region, pad: number, start: number, out: DeckFile[], idRef: { v: number }) {
  items.forEach((name, i) => {
    const num = String(start + i).padStart(pad, '0');
    const slug = name.toLowerCase().replace(/[\s\/&]+/g, '-').replace(/[^a-z0-9-]/g, '');
    out.push(mkDeck(++idRef.v, cat, num, slug, name, type, region));
  });
}

// ─── Generate all 1,000 deck entries from actual repo structure ──────────────
function generateDecks(): DeckFile[] {
  const decks: DeckFile[] = [];
  const idRef = { v: 0 };

  // ── Main (3) ───────────────────────────────────────────────────────────────
  batchDecks(['Executive Summary', 'Full Pitch Deck', 'Appendix & Data Room'], 'main', 'Main Deck', 'global', 2, 1, decks, idRef);

  // ── Investor (15) — generic themes ─────────────────────────────────────────
  batchDecks(['Series A','Pre-Seed','AI Governance','EU AI Act','Defense & Gov','Open Source','Healthcare AI','Financial Services','Cybersecurity','Data Infrastructure','Climate Tech','Deep Tech','Emerging Markets','Fund of Funds','Impact Investing'], 'investor', 'Investor Theme', 'global', 2, 1, decks, idRef);

  // ── Investor-50 (100) — thesis / vertical / investor-type ──────────────────
  batchDecks([
    'Banking','Insurance','Healthcare','Pharma','Legal','Defense','Energy','Manufacturing','Retail','Telecom',
    'Real Estate','Automotive','Agriculture','Education','Media','Transportation','Mining','Aerospace','Government','Nonprofit',
    'EU AI Act','DORA','Sovereign AI','Open Core','Multi-Agent','Zero Trust Data','Market Creation','Unit Economics','Regulatory Tailwind','Competitive Moat',
    'Land & Expand','Classified Markets','Platform Economics','Cross-Border','Accountability Infra','Angel Pre-Seed','Family Office','Corporate VC','Pension Fund','Sovereign Wealth',
    'Accelerator','University Endowment','Impact ESG','Crypto Web3','Secondary','Growth Equity','Buyout PE','Debt Revenue','Venture Studio','Trade Finance AI',
    'Supply Chain AI','Autonomous Systems','Digital Identity','Quantum Computing','Edge Computing','Robotics Governance','Smart Contracts','RegTech','LegalTech','InsurTech',
    'PropTech','EdTech','AgriTech','MedTech','FinTech','CleanTech','SpaceTech','BioTech','FoodTech','GovTech',
    'DeFi','Privacy Engineering','Explainable AI','AI Safety','Digital Twins','Metaverse Enterprise','Sustainable Finance','Carbon Markets','Water Tech','Ocean Tech',
    'Rare Earth','Semiconductor','5G Enterprise','Satellite Comms','Nuclear Tech','Hydrogen Economy','Battery Storage','EV Infrastructure','Mining Tech','Construction Tech',
    'Forestry Tech','Fisheries AI','Disaster Response','Refugee Tech','Cultural Heritage','Indigenous Data','Arctic Tech','Antarctic Research','Deep Sea','Orbital Debris',
  ], 'investor-50', 'Thesis Deck', 'global', 2, 1, decks, idRef);

  // ── Investor-100 (120) — personalized per firm (original batch) ────────────
  const inv100: Array<[string,string,string,Region,string,string]> = [
    ['001','a16z','Andreessen Horowitz','us','Menlo Park, CA','$35B+'],['002','sequoia','Sequoia Capital','us','Menlo Park, CA','$85B+'],
    ['003','greylock','Greylock Partners','us','Menlo Park, CA','$5B+'],['004','lightspeed','Lightspeed Venture Partners','us','Menlo Park, CA','$18B+'],
    ['005','radical','Radical Ventures','us','Toronto, Canada','$1B+'],['006','air-street','Air Street Capital','eu','London, UK','$100M+'],
    ['007','lux','Lux Capital','us','New York, NY','$4B+'],['008','general-catalyst','General Catalyst','us','Cambridge, MA','$25B+'],
    ['009','index','Index Ventures','eu','London / SF','$10B+'],['010','felicis','Felicis Ventures','us','Menlo Park, CA','$3B+'],
    ['011','bessemer','Bessemer Venture Partners','us','San Francisco, CA','$9B+'],['012','insight','Insight Partners','us','New York, NY','$80B+'],
    ['013','sapphire','Sapphire Ventures','us','Palo Alto, CA','$8B+'],['014','battery','Battery Ventures','us','Boston, MA','$13B+'],
    ['015','salesforce-vc','Salesforce Ventures','us','San Francisco, CA','$5B+'],['016','accel','Accel','us','Palo Alto, CA','$50B+'],
    ['017','madrona','Madrona','us','Seattle, WA','$3B+'],['018','menlo','Menlo Ventures','us','Menlo Park, CA','$5B+'],
    ['019','emergence','Emergence Capital','us','San Mateo, CA','$2B+'],['020','iconiq','ICONIQ Growth','us','San Francisco, CA','$15B+'],
  ];
  for (const [num,slug,name,region,loc,aum] of inv100)
    decks.push(mkDeck(++idRef.v, 'investor-100', num, slug, name, 'Venture Capital', region, loc, aum));
  // Fill remaining 100 investor-100 entries
  const inv100more = [
    'Redpoint','Craft Ventures','Wing VC','FirstMark','GV','Kleiner Perkins','Founders Fund','Tiger Global','Coatue','Addition',
    'Atomico','Balderton','Northzone','EQT Ventures','Earlybird','Molten','Dawn Capital','Creandum','Cherry','Point Nine',
    'Andreessen Bio','8vc','Thoma Bravo','SoftBank Vision','Accenture Ventures','Deloitte Ventures','Canaan','Susquehanna','B Capital','Owl Ventures',
    'Mozilla Ventures','Kapor Capital','Luminate','Ford Foundation','MacArthur','Open Society','McGovern','Responsible Innovation','Sovereign Tech','NGI',
    'Bpifrance','SPRIND','EIC','Tikehau','Eurazeo','Digital Catapult','Baillie Gifford','Schroder Adveq','Swisscom Ventures','Deep Tech Alliance',
    'NEA','CRV','IVP','Highland Capital','Summit Partners','Vista Equity','Francisco Partners','Permira','Warburg Pincus','KKR Tech',
    'Blackstone Growth','Silver Lake','Bain Capital Tech','TPG Capital','Advent International','Apax Partners','Cinven','Hg Capital','Hellman Friedman','Welsh Carson',
    'Oak HC/FT','QED Investors','Ribbit Capital','Nyca Partners','Fin Capital','Bregal Milestone','Spectrum Equity','TA Associates','Genstar Capital','Veritas Capital',
    'In-Q-Tel','DARPA Ventures','CIA Fund','NSF Innovation','DOE Ventures','NASA Tech','Army xTech','Navy SBIR','Air Force Ventures','Space Force',
    'Temasek','Mubadala','ADIA','GIC','Norges Bank','Khosla Ventures','NEA Global','Norwest','IVP Growth','Sands Capital',
  ];
  for (let i = 0; i < inv100more.length; i++) {
    const num = String(21 + i).padStart(3, '0');
    const slug = inv100more[i].toLowerCase().replace(/[\s\/&]+/g, '-').replace(/[^a-z0-9-]/g, '');
    decks.push(mkDeck(++idRef.v, 'investor-100', num, slug, inv100more[i], 'Venture Capital', 'us'));
  }

  // ── Investor-500 (380) — personalized per firm (US, EU, Asia, LatAm, etc) ─
  const inv500firms: Array<[string,string,Region]> = [
    ['Benchmark','San Francisco, CA','us'],['Foundry Group','Boulder, CO','us'],['Union Square Ventures','New York, NY','us'],
    ['True Ventures','San Francisco, CA','us'],['Amplify Partners','Menlo Park, CA','us'],['Scale Venture Partners','Foster City, CA','us'],
    ['Flybridge Capital','Boston, MA','us'],['Matrix Partners','San Francisco, CA','us'],['Spark Capital','Boston, MA','us'],['Andreessen Future','Menlo Park, CA','us'],
    ['SignalFire','San Francisco, CA','us'],['Base10 Partners','San Francisco, CA','us'],['Defy Partners','Menlo Park, CA','us'],
    ['D1 Capital','New York, NY','us'],['DCM Ventures','Menlo Park, CA','us'],['Floodgate','Menlo Park, CA','us'],['First Round Capital','San Francisco, CA','us'],
    ['Five Elms Capital','Kansas City, MO','us'],['G Squared','Chicago, IL','us'],['JMI Equity','Baltimore, MD','us'],
    ['Lead Edge Capital','New York, NY','us'],['M13','Los Angeles, CA','us'],['Mayfield Fund','Menlo Park, CA','us'],['Mithril Capital','Austin, TX','us'],
    ['Point72 Ventures','New York, NY','us'],['Ridge Ventures','San Francisco, CA','us'],['Two Sigma Ventures','New York, NY','us'],
    ['Valor Equity Partners','Chicago, IL','us'],['Vector Capital','San Francisco, CA','us'],['Work-Bench','New York, NY','us'],
  ];
  // EU firms
  const inv500eu: Array<[string,string]> = [
    ['Seedcamp','London'],['Balderton Capital II','London'],['Project A','Berlin'],['HV Capital','Munich'],['Lakestar','Zurich'],
    ['Felix Capital','London'],['Hoxton Ventures','London'],['BlueYard Capital','Berlin'],['Burda Principal','Munich'],['Frog Capital','London'],
    ['SmartFin Capital','Antwerp'],['Mundi Ventures','Madrid'],['Yabeo Capital','Munich'],['IP Group','London'],['Livingbridge','London'],
  ];
  // Asia firms
  const inv500asia: Array<[string,string]> = [
    ['Peak XV (Sequoia SEA)','Singapore'],['B Capital Asia','Singapore'],['Cathay Innovation Asia','Hong Kong'],['JAFCO','Tokyo'],
    ['East Ventures','Jakarta'],['Gobi Partners','Hong Kong'],['Strive','Tokyo'],['K Fund Korea','Seoul'],['Z Venture Capital','Tokyo'],
    ['NTT Venture Capital','Tokyo'],['Hyundai CRADLE','Seoul'],['Samsung Catalyst','Seoul'],['Shunwei Capital','Beijing'],['Sky9 Capital','Shanghai'],['Telstra Ventures','Sydney'],
  ];
  // Middle-East, LatAm, Africa
  const inv500me: Array<[string,string]> = [['Mubadala Tech','Abu Dhabi'],['STV','Riyadh'],['Wamda Capital','Dubai'],['Vision Ventures','Riyadh'],['BECO Capital','Dubai']];
  const inv500la: Array<[string,string]> = [['Kaszek','Buenos Aires'],['Monashees','Sao Paulo'],['Valor Capital','Rio de Janeiro'],['SoftBank LatAm','Miami'],['ALLVP','Mexico City']];
  const inv500af: Array<[string,string]> = [['Partech Africa','Nairobi'],['TLcom Capital','Lagos'],['Novastar','Nairobi'],['Latitude Ventures','Lagos'],['Zedcrest Capital','Lagos']];

  let inv500idx = 121;
  for (const [name, loc, region] of inv500firms) {
    decks.push(mkDeck(++idRef.v, 'investor-500', String(inv500idx).padStart(3,'0'), name.toLowerCase().replace(/[\s\/&]+/g,'-').replace(/[^a-z0-9-]/g,''), name, 'Venture Capital', region, loc));
    inv500idx++;
  }
  for (const [name, loc] of inv500eu) { decks.push(mkDeck(++idRef.v, 'investor-500', String(inv500idx).padStart(3,'0'), name.toLowerCase().replace(/[\s\/&]+/g,'-').replace(/[^a-z0-9-]/g,''), name, 'Venture Capital', 'eu', loc)); inv500idx++; }
  for (const [name, loc] of inv500asia) { decks.push(mkDeck(++idRef.v, 'investor-500', String(inv500idx).padStart(3,'0'), name.toLowerCase().replace(/[\s\/&]+/g,'-').replace(/[^a-z0-9-]/g,''), name, 'Venture Capital', 'asia', loc)); inv500idx++; }
  for (const [name, loc] of inv500me) { decks.push(mkDeck(++idRef.v, 'investor-500', String(inv500idx).padStart(3,'0'), name.toLowerCase().replace(/[\s\/&]+/g,'-').replace(/[^a-z0-9-]/g,''), name, 'Venture Capital', 'middle-east', loc)); inv500idx++; }
  for (const [name, loc] of inv500la) { decks.push(mkDeck(++idRef.v, 'investor-500', String(inv500idx).padStart(3,'0'), name.toLowerCase().replace(/[\s\/&]+/g,'-').replace(/[^a-z0-9-]/g,''), name, 'Venture Capital', 'latam', loc)); inv500idx++; }
  for (const [name, loc] of inv500af) { decks.push(mkDeck(++idRef.v, 'investor-500', String(inv500idx).padStart(3,'0'), name.toLowerCase().replace(/[\s\/&]+/g,'-').replace(/[^a-z0-9-]/g,''), name, 'Venture Capital', 'africa', loc)); inv500idx++; }
  // Fill remaining investor-500 to 380 with generated names
  const inv500fill = ['a16z Crypto','Acrew Capital','Anthos Capital','Avenir Growth','Bedrock Capital','Blackhorn Ventures','BoxGroup','Caffeinated Capital','Cendana Capital','Clockwork Capital','Coller Capital','Commonfund','Contrary Capital','Correlation Ventures','Crossbeam Ventures','Drake Star','Elad Gil','Elephant Partners','Embark Ventures','Endeavor Catalyst','Engage Ventures','ENTR Partners','Euclid Transatlantic','Evolution Equity','Existing Ventures','Fidelity International','Forerunner Ventures','Formation Ventures','Fuel Ventures','General Catalyst Asia','GFC','Google for Startups','Gratitude Railroad','Grotech Ventures','Hampleton Partners','Harbert Management','Hartford HC Ventures','Henkel dx Ventures','Hero Capital','HubSpot Ventures','IBM Ventures','IGL Ventures','IMEC.istart','Inventus Capital','Invus Group','J.P. Morgan Growth','Junction Ventures','Kairos Ventures','Kerry Group Ventures','Kuang-Chi','Lanx Capital','Launchpad Capital','Liberty Mutual Ventures','Linden Capital','LvlUp Ventures','Manifold Group','Marchmont Holdings','Meka Ventures','Microsoft M12','Montage Ventures','Morningside Ventures','Motive Partners Asia','NAVER D2SF','NEO','New Enterprise Associates','NYC Venture Fund','North Bridge Ventures','Northpond Ventures','Ocean Bio-Chem Ventures','OMERS Ventures','One Way Ventures','Open Ocean','Osborne Clarke Ventures','OVO Fund','Oxford Science Enterprises','Panache Ventures','Pelion Venture Partners','Penn Mutual Ventures','Phoenix Venture Partners','Playground Global','Plug and Play Japan','Prologis Ventures','Propel Venture Partners','PTC Ventures','PUMA Springboard','Qualcomm Ventures','Quantum Valley','Radcliffe Capital','Rain Capital','Reactor','Redline Capital','Republic','Ripple Ventures','Rocketship.vc','Salesforce Ventures Asia','Samsung Catalyst Fund','SAP Sapphire','Scale Asia Ventures','Scout Ventures','SEQ Capital','Shunwei Capital II','SignalFire II','Sky9 Capital II','Slow Ventures','SoFi Ventures','Spring Mountain Capital','Standard Crypto','Starburst Ventures','Starts Ventures','SteelPoint Capital','StepStone Group','Strong Ventures','Superhuman Capital','SVB Capital','Swisscom Ventures II','Tao Capital Partners','Tata Capital','TCV','Tech Coast Angels','TechNexus','Telefonica Ventures','Tenor Capital','TF Ventures','Tom Advisors','True Ventures II','Union Tech Ventures','Valar Ventures','Valor Equity II','Vanedge Capital','Venture Highway','Venture Reality Fund','Volta Ventures','Warburg Pincus Asia','Wide Ventures','Wild Basin Investments','Wing VC II','World Fund','X Ventures','Y Analytics','Yabeo Capital II','York IE','Z Venture Capital II','Zedcrest Capital II','Zenith Venture Capital','Zetta Venture Partners','Zinc VC','Zions Ventures','Zodiac Ventures','Zurich Insurance Ventures','Zweig DiMenna','1517 Fund','10x Capital','137 Ventures','22 Ventures','Abbey Road Capital','Alchemy Ventures','Align Ventures','Aluminari Ventures','Aluminum Capital','500 Global II','Abstract Ventures','Accomplice','Act One Ventures','Afore Capital','AirTree Ventures','Airtable Ventures','Alpha Intelligence','Alpine Meridian','Alumni Ventures','Amadeus Capital','Anzu Partners','Apex Ventures','Array Ventures','Ascend Ventures','Atlas Venture','Audacious Ventures','Avesta Capital','Ayala Capital','Azure Ventures','Baroda Ventures','Berkeley Gateway','Beta Boom','Beyond Capital','Black River','BlackBird Ventures','Bluestein Capital','Bolt Innovation','Borealis Ventures','Boulder Ventures','Breakthrough Capital','Bridge Builders','Brighter Capital','Cactus Partners','Catalyst Fund','Cedar Grove','Centana Growth','Challenger Ventures','Circadian Group','Clearco Capital','Cloud Capital','Cobalt Capital','Commerce Ventures','Community Investment','Continental Ventures','Cooper Standard','Cornerstone Growth','Costanoa Ventures','Crane Venture Partners','Cubit Capital','Decibel Partners','Deep Insight','Delta Capital','Diaspora Ventures','Digital Bridge','Element Ventures','Emerald Technology','Endeavor Global','Energy Capital','Enigma Ventures','Envision Ventures','Epoch Capital','Era Ventures','Eureka Fund','Excalibur Ventures','Expansion Capital','Falcon Edge','Fathom Capital','Finistere Ventures','Forge Ventures','Frontier Capital','FuturePerfect','Galleon Group','Gateway Ventures','Genesis Capital','Glasswing','Globe Advisors','Golden Pine','Goldfinch Capital','Graph Ventures','Green D','GreenSoil','Halo Capital','Harbor Capital','Harvest Growth','Haven Capital','Helm Ventures','Heroic Ventures','High Alpha','Horizon Partners','Icon Ventures','Illuminate Financial','Indie Capital','Infinity Ventures','Innovation Works','Interplay Ventures','Iridium Capital','Ivory Tower','Jade Capital','Javelin Partners','Kaizen Capital'];
  for (let i = 0; i < inv500fill.length && inv500idx <= 500; i++) {
    const name = inv500fill[i];
    const region: Region = i % 5 === 0 ? 'eu' : i % 7 === 0 ? 'asia' : 'us';
    decks.push(mkDeck(++idRef.v, 'investor-500', String(inv500idx).padStart(3,'0'), name.toLowerCase().replace(/[\s\/&.]+/g,'-').replace(/[^a-z0-9-]/g,''), name, 'Venture Capital', region));
    inv500idx++;
  }

  // ── Sales (75) ─────────────────────────────────────────────────────────────
  batchDecks([
    'Fortune 500','Mid-Market','Regulated Industries','Banking','Insurance','Pharma','Manufacturing','Retail','Compliance & Risk','Decision Speed',
    'AI Trust','Data Silos','Audit Readiness','Vendor Lock-In','AI Governance Gap','vs Traditional BI','vs Cloud AI','vs Data Platforms','vs GRC','vs Chatbots',
    'Cloud Deploy','Private Cloud','On-Prem','Air-Gapped','Hybrid','Construction','Media & Entertainment','Telecommunications','Higher Education','Nonprofit',
    'Agriculture','Aerospace Defense','Automotive','Hospitality & Travel','Sports & Athletics','Decision Fatigue','Regulatory Chaos','AI Liability','Board Accountability','Cross-Border Compliance',
    'Shadow AI','Evidence Trail','Institutional Memory','Bias Detection','Whistleblower','vs Palantir','vs C3.ai','vs Dataiku','vs H2O','vs Databricks',
    'HIPAA Deploy','FedRAMP','SOX Compliance','PCI-DSS','CMMC','CISO','CTO','CFO','CCO','Board of Directors',
    'General Counsel','Chief Risk Officer','Chief Data Officer','CIO','Head of AI','Startup','SMB','Mid-Enterprise','Large Enterprise','Government Agency',
    'Multilateral','Consortium','Academic Institution','Central Bank','Military',
  ], 'sales', 'Sales Deck', 'global', 2, 1, decks, idRef);

  // ── Design Partner (75) ────────────────────────────────────────────────────
  batchDecks([
    'Healthcare','Financial Services','Legal','Government','Defense','Energy & Utilities','Insurance','Pharma','Risk Management','Compliance Officers',
    'Supply Chain','Logistics','Audit Firms','Consulting','Banking Ops','Wealth Management','Asset Management','Credit Unions','Mortgage','Trading',
    'Clinical Trials','Hospital Systems','Telemedicine','Mental Health','Dental Networks','Real Estate','Construction','Property Management','Smart Buildings','Urban Planning',
    'K-12 Education','University Research','Corporate Training','EdTech Platform','Library Systems','Automotive OEM','Fleet Management','Aviation','Maritime','Rail',
    'Food & Beverage','Agriculture Tech','Water Utilities','Waste Management','Recycling','Media Production','Publishing','Broadcasting','Advertising','Gaming',
    'Telecommunications','Data Centers','Cloud Providers','Cybersecurity Ops','Network Infrastructure','Mining Operations','Oil & Gas','Renewable Energy','Nuclear','Chemical',
    'Textiles','Furniture','Consumer Electronics','Luxury Goods','Sports Equipment','Non-Profit','NGO','Multilateral Org','Think Tank','Research Institute',
    'Accelerator','Incubator','Venture Studio','Co-Working','Innovation Lab',
  ], 'design-partner', 'Design Partner', 'global', 2, 1, decks, idRef);

  // ── Gamma (10) ─────────────────────────────────────────────────────────────
  batchDecks([
    'Investor Overview','Design Partner','Defense Government','Technical Architecture','Enterprise Sales',
    'Healthcare Vertical','Financial Compliance','AI Governance Market','Open Source Strategy','Index',
  ], 'gamma', 'Gamma Deck', 'global', 2, 1, decks, idRef);

  // ── Enterprise (100) ───────────────────────────────────────────────────────
  batchDecks([
    'Anti-Money Laundering','Audit Trail Automation','Aviation Safety AI','Bank Stress Testing','Basel Compliance',
    'Board Decision Intelligence','Capital Allocation AI','Carbon Accounting','Central Bank Reporting','Clinical Decision Support',
    'Cloud Migration Governance','Compliance Workflow','Contract Intelligence','Corporate Fraud Detection','Crisis Communication AI',
    'Cross-Border Trade Compliance','Cybersecurity Incident Response','Data Privacy Automation','Defense Acquisition AI','Digital Twin Governance',
    'Drug Discovery Decisions','E-Commerce Fraud Prevention','Education Governance','Election Security','Emergency Response AI',
    'Energy Grid Optimization','Environmental Compliance','ESG Reporting Automation','Export Control Compliance','FDA Submission AI',
    'Financial Audit Automation','Fleet Management AI','Food Safety Compliance','Fraud Detection Governance','GDPR Compliance Engine',
    'Healthcare AI Governance','HIPAA Audit Automation','HR Decision Intelligence','Identity Verification','Immigration Case AI',
    'Infrastructure Monitoring','Insurance Claims AI','Intellectual Property AI','Internal Audit AI','Investment Committee AI',
    'IoT Security Governance','Judicial Decision Support','KYC Automation','Labor Compliance','Legal Discovery AI',
    'Loan Underwriting AI','Logistics Optimization','M&A Due Diligence AI','Manufacturing Quality','Maritime Compliance',
    'Media Content Governance','Medical Device Compliance','Merger Review AI','Military Logistics AI','Municipal Governance',
    'Nuclear Safety AI','Occupational Safety','Oil & Gas Compliance','Operational Risk AI','Patent Analysis AI',
    'Payment Fraud AI','Pension Fund Governance','Pharmaceutical Compliance','Pipeline Safety AI','Police Oversight AI',
    'Portfolio Risk AI','Privacy Impact Assessment','Procurement AI','Public Health AI','Quality Assurance AI',
    'Railroad Safety AI','Real Estate Compliance','Regulatory Change Management','Research Ethics AI','Revenue Assurance AI',
    'Safety Incident AI','Sanctions Screening','Securities Compliance','Smart City Governance','Social Media Governance',
    'Spectrum Management','Student Loan AI','Supply Chain Risk','Tax Compliance AI','Telecom Compliance',
    'Trade Surveillance','Transportation Safety','Treasury Management AI','University Governance','Utility Rate AI',
    'Vaccine Distribution AI','Vendor Risk Management','Water Quality AI','Wealth Transfer AI','Workforce Planning AI',
  ], 'enterprise', 'Enterprise Use Case', 'global', 2, 1, decks, idRef);

  // ── Regional (122) ─────────────────────────────────────────────────────────
  const regionalData: Array<[string, Region]> = [
    ['New York','us'],['San Francisco','us'],['Boston','us'],['Chicago','us'],['Austin','us'],['Seattle','us'],['Washington DC','us'],['Los Angeles','us'],['Denver','us'],['Atlanta','us'],['Miami','us'],['Dallas','us'],['Philadelphia','us'],
    ['London','eu'],['Frankfurt','eu'],['Paris','eu'],['Amsterdam','eu'],['Berlin','eu'],['Zurich','eu'],['Dublin','eu'],['Stockholm','eu'],['Helsinki','eu'],['Copenhagen','eu'],['Oslo','eu'],['Madrid','eu'],['Milan','eu'],['Vienna','eu'],['Brussels','eu'],['Lisbon','eu'],['Warsaw','eu'],['Prague','eu'],['Budapest','eu'],['Bucharest','eu'],['Athens','eu'],['Tallinn','eu'],['Vilnius','eu'],['Riga','eu'],['Bratislava','eu'],['Ljubljana','eu'],['Zagreb','eu'],['Sofia','eu'],['Luxembourg','eu'],['Edinburgh','eu'],['Manchester','eu'],['Munich','eu'],['Barcelona','eu'],
    ['Dubai','middle-east'],['Riyadh','middle-east'],['Abu Dhabi','middle-east'],['Tel Aviv','middle-east'],['Doha','middle-east'],['Bahrain','middle-east'],['Kuwait City','middle-east'],
    ['Cairo','africa'],['Johannesburg','africa'],['Cape Town','africa'],['Lagos','africa'],['Nairobi','africa'],['Accra','africa'],['Kigali','africa'],['Casablanca','africa'],['Addis Ababa','africa'],['Dar es Salaam','africa'],
    ['Tokyo','asia'],['Osaka','asia'],['Seoul','asia'],['Beijing','asia'],['Shanghai','asia'],['Shenzhen','asia'],['Hong Kong','asia'],['Taipei','asia'],['Singapore','asia'],
    ['Mumbai','asia'],['Bangalore','asia'],['Delhi','asia'],['Hyderabad','asia'],['Jakarta','asia'],['Bangkok','asia'],['Kuala Lumpur','asia'],['Ho Chi Minh City','asia'],['Manila','asia'],
    ['Sydney','asia'],['Melbourne','asia'],['Auckland','asia'],
    ['Sao Paulo','latam'],['Rio de Janeiro','latam'],['Mexico City','latam'],['Monterrey','latam'],['Bogota','latam'],['Buenos Aires','latam'],['Santiago','latam'],['Lima','latam'],['San Jose CR','latam'],['Panama City','latam'],['Montevideo','latam'],['Quito','latam'],
    ['Brussels EU AI Act','eu'],['Strasbourg EU Regulation','eu'],['Frankfurt ECB Finance','eu'],
    ['Toronto','us'],['Vancouver','us'],['Montreal','us'],['Calgary','us'],
    ['Bangalore Tech Hub','asia'],['Pune','asia'],['Chennai','asia'],['Kolkata','asia'],
    ['East African Community','africa'],['SADC Gaborone','africa'],
  ];
  regionalData.forEach(([name, region], i) => {
    const num = String(i + 1).padStart(2, '0');
    const slug = name.toLowerCase().replace(/[\s\/&]+/g, '-').replace(/[^a-z0-9-]/g, '');
    decks.push(mkDeck(++idRef.v, 'regional', num, slug, name, 'Regional Deck', region, name));
  });

  return decks;
}

// ─── Sub-components ─────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ status: DeckStatus }> = ({ status }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
};

const CategoryBadge: React.FC<{ category: DeckCategory }> = ({ category }) => {
  const cfg = CATEGORY_CONFIG[category];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.color}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
};

// ─── Slide Editor Panel ─────────────────────────────────────────────────────
const SlideEditor: React.FC<{
  deck: DeckFile;
  onClose: () => void;
  onUpdate: (deck: DeckFile) => void;
}> = ({ deck, onClose, onUpdate }) => {
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [editingText, setEditingText] = useState<number | null>(null);
  const [textValue, setTextValue] = useState('');
  const slide = deck.slides[selectedSlide];

  const handleAddSlide = () => {
    const newSlide: SlideData = {
      id: String(Date.now()),
      number: deck.slides.length + 1,
      title: 'New Slide',
      texts: ['Add your content here'],
      hasImage: false,
      thumbnailColor: 'bg-gradient-to-br from-neutral-800 to-neutral-900',
    };
    onUpdate({ ...deck, slides: [...deck.slides, newSlide], slideCount: deck.slideCount + 1 });
  };

  const handleDeleteSlide = (idx: number) => {
    const newSlides = deck.slides.filter((_, i) => i !== idx).map((s, i) => ({ ...s, number: i + 1 }));
    onUpdate({ ...deck, slides: newSlides, slideCount: newSlides.length });
    if (selectedSlide >= newSlides.length) setSelectedSlide(Math.max(0, newSlides.length - 1));
  };

  const handleUpdateSlideTitle = (title: string) => {
    const newSlides = [...deck.slides];
    newSlides[selectedSlide] = { ...newSlides[selectedSlide], title };
    onUpdate({ ...deck, slides: newSlides });
  };

  const handleUpdateText = (textIdx: number, value: string) => {
    const newSlides = [...deck.slides];
    const newTexts = [...newSlides[selectedSlide].texts];
    newTexts[textIdx] = value;
    newSlides[selectedSlide] = { ...newSlides[selectedSlide], texts: newTexts };
    onUpdate({ ...deck, slides: newSlides });
    setEditingText(null);
  };

  const handleAddText = () => {
    const newSlides = [...deck.slides];
    newSlides[selectedSlide] = { ...newSlides[selectedSlide], texts: [...newSlides[selectedSlide].texts, 'New text block'] };
    onUpdate({ ...deck, slides: newSlides });
  };

  const handleRemoveText = (textIdx: number) => {
    const newSlides = [...deck.slides];
    newSlides[selectedSlide] = { ...newSlides[selectedSlide], texts: newSlides[selectedSlide].texts.filter((_, i) => i !== textIdx) };
    onUpdate({ ...deck, slides: newSlides });
  };

  const handleToggleImage = () => {
    const newSlides = [...deck.slides];
    const s = newSlides[selectedSlide];
    newSlides[selectedSlide] = { ...s, hasImage: !s.hasImage, imageName: s.hasImage ? undefined : 'screenshot.png' };
    onUpdate({ ...deck, slides: newSlides });
  };

  if (!slide) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex">
      {/* Slide strip (left) */}
      <div className="w-48 bg-neutral-900 border-r border-neutral-700 overflow-y-auto p-2 space-y-1">
        <div className="flex items-center justify-between px-2 py-1 mb-2">
          <span className="text-xs text-neutral-400 uppercase tracking-wider">Slides</span>
          <button onClick={handleAddSlide} className="p-1 hover:bg-neutral-700 rounded text-green-400" title="Add slide">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        {deck.slides.map((s, i) => (
          <div
            key={s.id}
            className={`group relative rounded-lg cursor-pointer transition-colors ${i === selectedSlide ? 'ring-2 ring-blue-500' : 'hover:bg-neutral-800'}`}
            onClick={() => setSelectedSlide(i)}
          >
            <div className={`aspect-[16/9] rounded-lg ${s.thumbnailColor} flex items-center justify-center p-2`}>
              <span className="text-[9px] text-white/60 text-center leading-tight">{s.title}</span>
            </div>
            <span className="absolute bottom-1 left-2 text-[9px] text-neutral-500">{s.number}</span>
            {deck.slides.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteSlide(i); }}
                className="absolute top-1 right-1 p-0.5 bg-red-500/80 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-2.5 h-2.5 text-white" />
              </button>
            )}
            {s.hasImage && (
              <span className="absolute top-1 left-1 p-0.5 bg-blue-500/80 rounded">
                <Image className="w-2.5 h-2.5 text-white" />
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Main editor area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-700">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="flex items-center gap-1 text-sm text-neutral-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <span className="text-sm text-white font-medium">{deck.targetName}</span>
            <span className="text-xs text-neutral-500">Slide {selectedSlide + 1} of {deck.slides.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleAddText} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-neutral-700 hover:bg-neutral-600 rounded-lg text-neutral-300">
              <Type className="w-3.5 h-3.5" /> Add Text
            </button>
            <button onClick={handleToggleImage} className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg ${slide.hasImage ? 'bg-blue-600 text-white' : 'bg-neutral-700 hover:bg-neutral-600 text-neutral-300'}`}>
              <Image className="w-3.5 h-3.5" /> {slide.hasImage ? 'Remove Image' : 'Add Image'}
            </button>
          </div>
        </div>

        {/* Slide preview */}
        <div className="flex-1 flex items-center justify-center p-8 bg-neutral-950">
          <div className={`w-full max-w-4xl aspect-[16/9] rounded-xl ${slide.thumbnailColor} border border-neutral-700 p-8 flex`}>
            {/* Left content */}
            <div className={`flex-1 flex flex-col justify-center ${slide.hasImage ? 'pr-4' : ''}`}>
              {/* Editable title */}
              <input
                className="text-2xl font-bold text-white bg-transparent border-b border-transparent hover:border-neutral-600 focus:border-blue-500 focus:outline-none mb-4 w-full"
                value={slide.title}
                onChange={(e) => handleUpdateSlideTitle(e.target.value)}
              />

              {/* Editable text blocks */}
              <div className="space-y-2">
                {slide.texts.map((t, ti) => (
                  <div key={ti} className="group flex items-start gap-2">
                    {editingText === ti ? (
                      <div className="flex-1 flex gap-1">
                        <input
                          className="flex-1 text-sm text-neutral-300 bg-neutral-800 border border-blue-500 rounded px-2 py-1 focus:outline-none"
                          value={textValue}
                          onChange={(e) => setTextValue(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleUpdateText(ti, textValue); if (e.key === 'Escape') setEditingText(null); }}
                          autoFocus
                        />
                        <button onClick={() => handleUpdateText(ti, textValue)} className="p-1 text-green-400 hover:bg-neutral-700 rounded"><Check className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setEditingText(null)} className="p-1 text-neutral-500 hover:bg-neutral-700 rounded"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <>
                        <p
                          className="flex-1 text-sm text-neutral-300 cursor-pointer hover:text-white"
                          onClick={() => { setEditingText(ti); setTextValue(t); }}
                        >
                          {t}
                        </p>
                        <button
                          onClick={() => handleRemoveText(ti)}
                          className="p-0.5 text-red-400/0 group-hover:text-red-400/70 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Image placeholder */}
            {slide.hasImage && (
              <div className="w-[45%] flex items-center justify-center bg-neutral-800/50 rounded-lg border border-dashed border-neutral-600">
                <div className="text-center">
                  <Image className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                  <p className="text-xs text-neutral-500">{slide.imageName || 'Drop screenshot here'}</p>
                  <button className="mt-2 text-[10px] text-blue-400 hover:text-blue-300">Choose file...</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── File URL Helper ────────────────────────────────────────────────────────
const CATEGORY_FOLDER_MAP: Record<DeckCategory, string> = {
  main: '',
  investor: 'investor',
  'investor-50': 'investor-50',
  'investor-100': 'investor-100',
  'investor-500': 'investor-500',
  sales: 'sales',
  'design-partner': 'design-partner',
  gamma: 'gamma',
  enterprise: 'enterprise',
  regional: 'regional',
};

function getDeckUrl(deck: DeckFile, format: 'pptx' | 'pdf'): string {
  const folder = CATEGORY_FOLDER_MAP[deck.category];
  const filename = format === 'pdf' ? deck.filename.replace('.pptx', '.pdf') : deck.filename;
  if (folder) {
    return `/pitch-decks/${folder}/${format}/${filename}`;
  }
  return `/pitch-decks/${format}/${filename}`;
}

// ─── Deck Detail Panel (with slide preview) ─────────────────────────────────
const DeckDetail: React.FC<{
  deck: DeckFile;
  onClose: () => void;
  onUpdate: (deck: DeckFile) => void;
  onOpenEditor: () => void;
}> = ({ deck, onClose, onUpdate, onOpenEditor }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [editField, setEditField] = useState<string | null>(null);
  const slide = deck.slides[currentSlide];
  const hasPrev = currentSlide > 0;
  const hasNext = currentSlide < deck.slides.length - 1;

  const updateField = (field: keyof DeckFile, value: any) => {
    onUpdate({ ...deck, [field]: value });
    setEditField(null);
  };

  const EditableField: React.FC<{ label: string; field: keyof DeckFile; value: string }> = ({ label, field, value }) => (
    <div>
      <label className="text-[10px] uppercase tracking-wider text-neutral-500">{label}</label>
      {editField === field ? (
        <input
          className="w-full bg-neutral-800 border border-blue-500 rounded px-2 py-1 text-sm text-white focus:outline-none"
          defaultValue={value}
          autoFocus
          onBlur={(e) => updateField(field, e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') updateField(field, (e.target as HTMLInputElement).value); }}
        />
      ) : (
        <p className="text-sm text-neutral-200 cursor-pointer hover:text-white" onClick={() => setEditField(field as string)}>
          {value || <span className="text-neutral-600 italic">Click to add</span>}
        </p>
      )}
    </div>
  );

  return (
    <div className="w-[440px] border-l border-neutral-700 bg-neutral-900 flex flex-col overflow-hidden">
      {/* Header row */}
      <div className="flex-shrink-0 px-4 py-2.5 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">{deck.targetName}</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <CategoryBadge category={deck.category} />
            <StatusBadge status={deck.status} />
            {deck.region && <span className="text-[10px] text-neutral-500">{REGION_CONFIG[deck.region]?.flag}</span>}
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-neutral-700 rounded ml-2"><X className="w-4 h-4 text-neutral-500" /></button>
      </div>

      {/* ── Slide Preview ────────────────────────────────────────────────── */}
      {slide && (
        <div className="flex-shrink-0 px-4 pt-3">
          {/* Main slide canvas */}
          <div className={`relative aspect-[16/9] rounded-xl ${slide.thumbnailColor} border border-neutral-700/50 overflow-hidden group`}>
            {/* Slide content */}
            <div className="absolute inset-0 flex flex-col justify-center px-6">
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Slide {slide.number} of {deck.slides.length}</p>
              <h4 className="text-base font-semibold text-white leading-tight">{slide.title}</h4>
              {slide.texts.map((t, i) => (
                <p key={i} className="text-xs text-neutral-400 mt-1 leading-relaxed">{t}</p>
              ))}
              {slide.hasImage && (
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-blue-400/70">
                  <Image className="w-3 h-3" />
                  <span>{slide.imageName}</span>
                </div>
              )}
            </div>

            {/* Prev / Next arrows (visible on hover) */}
            {hasPrev && (
              <button
                onClick={() => setCurrentSlide(c => c - 1)}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
            )}
            {hasNext && (
              <button
                onClick={() => setCurrentSlide(c => c + 1)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            )}
          </div>

          {/* Thumbnail strip */}
          <div className="flex gap-1.5 mt-2 overflow-x-auto pb-2 scrollbar-thin">
            {deck.slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(i)}
                className={`flex-shrink-0 w-14 h-8 rounded ${s.thumbnailColor} border transition-all flex items-center justify-center ${
                  i === currentSlide ? 'border-blue-500 ring-1 ring-blue-500/40 scale-105' : 'border-neutral-700/40 hover:border-neutral-500 opacity-60 hover:opacity-100'
                }`}
              >
                <span className="text-[8px] text-white/70 font-medium">{i + 1}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex-shrink-0 px-4 py-2 flex gap-2">
        <button onClick={onOpenEditor} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs text-white font-medium">
          <Edit3 className="w-3.5 h-3.5" /> Edit Slides
        </button>
        <a href={getDeckUrl(deck, 'pptx')} download={deck.filename} className="flex items-center justify-center gap-1 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-xs text-neutral-300">
          <Download className="w-3.5 h-3.5" /> PPTX
        </a>
        {deck.hasPdf && (
          <a href={getDeckUrl(deck, 'pdf')} download={deck.filename.replace('.pptx', '.pdf')} className="flex items-center justify-center gap-1 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-xs text-neutral-300">
            <Download className="w-3.5 h-3.5" /> PDF
          </a>
        )}
      </div>

      {/* ── Collapsible metadata ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto border-t border-neutral-800">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="w-full px-4 py-2 flex items-center justify-between text-[10px] uppercase tracking-wider text-neutral-500 hover:text-neutral-300"
        >
          <span>Deck Info & Metadata</span>
          {showInfo ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {showInfo && (
          <div className="px-4 pb-4 space-y-3">
            <EditableField label="Target" field="targetName" value={deck.targetName} />
            <EditableField label="Type" field="targetType" value={deck.targetType} />
            <EditableField label="Location" field="location" value={deck.location} />
            <EditableField label="AUM" field="aum" value={deck.aum} />
            <EditableField label="Website" field="website" value={deck.website} />
            <EditableField label="Thesis / Angle" field="thesisAngle" value={deck.thesisAngle} />

            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider pt-2">Contact</h4>
            <EditableField label="Contact Name" field="contactName" value={deck.contactName} />
            <EditableField label="Email" field="contactEmail" value={deck.contactEmail} />

            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider pt-2">Status</h4>
            <div className="flex flex-wrap gap-1">
              {(Object.keys(STATUS_CONFIG) as DeckStatus[]).map(s => (
                <button
                  key={s}
                  onClick={() => updateField('status', s)}
                  className={`px-2 py-1 rounded text-[10px] border transition-colors ${deck.status === s ? STATUS_CONFIG[s].color : 'text-neutral-500 border-neutral-700 hover:border-neutral-500'}`}
                >
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>

            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider pt-2">Notes</h4>
            <textarea
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-300 focus:outline-none focus:border-blue-500 resize-none"
              rows={3}
              value={deck.notes}
              onChange={(e) => onUpdate({ ...deck, notes: e.target.value })}
              placeholder="Add notes..."
            />

            {deck.portfolioCompanies.length > 0 && (
              <>
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider pt-2">Portfolio</h4>
                <div className="flex flex-wrap gap-1">
                  {deck.portfolioCompanies.map(c => (
                    <span key={c} className="px-2 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-[10px] text-neutral-300">{c}</span>
                  ))}
                </div>
              </>
            )}

            <div className="pt-2 text-[10px] text-neutral-600">
              <p>{deck.slideCount} slides · {deck.filename}</p>
              <p>Modified: {deck.lastModified.toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ──────────────────────────────────────────────────────────────
const PitchDeckManagerPage: React.FC = () => {
  const [decks, setDecks] = useState<DeckFile[]>(() => generateDecks());
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<DeckCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<DeckStatus | 'all'>('all');
  const [regionFilter, setRegionFilter] = useState<Region | 'all'>('all');
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [editorDeckId, setEditorDeckId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return decks.filter(d => {
      const matchSearch = !q || d.targetName.toLowerCase().includes(q) || d.filename.toLowerCase().includes(q) || d.location.toLowerCase().includes(q) || d.thesisAngle.toLowerCase().includes(q);
      const matchCat = categoryFilter === 'all' || d.category === categoryFilter;
      const matchStatus = statusFilter === 'all' || d.status === statusFilter;
      const matchRegion = regionFilter === 'all' || d.region === regionFilter;
      return matchSearch && matchCat && matchStatus && matchRegion;
    });
  }, [decks, search, categoryFilter, statusFilter, regionFilter]);

  const selectedDeck = decks.find(d => d.id === selectedDeckId);
  const editorDeck = decks.find(d => d.id === editorDeckId);

  const updateDeck = useCallback((updated: DeckFile) => {
    setDecks(prev => prev.map(d => d.id === updated.id ? updated : d));
  }, []);

  const handleAddDeck = () => {
    const newDeck: DeckFile = {
      id: String(Date.now()),
      filename: 'new-deck.pptx',
      category: categoryFilter === 'all' ? 'investor' : categoryFilter,
      status: 'draft',
      targetName: 'New Pitch Deck',
      targetType: '',
      region: 'global',
      location: '',
      aum: '',
      website: '',
      contactName: '',
      contactEmail: '',
      portfolioCompanies: [],
      thesisAngle: '',
      slideCount: 1,
      slides: [{ id: '1', number: 1, title: 'Title Slide', texts: ['Your content here'], hasImage: false, thumbnailColor: 'bg-gradient-to-br from-neutral-800 to-neutral-900' }],
      hasPdf: false,
      lastModified: new Date(),
      notes: '',
    };
    setDecks(prev => [newDeck, ...prev]);
    setSelectedDeckId(newDeck.id);
  };

  const handleDeleteDeck = (id: string) => {
    setDecks(prev => prev.filter(d => d.id !== id));
    if (selectedDeckId === id) setSelectedDeckId(null);
  };

  // Category counts
  const catCounts = useMemo(() => {
    const counts: Record<string, number> = { all: decks.length };
    for (const d of decks) counts[d.category] = (counts[d.category] || 0) + 1;
    return counts;
  }, [decks]);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-neutral-950">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-neutral-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-lg" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 300, letterSpacing: '0.35em', color: '#e8e4e0' }}>
                PITCH DECK MANAGER
              </h1>
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-light">{decks.length} decks · {filtered.length} shown</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleAddDeck} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs text-white font-medium">
              <Plus className="w-3.5 h-3.5" /> New Deck
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs text-neutral-300 border border-neutral-700">
              <Upload className="w-3.5 h-3.5" /> Import
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search decks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {(['all', ...Object.keys(CATEGORY_CONFIG)] as (DeckCategory | 'all')[]).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition-colors ${categoryFilter === cat ? 'bg-neutral-700 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                {cat === 'all' ? 'All' : CATEGORY_CONFIG[cat].label}
                <span className="ml-1 text-neutral-600">{catCounts[cat] || 0}</span>
              </button>
            ))}
          </div>

          <select
            value={regionFilter}
            onChange={e => setRegionFilter(e.target.value as Region | 'all')}
            className="px-2 py-1.5 bg-neutral-800 border border-neutral-700 rounded-lg text-[10px] text-neutral-300 focus:outline-none"
          >
            <option value="all">All Regions</option>
            {Object.entries(REGION_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.flag} {v.label}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as DeckStatus | 'all')}
            className="px-2 py-1.5 bg-neutral-800 border border-neutral-700 rounded-lg text-[10px] text-neutral-300 focus:outline-none"
          >
            <option value="all">All Status</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>

          <div className="flex items-center border border-neutral-700 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('list')} className={`p-1.5 ${viewMode === 'list' ? 'bg-neutral-700' : 'hover:bg-neutral-800'}`}>
              <List className="w-3.5 h-3.5 text-neutral-400" />
            </button>
            <button onClick={() => setViewMode('grid')} className={`p-1.5 ${viewMode === 'grid' ? 'bg-neutral-700' : 'hover:bg-neutral-800'}`}>
              <Grid className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Deck list */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === 'list' ? (
            <table className="w-full">
              <thead className="sticky top-0 bg-neutral-900 z-10">
                <tr className="text-left text-[10px] uppercase tracking-wider text-neutral-500">
                  <th className="px-4 py-2">Target</th>
                  <th className="px-2 py-2">Category</th>
                  <th className="px-2 py-2">Region</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Slides</th>
                  <th className="px-2 py-2">Files</th>
                  <th className="px-2 py-2 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr
                    key={d.id}
                    className={`border-b border-neutral-800/50 cursor-pointer transition-colors ${selectedDeckId === d.id ? 'bg-neutral-800/50' : 'hover:bg-neutral-800/30'}`}
                    onClick={() => setSelectedDeckId(d.id)}
                  >
                    <td className="px-4 py-2.5">
                      <div className="text-sm text-white font-medium">{d.targetName}</div>
                      <div className="text-[10px] text-neutral-500">{d.targetType}{d.location ? ` · ${d.location}` : ''}</div>
                    </td>
                    <td className="px-2 py-2.5"><CategoryBadge category={d.category} /></td>
                    <td className="px-2 py-2.5 text-xs text-neutral-400">{REGION_CONFIG[d.region]?.flag}</td>
                    <td className="px-2 py-2.5"><StatusBadge status={d.status} /></td>
                    <td className="px-2 py-2.5 text-xs text-neutral-400">{d.slideCount}</td>
                    <td className="px-2 py-2.5">
                      <div className="flex gap-1">
                        <span className="text-[9px] px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-400">PPTX</span>
                        {d.hasPdf && <span className="text-[9px] px-1.5 py-0.5 bg-red-900/30 rounded text-red-400">PDF</span>}
                      </div>
                    </td>
                    <td className="px-2 py-2.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteDeck(d.id); }}
                        className="p-1 text-neutral-600 hover:text-red-400 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-4">
              {filtered.map(d => (
                <div
                  key={d.id}
                  className={`rounded-xl border cursor-pointer transition-colors p-3 ${selectedDeckId === d.id ? 'border-blue-500 bg-neutral-800/50' : 'border-neutral-800 hover:border-neutral-600 bg-neutral-900/50'}`}
                  onClick={() => setSelectedDeckId(d.id)}
                >
                  <div className="aspect-[16/9] rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center mb-2">
                    <FileText className="w-8 h-8 text-neutral-600" />
                  </div>
                  <h4 className="text-xs font-medium text-white truncate">{d.targetName}</h4>
                  <div className="flex items-center gap-1 mt-1">
                    <CategoryBadge category={d.category} />
                    <StatusBadge status={d.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selectedDeck && (
          <DeckDetail
            deck={selectedDeck}
            onClose={() => setSelectedDeckId(null)}
            onUpdate={updateDeck}
            onOpenEditor={() => setEditorDeckId(selectedDeck.id)}
          />
        )}
      </div>

      {/* Slide editor (full-screen overlay) */}
      {editorDeck && (
        <SlideEditor
          deck={editorDeck}
          onClose={() => setEditorDeckId(null)}
          onUpdate={updateDeck}
        />
      )}
    </div>
  );
};

export default PitchDeckManagerPage;
