import React, { useState, useMemo, useCallback } from 'react';
import {
  Search, FileText, Upload, Download, Trash2, Plus, Edit3,
  ChevronRight, ChevronDown, Eye, Copy, Filter, Globe,
  Building2, Users, Briefcase, Image, Type, Layers,
  MoreVertical, X, Check, ArrowLeft, Maximize2, Minimize2,
  FolderOpen, Tag, Calendar, Mail, ExternalLink, RefreshCw,
  Grid, List, SortAsc, Presentation,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────
type DeckCategory = 'investor' | 'investor-50' | 'investor-100' | 'sales' | 'design-partner' | 'gamma' | 'main';
type DeckStatus = 'draft' | 'ready' | 'sent' | 'viewed' | 'follow-up' | 'closed';
type Region = 'us' | 'eu' | 'asia' | 'global' | 'middle-east';

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
  sales:             { label: 'Sales',            color: 'text-green-400 bg-green-500/10', icon: <Users className="w-4 h-4" /> },
  'design-partner':  { label: 'Design Partner',   color: 'text-cyan-400 bg-cyan-500/10',   icon: <Globe className="w-4 h-4" /> },
  gamma:             { label: 'Gamma',            color: 'text-pink-400 bg-pink-500/10',   icon: <Layers className="w-4 h-4" /> },
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
};

