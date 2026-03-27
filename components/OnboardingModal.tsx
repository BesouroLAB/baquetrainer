import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingModalProps {
  onComplete: () => void;
}

interface Step {
  targetSelector: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const steps: Step[] = [
  {
    targetSelector: '[data-onboarding="welcome"]',
    title: '🎵 Bem-vindo ao BaqueTreino',
    description: 'Sua ferramenta de estudo para Maracatu de Baque Virado. Vamos conhecer a plataforma!',
    position: 'center',
  },
  {
    targetSelector: '[data-onboarding="sidebar"]',
    title: '📋 Repertório',
    description: 'Escolha a música que deseja estudar. Toque em qualquer faixa para carregá-la no mixer.',
    position: 'right',
  },
  {
    targetSelector: '[data-onboarding="mixer"]',
    title: '🎚️ Mixer de Faixas',
    description: 'Cada instrumento tem seu fader de volume. Use SOLO para isolar e MUTE para silenciar.',
    position: 'bottom',
  },
  {
    targetSelector: '[data-onboarding="transport"]',
    title: '⏯️ Controles de Reprodução',
    description: 'Play, Pause e Stop. A barra acima mostra o progresso da música.',
    position: 'top',
  },
  {
    targetSelector: '[data-onboarding="tools-left"]',
    title: '⚡ Velocidade & Loop',
    description: 'Altere a velocidade para praticar devagar. Marque pontos A e B para repetir trechos.',
    position: 'top',
  },
  {
    targetSelector: '[data-onboarding="tools-right"]',
    title: '🔧 Estudo & Bass Boost',
    description: 'O Bass Boost realça as Alfaias para você focar no grave.',
    position: 'top',
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const isCenter = step.position === 'center';

  // Find and measure the target element
  useEffect(() => {
    const findTarget = () => {
      if (isCenter) {
        setTargetRect(null);
        return;
      }
      const el = document.querySelector(step.targetSelector);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      }
    };

    findTarget();
    window.addEventListener('resize', findTarget);
    window.addEventListener('scroll', findTarget);

    return () => {
      window.removeEventListener('resize', findTarget);
      window.removeEventListener('scroll', findTarget);
    };
  }, [currentStep, step.targetSelector, isCenter]);

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  // Calculate tooltip position
  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect || isCenter) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const pad = 16;
    const pos = step.position;

    if (pos === 'bottom') {
      return {
        top: targetRect.bottom + pad,
        left: targetRect.left + targetRect.width / 2,
        transform: 'translateX(-50%)',
      };
    }
    if (pos === 'top') {
      return {
        bottom: window.innerHeight - targetRect.top + pad,
        left: targetRect.left + targetRect.width / 2,
        transform: 'translateX(-50%)',
      };
    }
    if (pos === 'right') {
      return {
        top: targetRect.top + targetRect.height / 2,
        left: targetRect.right + pad,
        transform: 'translateY(-50%)',
      };
    }
    // left
    return {
      top: targetRect.top + targetRect.height / 2,
      right: window.innerWidth - targetRect.left + pad,
      transform: 'translateY(-50%)',
    };
  };

  // SVG overlay with a "hole" cut out for the target element
  const renderOverlay = () => {
    if (!targetRect || isCenter) {
      return <div className="fixed inset-0 bg-black/80 z-[100]" />;
    }

    const p = 8; // padding around the highlight
    const r = 12; // border radius
    const x = targetRect.left - p;
    const y = targetRect.top - p;
    const w = targetRect.width + p * 2;
    const h = targetRect.height + p * 2;

    return (
      <svg className="fixed inset-0 w-full h-full z-[100]" style={{ pointerEvents: 'auto' }}>
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect x={x} y={y} width={w} height={h} rx={r} ry={r} fill="black" />
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.82)" mask="url(#spotlight-mask)" />
        {/* Glowing border around spotlight */}
        <rect
          x={x} y={y} width={w} height={h} rx={r} ry={r}
          fill="none" stroke="rgba(245,158,11,0.5)" strokeWidth="2"
        />
      </svg>
    );
  };

  return (
    <>
      {renderOverlay()}

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="fixed z-[101] max-w-sm w-[90vw] md:w-auto"
          style={getTooltipStyle()}
        >
          <div className="bg-gradient-to-b from-stone-900 to-stone-950 rounded-2xl border border-white/10 shadow-2xl shadow-black/60 p-5 md:p-6">
            {/* Decorative glow */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            <h3 className="text-base md:text-lg font-bold text-stone-100 mb-2 relative">
              {step.title}
            </h3>
            <p className="text-xs md:text-sm text-stone-400 leading-relaxed mb-5 relative">
              {step.description}
            </p>

            {/* Progress & Actions */}
            <div className="flex items-center justify-between relative">
              <div className="flex items-center space-x-1.5">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentStep
                        ? 'bg-amber-500 w-4'
                        : i < currentStep
                          ? 'bg-amber-500/40 w-1.5'
                          : 'bg-stone-700 w-1.5'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={onComplete}
                  className="text-[10px] md:text-xs text-stone-600 hover:text-stone-400 transition-colors px-2 py-1"
                >
                  Pular
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900 font-bold text-xs shadow-lg shadow-amber-900/30"
                >
                  {isLast ? 'Começar! 🎵' : 'Próximo →'}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};
