// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// MARKETING STUDIO PAGE
// Full-fledged marketing content generation: videos, images, pitches, copy
// =============================================================================

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../lib/api';
import {
  Video,
  Image,
  FileText,
  Wand2,
  Download,
  Copy,
  CheckCircle,
  Loader2,
  Sparkles,
  Play,
  Pause,
  Film,
  Camera,
  Presentation,
  MessageSquare,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface VideoScript {
  id: string;
  title: string;
  duration: string;
  targetAudience: string;
  script: {
    hook: string;
    problem: string;
    solution: string;
    demo: string;
    cta: string;
  };
  visualNotes: string[];
  voiceoverNotes: string;
}

interface ImagePrompt {
  id: string;
  purpose: string;
  platform: 'dall-e' | 'midjourney' | 'stable-diffusion';
  prompt: string;
  negativePrompt?: string;
  style: string;
  aspectRatio: string;
}

interface PitchDeck {
  id: string;
  audience: string;
  slides: Array<{
    slideNumber: number;
    title: string;
    content: string[];
    visualSuggestion: string;
    speakerNotes: string;
  }>;
}

interface MarketingCopy {
  id: string;
  type: 'email' | 'linkedin' | 'twitter' | 'blog' | 'landing-page';
  headline: string;
  body: string;
  cta: string;
  variations: string[];
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function MarketingStudioPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'video' | 'image' | 'pitch' | 'copy'>('video');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Video Script Generator
  const [videoTopic, setVideoTopic] = useState('');
  const [videoDuration, setVideoDuration] = useState('60');
  const [videoAudience, setVideoAudience] = useState('enterprise-cto');
  const [videoScript, setVideoScript] = useState<VideoScript | null>(null);

  // Image Prompt Generator
  const [imagePurpose, setImagePurpose] = useState('');
  const [imagePlatform, setImagePlatform] = useState<'dall-e' | 'midjourney' | 'stable-diffusion'>('midjourney');
  const [imageStyle, setImageStyle] = useState('professional-tech');
  const [imagePrompt, setImagePrompt] = useState<ImagePrompt | null>(null);

  // Pitch Deck Generator
  const [pitchAudience, setPitchAudience] = useState('');
  const [pitchFocus, setPitchFocus] = useState('');
  const [pitchDeck, setPitchDeck] = useState<PitchDeck | null>(null);

  // Marketing Copy Generator
  const [copyType, setCopyType] = useState<'email' | 'linkedin' | 'twitter' | 'blog' | 'landing-page'>('email');
  const [copyTopic, setCopyTopic] = useState('');
  const [copyTone, setCopyTone] = useState('professional');
  const [marketingCopy, setMarketingCopy] = useState<MarketingCopy | null>(null);

  const generateVideoScript = async () => {
    if (!videoTopic.trim()) {return;}

    setLoading(true);
    try {
      const response = await api.post('/marketing-studio/video-script', {
        topic: videoTopic,
        duration: parseInt(videoDuration),
        targetAudience: videoAudience,
      });
      setVideoScript((response.data as any).data);
    } catch (err) {
      console.error('Failed to generate video script:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateImagePrompt = async () => {
    if (!imagePurpose.trim()) {return;}

    setLoading(true);
    try {
      const response = await api.post('/marketing-studio/image-prompt', {
        purpose: imagePurpose,
        platform: imagePlatform,
        style: imageStyle,
      });
      setImagePrompt((response.data as any).data);
    } catch (err) {
      console.error('Failed to generate image prompt:', err);
    } finally {
      setLoading(false);
    }
  };

  const generatePitchDeck = async () => {
    if (!pitchAudience.trim() || !pitchFocus.trim()) {return;}

    setLoading(true);
    try {
      const response = await api.post('/marketing-studio/pitch-deck', {
        audience: pitchAudience,
        focus: pitchFocus,
      });
      setPitchDeck((response.data as any).data);
    } catch (err) {
      console.error('Failed to generate pitch deck:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateMarketingCopy = async () => {
    if (!copyTopic.trim()) {return;}

    setLoading(true);
    try {
      const response = await api.post('/marketing-studio/copy', {
        type: copyType,
        topic: copyTopic,
        tone: copyTone,
      });
      setMarketingCopy((response.data as any).data);
    } catch (err) {
      console.error('Failed to generate marketing copy:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-500" />
            Marketing Studio
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            AI-powered marketing content generation for videos, images, pitches, and copy
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('video')}
          className={`px-4 py-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'video'
              ? 'border-purple-500 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Video className="w-4 h-4" />
          Video Scripts
        </button>
        <button
          onClick={() => setActiveTab('image')}
          className={`px-4 py-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'image'
              ? 'border-purple-500 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Image className="w-4 h-4" />
          Image Prompts
        </button>
        <button
          onClick={() => setActiveTab('pitch')}
          className={`px-4 py-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'pitch'
              ? 'border-purple-500 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Presentation className="w-4 h-4" />
          Pitch Decks
        </button>
        <button
          onClick={() => setActiveTab('copy')}
          className={`px-4 py-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'copy'
              ? 'border-purple-500 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          Marketing Copy
        </button>
      </div>

      {/* Video Script Generator */}
      {activeTab === 'video' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Film className="w-5 h-5 text-purple-500" />
              Generate Video Script
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Video Topic
                </label>
                <input
                  type="text"
                  value={videoTopic}
                  onChange={(e) => setVideoTopic(e.target.value)}
                  placeholder="e.g., How Datacendia prevents AI hallucinations in enterprise decisions"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration (seconds)
                  </label>
                  <select
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="30">30 sec (Social)</option>
                    <option value="60">60 sec (Demo)</option>
                    <option value="90">90 sec (Explainer)</option>
                    <option value="120">2 min (Deep Dive)</option>
                    <option value="300">5 min (Webinar)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Audience
                  </label>
                  <select
                    value={videoAudience}
                    onChange={(e) => setVideoAudience(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="enterprise-cto">Enterprise CTO</option>
                    <option value="enterprise-cfo">Enterprise CFO</option>
                    <option value="compliance-officer">Compliance Officer</option>
                    <option value="legal-counsel">Legal Counsel</option>
                    <option value="technical-buyer">Technical Buyer</option>
                    <option value="general-business">General Business</option>
                  </select>
                </div>
              </div>

              <button
                onClick={generateVideoScript}
                disabled={loading || !videoTopic.trim()}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate Video Script
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Video Script Output */}
          {videoScript && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{videoScript.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(videoScript.script, null, 2))}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => downloadAsFile(JSON.stringify(videoScript, null, 2), `video-script-${Date.now()}.json`)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <div className="font-semibold text-purple-600 dark:text-purple-400 mb-1">HOOK (0-5s)</div>
                  <div className="text-gray-700 dark:text-gray-300">{videoScript.script.hook}</div>
                </div>
                <div>
                  <div className="font-semibold text-purple-600 dark:text-purple-400 mb-1">PROBLEM (5-20s)</div>
                  <div className="text-gray-700 dark:text-gray-300">{videoScript.script.problem}</div>
                </div>
                <div>
                  <div className="font-semibold text-purple-600 dark:text-purple-400 mb-1">SOLUTION (20-40s)</div>
                  <div className="text-gray-700 dark:text-gray-300">{videoScript.script.solution}</div>
                </div>
                <div>
                  <div className="font-semibold text-purple-600 dark:text-purple-400 mb-1">DEMO (40-55s)</div>
                  <div className="text-gray-700 dark:text-gray-300">{videoScript.script.demo}</div>
                </div>
                <div>
                  <div className="font-semibold text-purple-600 dark:text-purple-400 mb-1">CTA (55-60s)</div>
                  <div className="text-gray-700 dark:text-gray-300">{videoScript.script.cta}</div>
                </div>

                {videoScript.visualNotes.length > 0 && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="font-semibold text-gray-900 dark:text-white mb-2">Visual Notes:</div>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                      {videoScript.visualNotes.map((note, i) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {videoScript.voiceoverNotes && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="font-semibold text-gray-900 dark:text-white mb-2">Voiceover Notes:</div>
                    <div className="text-gray-600 dark:text-gray-400">{videoScript.voiceoverNotes}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Image Prompt Generator */}
      {activeTab === 'image' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-purple-500" />
              Generate Image Prompt
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image Purpose
                </label>
                <input
                  type="text"
                  value={imagePurpose}
                  onChange={(e) => setImagePurpose(e.target.value)}
                  placeholder="e.g., Hero image showing AI agents deliberating around a table"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Platform
                  </label>
                  <select
                    value={imagePlatform}
                    onChange={(e) => setImagePlatform(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="midjourney">Midjourney</option>
                    <option value="dall-e">DALL-E 3</option>
                    <option value="stable-diffusion">Stable Diffusion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Style
                  </label>
                  <select
                    value={imageStyle}
                    onChange={(e) => setImageStyle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="professional-tech">Professional Tech</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="cinematic">Cinematic</option>
                    <option value="isometric">Isometric 3D</option>
                    <option value="abstract">Abstract</option>
                    <option value="photorealistic">Photorealistic</option>
                  </select>
                </div>
              </div>

              <button
                onClick={generateImagePrompt}
                disabled={loading || !imagePurpose.trim()}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate Image Prompt
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Image Prompt Output */}
          {imagePrompt && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {imagePlatform.toUpperCase()} Prompt
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(imagePrompt.prompt)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">PROMPT</div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-900 dark:text-white font-mono">
                    {imagePrompt.prompt}
                  </div>
                </div>

                {imagePrompt.negativePrompt && (
                  <div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">NEGATIVE PROMPT</div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-900 dark:text-white font-mono">
                      {imagePrompt.negativePrompt}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Style</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{imagePrompt.style}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Aspect Ratio</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{imagePrompt.aspectRatio}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pitch Deck Generator */}
      {activeTab === 'pitch' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Presentation className="w-5 h-5 text-purple-500" />
              Generate Pitch Deck
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Audience
                </label>
                <input
                  type="text"
                  value={pitchAudience}
                  onChange={(e) => setPitchAudience(e.target.value)}
                  placeholder="e.g., Series A investors, Enterprise buyers, Board of Directors"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Focus Area
                </label>
                <input
                  type="text"
                  value={pitchFocus}
                  onChange={(e) => setPitchFocus(e.target.value)}
                  placeholder="e.g., Healthcare vertical, Defense contracts, Compliance automation"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <button
                onClick={generatePitchDeck}
                disabled={loading || !pitchAudience.trim() || !pitchFocus.trim()}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate Pitch Deck
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Pitch Deck Output */}
          {pitchDeck && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 max-h-[600px] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {pitchDeck.slides.length} Slides
                </h3>
                <button
                  onClick={() => downloadAsFile(JSON.stringify(pitchDeck, null, 2), `pitch-deck-${Date.now()}.json`)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {pitchDeck.slides.map((slide) => (
                  <div key={slide.slideNumber} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded font-mono">
                        Slide {slide.slideNumber}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">{slide.title}</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {slide.content.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <span className="font-semibold">Visual:</span> {slide.visualSuggestion}
                    </div>
                    {slide.speakerNotes && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span className="font-semibold">Notes:</span> {slide.speakerNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Marketing Copy Generator */}
      {activeTab === 'copy' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-500" />
              Generate Marketing Copy
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Copy Type
                </label>
                <select
                  value={copyType}
                  onChange={(e) => setCopyType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="email">Email Campaign</option>
                  <option value="linkedin">LinkedIn Post</option>
                  <option value="twitter">Twitter Thread</option>
                  <option value="blog">Blog Post</option>
                  <option value="landing-page">Landing Page</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Topic/Campaign
                </label>
                <input
                  type="text"
                  value={copyTopic}
                  onChange={(e) => setCopyTopic(e.target.value)}
                  placeholder="e.g., Launching Healthcare vertical, EU AI Act compliance"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tone
                </label>
                <select
                  value={copyTone}
                  onChange={(e) => setCopyTone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="professional">Professional</option>
                  <option value="technical">Technical</option>
                  <option value="conversational">Conversational</option>
                  <option value="urgent">Urgent</option>
                  <option value="educational">Educational</option>
                </select>
              </div>

              <button
                onClick={generateMarketingCopy}
                disabled={loading || !copyTopic.trim()}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Marketing Copy Output */}
          {marketingCopy && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{copyType.toUpperCase()}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(`${marketingCopy.headline}\n\n${marketingCopy.body}\n\n${marketingCopy.cta}`)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => downloadAsFile(`${marketingCopy.headline}\n\n${marketingCopy.body}\n\n${marketingCopy.cta}`, `copy-${copyType}-${Date.now()}.txt`)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">HEADLINE</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{marketingCopy.headline}</div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">BODY</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{marketingCopy.body}</div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">CALL TO ACTION</div>
                  <div className="text-sm font-medium text-purple-600 dark:text-purple-400">{marketingCopy.cta}</div>
                </div>

                {marketingCopy.variations.length > 0 && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">VARIATIONS</div>
                    <div className="space-y-2">
                      {marketingCopy.variations.map((variation, i) => (
                        <div key={i} className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded text-sm text-gray-700 dark:text-gray-300">
                          {variation}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
