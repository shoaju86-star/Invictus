import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Terminal, 
  Copy, 
  Check,
  ExternalLink,
  Layers
} from 'lucide-react';

interface StoreSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoreSubmissionModal: React.FC<StoreSubmissionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallPWA = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const outcome = await installPrompt.userChoice;
      if (outcome.outcome === 'accepted') {
        setIsInstalled(true);
      }
    } else {
      alert('To install on iOS: Tap the Share button in Safari, then select "Add to Home Screen". On Android/Chrome: Tap menu (⋮) -> "Install App".');
    }
  };

  const capacitorCommand = `npx @capacitor/cli create invictus-mobile
cd invictus-mobile
npm i @capacitor/core @capacitor/camera @capacitor/geolocation
npx cap add android
npx cap add ios
npx cap run android`;

  const copyCapacitorScript = () => {
    navigator.clipboard.writeText(capacitorCommand);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200">
        
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md">
              <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Google Play & Apple App Store Export</span>
              </h3>
              <p className="text-[11px] text-slate-400">Bundle ID: com.invictus.resale • PWA + Native Wrappers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* PWA Direct Installation Banner */}
          <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Download className="w-4 h-4" />
                <span>Instant Mobile Installation (PWA)</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Install Invictus directly on your phone home screen with offline caching and native app behavior.
              </p>
            </div>
            <button
              onClick={handleInstallPWA}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-3.5 py-2 rounded-xl shadow transition active:scale-95 whitespace-nowrap"
            >
              {isInstalled ? 'Installed' : 'Install to Phone'}
            </button>
          </div>

          {/* App Store / Google Play Specs Bento */}
          <div className="grid grid-cols-2 gap-3">
            {/* Apple App Store */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <span> Apple App Store</span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-300">
                <li>• <strong>Min iOS:</strong> 15.0+</li>
                <li>• <strong>Target Device:</strong> iPhone, iPad</li>
                <li>• <strong>Category:</strong> Shopping / Resale</li>
                <li>• <strong>In-App Purchases:</strong> Physical goods escrow</li>
                <li>• <strong>Permissions:</strong> Camera, Photos, Location</li>
              </ul>
            </div>

            {/* Google Play Store */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <span>Google Play Store</span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-300">
                <li>• <strong>Min SDK:</strong> Android 8.0 (API 26)</li>
                <li>• <strong>Target SDK:</strong> Android 14 (API 34)</li>
                <li>• <strong>Format:</strong> Android App Bundle (.aab)</li>
                <li>• <strong>Daraja API:</strong> M-PESA STK Push compliant</li>
                <li>• <strong>Biometrics:</strong> Fingerprint / Face Unlock</li>
              </ul>
            </div>
          </div>

          {/* Device Hardware Permissions Config */}
          <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-3.5 space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Native Hardware Permissions (Ready in manifest.json & Info.plist)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Camera (AI Appraisal)</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Photo Gallery Access</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Fine GPS (Safe Zones)</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Push Notifications</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Biometrics (Apple/G-Pay)</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Offline Service Worker</span>
              </div>
            </div>
          </div>

          {/* 1-Command Capacitor Mobile Build */}
          <div className="bg-slate-950 rounded-2xl p-3.5 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>1-Command Native Wrap (Capacitor / TWA)</span>
              </div>
              <button
                onClick={copyCapacitorScript}
                className="text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span className="text-[10px]">{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-[10px] font-mono text-emerald-400 bg-slate-900 p-2.5 rounded-xl overflow-x-auto">
              {capacitorCommand}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