// ─── Generate demo deck data from actual repo structure ─────────────────────
function generateDecks(): DeckFile[] {
  const decks: DeckFile[] = [];
  let id = 0;

  const investor100Data: Array<{ num: string; name: string; full: string; type: string; loc: string; aum: string; region: Region; portfolio: string[]; thesis: string; website: string }> = [
    { num: '001', name: 'a16z', full: 'Andreessen Horowitz (a16z)', type: 'Venture Capital', loc: 'Menlo Park, CA', aum: '$35B+', region: 'us', portfolio: ['Databricks','Anyscale','Hex','dbt Labs','Replit'], thesis: 'AI governance is the next infrastructure default', website: 'a16z.com' },
    { num: '002', name: 'sequoia', full: 'Sequoia Capital', type: 'Venture Capital', loc: 'Menlo Park, CA', aum: '$85B+', region: 'us', portfolio: ['Apple','Google','Stripe','Snowflake','Klarna'], thesis: 'Legendary builders of enduring companies', website: 'sequoiacap.com' },
    { num: '003', name: 'greylock', full: 'Greylock Partners', type: 'Venture Capital', loc: 'Menlo Park, CA', aum: '$5B+', region: 'us', portfolio: ['LinkedIn','Discord','Figma','Palo Alto Networks'], thesis: 'Enterprise infrastructure DNA', website: 'greylock.com' },
    { num: '004', name: 'lightspeed', full: 'Lightspeed Venture Partners', type: 'Venture Capital', loc: 'Menlo Park, CA', aum: '$18B+', region: 'us', portfolio: ['Snap','Affirm','Rubrik','Mulesoft'], thesis: 'Enterprise + consumer at scale', website: 'lsvp.com' },
    { num: '005', name: 'radical', full: 'Radical Ventures', type: 'Venture Capital', loc: 'Toronto, Canada', aum: '$1B+', region: 'us', portfolio: ['Cohere','Waabi','Layer6 AI'], thesis: 'Pure-play AI fund', website: 'radical.vc' },
  ];

  // Add first 5 investor-100 decks with real data
  for (const inv of investor100Data) {
    decks.push({
      id: String(++id),
      filename: `${inv.num}-${inv.name}.pptx`,
      category: 'investor-100',
      status: 'ready',
      targetName: inv.full,
      targetType: inv.type,
      region: inv.region,
      location: inv.loc,
      aum: inv.aum,
      website: inv.website,
      contactName: '',
      contactEmail: '',
      portfolioCompanies: inv.portfolio,
      thesisAngle: inv.thesis,
      slideCount: 10,
      slides: [
        { id: '1', number: 1, title: `Prepared for ${inv.full}`, texts: ['Cover slide'], hasImage: false, thumbnailColor: 'bg-gradient-to-br from-neutral-800 to-neutral-900' },
        { id: '2', number: 2, title: 'Investor Alignment', texts: [`Why Datacendia aligns with ${inv.full}`], hasImage: false, thumbnailColor: 'bg-gradient-to-br from-amber-900/30 to-neutral-900' },
        { id: '3', number: 3, title: 'The Problem', texts: ['Enterprise AI has no accountability layer'], hasImage: false, thumbnailColor: 'bg-gradient-to-br from-red-900/30 to-neutral-900' },
        { id: '4', number: 4, title: 'The Solution', texts: ['Multi-agent deliberation with cryptographic evidence'], hasImage: false, thumbnailColor: 'bg-gradient-to-br from-blue-900/30 to-neutral-900' },
        { id: '5', number: 5, title: 'Platform Proof', texts: ['205K+ tests, 156 endpoints, live platform'], hasImage: false, thumbnailColor: 'bg-gradient-to-br from-green-900/30 to-neutral-900' },
        { id: '6', number: 6, title: 'Multi-Agent Decision Engine', texts: ['Role-specific agents: CFO, CISO, Legal, Strategy, Risk'], hasImage: true, imageName: '02-council-deliberation.png', thumbnailColor: 'bg-gradient-to-br from-purple-900/30 to-neutral-900' },
        { id: '7', number: 7, title: 'Decision Audit Trail', texts: ['Every decision tracked with full evidence chain'], hasImage: true, imageName: '05-decisions.png', thumbnailColor: 'bg-gradient-to-br from-cyan-900/30 to-neutral-900' },
        { id: '8', number: 8, title: 'Founder', texts: ['Stuart Rainey — 7 years at TCS/PGIM'], hasImage: false, thumbnailColor: 'bg-gradient-to-br from-neutral-700 to-neutral-900' },
        { id: '9', number: 9, title: 'The Ask', texts: ['$1.5M Pre-Seed — $7M Pre-Money'], hasImage: false, thumbnailColor: 'bg-gradient-to-br from-amber-900/30 to-neutral-900' },
        { id: '10', number: 10, title: 'Next Steps', texts: ['Schedule deep dive, technical demo, data room'], hasImage: false, thumbnailColor: 'bg-gradient-to-br from-neutral-800 to-neutral-900' },
      ],
      hasPdf: true,
      lastModified: new Date(),
      notes: '',
    });
  }

  // Generate remaining investor-100 entries (simplified)
  const moreInvestors = [
    'Air Street Capital', 'Lux Capital', 'General Catalyst', 'Index Ventures', 'Felicis Ventures',
    'Bessemer Venture Partners', 'Insight Partners', 'Sapphire Ventures', 'Battery Ventures',
    'Salesforce Ventures', 'Accel', 'Madrona', 'Menlo Ventures', 'Emergence Capital',
    'ICONIQ Growth', 'Redpoint Ventures', 'Craft Ventures', 'Wing VC', 'FirstMark Capital',
  ];
  for (const name of moreInvestors) {
    decks.push({
      id: String(++id),
      filename: `${String(id).padStart(3,'0')}-${name.toLowerCase().replace(/\s+/g,'-')}.pptx`,
      category: 'investor-100',
      status: 'ready',
      targetName: name,
      targetType: 'Venture Capital',
      region: 'us',
      location: 'United States',
      aum: '',
      website: '',
      contactName: '',
      contactEmail: '',
      portfolioCompanies: [],
      thesisAngle: '',
      slideCount: 10,
      slides: [],
      hasPdf: true,
      lastModified: new Date(),
      notes: '',
    });
  }

  // Sales decks
  const salesDecks = [
    'Fortune 500', 'Mid-Market', 'Regulated Industries', 'Banking', 'Insurance',
    'Pharma', 'Manufacturing', 'Retail', 'Compliance & Risk', 'Decision Speed',
    'AI Trust', 'Data Silos', 'Audit Readiness', 'Vendor Lock-In', 'AI Governance Gap',
  ];
  for (const name of salesDecks) {
    decks.push({
      id: String(++id),
      filename: `${String(salesDecks.indexOf(name)+1).padStart(2,'0')}-${name.toLowerCase().replace(/\s+/g,'-').replace(/&/g,'and')}.pptx`,
      category: 'sales',
      status: 'ready',
      targetName: name,
      targetType: 'Sales Deck',
      region: 'global',
      location: '',
      aum: '',
      website: '',
      contactName: '',
      contactEmail: '',
      portfolioCompanies: [],
      thesisAngle: '',
      slideCount: 8,
      slides: [],
      hasPdf: true,
      lastModified: new Date(),
      notes: '',
    });
  }

  // Design partner decks
  const dpDecks = ['Healthcare', 'Financial Services', 'Legal', 'Government', 'Defense',
    'Energy & Utilities', 'Insurance', 'Pharma', 'Risk Management', 'Compliance Officers'];
  for (const name of dpDecks) {
    decks.push({
      id: String(++id),
      filename: `${String(dpDecks.indexOf(name)+1).padStart(2,'0')}-${name.toLowerCase().replace(/\s+/g,'-').replace(/&/g,'and')}.pptx`,
      category: 'design-partner',
      status: 'ready',
      targetName: name,
      targetType: 'Design Partner',
      region: 'global',
      location: '',
      aum: '',
      website: '',
      contactName: '',
      contactEmail: '',
      portfolioCompanies: [],
      thesisAngle: '',
      slideCount: 9,
      slides: [],
      hasPdf: true,
      lastModified: new Date(),
      notes: '',
    });
  }

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
  sales: 'sales',
  'design-partner': 'design-partner',
  gamma: 'gamma',
};

