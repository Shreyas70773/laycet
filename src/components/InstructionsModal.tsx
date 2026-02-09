'use client';

import { useApp } from '@/hooks/useAppState';
import { t } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  const { state } = useApp();
  const lang = state.settings.language;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">{t('instructionsTitle', lang)}</h2>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-blue-200 text-sm mt-1">{t('appSubtitle', lang)}</p>
              </div>

              {/* Study instructions */}
              <div className="p-6 space-y-3">
                <div className="space-y-2 text-sm text-slate-700">
                  {[
                    'instruction1',
                    'instruction2',
                    'instruction3',
                    'instruction4',
                    'instruction5',
                    'instruction6',
                  ].map((key, i) => (
                    <div key={key} className="flex gap-2">
                      <span className="text-blue-500 font-bold">{i + 1}.</span>
                      <span>{t(key as keyof typeof import('@/lib/i18n').default.cn, lang)}</span>
                    </div>
                  ))}
                </div>

                {/* Color legend */}
                <div className="mt-4 space-y-1 text-sm">
                  <p>{t('instructionGreen', lang)}</p>
                  <p>{t('instructionRed', lang)}</p>
                </div>

                {/* Keyboard shortcuts */}
                <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                  <h3 className="text-sm font-bold text-slate-600 mb-2">
                    {t('keyboardTitle', lang)}
                  </h3>
                  <div className="space-y-1 text-xs text-slate-500 font-mono">
                    {['keyArrows', 'keyD', 'keyG', 'keyR', 'keyW', 'keyC', 'keyEsc'].map(
                      (key) => (
                        <p key={key}>
                          {t(key as keyof typeof import('@/lib/i18n').default.cn, lang)}
                        </p>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 pb-6">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  {t('gotIt', lang)}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
