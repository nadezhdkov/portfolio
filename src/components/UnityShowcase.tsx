/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RefreshCw, Gamepad2, Volume2, VolumeX, Swords, Award, Heart, HelpCircle, Activity } from 'lucide-react';
import { synths } from '../utils/audio';

// @ts-ignore
import runnerBackground from '../assets/runner/background.png';
// @ts-ignore
import runnerCoffee from '../assets/runner/coffee.png';
// @ts-ignore
import runnerEnemies from '../assets/runner/enemies.png';
// @ts-ignore
import runnerForeground from '../assets/runner/foreground.png';
// @ts-ignore
import runnerMiddleground1 from '../assets/runner/middleground1.png';
// @ts-ignore
import runnerMiddleground2 from '../assets/runner/middleground2.png';
// @ts-ignore
import runnerPlayer from '../assets/runner/player.png';
// @ts-ignore
import runnerRestartIcon from '../assets/runner/restart_icon.png';
// @ts-ignore
import runnerThorn from '../assets/runner/thorn.png';
// @ts-ignore
import runnerTiles from '../assets/runner/tiles.png';

// @ts-ignore
import flappyBackground from '../assets/flappybird/Background2.png';
// @ts-ignore
import flappyBird from '../assets/flappybird/Bird1-1.png';
// @ts-ignore
import flappyPipe from '../assets/flappybird/PipeStyle1.png';

// @ts-ignore
import fCard from '../assets/flowerdefense/card.png';
// @ts-ignore
import fCoin from '../assets/flowerdefense/coin.png';
// @ts-ignore
import fFlower from '../assets/flowerdefense/flower.png';
// @ts-ignore
import fFlower2 from '../assets/flowerdefense/flower2.png';
// @ts-ignore
import fFlower3 from '../assets/flowerdefense/flower3.png';
// @ts-ignore
import fGrid from '../assets/flowerdefense/grid.png';
// @ts-ignore
import fLeaf from '../assets/flowerdefense/leaf.png';
// @ts-ignore
import fMiniFlower from '../assets/flowerdefense/mini flower.png';
// @ts-ignore
import fShopButton from '../assets/flowerdefense/shop button.png';
// @ts-ignore
import fSunrays from '../assets/flowerdefense/sunrays.png';
// @ts-ignore
import fTileset from '../assets/flowerdefense/tileset.png';
// @ts-ignore
import fTiro from '../assets/flowerdefense/tiro.png';
// @ts-ignore
import fMomo from '../assets/flowerdefense/momo_idle_shadow.png';
// @ts-ignore
import fArena from '../assets/flowerdefense/flower_arena.jpg';

interface GameConfig {
  spawnInterval: number;
  engineSpeed: number;
  entityLimit: number;
  physicsTickRate: number;
}

interface UnityShowcaseProps {
  lang?: 'pt' | 'en';
}

// Entity types for game engine simulation
interface TDNode {
  x: number;
  y: number;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number;
  nodeIndex: number;
  color: string;
}

interface Turret {
  x: number;
  y: number;
  range: number;
  fireCooldown: number;
  lastFired: number;
  color: string;
}

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

interface SemicolumnObstacle {
  id?: number;
  x: number;
  width: number;
  y: number;
  height: number;
  passed: boolean;
  speed: number;
  type?: 'thorn' | 'enemy' | 'coffee';
  pulseAnim?: number;
}

interface FlappyPipe {
  x: number;
  width: number;
  topHeight: number;
  bottomHeight: number;
  passed: boolean;
}