function getDeckUrl(deck: DeckFile, format: 'pptx' | 'pdf'): string {
  const folder = CATEGORY_FOLDER_MAP[deck.category];
  const filename = format === 'pdf' ? deck.filename.replace('.pptx', '.pdf') : deck.filename;
  if (folder) {
    return `/pitch-decks/${folder}/${format}/${filename}`;
  }
  return `/pitch-decks/${format}/${filename}`;
}

// ─── Deck Detail Panel ──────────────────────────────────────────────────────
const DeckDetail: React.FC<{
  deck: DeckFile;
  onClose: () => void;
  onUpdate: (deck: DeckFile) => void;
  onOpenEditor: () => void;
}> = ({ deck, onClose, onUpdate, onOpenEditor }) => {
  const [editField, setEditField] = useState<string | null>(null);

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
    <div className="w-[400px] border-l border-neutral-700 bg-neutral-900 overflow-y-auto">
      <div className="p-4 border-b border-neutral-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white truncate">{deck.targetName}</h3>
          <button onClick={onClose} className="p-1 hover:bg-neutral-700 rounded"><X className="w-4 h-4 text-neutral-500" /></button>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <CategoryBadge category={deck.category} />
          <StatusBadge status={deck.status} />
          {deck.region && (
            <span className="text-xs text-neutral-400">{REGION_CONFIG[deck.region]?.flag} {REGION_CONFIG[deck.region]?.label}</span>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={onOpenEditor} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs text-white font-medium">
            <Edit3 className="w-3.5 h-3.5" /> Edit Slides
          </button>
          <a
            href={getDeckUrl(deck, 'pptx')}
            download={deck.filename}
            className="flex items-center justify-center gap-1 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-xs text-neutral-300"
          >
            <Download className="w-3.5 h-3.5" /> PPTX
          </a>
          {deck.hasPdf && (
            <a
              href={getDeckUrl(deck, 'pdf')}
              download={deck.filename.replace('.pptx', '.pdf')}
              className="flex items-center justify-center gap-1 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-xs text-neutral-300"
            >
              <Download className="w-3.5 h-3.5" /> PDF
            </a>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 space-y-3">
        <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Deck Info</h4>
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
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider pt-2">Portfolio Companies</h4>
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
