import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Check, X, Info, Share, HelpCircle, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState<boolean>(false);
  const [bannerDismissed, setBannerDismissed] = useState<boolean>(false);
  const [isAndroid, setIsAndroid] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    // Detect OS
    const ua = navigator.userAgent || '';
    const android = /android/i.test(ua);
    const ios = /iphone|ipad|ipod/i.test(ua);
    setIsAndroid(android);
    setIsIOS(ios);

    // Check if already in standalone / PWA mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
    }

    // Listen for install prompt on Android / Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      console.log('FuerzaEnCasa PWA fue instalada exitosamente');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuario aceptó instalar la PWA');
          setIsInstalled(true);
        } else {
          console.log('Usuario rechazó la instalación');
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('Error durante la instalación:', err);
        setShowInstructionsModal(true);
      }
    } else {
      setShowInstructionsModal(true);
    }
  };

  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">
        <Check className="w-3.5 h-3.5" />
        <span>PWA Instalada</span>
      </div>
    );
  }

  return (
    <>
      {/* Quick Action Button for Header */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleInstallClick}
          className="flex items-center space-x-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all transform active:scale-95 shadow-sm"
          title="Instalar FuerzaEnCasa en Android / Móvil"
        >
          <Smartphone className="w-4 h-4 text-amber-400 animate-bounce" />
          <span className="hidden sm:inline">Instalar en Android</span>
          <span className="sm:hidden">Instalar</span>
          <Download className="w-3.5 h-3.5 text-amber-400" />
        </button>
      </div>

      {/* Floating Bottom Installation Banner for Mobile if not dismissed */}
      {!bannerDismissed && (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden animate-in fade-in slide-in-from-bottom duration-300">
          <div className="bg-slate-900/95 backdrop-blur-md border border-amber-500/40 rounded-2xl p-4 shadow-2xl shadow-black/80 flex items-center justify-between text-slate-100 space-x-3">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center shrink-0 shadow-md">
                <Smartphone className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-sm text-slate-100 truncate">FuerzaEnCasa App</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-amber-400 text-slate-950 rounded uppercase">Android</span>
                </div>
                <p className="text-xs text-slate-300 truncate">Instálala en tu pantalla de inicio</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleInstallClick}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95 flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Instalar</span>
              </button>
              <button
                onClick={() => setBannerDismissed(true)}
                className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label="Cerrar aviso"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step-by-step Installation Modal */}
      {showInstructionsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-100">Instalar FuerzaEnCasa</h3>
                  <p className="text-xs text-amber-400 font-medium">Aplicación PWA Nativa</p>
                </div>
              </div>
              <button
                onClick={() => setShowInstructionsModal(false)}
                className="p-1 text-slate-400 hover:text-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Android Instructions */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Guía de instalación para Android (Chrome)</span>
              </div>
              <ol className="space-y-2.5 text-xs text-slate-300 bg-slate-800/60 border border-slate-700/50 rounded-xl p-3.5">
                <li className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                  <span>Abre el menú del navegador tocando los <strong>3 puntos (⋮)</strong> en la esquina superior derecha.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                  <span>Pulsa en <strong>"Añadir a la pantalla de inicio"</strong> o <strong>"Instalar aplicación"</strong>.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                  <span>Confirma y la app aparecerá en tu móvil con su icono propio, pantalla completa y acceso offline.</span>
                </li>
              </ol>
            </div>

            {/* iOS Instructions fallback */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center space-x-2 text-slate-400 font-medium text-xs">
                <Share className="w-3.5 h-3.5 text-sky-400" />
                <span>¿Usas iPhone / iOS Safari?</span>
              </div>
              <p className="text-[11px] text-slate-400 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
                Toca el botón <strong>Compartir</strong> <Share className="inline w-3 h-3 text-sky-400" /> en Safari y luego elige <strong>"Añadir a pantalla de inicio"</strong>.
              </p>
            </div>

            <div className="pt-2">
              {deferredPrompt ? (
                <button
                  onClick={handleInstallClick}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold py-3 rounded-xl shadow-lg flex items-center justify-center space-x-2 text-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Lanzar Instalación Directa</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowInstructionsModal(false)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Entendido
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