export default function UnityShowcase({ lang = 'pt' }: UnityShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<'defence' | 'runner' | 'platformer'>('defence');
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(synths.soundEnabled);
  
  // High score tracking
  const [highScores, setHighScores] = useState({
    defence: 0,
    runner: 0,
    platformer: 0,
  });

  const [config, setConfig] = useState<GameConfig>({
    spawnInterval: 1.5,
    engineSpeed: 1.0,
    entityLimit: 120,
    physicsTickRate: 60,
  });

  // Current reactive stats exposed to the telemetry panel
  const [gameStats, setGameStats] = useState({
    activeEntities: 0,
    drawCalls: 0,
    physicsMs: 1.1,
    renderingMs: 2.5,
    score: 0,
    lives: 5,
    gameState: 'idle' as 'idle' | 'playing' | 'gameover',
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Game Loop and Entity references to bypass React state delay in Canvas loop
  const scoreRef = useRef(0);
  const livesRef = useRef(5);
  const gameStateRef = useRef<'idle' | 'playing' | 'gameover'>('idle');
  const frameCountRef = useRef(0);
  const lastSpawnTimeRef = useRef(0);

  // Tower Defense pathing nodes
  const tdPathNodes: TDNode[] = [
    { x: 500, y: 140 },
    { x: 380, y: 140 },
    { x: 380, y: 60 },
    { x: 220, y: 60 },
    { x: 220, y: 220 },
    { x: 100, y: 220 },
    { x: 100, y: 140 },
    { x: 30, y: 140 },
  ];

  // Entity Lists Refs
  const enemiesRef = useRef<Enemy[]>([]);
  const turretsRef = useRef<Turret[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  
  // Runner Character & Obstacles refs
  const runnerY = useRef(210);
  const runnerVy = useRef(0);
  const runnerIsGrounded = useRef(true);
  const runnerObstaclesRef = useRef<SemicolumnObstacle[]>([]);

  // Load and cache runner assets
  const runnerAssetsRef = useRef<{
    background: HTMLImageElement | null;
    middleground1: HTMLImageElement | null;
    middleground2: HTMLImageElement | null;
    foreground: HTMLImageElement | null;
    tiles: HTMLImageElement | null;
    player: HTMLImageElement | null;
    enemies: HTMLImageElement | null;
    thorn: HTMLImageElement | null;
    coffee: HTMLImageElement | null;
    restart_icon: HTMLImageElement | null;
  }>({
    background: null,
    middleground1: null,
    middleground2: null,
    foreground: null,
    tiles: null,
    player: null,
    enemies: null,
    thorn: null,
    coffee: null,
    restart_icon: null,
  });

  // Load and cache flappybird assets
  const flappyAssetsRef = useRef<{
    background: HTMLImageElement | null;
    bird: HTMLImageElement | null;
    pipe: HTMLImageElement | null;
  }>({
    background: null,
    bird: null,
    pipe: null,
  });

  // Load and cache flowerdefense assets
  const flowerAssetsRef = useRef<{
    card: HTMLImageElement | null;
    coin: HTMLImageElement | null;
    flower: HTMLImageElement | null;
    flower2: HTMLImageElement | null;
    flower3: HTMLImageElement | null;
    grid: HTMLImageElement | null;
    leaf: HTMLImageElement | null;
    miniFlower: HTMLImageElement | null;
    shopButton: HTMLImageElement | null;
    sunrays: HTMLImageElement | null;
    tileset: HTMLImageElement | null;
    tiro: HTMLImageElement | null;
    momo: HTMLImageElement | null;
    arena: HTMLImageElement | null;
  }>({
    card: null,
    coin: null,
    flower: null,
    flower2: null,
    flower3: null,
    grid: null,
    leaf: null,
    miniFlower: null,
    shopButton: null,
    sunrays: null,
    tileset: null,
    tiro: null,
    momo: null,
    arena: null,
  });

  useEffect(() => {
    const assets = {
      background: runnerBackground,
      middleground1: runnerMiddleground1,
      middleground2: runnerMiddleground2,
      foreground: runnerForeground,
      tiles: runnerTiles,
      player: runnerPlayer,
      enemies: runnerEnemies,
      thorn: runnerThorn,
      coffee: runnerCoffee,
      restart_icon: runnerRestartIcon,
    };

    Object.entries(assets).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        runnerAssetsRef.current[key as keyof typeof assets] = img;
      };
    });

    const flappyAssets = {
      background: flappyBackground,
      bird: flappyBird,
      pipe: flappyPipe,
    };

    Object.entries(flappyAssets).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        flappyAssetsRef.current[key as keyof typeof flappyAssets] = img;
      };
    });

    const flowerAssets = {
      card: fCard,
      coin: fCoin,
      flower: fFlower,
      flower2: fFlower2,
      flower3: fFlower3,
      grid: fGrid,
      leaf: fLeaf,
      miniFlower: fMiniFlower,
      shopButton: fShopButton,
      sunrays: fSunrays,
      tileset: fTileset,
      tiro: fTiro,
      momo: fMomo,
      arena: fArena,
    };

    Object.entries(flowerAssets).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        flowerAssetsRef.current[key as keyof typeof flowerAssets] = img;
      };
    });
  }, []);

  // Platformer (Flappy) Character & Obstacles refs
  const platformerY = useRef(140);
  const platformerVy = useRef(0);
  const platformerPipesRef = useRef<FlappyPipe[]>([]);

  // Flower Defense specific references
  const flowerCoinsRef = useRef(15);
  const flowerPlacementModeRef = useRef(false);
  const flowerHoverXRef = useRef(0);
  const flowerHoverYRef = useRef(0);
  const flowerMotherHpRef = useRef(10);
  const flowerMotherLastFiredRef = useRef(0);

  // Sound Sync toggling
  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    synths.soundEnabled = nextVal;
    synths.playClick();
  };

  const handleReset = () => {
    synths.playSuccess();
    setConfig({
      spawnInterval: 1.5,
      engineSpeed: 1.0,
      entityLimit: 120,
      physicsTickRate: 60,
    });
    resetGame();
  };

  // Triggers state reset based on current selection
  const resetGame = () => {
    scoreRef.current = 0;
    frameCountRef.current = 0;
    lastSpawnTimeRef.current = 0;
    enemiesRef.current = [];
    bulletsRef.current = [];
    particlesRef.current = [];
    runnerObstaclesRef.current = [];
    platformerPipesRef.current = [];

    if (activeCategory === 'defence') {
      livesRef.current = 10;
      flowerMotherHpRef.current = 10;
      flowerCoinsRef.current = 15;
      flowerPlacementModeRef.current = false;
      flowerMotherLastFiredRef.current = 0;
      // Pre-add 1 helper flower on the board
      turretsRef.current = [
        { x: 310, y: 145, range: 100, fireCooldown: 700, lastFired: 0, color: '#ffff00' },
      ];
    } else {
      livesRef.current = 1;
    }

    if (activeCategory === 'runner') {
      runnerY.current = 210;
      runnerVy.current = 0;
      runnerIsGrounded.current = true;
    }

    if (activeCategory === 'platformer') {
      platformerY.current = 130;
      platformerVy.current = 0;
    }

    gameStateRef.current = 'playing';
    setGameStats(prev => ({
      ...prev,
      score: 0,
      lives: livesRef.current,
      gameState: 'playing',
    }));
  };

  // Setup input handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStateRef.current === 'gameover') {
        if (e.key === ' ' || e.key === 'Enter' || e.key.toLowerCase() === 'r') {
          resetGame();
        }
        return;
      }
      if (gameStateRef.current === 'idle') {
        if (e.key === ' ' || e.key === 'Enter') {
          resetGame();
        }
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        handleJumpAction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCategory]);

  // Handle Action Trigger (Jump/Flap)
  const handleJumpAction = () => {
    if (gameStateRef.current !== 'playing') {
      resetGame();
      return;
    }

    if (activeCategory === 'runner' && runnerIsGrounded.current) {
      runnerVy.current = -11; // Jumping velocity force
      runnerIsGrounded.current = false;
      synths.playClick();
      // Particles feedback
      spawnParticles(100, runnerY.current + 20, '#00f0ff', 6);
    } else if (activeCategory === 'platformer') {
      platformerVy.current = -5.8; // Upward thruster
      synths.playClick();
      // Jetpack sparks
      spawnParticles(120 - 15, platformerY.current + 10, '#ff007f', 4);
    }
  };

  // Helper helper to blow up items
  const spawnParticles = (x: number, y: number, color: string, count = 10) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        color,
        size: Math.random() * 3 + 1.5,
        life: 0,
        maxLife: Math.random() * 20 + 15,
      });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 500;
    const y = ((e.clientY - rect.top) / rect.height) * 270;
    flowerHoverXRef.current = x;
    flowerHoverYRef.current = y;
  };

  const handleCanvasMouseLeave = () => {
    flowerHoverXRef.current = -999;
    flowerHoverYRef.current = -999;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Responsive scale-aware coordinate mapping (logical 500x270 viewport)
    const x = ((e.clientX - rect.left) / rect.width) * 500;
    const y = ((e.clientY - rect.top) / rect.height) * 270;

    if (gameStateRef.current !== 'playing') {
      resetGame();
      return;
    }

    if (activeCategory === 'defence') {
      // 1. Check if clicked on the bottom-left shop card (x: 10..46, y: 208..260)
      if (x >= 10 && x <= 46 && y >= 208 && y <= 260) {
        flowerPlacementModeRef.current = !flowerPlacementModeRef.current;
        synths.playClick();
        return;
      }

      // 2. Clicked on the board
      if (flowerPlacementModeRef.current) {
        // Out of bounds check
        if (x < 15 || y < 15 || x > 485 || y > 255) {
          synths.playError();
          return;
        }

        // Cost check (Mini Flower costs 5 coins)
        if (flowerCoinsRef.current < 5) {
          synths.playError();
          return;
        }

        // Too close to Mother Flower (250, 135)
        const dxMother = 250 - x;
        const dyMother = 135 - y;
        if (Math.sqrt(dxMother * dxMother + dyMother * dyMother) < 32) {
          synths.playError();
          return;
        }

        // Space overlap check with existing mini flowers
        const spaceOverlap = turretsRef.current.some(t => {
          const dx = t.x - x;
          const dy = t.y - y;
          return Math.sqrt(dx * dx + dy * dy) < 18;
        });

        if (spaceOverlap) {
          synths.playError();
          return;
        }

        // Placement succeeds!
        flowerCoinsRef.current -= 5;
        turretsRef.current.push({
          x: Math.floor(x),
          y: Math.floor(y),
          range: 100,
          fireCooldown: 700,
          lastFired: 0,
          color: '#ffff00',
        });

        synths.playClick();
        spawnParticles(x, y, '#39ff14', 12);
        flowerPlacementModeRef.current = false;
      }
    } else {
      // In Runner or Platformer, click acts as a jump/flap action!
      handleJumpAction();
    }
  };

  // Launch fresh game when changing active tabs
  useEffect(() => {
    resetGame();
  }, [activeCategory]);

  // CORE COMBINED ARCADE ENGINES GAME LOOP
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let enemyIdTicker = 0;

    const loop = () => {
      // Background and cleaning
      ctx.fillStyle = '#06070c';
      ctx.fillRect(0, 0, 500, 270);

      // Neon grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 500; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 270);
        ctx.stroke();
      }
      for (let i = 0; i < 270; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(500, i);
        ctx.stroke();
      }

      if (!isPlaying) {
        // Paused feedback
        drawGameDetails(ctx);
        drawPausedOverlay(ctx);
        animId = requestAnimationFrame(loop);
        return;
      }

      frameCountRef.current++;
      const speed = config.engineSpeed;
      const physicsTickRatio = config.physicsTickRate / 60; // default 60hz smooth

      // -------------------------------------------------------------
      // SUB GAME 1: FLOWER DEFENSE
      // -------------------------------------------------------------
      if (activeCategory === 'defence') {
        const now = Date.now();

        // 1. Draw beautiful Grass Backdrop
        const arenaBg = flowerAssetsRef.current.arena;
        if (arenaBg && arenaBg.complete && arenaBg.naturalWidth > 0) {
          ctx.drawImage(arenaBg, 0, 0, 500, 270);
        } else {
          // Visual grass fallback
          ctx.fillStyle = '#62c332';
          ctx.fillRect(0, 0, 500, 270);
          const gridImg = flowerAssetsRef.current.grid;
          if (gridImg && gridImg.complete && gridImg.naturalWidth > 0) {
            for (let x = 0; x < 500; x += 32) {
              for (let y = 0; y < 270; y += 32) {
                ctx.drawImage(gridImg, x, y);
              }
            }
          }
        }

        // 2. Overlay magical slowly moving morning sunrays
        const sunImg = flowerAssetsRef.current.sunrays;
        if (sunImg && sunImg.complete && sunImg.naturalWidth > 0) {
          ctx.save();
          ctx.globalAlpha = 0.16;
          const sunScroll = (frameCountRef.current * 0.12 * speed) % 128;
          for (let x = -sunScroll; x < 500 + 128; x += 128) {
            ctx.drawImage(sunImg, x, 0, 128, 270);
          }
          ctx.restore();
        }

        // 3. Spawn Momo slime enemies around the map edges
        const spawnDelay = (config.spawnInterval * 1250) / speed;
        if (gameStateRef.current === 'playing' && now - lastSpawnTimeRef.current > spawnDelay) {
          if (enemiesRef.current.length < config.entityLimit) {
            // Generate random spawn points on perimeter of 500x270 rectangle
            let sx = 0, sy = 0;
            const borderRoll = Math.random();
            if (borderRoll < 0.25) {
              sx = -16;
              sy = Math.random() * 270;
            } else if (borderRoll < 0.5) {
              sx = 516;
              sy = Math.random() * 270;
            } else if (borderRoll < 0.75) {
              sx = Math.random() * 500;
              sy = -16;
            } else {
              sx = Math.random() * 500;
              sy = 286;
            }

            enemiesRef.current.push({
              id: enemyIdTicker++,
              x: sx,
              y: sy,
              hp: 12 + Math.floor(scoreRef.current * 0.08),
              maxHp: 12 + Math.floor(scoreRef.current * 0.08),
              speed: (0.75 + Math.random() * 0.35) * physicsTickRatio,
              nodeIndex: 0,
              color: '#5cceee',
            });
          }
          lastSpawnTimeRef.current = now;
        }

        // 4. Update & Draw Momo slime enemies crawling towards center (250, 135)
        if (gameStateRef.current === 'playing') {
          for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
            const enemy = enemiesRef.current[i];
            const dx = 250 - enemy.x;
            const dy = 135 - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 20) {
              // Reached Mother Flower!
              flowerMotherHpRef.current -= 1;
              livesRef.current = Math.max(0, flowerMotherHpRef.current);
              synths.playError();
              spawnParticles(enemy.x, enemy.y, '#e76f51', 12);
              enemiesRef.current.splice(i, 1);

              if (flowerMotherHpRef.current <= 0) {
                flowerMotherHpRef.current = 0;
                livesRef.current = 0;
                gameStateRef.current = 'gameover';
                setHighScores(prev => ({
                  ...prev,
                  defence: Math.max(prev.defence, scoreRef.current),
                }));
              }
              continue;
            } else {
              // Crawl towards center
              enemy.x += (dx / dist) * enemy.speed * speed;
              enemy.y += (dy / dist) * enemy.speed * speed;
            }

            // Draw animated Momo slime sprite sheet
            const momoImg = flowerAssetsRef.current.momo;
            if (momoImg && momoImg.complete && momoImg.naturalWidth > 0) {
              const animCol = Math.floor(frameCountRef.current / 8) % 4;
              const sx = animCol * 32;
              const sy = 0; // Row 0 is standard walk crawl
              ctx.drawImage(momoImg, sx, sy, 32, 32, enemy.x - 16, enemy.y - 16, 32, 32);
            } else {
              // Vector mint green fallback
              ctx.fillStyle = '#5cceee';
              ctx.beginPath();
              ctx.arc(enemy.x, enemy.y, 8, 0, Math.PI * 2);
              ctx.fill();
            }

            // Active HP Health bar
            if (enemy.hp < enemy.maxHp) {
              const hpW = (enemy.hp / enemy.maxHp) * 14;
              ctx.fillStyle = 'rgba(0,0,0,0.5)';
              ctx.fillRect(enemy.x - 7, enemy.y - 14, 14, 2.5);
              ctx.fillStyle = '#39ff14';
              ctx.fillRect(enemy.x - 7, enemy.y - 14, hpW, 2.5);
            }
          }
        }

        // 5. Draw center Mother Flower with slow breathing idle animation
        const flowerFrame = Math.floor(frameCountRef.current / 10) % 3;
        const mainFlowerImg = flowerFrame === 0 
          ? flowerAssetsRef.current.flower 
          : flowerFrame === 1 
          ? flowerAssetsRef.current.flower2 
          : flowerAssetsRef.current.flower3;

        if (mainFlowerImg && mainFlowerImg.complete && mainFlowerImg.naturalWidth > 0) {
          ctx.drawImage(mainFlowerImg, 230, 117.5, 40, 35);
        } else {
          // Yellow beautiful flower placeholder
          ctx.fillStyle = '#fffc33';
          ctx.beginPath();
          ctx.arc(250, 135, 18, 0, Math.PI * 2);
          ctx.fill();
        }

        // Mother Flower HP status header
        const mainHpRatio = flowerMotherHpRef.current / 10;
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fillRect(230, 110, 40, 3);
        ctx.fillStyle = mainHpRatio > 0.4 ? '#39ff14' : '#ff0055';
        ctx.fillRect(230, 110, 40 * mainHpRatio, 3);

        // Mother Flower automatic shooting logic
        if (gameStateRef.current === 'playing' && enemiesRef.current.length > 0) {
          // Look for nearest target in range 150
          let closestEnemy: Enemy | null = null;
          let closestDist = 150;
          enemiesRef.current.forEach(e => {
            const dx = e.x - 250;
            const dy = e.y - 135;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < closestDist) {
              closestDist = dist;
              closestEnemy = e;
            }
          });

          // Mother Flower shoots every 650ms / speed (39 frames approx)
          const lastFiredMother = flowerMotherLastFiredRef.current;
          if (closestEnemy && now - lastFiredMother > (650 / speed)) {
            flowerMotherLastFiredRef.current = now;
            bulletsRef.current.push({
              x: 250,
              y: 130,
              vx: ((closestEnemy.x - 250) / closestDist) * 4.2,
              vy: ((closestEnemy.y - 130) / closestDist) * 4.2,
              damage: 4,
              color: '#39ff14',
            });
            // Shoot leaf sparkles
            spawnParticles(250, 130, '#39ff14', 3);
          }
        }

        // 6. Draw Helper Mini-Flowers & autonomous firing
        const miniFlowerImg = flowerAssetsRef.current.miniFlower;
        turretsRef.current.forEach(tur => {
          if (miniFlowerImg && miniFlowerImg.complete && miniFlowerImg.naturalWidth > 0) {
            ctx.drawImage(miniFlowerImg, tur.x - 7.5, tur.y - 9, 15, 18);
          } else {
            ctx.fillStyle = '#ffb703';
            ctx.beginPath();
            ctx.arc(tur.x, tur.y - 2, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#4caf50';
            ctx.fillRect(tur.x - 1, tur.y + 3, 2, 4);
          }

          // Shoots nearby slimes (range 100)
          if (gameStateRef.current === 'playing' && enemiesRef.current.length > 0) {
            let clEnemy: Enemy | null = null;
            let clDist = tur.range;
            enemiesRef.current.forEach(e => {
              const dx = e.x - tur.x;
              const dy = e.y - tur.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < clDist) {
                clDist = dist;
                clEnemy = e;
              }
            });

            if (clEnemy && now - tur.lastFired > (tur.fireCooldown / speed)) {
              bulletsRef.current.push({
                x: tur.x,
                y: tur.y - 3,
                vx: ((clEnemy.x - tur.x) / clDist) * 4.5,
                vy: ((clEnemy.y - (tur.y - 3)) / clDist) * 4.5,
                damage: 3,
                color: '#ffff00',
              });
              tur.lastFired = now;
              spawnParticles(tur.x, tur.y - 3, '#ffff00', 2);
            }
          }
        });

        // 7. Update, Collision & Render seed Projectiles
        for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
          const bullet = bulletsRef.current[i];
          bullet.x += bullet.vx * speed;
          bullet.y += bullet.vy * speed;

          // Border cull
          if (bullet.x < -10 || bullet.x > 510 || bullet.y < -10 || bullet.y > 280) {
            bulletsRef.current.splice(i, 1);
            continue;
          }

          // Draw seed fTiro bullet
          const tiroImg = flowerAssetsRef.current.tiro;
          if (tiroImg && tiroImg.complete && tiroImg.naturalWidth > 0) {
            ctx.drawImage(tiroImg, bullet.x - 8, bullet.y - 8, 16, 16);
          } else {
            ctx.fillStyle = bullet.color;
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2);
            ctx.fill();
          }

          // Collisions checking
          if (gameStateRef.current === 'playing') {
            let didHit = false;
            for (let j = enemiesRef.current.length - 1; j >= 0; j--) {
              const enemy = enemiesRef.current[j];
              const bdx = enemy.x - bullet.x;
              const bdy = enemy.y - bullet.y;
              const bdist = Math.sqrt(bdx * bdx + bdy * bdy);

              if (bdist < 15) {
                enemy.hp -= bullet.damage;
                spawnParticles(bullet.x, bullet.y, '#ffff00', 4);
                didHit = true;

                if (enemy.hp <= 0) {
                  synths.playClick();
                  spawnParticles(enemy.x, enemy.y, '#5cceee', 12);
                  scoreRef.current += 10;
                  flowerCoinsRef.current += 1;
                  enemiesRef.current.splice(j, 1);
                }
                break;
              }
            }

            if (didHit) {
              bulletsRef.current.splice(i, 1);
            }
          }
        }

        // 8. Draw HUD: gold Coin Count Displays
        const coinImg = flowerAssetsRef.current.coin;
        if (coinImg && coinImg.complete && coinImg.naturalWidth > 0) {
          const coinFrame = Math.floor(frameCountRef.current / 6) % 4;
          const cs = coinFrame * 16;
          ctx.drawImage(coinImg, cs, 0, 16, 16, 15, 12, 16, 16);
        } else {
          // Yellow coin vector backup
          ctx.fillStyle = '#ffb703';
          ctx.beginPath();
          ctx.arc(23, 20, 7, 0, Math.PI * 2);
          ctx.fill();
        }

        // Number count text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px "Space Grotesk", sans-serif';
        ctx.textAlign = 'left';
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#000000';
        ctx.strokeText(`× ${flowerCoinsRef.current}`, 36, 24);
        ctx.fillText(`× ${flowerCoinsRef.current}`, 36, 24);

        // 9. Draw shop helper Mini Flower Card Button (Bottom-left corner)
        const fCardImg = flowerAssetsRef.current.card;
        if (fCardImg && fCardImg.complete && fCardImg.naturalWidth > 0) {
          ctx.drawImage(fCardImg, 10, 208, 36, 52);
          
          // Render miniature helper flower inside card bounds
          if (miniFlowerImg && miniFlowerImg.complete && miniFlowerImg.naturalWidth > 0) {
            ctx.drawImage(miniFlowerImg, 20.5, 218, 15, 18);
          }
        } else {
          // Card Box background
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.fillRect(10, 208, 36, 52);
          ctx.strokeStyle = '#ffffff';
          ctx.strokeRect(10, 208, 36, 52);
          if (miniFlowerImg && miniFlowerImg.complete && miniFlowerImg.naturalWidth > 0) {
            ctx.drawImage(miniFlowerImg, 20.5, 218, 15, 18);
          }
        }

        // Price indicator underneath the card
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeText('5 C', 28, 252);
        ctx.fillText('5 C', 28, 252);

        // Draw neon border highlighter if active
        if (flowerPlacementModeRef.current) {
          ctx.strokeStyle = '#ffb703';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(9.5, 207.5, 37, 53);
        }

        // 10. Draw placement hover preview holographic
        if (flowerPlacementModeRef.current && flowerHoverXRef.current > 0 && flowerHoverXRef.current < 500) {
          const hx = flowerHoverXRef.current;
          const hy = flowerHoverYRef.current;

          // Check if coordinate is valid (within grass bounds, not too close to Mother or other plants, and fits coin budget)
          const dxM = 250 - hx;
          const dyM = 135 - hy;
          const motherDistance = Math.sqrt(dxM * dxM + dyM * dyM);

          const plantDistanceOk = !turretsRef.current.some(t => {
            const tdx = t.x - hx;
            const tdy = t.y - hy;
            return Math.sqrt(tdx * tdx + tdy * tdy) < 18;
          });

          const isInsideGrass = hx >= 15 && hx <= 485 && hy >= 15 && hy <= 255;
          const isMotherDistanceOk = motherDistance >= 32;
          const hasBudget = flowerCoinsRef.current >= 5;

          const placementValid = isInsideGrass && isMotherDistanceOk && plantDistanceOk && hasBudget;

          ctx.save();
          // Transparent preview circle range
          ctx.beginPath();
          ctx.arc(hx, hy, 100, 0, Math.PI * 2);
          ctx.fillStyle = placementValid ? 'rgba(57, 255, 20, 0.12)' : 'rgba(255, 0, 85, 0.12)';
          ctx.fill();
          ctx.strokeStyle = placementValid ? 'rgba(57, 255, 20, 0.35)' : 'rgba(255, 0, 85, 0.35)';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Render semi-transparent mini flower
          ctx.globalAlpha = 0.55;
          if (miniFlowerImg && miniFlowerImg.complete && miniFlowerImg.naturalWidth > 0) {
            ctx.drawImage(miniFlowerImg, hx - 7.5, hy - 9, 15, 18);
          } else {
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.arc(hx, hy, 5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      // -------------------------------------------------------------
      // SUB GAME 2: UNLIMITED RUNNER
      // -------------------------------------------------------------
      if (activeCategory === 'runner') {
        const floorY = 210;

        // Helper to draw scrolling full-canvas parallax layers safely holding a fallback
        const drawScrollingParallax = (img: HTMLImageElement | null, speedFactor: number) => {
          if (img && img.complete && img.naturalWidth > 0) {
            const scrollX = (frameCountRef.current * speedFactor * speed) % 500;
            ctx.drawImage(img, -scrollX, 0, 500, 270);
            ctx.drawImage(img, 500 - scrollX, 0, 500, 270);
          }
        };

        // Render multi-layer pixel art parallax environment backdrop
        drawScrollingParallax(runnerAssetsRef.current.background, 0.15);
        drawScrollingParallax(runnerAssetsRef.current.middleground1, 0.4);
        drawScrollingParallax(runnerAssetsRef.current.middleground2, 0.95);

        // Draw foreground overlay layer with proportional width & height (320x64 scale -> 500x100) placed at the bottom
        const foregroundImg = runnerAssetsRef.current.foreground;
        if (foregroundImg && foregroundImg.complete && foregroundImg.naturalWidth > 0) {
          const fgScrollX = (frameCountRef.current * 1.7 * speed) % 500;
          ctx.drawImage(foregroundImg, -fgScrollX, 170, 500, 100);
          ctx.drawImage(foregroundImg, 500 - fgScrollX, 170, 500, 100);
        }

        // Draw the ground (tiled with tiles.png or retro neon line fallback)
        const floorImg = runnerAssetsRef.current.tiles;
        if (floorImg && floorImg.complete && floorImg.naturalWidth > 0) {
          const stepSize = 16;
          const groundScrollX = (frameCountRef.current * 4 * speed) % stepSize;
          for (let x = -groundScrollX; x < 505 + stepSize; x += stepSize) {
            // Row 1 (top surface): slice top-center tile [1, 0] at (16,0,16,16), draw at (x, 222)
            ctx.drawImage(floorImg, 16, 0, 16, 16, x, 222, 16, 16);
            // Row 2 (middle fill): slice mid-center tile [1, 1] at (16,16,16,16), draw at (x, 238)
            ctx.drawImage(floorImg, 16, 16, 16, 16, x, 238, 16, 16);
            // Row 3 (bottom fill): slice mid-center tile [1, 1] at (16,16,16,16), draw at (x, 254)
            ctx.drawImage(floorImg, 16, 16, 16, 16, x, 254, 16, 16);
          }
        } else {
          // Draw fallback retro electric grid floor
          ctx.strokeStyle = '#39ff14';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, floorY + 12);
          ctx.lineTo(500, floorY + 12);
          ctx.stroke();

          ctx.strokeStyle = 'rgba(57, 255, 20, 0.2)';
          ctx.lineWidth = 2;
          const tickMove = (frameCountRef.current * 4 * speed) % 40;
          for (let x = 500 - tickMove; x >= 0; x -= 40) {
            ctx.beginPath();
            ctx.moveTo(x, floorY + 12);
            ctx.lineTo(x - 20, 270);
            ctx.stroke();
          }
        }

        // Draw Player Ship / Cat Sprite
        const px = 80;
        if (gameStateRef.current === 'playing') {
          // Apply gravity
          runnerY.current += runnerVy.current * speed;
          runnerVy.current += 0.44 * physicsTickRatio;

          if (runnerY.current >= floorY - 10) {
            runnerY.current = floorY - 10;
            runnerVy.current = 0;
            runnerIsGrounded.current = true;
          }

          // Auto score points passively
          if (frameCountRef.current % 8 === 0) {
            scoreRef.current += 1;
          }
        }

        // Draw player cat avatar with fallback (player.png has 48x48 frames)
        const playerImg = runnerAssetsRef.current.player;
        if (playerImg && playerImg.complete && playerImg.naturalWidth > 0) {
          let sx = 0;
          let sy = 0;
          
          if (gameStateRef.current === 'playing') {
            if (runnerIsGrounded.current) {
              // Running: animate columns 0 to 5 on Row 0
              const animFrame = Math.floor(frameCountRef.current / 4) % 6;
              sx = animFrame * 48;
              sy = 0;
            } else {
              // Jumping: rising or falling
              if (runnerVy.current < 0) {
                // Rising: Row 1, Column 0
                sx = 0;
                sy = 48;
              } else {
                // Falling: Row 2, Column 0
                sx = 0;
                sy = 96;
              }
            }
          } else {
            // Idle/Dead/Menu screen: Row 0, Column 0
            sx = 0;
            sy = 0;
          }

          // Draw frame with bottom edge aligned at runnerY.current + 10
          ctx.drawImage(playerImg, sx, sy, 48, 48, px - 24, runnerY.current - 21, 48, 48);
        } else {
          ctx.fillStyle = '#00f0ff';
          ctx.fillRect(px - 10, runnerY.current - 10, 18, 18);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(px - 10, runnerY.current - 10, 18, 18);
        }

        // Flame booster trail particle feedback
        if (!runnerIsGrounded.current && gameStateRef.current === 'playing') {
          ctx.fillStyle = '#ff0055';
          ctx.fillRect(px - 14, runnerY.current + 2, 4, 4);
        }

        // Spawn Obstacles, Enemies, and Coffee Powerups
        const spawnPeriod = (config.spawnInterval * 1200) / speed;
        const now = Date.now();
        if (gameStateRef.current === 'playing' && now - lastSpawnTimeRef.current > spawnPeriod) {
          if (runnerObstaclesRef.current.length < config.entityLimit) {
            const rand = Math.random();
            let type: 'thorn' | 'enemy' | 'coffee' = 'thorn';
            let h = 18;
            let width = 18;
            let yVal = floorY - h + 10;
            
            if (rand < 0.45) {
              type = 'thorn';
              h = 16;
              width = 16;
              yVal = floorY - h + 12; // flats down to floor tiles
            } else if (rand < 0.75) {
              type = 'enemy';
              h = 22;
              width = 22;
              yVal = Math.random() > 0.5 ? floorY - 14 : floorY - 45; // flying or ground level
            } else {
              type = 'coffee';
              h = 16;
              width = 16;
              yVal = floorY - 32 - Math.random() * 32; // hovering floating coffee
            }

            runnerObstaclesRef.current.push({
              id: Math.random(),
              x: 500,
              y: yVal,
              width: width,
              height: h,
              speed: (3.2 + Math.random() * 0.8) * physicsTickRatio,
              passed: false,
              type: type,
              pulseAnim: 0
            });
          }
          lastSpawnTimeRef.current = now;
        }

        // Update and draw Obstacles/Items loop
        runnerObstaclesRef.current.forEach((obs, idx) => {
          if (gameStateRef.current === 'playing') {
            obs.x -= obs.speed * speed;
          }

          const obsType = obs.type || 'thorn';

          if (obsType === 'thorn') {
            const thornImg = runnerAssetsRef.current.thorn;
            if (thornImg && thornImg.complete && thornImg.naturalWidth > 0) {
              ctx.drawImage(thornImg, obs.x, obs.y, obs.width, obs.height);
            } else {
              // Vector pink triangle fallback spikes
              ctx.fillStyle = '#ff007f';
              ctx.beginPath();
              ctx.moveTo(obs.x, obs.y + obs.height);
              ctx.lineTo(obs.x + obs.width / 2, obs.y);
              ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
              ctx.closePath();
              ctx.fill();
              ctx.strokeStyle = '#ffffff';
              ctx.stroke();
            }
          } else if (obsType === 'enemy') {
            const enemyImg = runnerAssetsRef.current.enemies;
            if (enemyImg && enemyImg.complete && enemyImg.naturalWidth > 0) {
              // Add floating/hover wobble pathing
              const hoverOffset = Math.sin(frameCountRef.current * 0.12) * 2.5;
              
              // Find if this is a flying or walking enemy by its yVal (ground level is around floorY - 14, flying is higher)
              const isFlying = obs.y < floorY - 25;
              
              let sx = 0;
              let sy = 0;
              let animFrame = 0;
              let bottomOffset = 30; // base bottom in sprite coords
              
              if (isFlying) {
                // Flying drone: Row 1, Columns 0 and 1
                animFrame = Math.floor(frameCountRef.current / 6) % 2;
                sx = animFrame * 48;
                sy = 48;
                bottomOffset = 31;
              } else {
                // Walking robot: Row 0, Columns 0, 1, 2
                animFrame = Math.floor(frameCountRef.current / 6) % 3;
                sx = animFrame * 48;
                sy = 0;
                bottomOffset = 30;
              }

              // Center the 48px sprite on the obstacle's horizontal center
              const cx = obs.x + obs.width / 2;
              const dx = cx - 24;
              // Align bottom edge
              const dy = (obs.y + obs.height) - bottomOffset + hoverOffset;
              
              ctx.drawImage(enemyImg, sx, sy, 48, 48, dx, dy, 48, 48);
            } else {
              ctx.fillStyle = '#ff007f';
              ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
              ctx.strokeStyle = '#ffffff';
              ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

              ctx.fillStyle = '#ffff00';
              ctx.fillRect(obs.x + 2, obs.y, obs.width - 4, 3);
            }
          } else if (obsType === 'coffee') {
            const coffeeImg = runnerAssetsRef.current.coffee;
            const floatOffset = Math.sin(frameCountRef.current * 0.1) * 3;
            if (coffeeImg && coffeeImg.complete && coffeeImg.naturalWidth > 0) {
              const animFrame = Math.floor(frameCountRef.current / 5) % 5;
              const sx = animFrame * 17;
              // Draw 17x18 coffee frame centered on 16x16 obs body
              ctx.drawImage(coffeeImg, sx, 0, 17, 18, obs.x - 0.5, obs.y + floatOffset - 1, 17, 18);
            } else {
              // Glowing booster battery fallback
              ctx.fillStyle = '#39ff14';
              ctx.beginPath();
              ctx.arc(obs.x + obs.width/2, obs.y + obs.height/2 + floatOffset, obs.width/2, 0, Math.PI * 2);
              ctx.fill();
              ctx.strokeStyle = '#ffffff';
              ctx.stroke();
            }
          }

          // Off-screen cleanup
          if (obs.x < -40) {
            runnerObstaclesRef.current.splice(idx, 1);
            return;
          }

          // Collisions & Collections logic
          if (gameStateRef.current === 'playing') {
            const runnerLeft = px - 10;
            const runnerRight = px + 8;
            const runnerTop = runnerY.current - 14;
            const runnerBottom = runnerY.current + 10;

            if (
              runnerRight > obs.x &&
              runnerLeft < obs.x + obs.width &&
              runnerBottom > obs.y &&
              runnerTop < obs.y + obs.height
            ) {
              if (obsType === 'coffee') {
                // Collect delicious hot coffee!
                scoreRef.current += 20; // 20 bonus points!
                synths.playSuccess();
                spawnParticles(obs.x + obs.width / 2, obs.y + obs.height / 2, '#39ff14', 10);
                runnerObstaclesRef.current.splice(idx, 1);
              } else {
                // Collision with spiked thorn or flying monster -> game over!
                gameStateRef.current = 'gameover';
                synths.playError();
                spawnParticles(px, runnerY.current, '#ff0055', 20);

                setHighScores(prev => ({
                  ...prev,
                  runner: Math.max(prev.runner, scoreRef.current),
                }));
              }
            }
          }
        });
      }

      // -------------------------------------------------------------
      // SUB GAME 3: PHYSICS PLATFORMER (FLAPPY SPACE)
      // -------------------------------------------------------------
      if (activeCategory === 'platformer') {
        const px = 100;

        // Draw parallax Flappy retro background
        const bgImg = flappyAssetsRef.current.background;
        if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
          const bgScrollX = (frameCountRef.current * 0.35 * speed) % 256;
          ctx.drawImage(bgImg, -bgScrollX, 0, 256, 270);
          ctx.drawImage(bgImg, 256 - bgScrollX, 0, 256, 270);
          ctx.drawImage(bgImg, 512 - bgScrollX, 0, 256, 270);
        }

        if (gameStateRef.current === 'playing') {
          // Physics step gravity
          platformerVy.current += 0.28 * physicsTickRatio;
          platformerY.current += platformerVy.current * speed;

          // Boundary death check
          if (platformerY.current < 5 || platformerY.current > 240) {
            gameStateRef.current = 'gameover';
            synths.playError();
            spawnParticles(px, platformerY.current, '#ffff00', 16);
            
            setHighScores(prev => ({
              ...prev,
              platformer: Math.max(prev.platformer, scoreRef.current),
            }));
          }
        }

        // Draw animated rotating flappy bird character
        const birdImg = flappyAssetsRef.current.bird;
        if (birdImg && birdImg.complete && birdImg.naturalWidth > 0) {
          ctx.save();
          ctx.translate(px, platformerY.current);
          
          let angle = platformerVy.current * 0.08;
          if (angle < -0.45) angle = -0.45;
          if (angle > 0.85) angle = 0.85;
          ctx.rotate(angle);

          let frameIndex = 0;
          if (gameStateRef.current === 'playing') {
            frameIndex = Math.floor(frameCountRef.current / 4) % 4;
          } else {
            frameIndex = 0;
          }
          const sx = frameIndex * 16;
          // Draw nicely centered 26x26 flappy bird
          ctx.drawImage(birdImg, sx, 0, 16, 16, -13, -13, 26, 26);
          ctx.restore();
        } else {
          // Fallback ship vector drawing
          ctx.fillStyle = '#ffff00';
          ctx.beginPath();
          ctx.moveTo(px - 12, platformerY.current - 8);
          ctx.lineTo(px + 12, platformerY.current);
          ctx.lineTo(px - 12, platformerY.current + 8);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();

          // Neon engine glow
          ctx.fillStyle = '#ff007f';
          ctx.fillRect(px - 15, platformerY.current - 3, 3, 6);
        }

        // Spawn Pipes
        const spawnDelay = (config.spawnInterval * 1600) / speed;
        const now = Date.now();
        if (gameStateRef.current === 'playing' && now - lastSpawnTimeRef.current > spawnDelay) {
          if (platformerPipesRef.current.length < config.entityLimit) {
            // Gap range configuration
            const gapY = 50 + Math.random() * 110;
            const gapHeight = 85;

            platformerPipesRef.current.push({
              x: 500,
              width: 32,
              topHeight: gapY,
              bottomHeight: 270 - (gapY + gapHeight),
              passed: false,
            });
          }
          lastSpawnTimeRef.current = now;
        }

        // Sliced pipe renderer helper
        const pipeImg = flappyAssetsRef.current.pipe;
        const drawPipe = (x: number, y: number, width: number, height: number, inverted: boolean) => {
          if (pipeImg && pipeImg.complete && pipeImg.naturalWidth > 0) {
            ctx.save();
            if (inverted) {
              // Top pipe (upside down)
              ctx.translate(x + width / 2, y + height / 2);
              ctx.scale(1, -1);
              
              const capH = 14;
              // Cap at the bottom edge in flipped local space
              ctx.drawImage(pipeImg, 0, 0, 32, capH, -width / 2, height / 2 - capH, width, capH);
              // Shaft
              const shaftH = height - capH;
              if (shaftH > 0) {
                ctx.drawImage(pipeImg, 0, capH, 32, 80 - capH, -width / 2, -height / 2, width, shaftH);
              }
            } else {
              // Bottom pipe
              const capH = 14;
              // Cap at top
              ctx.drawImage(pipeImg, 0, 0, 32, capH, x, y, width, capH);
              // Shaft
              const shaftH = height - capH;
              if (shaftH > 0) {
                ctx.drawImage(pipeImg, 0, capH, 32, 80 - capH, x, y + capH, width, shaftH);
              }
            }
            ctx.restore();
          } else {
            // Fallback neon green boxes
            ctx.fillStyle = '#39ff14';
            ctx.fillRect(x, y, width, height);
            ctx.strokeStyle = '#ffffff';
            ctx.strokeRect(x, y, width, height);
          }
        };

        // Update and Draw pipes
        platformerPipesRef.current.forEach((pipe, index) => {
          if (gameStateRef.current === 'playing') {
            pipe.x -= 2.6 * speed * physicsTickRatio;
          }

          // Draw top pipe
          drawPipe(pipe.x, 0, pipe.width, pipe.topHeight, true);

          // Draw bottom pipe
          const bottomY = 270 - pipe.bottomHeight;
          drawPipe(pipe.x, bottomY, pipe.width, pipe.bottomHeight, false);

          // Points score detection
          if (gameStateRef.current === 'playing' && !pipe.passed && pipe.x < px) {
            pipe.passed = true;
            scoreRef.current += 1;
            synths.playSuccess();
          }

          // Clean up off-screen pillars
          if (pipe.x < -50) {
            platformerPipesRef.current.splice(index, 1);
            return;
          }

          // Circular projection projection collision checks for absolute fairness
          if (gameStateRef.current === 'playing') {
            const birdRadius = 11;
            const birdX = px;
            const birdY = platformerY.current;

            // Top pipe intersection
            const closestTopX = Math.max(pipe.x, Math.min(birdX, pipe.x + pipe.width));
            const closestTopY = Math.max(0, Math.min(birdY, pipe.topHeight));
            const dstTopX = birdX - closestTopX;
            const dstTopY = birdY - closestTopY;
            const topCollision = (dstTopX * dstTopX + dstTopY * dstTopY) < (birdRadius * birdRadius);

            // Bottom pipe intersection
            const closestBottomX = Math.max(pipe.x, Math.min(birdX, pipe.x + pipe.width));
            const closestBottomY = Math.max(bottomY, Math.min(birdY, 270));
            const dstBottomX = birdX - closestBottomX;
            const dstBottomY = birdY - closestBottomY;
            const bottomCollision = (dstBottomX * dstBottomX + dstBottomY * dstBottomY) < (birdRadius * birdRadius);

            if (topCollision || bottomCollision) {
              gameStateRef.current = 'gameover';
              synths.playError();
              spawnParticles(px, platformerY.current, '#ff003c', 15);
              
              setHighScores(prev => ({
                ...prev,
                platformer: Math.max(prev.platformer, scoreRef.current),
              }));
            }
          }
        });
      }

      // Draw active sparks/explosions particles everywhere
      particlesRef.current.forEach((pt, index) => {
        pt.x += pt.vx * speed;
        pt.y += pt.vy * speed;
        pt.life++;

        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(0.2, pt.size * (1 - pt.life / pt.maxLife)), 0, Math.PI * 2);
        ctx.fill();

        if (pt.life >= pt.maxLife) {
          particlesRef.current.splice(index, 1);
        }
      });

      // Renders text feedback on canvas
      drawGameDetails(ctx);

      // Sync refs to dynamic telemetry React variables (throttled every couple frames to prevent block-lag)
      if (frameCountRef.current % 5 === 0) {
        let activeEntityCount = particlesRef.current.length;
        if (activeCategory === 'defence') {
          activeEntityCount += enemiesRef.current.length + turretsRef.current.length;
        } else if (activeCategory === 'runner') {
          activeEntityCount += runnerObstaclesRef.current.length + 1;
        } else if (activeCategory === 'platformer') {
          activeEntityCount += platformerPipesRef.current.length + 1;
        }

        const calculatedDraws = 12 + activeEntityCount * (activeCategory === 'defence' ? 2 : 1.5);

        setGameStats({
          score: scoreRef.current,
          lives: livesRef.current,
          gameState: gameStateRef.current,
          activeEntities: activeEntityCount,
          drawCalls: Math.floor(calculatedDraws),
          physicsMs: Number((0.8 + activeEntityCount * 0.035 * (config.physicsTickRate / 60)).toFixed(2)),
          renderingMs: Number((1.2 + calculatedDraws * 0.015 * speed).toFixed(2)),
        });
      }

      animId = requestAnimationFrame(loop);
    };

    // Sub function to details panel inside Canvas
    const drawGameDetails = (c: CanvasRenderingContext2D) => {
      // Draw Score Badge top border
      c.fillStyle = '#0a0d16';
      c.fillRect(0, 0, 500, 30);
      c.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      c.beginPath();
      c.moveTo(0, 30);
      c.lineTo(500, 30);
      c.stroke();

      // SCORE indicators font
      c.font = 'bold 11px monospace';
      c.fillStyle = '#ffffff';
      const labelScore = lang === 'pt' ? 'SCORE: ' : 'SCORE: ';
      c.fillText(`${labelScore}${scoreRef.current}`, 15, 19);

      // HIGH SCORE indicator
      const currentHS = highScores[activeCategory];
      c.fillStyle = '#ffb703';
      c.fillText(`HI: ${currentHS}`, 140, 19);

      // Lives Indicator
      if (activeCategory === 'defence') {
        const liveLabel = lang === 'pt' ? 'FLOR MÃE: ' : 'MOTHER FLR: ';
        c.fillStyle = livesRef.current <= 3 ? '#ff0055' : '#39ff14';
        c.fillText(`${liveLabel}${livesRef.current}/10`, 360, 19);
      } else {
        const hLabel = lang === 'pt' ? 'ESTADO: ONLINE' : 'STATUS: LIVE';
        c.fillStyle = gameStateRef.current === 'gameover' ? '#ff0055' : '#39ff14';
        c.fillText(gameStateRef.current === 'gameover' ? 'CRASHED_ERR' : hLabel, 360, 19);
      }

      // Draw instructions overlays in idle states
      if (gameStateRef.current === 'idle') {
        c.fillStyle = 'rgba(5, 5, 8, 0.85)';
        c.fillRect(0, 30, 500, 240);

        c.fillStyle = '#fffc33';
        c.font = 'bold 16px "Space Grotesk", sans-serif';
        c.textAlign = 'center';
        
        const ptStr = activeCategory === 'defence' ? 'FLOWER DEFENSE' : activeCategory === 'runner' ? 'GODOT RUNNER' : 'FLAPPY BIRD RETRÔ';
        const enStr = activeCategory === 'defence' ? 'FLOWER DEFENSE' : activeCategory === 'runner' ? 'GODOT RUNNER' : 'RETRO FLAPPY BIRD';
        c.fillText(lang === 'pt' ? ptStr : enStr, 250, 110);

        c.font = '11px "JetBrains Mono", monospace';
        c.fillStyle = 'rgba(255,255,255,0.6)';
        
        const ptSub = activeCategory === 'defence' 
          ? 'Clique no CARD abaixo esquerdo e depois no mapa para plantar mini flores!' 
          : activeCategory === 'platformer'
          ? 'Pressione ESPAÇO ou clique na tela para BATER AS ASAS e subir.'
          : 'Pressione ESPAÇO ou clique na tela para SALTAR obstáculos.';
        const enSub = activeCategory === 'defence'
          ? 'Click bottom-left CARD to plant mini helper flowers on the grass board!'
          : activeCategory === 'platformer'
          ? 'Press SPACE or click screen to FLAP and fly upwards.'
          : 'Press SPACE or click screen to JUMP obstacles.';

        c.fillText(lang === 'pt' ? ptSub : enSub, 250, 140);
        
        c.fillStyle = '#ff007f';
        c.fillText(lang === 'pt' ? '[ CLIQUE NA TELA PARA COMEÇAR O JOGO ]' : '[ CLICK THE SCREEN TO START GAMEPLAY ]', 250, 175);
        c.textAlign = 'left'; // restore
      }

      // Draw gameover overlay
      if (gameStateRef.current === 'gameover') {
        c.fillStyle = 'rgba(15, 2, 8, 0.9)';
        c.fillRect(0, 30, 500, 240);

        c.fillStyle = '#ff0055';
        c.font = 'bold 20px "Space Grotesk", sans-serif';
        c.textAlign = 'center';
        c.fillText(lang === 'pt' ? 'FIM DE JOGO' : 'SYSTEM CRASHED // GAME OVER', 250, 110);

        c.font = '12px "JetBrains Mono", monospace';
        c.fillStyle = '#ffffff';
        c.fillText(`${lang === 'pt' ? 'Pontuação Registrada' : 'Logged Total Score'}: ${scoreRef.current}`, 250, 145);

        c.fillStyle = '#00f0ff';
        c.fillText(lang === 'pt' ? 'pressionar ESPAÇO ou CLICAR para recomeçar' : 'press SPACE bar or CLICK screen to restart', 250, 180);
        c.textAlign = 'left'; // restore
      }
    };

    const drawPausedOverlay = (c: CanvasRenderingContext2D) => {
      c.fillStyle = 'rgba(5, 5, 8, 0.65)';
      c.fillRect(0, 30, 500, 240);
      c.fillStyle = '#ffb703';
      c.font = 'bold 16px "Space Grotesk", sans-serif';
      c.textAlign = 'center';
      c.fillText('ENGINE PAUSED', 250, 130);
      c.font = '10px "JetBrains Mono", monospace';
      c.fillStyle = 'rgba(255,255,255,0.4)';
      c.fillText('CLICK SIMULATE TO RESUME CORE MODULES', 250, 155);
      c.textAlign = 'left';
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, config, activeCategory, lang, highScores]);

  return (
    <div className="w-full glass-panel rounded-2xl overflow-hidden flex flex-col md:flex-row h-auto border border-white/10">
      
      {/* Simulation / Selector Sidebar */}
      <div className="w-full md:w-[280px] bg-white/[0.01] border-b md:border-b-0 md:border-r border-white/10 p-5 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#b5179e] uppercase font-bold flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5" />
            Unity Playable Engine v3.0
          </span>
          <h4 className="font-display font-black text-xl text-white mt-1">
            {lang === 'pt' ? 'Mini Jogo Iterativo' : 'Iterative Playground'}
          </h4>
          <p className="text-xs text-white/50 mt-2 leading-relaxed">
            {lang === 'pt' 
              ? 'Mude os parâmetros e jogue um jogo real que obedece às variáveis da engine modificadas!'
              : 'Modify parameters and play a real 2D game that updates dynamically using adjusted engine speed!'}
          </p>

          {/* Navigation categories */}
          <div className="mt-6 space-y-2">
            <CategoryTabBtn
              label={lang === 'pt' ? "Flower Defense" : "Flower Defense"}
              active={activeCategory === 'defence'}
              onClick={() => setActiveCategory('defence')}
              subtitle={lang === 'pt' ? "Defenda a Flor com mini flores" : "Protect Mother Flower with plants"}
              icon={<Heart className="w-4 h-4 text-cyber-green" />}
            />
            <CategoryTabBtn
              label={lang === 'pt' ? "Flappy Bird" : "Flappy Bird"}
              active={activeCategory === 'platformer'}
              onClick={() => setActiveCategory('platformer')}
              subtitle={lang === 'pt' ? "Voo e desvios de canos" : "Flap and dodge retro pipes"}
              icon={<Heart className="w-4 h-4 text-cyber-yellow" />}
            />
            <CategoryTabBtn
              label={lang === 'pt' ? "Godot Runner" : "Godot Runner"}
              active={activeCategory === 'runner'}
              onClick={() => setActiveCategory('runner')}
              subtitle={lang === 'pt' ? "Desvios em alta velocidade" : "Avoid obstacles at extreme h-speed"}
              icon={<Award className="w-4 h-4 text-cyber-pink" />}
            />
          </div>
        </div>

        {/* Global state controller */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold cursor-pointer transition-all ${
                isPlaying 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20' 
                  : 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20 hover:bg-cyber-cyan/20'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'PAUSE' : 'SIMULATE'}</span>
            </button>

            {/* Sound Sync Switch */}
            <button
              onClick={toggleSound}
              className={`p-1.5 rounded border transition-all cursor-pointer ${
                soundEnabled 
                  ? 'bg-cyber-green/10 text-cyber-green border-cyber-green/20 hover:bg-cyber-green/20' 
                  : 'bg-white/[0.02] border-white/5 text-white/40 hover:text-white'
              }`}
              title={soundEnabled ? 'Sons Ativos' : 'Silenciado'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
          
          <button
            onClick={handleReset}
            className="p-1.5 rounded bg-white/[0.02] border border-white/5 hover:border-white/20 text-white/60 hover:text-white cursor-pointer transition-all"
            title="Reset config variables and points"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Simulator Interface Display (Main Body) */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        
        <div>
          {/* Header Description of current Selection */}
          <div className="border-b border-white/5 pb-4 mb-4 flex flex-col lg:flex-row justify-between lg:items-center gap-2">
            <div>
              {activeCategory === 'defence' && (
                <div>
                  <span className="text-[10px] font-mono text-cyber-green tracking-widest uppercase font-bold">
                    GAME RECON: FLOWER_DEFENSE_ARENA // PLAYABLE
                  </span>
                  <h5 className="font-display font-bold text-lg text-white">
                    Flower Defense vs Memo Momo Slimes
                  </h5>
                </div>
              )}
              {activeCategory === 'runner' && (
                <div>
                  <span className="text-[10px] font-mono text-cyber-pink tracking-widest uppercase font-bold">
                    GAME RECON: RUN_SCROLL_GEN // PLAYABLE
                  </span>
                  <h5 className="font-display font-bold text-lg text-white">
                    Godot Runner
                  </h5>
                </div>
              )}
              {activeCategory === 'platformer' && (
                <div>
                  <span className="text-[10px] font-mono text-cyber-yellow tracking-widest uppercase font-bold">
                    GAME RECON: FLAP_DODGE_PIPES // PLAYABLE
                  </span>
                  <h5 className="font-display font-bold text-lg text-white">
                    Flappy Bird Pixel Retro
                  </h5>
                </div>
              )}
            </div>

            {/* Score pill helper */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono bg-white/[0.04] px-2.5 py-1 rounded text-white/50 border border-white/5 font-bold uppercase tracking-wider">
                {lang === 'pt' ? 'CO-OP ENGAGED' : 'ARCADE RUNNING'}
              </span>
            </div>
          </div>

          {/* PLAYABLE CANVAS RETRO VIEWPORT */}
          <div className="relative w-full overflow-hidden rounded-xl border border-white/15 bg-black mb-5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <canvas
              ref={canvasRef}
              width={500}
              height={270}
              onClick={handleCanvasClick}
              className="w-full aspect-[500/270] block cursor-crosshair hover:brightness-[1.1] transition-all"
            />
            {/* Tech scanner CRT lines overlays */}
            <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />
            <div className="absolute bottom-2.5 right-3 text-[8.5px] font-mono text-white/20 select-none bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm pointer-events-none">
              {lang === 'pt' ? 'AJUSTE AS VARIÁVEIS DO MOTOR ↓' : 'TWEAK THE VARIABLES BELOW ↓'}
            </div>
          </div>

          {/* Interactive sliders grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3 mb-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-white/35 uppercase tracking-widest font-bold">
                {lang === 'pt' ? 'Variáveis da Engine' : 'Tweak Engine Variables'}
              </span>
              
              {/* Slider 1: Speed */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-white/60">Time.timeScale (Speed modifier)</span>
                  <span className="text-cyber-cyan font-bold">{config.engineSpeed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="2.5"
                  step="0.1"
                  value={config.engineSpeed}
                  onChange={(e) => setConfig({ ...config, engineSpeed: parseFloat(e.target.value) })}
                  className="w-full accent-cyber-cyan bg-white/5 rounded-lg h-1 select-none cursor-pointer"
                />
              </div>

              {/* Slider 2: Spawn Waves */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-white/60">Spawn Wave Generator (Period)</span>
                  <span className="text-cyber-cyan font-bold">{config.spawnInterval}s</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="3.5"
                  step="0.1"
                  value={config.spawnInterval}
                  onChange={(e) => setConfig({ ...config, spawnInterval: parseFloat(e.target.value) })}
                  className="w-full accent-cyber-cyan bg-white/5 rounded-lg h-1 select-none cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-mono text-white/35 uppercase tracking-widest font-bold">
                {lang === 'pt' ? 'Variáveis de Física' : 'Tweak Physics Variables'}
              </span>

              {/* Slider 3: Max Active Entities */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-white/60">Active Entity Heap Limit</span>
                  <span className="text-cyber-cyan font-bold">{config.entityLimit} objs</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="10"
                  value={config.entityLimit}
                  onChange={(e) => setConfig({ ...config, entityLimit: parseInt(e.target.value) })}
                  className="w-full accent-cyber-cyan bg-white/5 rounded-lg h-1 select-none cursor-pointer"
                />
              </div>

              {/* Slider 4: Physics Tick Rate */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-white/60">FixedUpdate (Physics Precision)</span>
                  <span className="text-cyber-cyan font-bold">{config.physicsTickRate} Hz</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="120"
                  step="10"
                  value={config.physicsTickRate}
                  onChange={(e) => setConfig({ ...config, physicsTickRate: parseInt(e.target.value) })}
                  className="w-full accent-cyber-cyan bg-white/5 rounded-lg h-1 select-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Simulation Engine Telemetry */}
        <div className="glass-card border border-white/10 rounded-xl p-4 mt-1">
          <div className="flex items-center justify-between mb-3 text-[10px] font-mono text-white/35 uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
              <span>{lang === 'pt' ? 'Diagnósticos de Execução em Tempo Real' : 'Real-time Execution Diagnostics'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-white/40" />
              <span className="text-cyber-cyan font-bold">60.0 FPS</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="bg-white/[0.015] border border-white/5 py-2 px-1 rounded hover:border-white/10 transition-colors">
              <div className="text-[8.5px] font-mono text-white/40 uppercase tracking-wider">DRAW_CALLS</div>
              <div className="text-xs font-mono font-bold text-white mt-0.5">{gameStats.drawCalls}</div>
            </div>
            <div className="bg-white/[0.015] border border-white/5 py-2 px-1 rounded hover:border-white/10 transition-colors">
              <div className="text-[8.5px] font-mono text-white/40 uppercase tracking-wider">ACTIVE_OBJECTS</div>
              <div className="text-xs font-mono font-bold text-cyber-cyan mt-0.5">{gameStats.activeEntities}</div>
            </div>
            <div className="bg-white/[0.015] border border-white/5 py-2 px-1 rounded hover:border-white/10 transition-colors">
              <div className="text-[8.5px] font-mono text-white/40 uppercase tracking-wider">PHYSICS_COMPUTE</div>
              <div className="text-xs font-mono font-bold text-cyber-yellow mt-0.5">{gameStats.physicsMs} ms</div>
            </div>
            <div className="bg-white/[0.015] border border-white/5 py-2 px-1 rounded hover:border-white/10 transition-colors">
              <div className="text-[8.5px] font-mono text-white/40 uppercase tracking-wider">GPU_RENDERING</div>
              <div className="text-xs font-mono font-bold text-[#ff007f] mt-0.5">{gameStats.renderingMs} ms</div>
            </div>
          </div>

          {/* Render safety status line */}
          <div className="flex items-center justify-between text-[8px] font-mono text-white/20 mt-3 pt-2 border-t border-white/5">
            <span>THREAD POOL: MAIN_GAME_60_STEP</span>
            <span>SHADERS: RUST_WEB_GL_URP</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// Subcomponent Buttons
interface CatProps {
  label: string;
  subtitle: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

function CategoryTabBtn({ label, subtitle, active, onClick, icon }: CatProps) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full text-left p-3 rounded-xl border select-none cursor-pointer transition-all ${
        active 
          ? 'bg-gradient-to-r from-white/[0.035] to-white/[0.005] border-white/15 text-white shadow-lg shadow-black/40'
          : 'bg-transparent border-transparent text-white/45 hover:text-white/80'
      }`}
    >
      {active && (
        <span className="absolute left-1.5 top-3.5 bottom-3.5 w-1.5 bg-cyber-cyan rounded-full shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
      )}
      <div className={`flex items-center gap-2 text-xs font-bold leading-none ${active ? 'pl-2.5' : ''}`}>
        {icon}
        <span>{label}</span>
      </div>
      <div className={`text-[9.5px] font-mono mt-1.5 ${active ? 'pl-2.5 text-white/60' : 'text-white/30'}`}>
        {subtitle}
      </div>
    </button>
  );
}
