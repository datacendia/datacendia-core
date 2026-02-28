import { Lock, Sparkles, ArrowRight } from 'lucide-react';

interface EnterpriseGateProps {
  featureName: string;
  description?: string;
}

export function EnterpriseGate({ featureName, description }: EnterpriseGateProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-8">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center">
          <Lock className="w-8 h-8 text-amber-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">{featureName}</h1>
          <p className="text-zinc-400 text-sm">
            {description || 'This feature is available in Datacendia Enterprise Edition.'}
          </p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-500">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold text-sm">Enterprise Edition</span>
          </div>
          <p className="text-zinc-400 text-sm text-left">
            Please upgrade to access this feature. Enterprise Edition includes full vertical packs, 
            sovereign architecture patterns, advanced orchestrators, and priority support.
          </p>
          <a
            href="https://datacendia.com/pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            View Enterprise Plans <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <p className="text-zinc-600 text-xs">
          Contact <a href="mailto:enterprise@datacendia.com" className="text-zinc-500 hover:text-zinc-400 underline">enterprise@datacendia.com</a> for a demo
        </p>
      </div>
    </div>
  );
}
