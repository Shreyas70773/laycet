'use client';

import { useApp } from '@/hooks/useAppState';
import { t } from '@/lib/i18n';
import { formatPercent } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Target, Flame, AlertTriangle, Download, Printer } from 'lucide-react';
import { useState } from 'react';

interface StatsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StatsPanel({ isOpen, onClose }: StatsPanelProps) {
  const { state, words, currentWords, getGroupStats } = useApp();
  const lang = state.settings.language;
  const [exportMsg, setExportMsg] = useState('');

  // Overall stats
  const totalWords = words.length;
  const totalGreen = Object.values(state.wordStatuses).filter((s) => s === 'green').length;
  const totalRed = Object.values(state.wordStatuses).filter((s) => s === 'red').length;
  const totalReviewed = totalGreen + totalRed;

  // Get red-marked words for export
  const redWords = words.filter((w) => state.wordStatuses[w.id] === 'red');

  const handleExport = () => {
    if (redWords.length === 0) {
      setExportMsg(t('noRedWords', lang));
      setTimeout(() => setExportMsg(''), 2000);
      return;
    }
    const text = redWords
      .map((w) => `${w.word} ${w.ipa} (${w.partOfSpeech}) - ${w.chinese}`)
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setExportMsg(t('exportSuccess', lang));
      setTimeout(() => setExportMsg(''), 2000);
    }).catch(() => {
      // Fallback: open in new window for copying/printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`<html><head><title>${t('exportRedWords', lang)}</title>
          <style>body{font-family:sans-serif;padding:2rem;line-height:1.8}h1{color:#333;margin-bottom:1rem}p{margin:0.25rem 0;font-size:14px}</style></head><body>
          <h1>${t('exportRedWords', lang)} (${redWords.length})</h1>
          ${redWords.map((w) => `<p><strong>${w.word}</strong> ${w.ipa} <em>(${w.partOfSpeech})</em> — ${w.chinese}</p>`).join('')}
          </body></html>`);
        printWindow.document.close();
        printWindow.print();
      }
    });
  };

  const handlePrint = () => {
    if (redWords.length === 0) {
      setExportMsg(t('noRedWords', lang));
      setTimeout(() => setExportMsg(''), 2000);
      return;
    }
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<html><head><title>${t('print', lang)}</title>
        <style>
          body{font-family:'Segoe UI',sans-serif;padding:2rem;color:#333}
          h1{font-size:20px;margin-bottom:0.5rem}
          h2{font-size:14px;color:#666;margin-bottom:1.5rem;font-weight:normal}
          .word{display:flex;align-items:baseline;gap:0.5rem;padding:0.35rem 0;border-bottom:1px solid #eee}
          .word:last-child{border-bottom:none}
          .en{font-weight:bold;font-size:15px}
          .ipa{color:#888;font-size:12px}
          .pos{color:#666;font-style:italic;font-size:12px}
          .cn{font-size:14px;margin-left:auto}
          @media print{body{padding:1rem}}
        </style></head><body>
        <h1>CET-4 ${lang === 'cn' ? '不认识的词' : 'Unknown Words'}</h1>
        <h2>${redWords.length} ${lang === 'cn' ? '个单词' : 'words'} · ${new Date().toLocaleDateString()}</h2>
        ${redWords.map((w) => `<div class="word"><span class="en">${w.word}</span><span class="ipa">${w.ipa}</span><span class="pos">${w.partOfSpeech}</span><span class="cn">${w.chinese}</span></div>`).join('')}
        </body></html>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Hardest words (most times marked red)
  const hardestWords = Object.entries(state.redCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([id, count]) => {
      const word = words.find((w) => w.id === id);
      return { word, count };
    })
    .filter((h) => h.word);

  // Per-group stats
  const groupStats = Array.from({ length: 30 }, (_, i) => ({
    group: i + 1,
    ...getGroupStats(i + 1),
  }));

  // Simple progress chart data (last 14 days from history)
  const historyData = state.studyHistory.slice(-14);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">
                📊 {t('statistics', lang)}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Summary cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <Target size={16} />
                    <span className="text-xs font-medium">{t('totalWords', lang)}</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">{totalWords}</p>
                  <p className="text-xs text-blue-400">
                    {totalReviewed} {lang === 'cn' ? '已复习' : 'reviewed'}
                  </p>
                </div>

                <div className="bg-emerald-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-emerald-600 mb-1">
                    <TrendingUp size={16} />
                    <span className="text-xs font-medium">{t('knownWords', lang)}</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-700">{totalGreen}</p>
                  <p className="text-xs text-emerald-400">
                    {formatPercent(totalGreen, totalWords)}
                  </p>
                </div>

                <div className="bg-red-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-600 mb-1">
                    <AlertTriangle size={16} />
                    <span className="text-xs font-medium">{t('unknownWords', lang)}</span>
                  </div>
                  <p className="text-2xl font-bold text-red-700">{totalRed}</p>
                  <p className="text-xs text-red-400">
                    {formatPercent(totalRed, totalWords)}
                  </p>
                </div>

                <div className="bg-amber-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-amber-600 mb-1">
                    <Flame size={16} />
                    <span className="text-xs font-medium">{t('studyStreak', lang)}</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-700">{state.streak}</p>
                  <p className="text-xs text-amber-400">{t('days', lang)}</p>
                </div>
              </div>

              {/* Export / Print buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-sm font-medium transition-colors"
                >
                  <Download size={16} />
                  {t('exportRedWords', lang)} ({redWords.length})
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-sm font-medium transition-colors"
                >
                  <Printer size={16} />
                  {t('print', lang)}
                </button>
              </div>
              {exportMsg && (
                <div className="text-center text-sm text-emerald-600 font-medium animate-pulse">
                  {exportMsg}
                </div>
              )}

              {/* Progress chart (simple bar chart) */}
              {historyData.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-600 mb-3">
                    {t('progressChart', lang)}
                  </h3>
                  <div className="flex items-end gap-1 h-32 bg-slate-50 rounded-lg p-3">
                    {historyData.map((day, i) => {
                      const maxVal = Math.max(
                        ...historyData.map((d) => d.greenCount + d.redCount),
                        1
                      );
                      const greenHeight = (day.greenCount / maxVal) * 100;
                      const redHeight = (day.redCount / maxVal) * 100;

                      return (
                        <div
                          key={i}
                          className="flex-1 flex flex-col justify-end items-center gap-0.5"
                          title={`${day.date}: 🟢${day.greenCount} 🔴${day.redCount}`}
                        >
                          <div
                            className="w-full bg-emerald-400 rounded-t"
                            style={{ height: `${greenHeight}%`, minHeight: day.greenCount ? 2 : 0 }}
                          />
                          <div
                            className="w-full bg-red-400 rounded-b"
                            style={{ height: `${redHeight}%`, minHeight: day.redCount ? 2 : 0 }}
                          />
                          <span className="text-[8px] text-slate-400 mt-1">
                            {day.date.slice(-2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Hardest words */}
              {hardestWords.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-600 mb-3">
                    🎯 {t('hardestWords', lang)}
                  </h3>
                  <div className="space-y-2">
                    {hardestWords.map(({ word, count }, i) => (
                      <div
                        key={word!.id}
                        className="flex items-center justify-between bg-red-50 rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-red-400 font-mono w-5">
                            {i + 1}.
                          </span>
                          <span className="text-sm font-medium text-red-800">
                            {word!.word}
                          </span>
                          <span className="text-xs text-red-400">{word!.chinese}</span>
                        </div>
                        <span className="text-xs text-red-500 font-medium">
                          {count}x {t('timesMarkedRed', lang)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Per-group completion */}
              <div>
                <h3 className="text-sm font-bold text-slate-600 mb-3">
                  {lang === 'cn' ? '各组完成度' : 'Group Completion'}
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {groupStats.map(({ group, total, green, red }) => {
                    const pct = total ? Math.round((green / total) * 100) : 0;
                    return (
                      <div
                        key={group}
                        className="text-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                        title={`Group ${group}: ${green}/${total} green, ${red} red`}
                      >
                        <div className="text-[10px] text-slate-400 mb-1">G{group}</div>
                        <div
                          className={`text-sm font-bold ${
                            pct === 100
                              ? 'text-emerald-600'
                              : pct > 0
                              ? 'text-blue-600'
                              : 'text-slate-300'
                          }`}
                        >
                          {pct}%
                        </div>
                        <div className="h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
