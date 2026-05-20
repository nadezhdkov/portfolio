/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Terminal as TerminalIcon, 
  Layers, 
  Activity, 
  Cpu, 
  ExternalLink, 
  Calendar, 
  Briefcase, 
  ArrowUpRight, 
  Check, 
  Mail, 
  Github, 
  Music, 
  Volume2, 
  VolumeX, 
  Globe, 
  ShieldCheck, 
  FolderGit2, 
  MousePointer2,
  Wrench,
  ChevronRight,
  Database
} from 'lucide-react';

import LoadingScreen from './components/LoadingScreen';
import NoiseOverlay from './components/NoiseOverlay';
import TerminalPanel from './components/TerminalPanel';
import EngineMetrics from './components/EngineMetrics';
import MinecraftSystems from './components/MinecraftSystems';
import UnityShowcase from './components/UnityShowcase';
import SkillGraph from './components/SkillGraph';
import MostUsedLanguages from './components/MostUsedLanguages';
import ProjectMediaGallery from './components/ProjectMediaGallery';

import { PROJECTS_DATA, TIMELINE_DATA, HERO_TAGLINES } from './data';
import { synths } from './utils/audio';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [soundOn, setSoundOn] = useState(false);
  const [activeTab, setActiveTab] = useState<'unity' | 'minecraft' | 'scratch' | 'metrics'>('unity');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [lang, setLang] = useState<'pt' | 'en'>('pt');
  
  // Contact Form States
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMsg, setFormMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSent, setFormSent] = useState(false);

  const taglines = lang === 'pt'
    ? ["Programador de Gameplay", "Desenvolvedor de Sistemas", "Criador de Sistemas Minecraft", "Engenheiro Criativo"]
    : ["Gameplay Programmer", "Game Systems Developer", "Minecraft Systems Creator", "Creative Engineer"];

  // Rotate Hero Taglines
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [taglines.length]);

  // Update Synths volume preference globally
  const handleSoundToggle = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    synths.soundEnabled = nextState;
    if (nextState) {
      synths.playSuccess();
    }
  };

  const handleInteractiveClick = () => {
    synths.playClick();
  };

  const handleSmoothScroll = (e: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    synths.playClick();
    const cleanId = targetId.startsWith('#') ? targetId.slice(1) : targetId;
    
    if (cleanId === 'top') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }

    const element = document.getElementById(cleanId);
    if (element) {
      const headerHeight = 84; // Offset for sticky navigation header
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMsg) return;
    
    setIsSubmitting(true);
    synths.playClick();

    setTimeout(() => {
      setIsSubmitting(false);
      setFormSent(true);
      synths.playSuccess();
      setFormName("");
      setFormEmail("");
      setFormMsg("");
      setTimeout(() => setFormSent(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f1f2f6] relative font-sans flex flex-col selection:bg-cyber-cyan/35 selection:text-white">
      
      {/* Cinematic Loading screen */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen 
            onComplete={() => {
              setIsLoading(false);
              synths.playSwoop();
            }} 
          />
        )}
      </AnimatePresence>

      {/* Cyber overlay elements */}
      <NoiseOverlay />

      {/* Grid background simulation with Frosted Glass Theme overlay pattern */}
      <div className="absolute inset-0 bg-[#050505] overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-[0.15] animate-grid-move" 
          style={{ backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-cyber-cyan/10 via-transparent to-cyber-purple/10 pointer-events-none" />
        
        {/* Floating Atmospheric blur ambient spots */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyber-cyan/15 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyber-purple/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* Floating System HUD (Estatic labels in margin) */}
      <div className="hidden lg:block fixed left-4 top-1/2 -translate-y-1/2 z-40 font-mono text-[9px] text-white/15 select-none space-y-6">
        <div className="rotate-90 origin-left tracking-[0.3em] uppercase whitespace-nowrap">
          SYSTEM_OS: RICK_KERNEL_v1.12.9
        </div>
        <div className="rotate-90 origin-left tracking-[0.3em] uppercase whitespace-forward pt-24 text-cyber-cyan">
          ● REAL-TIME DIRECT COMPILER
        </div>
      </div>

      <div className="hidden lg:block fixed right-6 top-1/2 -translate-y-1/2 z-40 font-mono text-[9px] text-white/15 select-none space-y-2 text-right">
        <div>LATENCY: &lt;1.2ms</div>
        <div>CONNS: ACTIVE_OK</div>
        <div>PORT: 3000</div>
      </div>

      {/* Core Global Header Navigation */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/10 bg-[#050505]/45 backdrop-blur-md select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand */}
          <a 
            href="#top" 
            onClick={(e) => handleSmoothScroll(e, "top")}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyber-cyan via-[#080910] to-[#b5179e] p-[1.5px] border border-white/5 relative overflow-hidden flex items-center justify-center">
              <span className="font-display font-black text-xs text-white tracking-tighter">R</span>
              <div className="absolute inset-0 bg-cyber-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <span className="font-display font-bold text-sm tracking-wider text-white">Rick<span className="text-cyber-cyan"> Dev</span></span>
              <div className="text-[8px] font-mono text-white/40 leading-none">GAME DEV PORTFOLIO</div>
            </div>
          </a>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono font-medium text-white/60">
            <a href="#about" onClick={(e) => handleSmoothScroll(e, "about")} className="hover:text-cyber-cyan transition-colors">
              {lang === 'pt' ? '/sobre_mim' : '/about_me'}
            </a>
            <a href="#unity-sandbox" onClick={(e) => handleSmoothScroll(e, "unity-sandbox")} className="hover:text-cyber-cyan transition-colors">
              /unity_sandbox
            </a>
            <a href="#skills-matrix" onClick={(e) => handleSmoothScroll(e, "skills-matrix")} className="hover:text-cyber-cyan transition-colors">
              {lang === 'pt' ? '/tecnologias' : '/tech_stack'}
            </a>
            <a href="#timeline-history" onClick={(e) => handleSmoothScroll(e, "timeline-history")} className="hover:text-cyber-cyan transition-colors">
              {lang === 'pt' ? '/experiencia' : '/experience'}
            </a>
            <a href="#contact-protocol" onClick={(e) => handleSmoothScroll(e, "contact-protocol")} className="hover:text-cyber-cyan transition-colors">
              {lang === 'pt' ? '/contato' : '/contact'}
            </a>
          </nav>

          {/* Action cluster (Sound toggle + Language switch + System state indicator) */}
          <div className="flex items-center gap-3">
            
            {/* Language Switcher Trigger */}
            <button
              onClick={() => { setLang(lang === 'pt' ? 'en' : 'pt'); synths.playClick(); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border bg-white/[0.02] text-white/50 border-white/5 hover:border-white/10 hover:text-white/80 text-xs font-mono transition-all cursor-pointer"
              title={lang === 'pt' ? 'Switch to English' : 'Mudar para Português'}
            >
              <Globe className="w-3.5 h-3.5 text-cyber-cyan" />
              <span className="text-[10px] uppercase font-bold tracking-wider">
                {lang === 'pt' ? 'EN' : 'PT-BR'}
              </span>
            </button>

            {/* Ambient Sound Trigger */}
            <button
              onClick={handleSoundToggle}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                soundOn
                  ? 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/30 shadow-[0_0_10px_rgba(0,240,255,0.1)]'
                  : 'bg-white/[0.02] text-white/50 border-white/5 hover:border-white/10 hover:text-white/80'
              }`}
              title="Alternar SFX de Botões"
            >
              <AnimatePresence mode="wait">
                {soundOn ? (
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} key="audio-on" className="flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase font-bold tracking-wider hidden sm:inline">SFX ON</span>
                  </motion.div>
                ) : (
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} key="audio-off" className="flex items-center gap-1">
                    <VolumeX className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase font-bold tracking-wider hidden sm:inline">SFX MUTED</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Quick launcher terminal call for UX */}
            <a
              href="#interactive-terminal"
              onClick={(e) => handleSmoothScroll(e, "interactive-terminal")}
              className="hidden sm:flex items-center gap-1.5 text-xs text-cyber-green bg-cyber-green/5 border border-cyber-green/15 rounded-lg px-3 py-1.5 font-mono hover:bg-cyber-green/10 hover:border-cyber-green/30 transition-all font-semibold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-ping" />
              <span>TERMINAL DIAGNOSTICS</span>
            </a>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="z-10 flex-1 relative w-full overflow-hidden">
        
        {/* HERO SECTION */}
        <section id="top" className="relative min-h-[calc(100vh-64px)] flex items-center pt-8 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Big typography and catchwords column */}
            <div className="lg:col-span-7 space-y-8 flex flex-col justify-center text-left">
              
              {/* Launcher Info */}
              <div className="inline-flex items-center gap-2 bg-white/[0.02] border border-white/5 py-1 px-3 rounded-full w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-cyan"></span>
                </span>
                <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase font-bold">
                  {lang === 'pt' ? 'Núcleo de Jogos & Arquitetura Carregado' : 'Game Development & Architecture Core Loaded'}
                </span>
              </div>

              {/* Big Display Name */}
              <div className="space-y-4">
                <h1 className="text-large-display font-display font-black tracking-tight leading-[0.9] text-white select-text">
                  RICK<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-white to-cyber-purple drop-shadow-[0_4px_12px_rgba(0,240,255,0.1)]">
                    RICK DEV
                  </span>
                </h1>

                {/* Taglines Carousel */}
                <div className="h-10 flex items-center overflow-hidden font-mono text-base md:text-lg font-bold">
                  <span className="text-white/40 select-none mr-2">❯</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={carouselIndex}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35 }}
                      className="text-cyber-cyan tracking-wider uppercase text-glow-cyan"
                    >
                      {taglines[carouselIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              {/* Vibe statement */}
              <p className="text-sm md:text-base text-white/60 font-sans max-w-xl leading-relaxed">
                {lang === 'pt' 
                  ? "Desenvolvo mecânicas de jogo, sistemas de física e integrações de rede para servidores e jogos independentes. Trabalho criando plugins personalizados para Minecraft (Spigot) e arquitetando sistemas organizados e modulares na Unity."
                  : "I design gameplay mechanics, physics systems, and network integrations for servers and indie games. I specialize in building custom Minecraft Spigot plugins and organizing modular architectures in Unity."
                }
              </p>

              {/* Launcher Buttons CTA */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#unity-sandbox"
                  onClick={(e) => handleSmoothScroll(e, "unity-sandbox")}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyber-cyan to-[#0a66c2] text-white text-xs font-mono font-bold tracking-widest hover:shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all cursor-pointer flex items-center gap-2"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>{lang === 'pt' ? 'SIMULADOR DE JOGO' : 'GAMEPLAY SIMULATOR'}</span>
                </a>
                
                <a
                  href="#contact-protocol"
                  onClick={(e) => handleSmoothScroll(e, "contact-protocol")}
                  className="px-6 py-3 rounded-lg bg-white/[0.03] border border-white/10 hover:border-cyber-cyan/30 text-white hover:text-cyber-cyan text-xs font-mono font-bold tracking-widest transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>{lang === 'pt' ? 'ENTRAR EM CONTATO' : 'GET IN TOUCH'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Engine telemetry mini panel */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/[0.01] border border-white/[0.03] p-4 rounded-xl max-w-2xl">
                <div>
                  <div className="text-[9px] font-mono text-white/30 uppercase">SPIGOT_VM</div>
                  <div className="text-xs font-mono font-black text-white mt-1">20.0 TPS</div>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-white/30 uppercase">AVERAGE_PING</div>
                  <div className="text-xs font-mono font-black text-cyber-cyan mt-1">&lt; 12ms</div>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-white/30 uppercase">PROTOTYPES</div>
                  <div className="text-xs font-mono font-black text-cyber-purple mt-1">4 COMPILADOS</div>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-white/30 uppercase">STATUS</div>
                  <div className="text-xs font-mono font-black text-cyber-green mt-1">ACTIVE</div>
                </div>
              </div>

            </div>

            {/* Simulated Desktop HUD/IDE Column */}
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-cyber-cyan/5 rounded-full blur-[80px] pointer-events-none" />
              <div className="relative">
                <TerminalPanel />
              </div>
            </div>

          </div>
        </section>

        {/* SECTION: ABOUT ME */}
        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative bg-white/[0.01]">
          <div className="max-w-7xl mx-auto">
            
            {/* Title block */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-xs font-mono text-cyber-cyan uppercase tracking-[0.2em] font-bold">
                  [SYSTEM_ABOUT]
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-black text-white mt-1">
                  {lang === 'pt' ? 'Arquitetura Mental & Perfil' : 'Mental Architecture & Profile'}
                </h2>
              </div>
              <p className="text-xs md:text-sm text-white/40 font-mono tracking-wider">
                DECOUPLED COMPONENT DESIGNER
              </p>
            </div>

            {/* Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
              
              {/* Biography panel */}
              <div className="lg:col-span-7 glass-panel rounded-2xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 engine-grid opacity-10 pointer-events-none" />
                
                <div className="space-y-6 z-10 relative">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="text-cyber-cyan w-5 h-5" />
                    <span className="font-mono text-xs uppercase tracking-widest text-white/70 font-semibold">
                      {lang === 'pt' ? 'Identidade Rick Dev Verificada' : 'Rick Dev Identity Verified'}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-display font-bold text-white tracking-tight leading-snug">
                    {lang === 'pt'
                      ? '"Desenvolver jogos vai além de arrastar componentes; trata-se de arquitetar mecânicas limpas e garantir que a lógica por trás de cada interação faça sentido."'
                      : '"Game development is more than just dragging components; it\'s about architecting clean mechanics and ensuring the logic behind every encounter makes sense."'
                    }
                  </h3>

                  <div className="space-y-4 text-sm text-white/70 leading-relaxed font-sans text-left">
                    {lang === 'pt' ? (
                      <>
                        <p>
                          Comecei programando de forma prática, motivado pela curiosidade de entender como as modificações de jogos e os servidores funcionavam por trás dos panos. Hoje, trabalho criando soluções eficientes em tempo real, com foco em <strong>Java (ecossistema Spigot/Paper)</strong>, <strong>C# (Unity)</strong> e <strong>TypeScript</strong>.
                        </p>
                        <p>
                          Valorizo código limpo, modular e de fácil manutenção. Ao desenvolver minijogos como BedWars, trabalho diretamente com manipulação de pacotes de baixo nível (NMS) e processamento assíncrono para garantir a estabilidade do servidor. Na Unity, priorizo uma arquitetura desacoplada, utilizando ScriptableObjects para dados e sistemas de Object Pooling para evitar picos de uso do Garbage Collector.
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          I started programming practically, driven by curiosity to understand how game modifications and servers worked under the hood. Today, I build real-time systems, focusing on <strong>Java (Spigot/Paper ecosystem)</strong>, <strong>C# (Unity)</strong>, and <strong>TypeScript</strong>.
                        </p>
                        <p>
                          I value clean, modular, and maintainable code. When developing game modes like BedWars, I work directly with low-level packet handling (NMS) and asynchronous loops to keep the main thread stable. In Unity, I prioritize decoupled architecture, utilizing ScriptableObjects for data and Object Pooling to prevent garbage collection spikes.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Sub signatures block */}
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between z-10 relative">
                  <div>
                    <div className="text-xs font-mono text-white/50">LOCAL_TIMECODE</div>
                    <div className="text-xs font-mono font-bold text-cyber-cyan">2026-05-20 // UTC-3</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-white/30">
                      {lang === 'pt' ? 'LIVRE PARA PROJETOS_INDIE' : 'OPEN FOR INDIE_CREATIONS'}
                    </div>
                    <span className="inline-block px-1.5 py-0.5 bg-cyber-green/10 text-cyber-green text-[9px] uppercase font-mono rounded font-bold">
                      ● {lang === 'pt' ? 'DISPONÍVEL' : 'AVAILABLE_OK'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Side Spec box cards */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Stats 1: Gameplay loops */}
                <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-white/40 uppercase">
                      {lang === 'pt' ? 'Estatísticas Operacionais' : 'Operational Stats'}
                    </span>
                    <Gamepad2 className="text-cyber-cyan w-4 h-4" />
                  </div>
                  <div className="my-4 text-left">
                    <div className="text-[32px] font-display font-black text-white leading-none">60+ HZ</div>
                    <div className="text-xs font-mono text-cyber-cyan mt-1">
                      {lang === 'pt' ? 'FPS DE DESENVOLVIMENTO' : 'DEVELOPMENT STABLE FREQ'}
                    </div>
                  </div>
                  <p className="text-xs text-white/55 font-mono text-left">
                    {lang === 'pt'
                      ? 'Garantia de game loop leve em sistemas de baixa latência e tratamento direto de vetores matemáticos.'
                      : 'Guaranteed lightweight game loop on low-latency systems and direct linear vector algebra calculations.'
                    }
                  </p>
                </div>

                {/* Stats 2: Java expertise */}
                <div className="glass-card p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute inset-0 bg-cyber-green/5 blur-3xl pointer-events-none" />
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] font-mono text-white/40 uppercase">
                      {lang === 'pt' ? 'Estatísticas Minecraft' : 'Minecraft Stats'}
                    </span>
                    <Database className="text-cyber-green w-4 h-4" />
                  </div>
                  <div className="my-4 z-10 text-left">
                    <div className="text-[32px] font-display font-black text-white leading-none">20.0 TPS</div>
                    <div className="text-xs font-mono text-cyber-green mt-1">
                      {lang === 'pt' ? 'PERFORMANCE DE PLUGINS' : 'PLUGINS COMPLIANCE'}
                    </div>
                  </div>
                  <p className="text-xs text-white/55 font-mono z-10 text-left">
                    {lang === 'pt'
                      ? 'Código assíncrono projetado para gerenciar mais de 500 jogadores concorrentes na mesma máquina física.'
                      : 'Asynchronous event engines designed to handle 500+ concurrent players on the same hardware instance.'
                    }
                  </p>
                </div>

                {/* Most Used Languages Dynamic Widget */}
                <MostUsedLanguages lang={lang} />

              </div>

            </div>

          </div>
        </section>

        {/* SECTION: THE GAME ENGINE WORKSPACE (PROJECTS & SIMULATIONS) */}
        <section id="unity-sandbox" className="py-20 px-4 sm:px-6 lg:px-8 relative border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            
            {/* Title Block */}
            <div className="mb-12">
              <span className="text-xs font-mono text-cyber-cyan uppercase tracking-[0.2em] font-bold">
                [PROJECTS_PLAYGROUND]
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-black text-white mt-1">
                Workspace de Projetos Interativos
              </h2>
              <p className="text-sm text-white/50 font-sans mt-3 max-w-2xl leading-relaxed">
                Navegue pelas quatro principais categorias do meu portfólio de engenharia de jogos. Você pode testar variáveis ativas nos painéis live.
              </p>
            </div>

            {/* Visual Tabs Navigation */}
            <div className="flex flex-wrap gap-2 mb-8 glass-card p-1.5 rounded-xl w-fit">
              <button
                onClick={() => { setActiveTab('unity'); synths.playClick(); }}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold tracking-wider rounded-lg transition-all cursor-pointer ${
                  activeTab === 'unity'
                    ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/35'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                <span>UNITY SANDBOX [PROTOTIPOS]</span>
              </button>
              
              <button
                onClick={() => { setActiveTab('minecraft'); synths.playClick(); }}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold tracking-wider rounded-lg transition-all cursor-pointer ${
                  activeTab === 'minecraft'
                    ? 'bg-cyber-green/15 text-cyber-green border border-cyber-green/35'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>MINECRAFT WORKSPACE [LOGS-NODE]</span>
              </button>

              <button
                onClick={() => { setActiveTab('scratch'); synths.playClick(); }}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold tracking-wider rounded-lg transition-all cursor-pointer ${
                  activeTab === 'scratch'
                    ? 'bg-[#ff007f]/15 text-[#ff007f] border border-[#ff007f]/35'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                <FolderGit2 className="w-4 h-4" />
                <span>JOGOS PUBLICADOS [ITCH.IO]</span>
              </button>

              <button
                onClick={() => { setActiveTab('metrics'); synths.playClick(); }}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold tracking-wider rounded-lg transition-all cursor-pointer ${
                  activeTab === 'metrics'
                    ? 'bg-cyber-yellow/15 text-cyber-yellow border border-cyber-yellow/35'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>TELEMETRIA DE REDE [JVM-DIAGNOSTIC]</span>
              </button>
            </div>

            {/* Displaying Content based on active Tab with entry animations */}
            <div className="min-h-[500px]">
              <AnimatePresence mode="wait">
                {activeTab === 'unity' && (
                  <motion.div
                    key="unity-tab"
                    initial={{ opacity: 0, scale: 0.98, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -15 }}
                    transition={{ duration: 0.35 }}
                  >
                    <UnityShowcase lang={lang} />
                  </motion.div>
                )}

                {activeTab === 'minecraft' && (
                  <motion.div
                    id="minecraft-infrastructure"
                    key="minecraft-tab"
                    initial={{ opacity: 0, scale: 0.98, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -15 }}
                    transition={{ duration: 0.35 }}
                  >
                    <MinecraftSystems />
                  </motion.div>
                )}

                {activeTab === 'scratch' && (
                  <motion.div
                    key="scratch-tab"
                    initial={{ opacity: 0, scale: 0.98, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -15 }}
                    transition={{ duration: 0.35 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                  >
                    {/* Project card 1: Pong 2D */}
                    <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 py-1.5 px-3 bg-cyber-cyan/15 border-b border-l border-cyber-cyan/30 text-cyber-cyan text-[10px] font-mono rounded-bl-xl font-bold uppercase tracking-widest">
                        v1.2.1 Stable
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-cyber-cyan">
                          <Gamepad2 className="w-5 h-5" />
                          <span className="text-[10px] font-mono uppercase tracking-widest font-semibold">Unity - Gameplay Programming</span>
                        </div>

                        <h3 className="text-2xl font-display font-black text-white">
                          Pong 2D Game
                        </h3>

                        <p className="text-sm text-white/70 leading-relaxed font-sans">
                          Meu primeiro projeto oficial publicado. Desenvolvido para concretizar o entendimento matemático de translação de vetores, colisões baseadas em delimitações convexas (AABB), tratamento de latência de quadros (DeltaTime) e comportamento de oponentes simulando reflexos biológicos.
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {["C#", "Unity API", "Vectores", "AABB Colisões", "AI Reativa"].map((tg) => (
                            <span key={tg} className="text-[10px] font-mono bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded text-white/50">
                              {tg}
                            </span>
                          ))}
                        </div>

                        {/* Bullets layout */}
                        <div className="border-t border-white/10 pt-4 mt-2 space-y-2">
                          <div className="flex items-start gap-2 text-xs text-white/70 font-sans">
                            <span className="text-cyber-cyan font-bold font-mono mt-0.5">✔</span>
                            <span>Física de atrito sem deslizamento para evitar saltos ou tunelamento de bola.</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-white/70 font-sans">
                            <span className="text-cyber-cyan font-bold font-mono mt-0.5">✔</span>
                            <span>Inteligência artificial do oponente calculada por taxa de atraso dinâmico nas raquetes.</span>
                          </div>
                        </div>
                      </div>

                      {/* Download section bottom */}
                      <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-left">
                          <span className="text-[9px] font-mono text-white/30 uppercase">DOWNLOAD_PLATFORM</span>
                          <div className="text-xs font-mono font-bold text-cyber-green">itch.io Game Marketplace</div>
                        </div>

                        <a
                          href="https://hopegm.itch.io/pong-2d-game"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleInteractiveClick}
                          className="px-5 py-2.5 rounded-lg bg-cyber-cyan text-[#080910] text-xs font-mono font-bold tracking-widest hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all flex items-center gap-1.5 border border-cyber-cyan/25 cursor-pointer"
                        >
                          <span>VISITAR ITCH.IO</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Generic project highlights */}
                    <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col justify-between">
                      <div className="space-y-6">
                        <span className="text-xs font-mono text-[#ff007f] font-bold tracking-widest uppercase">
                          ★ Destaques Adicionais
                        </span>

                        <h4 className="text-lg font-display font-semibold text-white">
                          Atuação em Projetos Indie & Comunidades Minecraft
                        </h4>

                        <div className="space-y-4">
                          <div className="p-3.5 bg-white/[0.015] border border-white/5 rounded-xl">
                            <div className="text-xs font-mono font-bold text-white/80">Sistemas Admin Web Configuradores</div>
                            <p className="text-xs text-white/60 mt-1 font-sans">
                              Desenvolvimento de conversores web capazes de modular configurações visuais de plugins Minecraft diretamente para feeds YAML integrados em servidores remotos.
                            </p>
                          </div>

                          <div className="p-3.5 bg-white/[0.015] border border-white/5 rounded-xl">
                            <div className="text-xs font-mono font-bold text-white/80">Infraestrutura e Administração de Plataformas</div>
                            <p className="text-xs text-white/60 mt-1 font-sans">
                              Gerenciamento e organização técnica de servidores de jogo, deploy contínuo em contêineres e sincronizações assíncronas de arquivos estáticos de mapas de areia.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 font-mono text-[9px] text-white/20 uppercase tracking-widest leading-relaxed">
                        Comprometido com a organização e metodologias limpas de refatoração constante.
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'metrics' && (
                  <motion.div
                    key="metrics-tab"
                    initial={{ opacity: 0, scale: 0.98, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -15 }}
                    transition={{ duration: 0.35 }}
                  >
                    <EngineMetrics />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </section>

        {/* SECTION: GAME SCREENSHOT GALLERY */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative bg-[#040508]/40">
          <div className="max-w-7xl mx-auto">
            <ProjectMediaGallery 
              lang={lang} 
              soundOn={soundOn} 
              onPlayClick={() => synths.playClick()} 
              onPlaySuccess={() => synths.playSuccess()} 
            />
          </div>
        </section>

        {/* SECTION: SKILLS & RATINGS MATRIX */}
        <section id="skills-matrix" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <SkillGraph />
          </div>
        </section>

        {/* SECTION: EXPERIENCE TIMELINE */}
        <section id="timeline-history" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative bg-white/[0.01]">
          <div className="max-w-7xl mx-auto">
            
            {/* Title Block */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <span className="text-xs font-mono text-cyber-cyan uppercase tracking-[0.2em] font-bold">
                [TIMELINE_HISTORY]
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-black text-white mt-1">
                Jornada & Experiência Profissional
              </h2>
              <p className="text-sm text-white/55 font-sans mt-3 max-w-xl">
                Histórico de desenvolvimento em arquitetura de jogos, lógica de minigames e desenvolvimento de sistemas eficientes e integrados.
              </p>
            </motion.div>

            {/* Timeline track nodes */}
            <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:-translate-x-1/2 before:w-[1px] before:bg-white/10 before:z-0">
              
              {TIMELINE_DATA.map((item, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <div 
                    key={item.period} 
                    className={`relative flex flex-col md:flex-row md:justify-between items-start md:items-center w-full z-10 ${
                      isLeft ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Circle timeline beacon triggered on scroll */}
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-120px" }}
                      transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
                      className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#050505] border-2 border-cyber-cyan z-20 flex items-center justify-center"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
                    </motion.div>

                    {/* Timeline card body with scroll trigger popping box */}
                    <motion.div 
                      initial={{ opacity: 0, y: 70, scale: 0.96 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: "-120px" }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
                      className={`w-full md:w-[46%] pl-10 md:pl-0 ${isLeft ? 'md:text-right' : 'md:text-left'}`}
                    >
                      <motion.div
                        whileHover={{ y: -4, border: "1px solid rgba(0, 245, 212, 0.3)", boxShadow: "0 10px 30px -10px rgba(0, 245, 212, 0.15)" }}
                        className="glass-card border border-white/10 p-6 rounded-2xl hover:border-white/20 transition-all text-left"
                      >
                        {/* Meta title info */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3 mb-4">
                          <span className="text-cyber-cyan text-xs font-mono font-bold tracking-wider">
                            {item.period}
                          </span>
                          <span className="text-[10px] font-mono text-white/30 uppercase">
                            {item.company}
                          </span>
                        </div>

                        <h3 className="text-lg font-display font-bold text-white tracking-tight leading-snug">
                          {item.role}
                        </h3>

                        <p className="text-xs text-white/60 font-sans mt-2 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="mt-4 space-y-2">
                          {item.bullets.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-2 text-xs text-white/75 font-sans leading-relaxed">
                              <span className="text-cyber-cyan font-bold select-none mt-0.5">•</span>
                              <span>{bullet}</span>
                            </div>
                          ))}
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1.5 pt-4 mt-2">
                          {item.tags.map((tg) => (
                            <span key={tg} className="text-[9px] font-mono bg-white/[0.03] border border-white/5 px-2 py-0.5 rounded text-white/40">
                              {tg}
                            </span>
                          ))}
                        </div>

                      </motion.div>
                    </motion.div>

                    {/* Empty block on target screen to balance grid */}
                    <div className="hidden md:block w-[46%]" />

                  </div>
                );
              })}

            </div>

          </div>
        </section>

        {/* SECTION: CONTACT & HANDSHAKE PROTOCOL */}
        <section id="contact-protocol" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Contact text side */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
              <div>
                <span className="text-xs font-mono text-cyber-cyan uppercase tracking-[0.2em] font-bold">
                  [NETWORK_HANDSHAKE]
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-black text-white mt-1">
                  {lang === 'pt' ? "Inicie Uma Conexão Remota" : "Start a Remote Connection"}
                </h2>
                <p className="text-sm text-white/60 font-sans mt-3 leading-relaxed max-w-xl">
                  {lang === 'pt'
                    ? "Se você está procurando um programador focado em Unity, desenvolvedor de plugins de Minecraft (Spigot/NMS), ou simplesmente quer trocar uma ideia sobre desenvolvimento de jogos, sinta-se à vontade para entrar em contato."
                    : "If you're looking for a Unity developer, a Minecraft backend plugin creator (Spigot/NMS), or simply want to chat about game development, feel free to reach out."
                  }
                </p>
              </div>

              {/* Direct Channels Cards */}
              <div className="space-y-4">
                
                {/* Channel 1: Email */}
                <div className="flex items-center gap-4 glass-card p-4 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/25 flex items-center justify-center text-cyber-cyan">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-white/30 uppercase">EMAIL_DIRECT_LINE</span>
                    <div className="text-xs font-mono font-bold text-white selection:bg-cyber-cyan/35 select-all">
                      rickmviana.dev@outlook.com
                    </div>
                  </div>
                </div>

                {/* Channel 2: Github */}
                <a
                  href="https://github.com/nadezhdkov"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleInteractiveClick}
                  className="flex items-center gap-4 glass-card hover:border-white/25 p-4 rounded-xl group transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#ff007f]/10 border border-[#ff007f]/25 flex items-center justify-center text-[#ff007f] group-hover:bg-[#ff007f]/20 transition-all">
                    <Github className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-mono text-white/30 uppercase">REPOSITORY_PROFILE</span>
                    <div className="text-xs font-mono font-bold text-white group-hover:text-[#ff007f] transition-colors">
                      github.com/nadezhdkov
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                </a>

                {/* Channel 3: Itch.io */}
                <a
                  href="https://hopegm.itch.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleInteractiveClick}
                  className="flex items-center gap-4 glass-card hover:border-white/25 p-4 rounded-xl group transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-cyber-yellow/10 border border-cyber-yellow/25 flex items-center justify-center text-cyber-yellow group-hover:bg-cyber-yellow/20 transition-all">
                    <Gamepad2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-mono text-white/30 uppercase">GAMEPLAY_STORE</span>
                    <div className="text-xs font-mono font-bold text-white group-hover:text-cyber-yellow transition-colors font-mono">
                      hopegm.itch.io
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                </a>

              </div>

              {/* Integrity footprint code */}
              <div className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] leading-relaxed hidden lg:block">
                SECURE AUTH PROTOCOLS ENABLED<br/>
                KEY: B64_SHA256_RICK_ENCRYPT_OK
              </div>
            </div>

            {/* Simulated contact secure protocol form */}
            <div className="lg:col-span-6 glass-panel rounded-2xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 engine-grid opacity-5 pointer-events-none" />
              
              <form onSubmit={handleFormSubmit} className="space-y-4 z-10 relative">
                
                <div className="border-b border-white/10 pb-4 mb-4">
                  <span className="text-[9px] font-mono text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/15 px-2.5 py-1 rounded font-bold uppercase tracking-widest">
                    HANDSHAKE API FORM v2.0
                  </span>
                  <h3 className="text-lg font-display font-medium text-white tracking-tight mt-2 text-left">
                    Envie Uma Mensagem de Handshake
                  </h3>
                </div>

                {/* Name */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono text-white/40 tracking-wider uppercase">Nome / Nickname</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: John Doe"
                    className="w-full glass-input text-white rounded-lg px-3.5 py-2.5 outline-none font-mono text-xs transition-colors focus:border-cyber-cyan/50"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono text-white/40 tracking-wider uppercase">Endereço de Email</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="Ex: john@domain.com"
                    className="w-full glass-input text-white rounded-lg px-3.5 py-2.5 outline-none font-mono text-xs transition-colors focus:border-cyber-cyan/50"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono text-white/40 tracking-wider uppercase">Conteúdo da Mensagem</label>
                  <textarea
                    required
                    rows={4}
                    value={formMsg}
                    onChange={(e) => setFormMsg(e.target.value)}
                    placeholder="Digite seu sinal ou proposta de projeto aqui..."
                    className="w-full glass-input text-white rounded-lg px-3.5 py-2.5 outline-none font-mono text-xs transition-colors resize-none focus:border-cyber-cyan/50"
                  />
                </div>

                {/* Submit Indicator */}
                <button
                  type="submit"
                  disabled={isSubmitting || formSent}
                  className="w-full bg-cyber-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] text-[#080910] py-3 rounded-lg text-xs font-mono font-bold tracking-widest cursor-pointer hover:bg-white transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'ENVIANDO PROTOCOLO...' : formSent ? 'SINAL ENVIADO COM SUCESSO! ✔' : 'SUBMETER SINAL DE HANDSHAKE'}
                </button>

                {/* Live validation feedback */}
                <AnimatePresence>
                  {formSent && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-xs font-mono text-cyber-green text-center mt-2.5"
                    >
                      ✔ Conexão simulada com sucesso! Aguarde o retorno no seu email.
                    </motion.div>
                  )}
                </AnimatePresence>

              </form>

              {/* Status parameters bottom */}
              <div className="border-t border-white/5 pt-4 mt-6 flex items-center justify-between text-[10px] font-mono text-white/20 select-none">
                <span>API ENCRYPT: SECURE TLS 1.3</span>
                <span>STATE: LISTENING_HANDSHAKES</span>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="glass-panel border-t border-white/10 bg-[#050505]/45 backdrop-blur-md py-12 px-4 sm:px-6 lg:px-8 select-none z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Logo Brand left */}
          <div className="space-y-1.5 text-center md:text-left">
            <div className="text-white text-sm font-display font-black tracking-wider uppercase">
              Rick<span className="text-cyber-cyan">Dev</span>
            </div>
            <div className="text-[10px] font-mono text-white/35">
              Gameplay programming, Systems design, and Multiplayer developer tools.
            </div>
          </div>

          {/* Copyright center */}
          <div className="text-center">
            <span className="text-xs text-white/40 font-mono tracking-wider">
              &copy; 2026-presente Rick Dev. Todos os direitos reservados.
            </span>
          </div>

          {/* Tech Spec Indicator right */}
          <div className="flex gap-4 font-mono text-[9px] text-white/25">
            <span>REACT 19.0</span>
            <span>VITE 6.2</span>
            <span>TAILWIND 4.0</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
