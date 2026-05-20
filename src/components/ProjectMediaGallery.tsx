/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image, ZoomIn, X, Film, CheckCircle, Flame, ShieldAlert, Zap } from 'lucide-react';

interface GalleryItem {
  id: string;
  category: 'all' | 'games' | 'servers';
  titlePT: string;
  titleEN: string;
  descPT: string;
  descEN: string;
  image: string;
  tags: string[];
  metrics: { labelPT: string; labelEN: string; value: string }[];
}

// Actual uploaded project images served statically via /public
const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "pong-physics",
    category: "games",
    titlePT: "Retro Pong 2D — Física & Loops",
    titleEN: "Retro Pong 2D — Physics & Loops",
    descPT: "Demonstração prática do Pong 2D rodando em tempo real. Desenvolvido para estudar colisão de caixas delimitadoras de eixos (AABB), reflexão de vetores bidimensionais e comportamento de IA sem depender de game engines prontas.",
    descEN: "Gameplay demo of Pong 2D running in real-time. Created to study Axis-Aligned Bounding Box (AABB) collisions, 2D vector path reflections, and custom CPU opponent tracking math without using ready-made game engines.",
    image: "/imagens_game/pong.gif",
    tags: ["C# Coding", "Vector Math", "AABB Physicals", "Independent Game"],
    metrics: [
      { labelPT: "Movimento", labelEN: "Motion", value: "AABB Vector" },
      { labelPT: "Taxa", labelEN: "Tick Rate", value: "60Hz Loop" },
      { labelPT: "Estrutura", labelEN: "Build", value: "Código Puro" }
    ]
  },
  {
    id: "cyber-towerforce",
    category: "games",
    titlePT: "Mecanismos Customizados: Plugin Minecraft",
    titleEN: "Custom Mechanisms: Minecraft Plugin",
    descPT: "Desenvolvimento de um plugin personalizado em Java voltado para o minijogo Esconde-Esconde, estruturando um sistema de mecanismos interativos do lado do servidor para auxiliar na jogabilidade.",
    descEN: "Custom Java plugin architecture engineered for the Hide 'n Seek minigame, implementing interactive mechanism controllers on the server-side to enhance main gameplay features.",
    image: "/imagens_game/Screenshot_20260520_004028.png",
    tags: ["Java 21", "Spigot API", "Minecraft Plugin", "System Triggers"],
    metrics: [
      { labelPT: "Linguagem", labelEN: "Language", value: "Java / Spigot" },
      { labelPT: "Mecanismos", labelEN: "Mechanics", value: "Lógicos" },
      { labelPT: "Uso", labelEN: "Context", value: "Esconde-Esconde" }
    ]
  },
  {
    id: "space-flight-2d",
    category: "games",
    titlePT: "Hospedagem Pong 2D — Itch.io",
    titleEN: "Pong 2D Deployment — Itch.io",
    descPT: "Página oficial do jogo Pong 2D publicada na plataforma Itch.io, servindo como meio de distribuição pública para downloads e testes diretos da build executável do meu primeiro jogo lançado.",
    descEN: "Official release and profile page of Pong 2D published on the Itch.io game platform, acting as a public portal for download files and direct testing of my first independent release.",
    image: "/imagens_game/Screenshot_20260520_004053-1.png",
    tags: ["Itch.io", "Public Build", "Game Release", "Executable Link"],
    metrics: [
      { labelPT: "Hospedagem", labelEN: "Hoster", value: "Itch.io" },
      { labelPT: "Distribuição", labelEN: "Release", value: "Executável" },
      { labelPT: "Estágio", labelEN: "Phase", value: "Publicado" }
    ]
  },
  {
    id: "infinite-runner-cyber",
    category: "games",
    titlePT: "Voo Sensorial — Física Estilo Flappy Bird",
    titleEN: "Sensory Flight — Flappy Bird Dynamics",
    descPT: "Protótipo estilo Flappy Bird desenvolvido em Unity para consolidar conceitos de aceleração gravitacional, aplicação ágil de forças de impulsão lineares (Thrusters) e reciclagem dinâmica de obstáculos na memória (Object Pooling).",
    descEN: "Flappy Bird inspired prototype built in Unity to experiment with gravitational acceleration, responsive upward impulse thruster calculation, and proactive obstacle block recycling via lightweight memory pooling.",
    image: "/imagens_game/Screenshot_20260520_004452-1.png",
    tags: ["Unity Engine", "C# Coding", "Physics 2D", "Object Pooling"],
    metrics: [
      { labelPT: "Física", labelEN: "Motion Mode", value: "Rigidbody2D" },
      { labelPT: "Controle", labelEN: "Reaction", value: "Suave / Instantâneo" },
      { labelPT: "Gráficos", labelEN: "Rendering", value: "60 FPS Locked" }
    ]
  },
  {
    id: "minecraft-minigames",
    category: "servers",
    titlePT: "Esconde-Esconde: Arena Fliperama Retrô",
    titleEN: "Hide 'n Seek: Retro Arcade Arena",
    descPT: "Construção de uma arena customizada para o minijogo Esconde-Esconde (Hide 'n Seek) em colaboração com a equipe, inspirada em consoles retrô e trazendo elementos clássicos de Mario, Snake e Megaman.",
    descEN: "Custom map design mapped and constructed for the Hide 'n Seek minigame in collaboration with my team, themed as an arcade cabinet containing elements of Mario, Snake, and Megaman.",
    image: "/imagens_game/2026-05-20_01.23.20.png",
    tags: ["Level Design", "Team Project", "Minecraft Map", "Retro Arcade"],
    metrics: [
      { labelPT: "Estilo", labelEN: "Art Direction", value: "Fliperama 80s" },
      { labelPT: "Modo de Jogo", labelEN: "Game Mode", value: "Esconde-Esconde" },
      { labelPT: "Construção", labelEN: "Work Type", value: "Em Equipe" }
    ]
  },
  {
    id: "lobby-system-cluster",
    category: "servers",
    titlePT: "Lobby Central: Inspiração Toy Story",
    titleEN: "Main Server Hub: Toy Story Theme",
    descPT: "Lobby central desenvolvido para o servidor de minijogos, com temática estética baseada no nostálgico universo de Toy Story (recreando elementos do filme e jogo de PS2). Ponto de redirecionamento de redes principal do proxy.",
    descEN: "Central server hub engineered and designed for player spawning, styled after the classic Toy Story movie and PlayStation 2 aesthetics. Acts as the primary proxy player redirection endpoint.",
    image: "/imagens_game/2026-05-20_01.22.36.png",
    tags: ["Velocity Proxy", "Map Aesthetics", "PS2 Theme", "Toyota Car Decor"],
    metrics: [
      { labelPT: "Nostalgia", labelEN: "Goal Theme", value: "Toy Story PS2" },
      { labelPT: "Atuação", labelEN: "Usage", value: "Lobby de Spawn" },
      { labelPT: "Roteador", labelEN: "Network Connect", value: "Proxy/Velocity" }
    ]
  },
  {
    id: "web-portal-dashboard",
    category: "servers",
    titlePT: "Portal Web Oficial & Comércio do Servidor",
    titleEN: "Official Server Portal & Web Store",
    descPT: "Website oficial completo em desenvolvimento para a comunidade do servidor de Minecraft onde atuo como CEO. Desenvolvido para centralizar fóruns integrados, sistemas automatizados de vendas/donates e notícias.",
    descEN: "Comprehensive official portal under active development for our Minecraft server community, where I operate as CEO. Built to bundle integrated forums, automatic store checkout routes, donations, and blog updates.",
    image: "/imagens_game/Screenshot_20260520_012923.png",
    tags: ["TypeScript", "Web Dashboard", "Store Gateway", "CEO Project"],
    metrics: [
      { labelPT: "Desenvolvimento", labelEN: "Web Platform", value: "TypeScript / CSS" },
      { labelPT: "E-commerce", labelEN: "Store API", value: "Loja & Donates" },
      { labelPT: "Função", labelEN: "My Role", value: "Fundador / CEO" }
    ]
  }
];

