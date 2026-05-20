/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Cpu, Terminal } from 'lucide-react';

interface LanguageStat {
  name: string;
  percentage: number;
  color: string;
  textClass: string;
}

const LANGUAGES_DATA: LanguageStat[] = [
  { name: "Java", percentage: 75.82, color: "bg-[#c27c11]", textClass: "text-[#d48c1f]" },
  { name: "Python", percentage: 10.34, color: "bg-[#306998]", textClass: "text-[#4784b8]" },
  { name: "TypeScript", percentage: 7.93, color: "bg-[#3178c6]", textClass: "text-[#4b94e2]" },
  { name: "Go", percentage: 3.87, color: "bg-[#00add8]", textClass: "text-[#00c5f5]" },
  { name: "HTML", percentage: 2.04, color: "bg-[#e34c26]", textClass: "text-[#f0643f]" }
];

interface MostUsedLanguagesProps {
  lang: 'pt' | 'en';
}

export default function MostUsedLanguages({ lang }: MostUsedLanguagesProps) {
  return (
    <div className="glass-card p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
      
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-4">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-cyber-cyan" />
            <span className="text-[10px] font-mono text-white/55 uppercase tracking-widest font-bold">
              {lang === 'pt' ? 'Métricas de Repositórios GitHub' : 'GitHub Repository Metrics'}
            </span>
          </div>
          <span className="text-[9px] font-mono text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/15 px-2 py-0.5 rounded font-bold">
            LIVE_STATS
          </span>
        </div>

        {/* Title */}
        <h4 className="text-sm font-mono text-white/90 font-bold mb-3 flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
          {lang === 'pt' ? 'Linguagens Mais Utilizadas' : 'Most Used Languages'}
        </h4>

        {/* Multi-seg bar */}
        <div className="w-full h-3 rounded-full bg-white/[0.04] overflow-hidden flex mb-6 border border-white/5">
          {LANGUAGES_DATA.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ width: 0 }}
              animate={{ width: `${item.percentage}%` }}
              transition={{ delay: 0.1 * index, duration: 0.8 }}
              className={`${item.color} h-full transition-all`}
              title={`${item.name}: ${item.percentage}%`}
            />
          ))}
        </div>

        {/* Grid Lists of stats */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {LANGUAGES_DATA.map((item) => (
            <div key={item.name} className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${item.color} flex-shrink-0`} />
                <span className="text-xs font-mono text-white/80 font-semibold">{item.name}</span>
              </div>
              <div className={`text-[11px] font-mono pl-4 ${item.textClass} font-semibold`}>
                {item.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Footnote */}
      <div className="mt-5 pt-3 border-t border-white/5 text-[9px] font-mono text-white/30 text-left">
        {lang === 'pt' 
          ? '* Extraído dos repositórios oficiais e commits ativos em Java e Web.'
          : '* Compiled from official repositories & active Java & web commits.'
        }
      </div>
    </div>
  );
}