// Helper to resolve static public assets through Vite's base path in any environment (dev/prod subfolder)
export const resolveAssetPath = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const base = (import.meta as any).env?.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
};

interface ProjectMediaGalleryProps {
  lang: 'pt' | 'en';
  soundOn: boolean;
  onPlayClick: () => void;
  onPlaySuccess: () => void;
}

export default function ProjectMediaGallery({ lang, soundOn, onPlayClick, onPlaySuccess }: ProjectMediaGalleryProps) {
  const [filter, setFilter] = useState<'all' | 'games' | 'servers'>('all');
  const [activeLightbox, setActiveLightbox] = useState<GalleryItem | null>(null);

  const filteredItems = filter === 'all' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(it => it.category === filter);

  const openImage = (item: GalleryItem) => {
    onPlaySuccess();
    setActiveLightbox(item);
  };

  const closeLightbox = () => {
    onPlayClick();
    setActiveLightbox(null);
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden">
      
      {/* Background grids */}
      <div className="absolute inset-0 engine-grid opacity-5 pointer-events-none" />

      {/* Header and filter block */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-[10px] font-mono text-cyber-cyan tracking-widest uppercase font-bold flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 animate-pulse" />
            {lang === 'pt' ? 'DIRETÓRIO DIGITAL DE RECURSOS' : 'DIGITAL ASSETS DIRECTORY'}
          </span>
          <h3 className="font-display font-black text-xl text-white tracking-tight mt-1">
            {lang === 'pt' ? 'Galeria de Mídias de Jogo' : 'Gameplay Media Gallery'}
          </h3>
          <p className="text-xs text-white/50 font-mono mt-1">
            {lang === 'pt' 
              ? 'Área de renderização de mockups reais de jogos, servidores e minigames editados' 
              : 'Real gameplay mockup renders for servers, minigames, and customized prototypes'}
          </p>
        </div>

        {/* Tab filters inside */}
        <div className="flex flex-wrap gap-1 bg-white/[0.01] border border-white/10 p-1 rounded-lg">
          {(['all', 'games', 'servers'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => { setFilter(cat); onPlayClick(); }}
              className={`px-3 py-1.5 text-[10px] font-mono font-bold tracking-wider rounded transition-all cursor-pointer uppercase ${
                filter === cat
                  ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/35'
                  : 'text-white/45 hover:text-white/85'
              }`}
            >
              {cat === 'all' ? (lang === 'pt' ? 'Ver Todos' : 'See All') : cat === 'games' ? (lang === 'pt' ? 'Minijogos' : 'Minigames') : (lang === 'pt' ? 'Servidores' : 'Servers')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid displays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0b0c14]/40 border border-white/10 hover:border-white/20 rounded-xl overflow-hidden flex flex-col justify-between group h-full transition-all relative"
            >
              <div className="flex flex-col h-full justify-between">
                {/* Image box hover effects */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#06070b]/90 group-hover:scale-[1.01] transition-transform duration-300">
                  <img
                    src={resolveAssetPath(item.image)}
                    alt={lang === 'pt' ? item.titlePT : item.titleEN}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  
                  {/* Mask overlay zoom btn */}
                  <div className="absolute inset-0 bg-[#050505]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                    <span className="p-2.5 rounded-full bg-cyber-cyan text-[#050505] font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform flex items-center gap-1 text-xs font-mono">
                      <ZoomIn className="w-4 h-4" />
                      <span>{lang === 'pt' ? 'AMPLIAR' : 'EXPAND'}</span>
                    </span>
                  </div>

                  <button
                    onClick={() => openImage(item)}
                    className="absolute inset-0 w-full h-full cursor-pointer z-10"
                    aria-label="Expand image"
                  />
                </div>

                {/* Info and content box below image */}
                <div className="p-4 flex flex-col gap-3 flex-grow bg-white/[0.01]">
                  <div>
                    <h4 className="font-display font-medium text-white text-sm tracking-tight group-hover:text-cyber-cyan transition-colors">
                      {lang === 'pt' ? item.titlePT : item.titleEN}
                    </h4>
                    <p className="text-[11px] text-white/50 font-sans mt-1 leading-relaxed">
                      {lang === 'pt' ? item.descPT : item.descEN}
                    </p>
                  </div>
                  
                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-1.5 border-t border-white/5 pt-2.5">
                    {item.metrics.map((met, mIdx) => (
                      <div key={mIdx} className="bg-white/[0.02] border border-white/5 rounded p-1.5 text-center">
                        <span className="block text-[8px] font-mono text-white/40 uppercase">
                          {lang === 'pt' ? met.labelPT : met.labelEN}
                        </span>
                        <span className="block text-[9px] font-mono text-cyber-cyan font-bold truncate mt-0.5">
                          {met.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-[9px] font-mono bg-white/[0.04] border border-white/5 px-2 py-0.5 rounded text-white/40">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Fullscreen Lightbox Overlay */}
      <AnimatePresence>
        {activeLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-[#050505]/95 backdrop-blur-lg flex items-center justify-center p-4 grid place-items-center"
          >
            {/* Inner close mask */}
            <div className="absolute inset-0 cursor-zoom-out" onClick={closeLightbox} />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.93, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-5xl bg-[#090a10] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 flex flex-col"
            >
              {/* Image box with close button float */}
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={resolveAssetPath(activeLightbox.image)}
                  alt={lang === 'pt' ? activeLightbox.titlePT : activeLightbox.titleEN}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                
                {/* Close Button top-right over image */}
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-[#050505]/65 hover:bg-white/15 border border-white/15 text-white/75 hover:text-white transition-all cursor-pointer z-20 backdrop-blur-sm"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Tech indicator scan lines */}
                <div className="absolute inset-0 scanlines opacity-5 opacity-mask pointer-events-none" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
