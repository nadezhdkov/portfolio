/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RefreshCw, Gamepad2, Volume2, VolumeX, Swords, Award, Heart, HelpCircle, Activity } from 'lucide-react';
import { synths } from '../utils/audio';

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
  x: number;
  width: number;
  y: number;
  height: number;
  passed: boolean;
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

  // Platformer (Flappy) Character & Obstacles refs
  const platformerY = useRef(140);
  const platformerVy = useRef(0);
  const platformerPipesRef = useRef<FlappyPipe[]>([]);

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
      livesRef.current = 5;
      // Pre-add 2 cool turrets on the board
      turretsRef.current = [
        { x: 300, y: 110, range: 110, fireCooldown: 400, lastFired: 0, color: '#00f0ff' },
        { x: 160, y: 150, range: 115, fireCooldown: 300, lastFired: 0, color: '#ff007f' },
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

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (gameStateRef.current !== 'playing') {
      resetGame();
      return;
    }

    if (activeCategory === 'defence') {
      // Placing a dynamic defense turret
      // Make sure we didn't click exactly on the core or outside bounds
      if (x < 15 || y < 15 || x > 485 || y > 265) return;
      
      // Prevent placing on path nodes (keep simple clearance spacing)
      const distanceToPath = tdPathNodes.some(node => {
        const dx = node.x - x;
        const dy = node.y - y;
        return Math.sqrt(dx * dx + dy * dy) < 22;
      });

      if (distanceToPath) {
        synths.playError();
        return; // Clicked on path
      }

      // Check count limit
      if (turretsRef.current.length >= 10) {
        turretsRef.current.shift(); // Remove oldest to fit limit
      }

      const colorList = ['#00f0ff', '#ff007f', '#ffb703', '#39ff14'];
      const randomColor = colorList[Math.floor(Math.random() * colorList.length)];
      
      turretsRef.current.push({
        x,
        y,
        range: 110,
        fireCooldown: Math.random() * 150 + 250,
        lastFired: 0,
        color: randomColor,
      });
      
      synths.playClick();
      spawnParticles(x, y, '#00f0ff', 10);
    } else {
      // In Runner or Platformer, clicking inside the screen triggers player jump/flap!
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
      // SUB GAME 1: TOWER DEFENSE
      // -------------------------------------------------------------
      if (activeCategory === 'defence') {
        // Draw the curved high-tech pathway
        ctx.beginPath();
        ctx.strokeStyle = '#1e2030';
        ctx.lineWidth = 18;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(500, 140);
        tdPathNodes.forEach(n => ctx.lineTo(n.x, n.y));
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
        ctx.lineWidth = 8;
        ctx.moveTo(500, 140);
        tdPathNodes.forEach(n => ctx.lineTo(n.x, n.y));
        ctx.stroke();

        // Spawn Enemies
        const spawnDelay = (config.spawnInterval * 1000) / speed;
        const now = Date.now();
        if (gameStateRef.current === 'playing' && now - lastSpawnTimeRef.current > spawnDelay) {
          if (enemiesRef.current.length < config.entityLimit) {
            enemiesRef.current.push({
              id: enemyIdTicker++,
              x: 500,
              y: 135 + (Math.random() * 10 - 5),
              hp: 12 + Math.floor(scoreRef.current * 0.1),
              maxHp: 12 + Math.floor(scoreRef.current * 0.1),
              speed: (1.1 + Math.random() * 0.4) * physicsTickRatio,
              nodeIndex: 0,
              color: Math.random() > 0.4 ? '#ff0055' : '#b200ff',
            });
          }
          lastSpawnTimeRef.current = now;
        }

        // Draw and Move Enemies
        if (gameStateRef.current === 'playing') {
          enemiesRef.current.forEach((enemy, idx) => {
            const node = tdPathNodes[enemy.nodeIndex];
            if (!node) return;

            const dx = node.x - enemy.x;
            const dy = node.y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 4) {
              enemy.nodeIndex++;
              // Core leak check
              if (enemy.nodeIndex >= tdPathNodes.length) {
                livesRef.current--;
                synths.playError();
                spawnParticles(enemy.x, enemy.y, '#ff0055', 12);
                enemiesRef.current.splice(idx, 1);
                if (livesRef.current <= 0) {
                  livesRef.current = 0;
                  gameStateRef.current = 'gameover';
                  // Save Highscore
                  setHighScores(prev => ({
                    ...prev,
                    defence: Math.max(prev.defence, scoreRef.current),
                  }));
                }
                return;
              }
            } else {
              enemy.x += (dx / dist) * enemy.speed * speed;
              enemy.y += (dy / dist) * enemy.speed * speed;
            }

            // Draw Enemy Cube
            ctx.fillStyle = enemy.color;
            ctx.fillRect(enemy.x - 6, enemy.y - 6, 12, 12);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.strokeRect(enemy.x - 6, enemy.y - 6, 12, 12);

            // Health bar
            const hpWidth = (enemy.hp / enemy.maxHp) * 14;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(enemy.x - 7, enemy.y - 12, 14, 2);
            ctx.fillStyle = enemy.hp > enemy.maxHp * 0.5 ? '#39ff14' : '#ff007f';
            ctx.fillRect(enemy.x - 7, enemy.y - 12, hpWidth, 2);
          });
        }

        // Draw Base Core Shield Gate
        ctx.beginPath();
        ctx.arc(30, 140, 16, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.fill();
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(26, 136, 8, 8);

        // Core decorative shield spinning
        ctx.beginPath();
        ctx.arc(30, 140, 22, (frameCountRef.current * 0.02) % (Math.PI * 2), ((frameCountRef.current * 0.02) + 1.2) % (Math.PI * 2));
        ctx.strokeStyle = '#ff007f';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw placed Lasers
        turretsRef.current.forEach(tur => {
          // Body circular node
          ctx.fillStyle = '#111322';
          ctx.beginPath();
          ctx.arc(tur.x, tur.y, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#383a40';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Colored laser core pulse
          ctx.fillStyle = tur.color;
          ctx.beginPath();
          ctx.arc(tur.x, tur.y, 4, 0, Math.PI * 2);
          ctx.fill();

          // Outer radius ring helper on placement
          ctx.beginPath();
          ctx.arc(tur.x, tur.y, tur.range, 0, Math.PI * 2);
          ctx.strokeStyle = `${tur.color}15`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Shooting process
          if (gameStateRef.current === 'playing') {
            // Target search: nearest enemy
            let closestEnemy: Enemy | null = null;
            let closestDist = tur.range;

            enemiesRef.current.forEach(enemy => {
              const ex = enemy.x - tur.x;
              const ey = enemy.y - tur.y;
              const d = Math.sqrt(ex*ex + ey*ey);
              if (d < closestDist) {
                closestDist = d;
                closestEnemy = enemy;
              }
            });

            if (closestEnemy && now - tur.lastFired > tur.fireCooldown) {
              // Shoot beam!
              ctx.beginPath();
              ctx.strokeStyle = tur.color;
              ctx.lineWidth = 2.5;
              ctx.moveTo(tur.x, tur.y);
              ctx.lineTo(closestEnemy.x, closestEnemy.y);
              ctx.stroke();

              // Extra white beam core
              ctx.beginPath();
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 1;
              ctx.moveTo(tur.x, tur.y);
              ctx.lineTo(closestEnemy.x, closestEnemy.y);
              ctx.stroke();

              // Inflict damage to enemy
              closestEnemy.hp -= 4;

              // Generate shoot sparks
              spawnParticles(closestEnemy.x, closestEnemy.y, tur.color, 3);

              if (closestEnemy.hp <= 0) {
                // Enemy dead
                scoreRef.current += 10;
                synths.playClick();
                spawnParticles(closestEnemy.x, closestEnemy.y, closestEnemy.color, 12);
                
                // Remove enemy
                const eIdx = enemiesRef.current.findIndex(e => e.id === closestEnemy!.id);
                if (eIdx !== -1) enemiesRef.current.splice(eIdx, 1);
              }
              tur.lastFired = now;
            }
          }
        });
      }

      // -------------------------------------------------------------
      // SUB GAME 2: UNLIMITED RUNNER
      // -------------------------------------------------------------
      if (activeCategory === 'runner') {
        const floorY = 210;

        // Draw cyber electric grid floor line
        ctx.strokeStyle = '#39ff14';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, floorY + 12);
        ctx.lineTo(500, floorY + 12);
        ctx.stroke();

        // Staggered vertical floor ticks for scrolling speed feedback
        ctx.strokeStyle = 'rgba(57, 255, 20, 0.2)';
        ctx.lineWidth = 2;
        const tickMove = (frameCountRef.current * 4 * speed) % 40;
        for (let x = 500 - tickMove; x >= 0; x -= 40) {
          ctx.beginPath();
          ctx.moveTo(x, floorY + 12);
          ctx.lineTo(x - 20, 270);
          ctx.stroke();
        }

        // Draw Player Ship Cube
        const px = 80;
        if (gameStateRef.current === 'playing') {
          // Apply gravity
          runnerVy.current += 0.44 * physicsTickRatio;
          runnerY.current += runnerVy.current * speed;

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

        // Render jumping body
        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(px - 10, runnerY.current - 10, 18, 18);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(px - 10, runnerY.current - 10, 18, 18);

        // Flame booster emission trail
        if (!runnerIsGrounded.current) {
          ctx.fillStyle = '#ff0055';
          ctx.fillRect(px - 15, runnerY.current + 2, 4, 4);
        }

        // Spawn Obstacle Pillars
        const spawnPeriod = (config.spawnInterval * 1200) / speed;
        const now = Date.now();
        if (gameStateRef.current === 'playing' && now - lastSpawnTimeRef.current > spawnPeriod) {
          if (runnerObstaclesRef.current.length < config.entityLimit) {
            const h = Math.random() * 32 + 20; // varying column height
            runnerObstaclesRef.current.push({
              id: Math.random(),
              x: 500,
              y: floorY - h + 10,
              width: 14 + Math.random() * 8,
              height: h,
              speed: (3.2 + Math.random() * 0.8) * physicsTickRatio,
              passed: false,
            });
          }
          lastSpawnTimeRef.current = now;
        }

        // Update and draw Obstacles
        runnerObstaclesRef.current.forEach((obs, idx) => {
          if (gameStateRef.current === 'playing') {
            obs.x -= obs.speed * speed;
          }

          // Render neon barricade block
          ctx.fillStyle = '#ff007f';
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          ctx.strokeStyle = '#ffffff';
          ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

          // Danger top core light strip
          ctx.fillStyle = '#ffff00';
          ctx.fillRect(obs.x + 2, obs.y, obs.width - 4, 3);

          // Cleaning out-of-screen blocks
          if (obs.x < -40) {
            runnerObstaclesRef.current.splice(idx, 1);
            return;
          }

          // Collision Check
          if (gameStateRef.current === 'playing') {
            const runnerLeft = px - 10;
            const runnerRight = px + 8;
            const runnerTop = runnerY.current - 10;
            const runnerBottom = runnerY.current + 8;

            if (
              runnerRight > obs.x &&
              runnerLeft < obs.x + obs.width &&
              runnerBottom > obs.y &&
              runnerTop < obs.y + obs.height
            ) {
              // Collide crash
              gameStateRef.current = 'gameover';
              synths.playError();
              spawnParticles(px, runnerY.current, '#ff007f', 18);
              
              setHighScores(prev => ({
                ...prev,
                runner: Math.max(prev.runner, scoreRef.current),
              }));
            }
          }
        });
      }

      // -------------------------------------------------------------
      // SUB GAME 3: PHYSICS PLATFORMER (FLAPPY SPACE)
      // -------------------------------------------------------------
      if (activeCategory === 'platformer') {
        // Player Ship coordinates
        const px = 100;
        
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

        // Draw ship yellow rocket
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        // Triangle thrusting
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

        // Spawn Pipes
        const spawnDelay = (config.spawnInterval * 1600) / speed;
        const now = Date.now();
        if (gameStateRef.current === 'playing' && now - lastSpawnTimeRef.current > spawnDelay) {
          if (platformerPipesRef.current.length < config.entityLimit) {
            // Gap range configuration
            const gapY = 60 + Math.random() * 100;
            const gapHeight = 90; // generous space gap

            platformerPipesRef.current.push({
              x: 500,
              width: 25,
              topHeight: gapY,
              bottomHeight: 270 - (gapY + gapHeight),
              passed: false,
            });
          }
          lastSpawnTimeRef.current = now;
        }

        // Update and Draw pipes
        platformerPipesRef.current.forEach((pipe, index) => {
          if (gameStateRef.current === 'playing') {
            pipe.x -= 2.6 * speed * physicsTickRatio;
          }

          // Draw top pipe
          ctx.fillStyle = '#39ff14';
          ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
          ctx.strokeStyle = '#ffffff';
          ctx.strokeRect(pipe.x, -5, pipe.width, pipe.topHeight + 5);

          // Top pipe retro lip rim
          ctx.fillRect(pipe.x - 3, pipe.topHeight - 12, pipe.width + 6, 12);
          ctx.strokeRect(pipe.x - 3, pipe.topHeight - 12, pipe.width + 6, 12);

          // Draw bottom pipe
          const bottomY = 270 - pipe.bottomHeight;
          ctx.fillRect(pipe.x, bottomY, pipe.width, pipe.bottomHeight);
          ctx.strokeRect(pipe.x, bottomY, pipe.width, pipe.bottomHeight + 5);

          // Bottom pipe retro lip rim
          ctx.fillRect(pipe.x - 3, bottomY, pipe.width + 6, 12);
          ctx.strokeRect(pipe.x - 3, bottomY, pipe.width + 6, 12);

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

          // Collision Check
          if (gameStateRef.current === 'playing') {
            const shipLeft = px - 11;
            const shipRight = px + 11;
            const shipTop = platformerY.current - 7;
            const shipBottom = platformerY.current + 7;

            // Intersects top pipe
            const topCollision = (
              shipRight > pipe.x &&
              shipLeft < pipe.x + pipe.width &&
              shipTop < pipe.topHeight
            );

            // Intersects bottom pipe
            const bottomCollision = (
              shipRight > pipe.x &&
              shipLeft < pipe.x + pipe.width &&
              shipBottom > bottomY
            );

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
        const liveLabel = lang === 'pt' ? 'VIDAS CORE: ' : 'CORE HEALTH: ';
        c.fillStyle = livesRef.current <= 1 ? '#ff0055' : '#00f0ff';
        c.fillText(`${liveLabel}${livesRef.current}/5`, 360, 19);
      } else {
        const hLabel = lang === 'pt' ? 'ESTADO: ONLINE' : 'STATUS: LIVE';
        c.fillStyle = gameStateRef.current === 'gameover' ? '#ff0055' : '#39ff14';
        c.fillText(gameStateRef.current === 'gameover' ? 'CRASHED_ERR' : hLabel, 360, 19);
      }

      // Draw instructions overlays in idle states
      if (gameStateRef.current === 'idle') {
        c.fillStyle = 'rgba(5, 5, 8, 0.85)';
        c.fillRect(0, 30, 500, 240);

        c.fillStyle = '#00f0ff';
        c.font = 'bold 16px "Space Grotesk", sans-serif';
        c.textAlign = 'center';
        
        const ptStr = activeCategory === 'defence' ? 'ARENA TOWER DEFENSE' : activeCategory === 'runner' ? 'RUNNER INFINITO' : 'VOO ESPACIAL SENSORIAL';
        const enStr = activeCategory === 'defence' ? 'ARENA TOWER DEFENSE' : activeCategory === 'runner' ? 'INFINITE RUNNER' : 'SENSORY COSMIC FLIGHT';
        c.fillText(lang === 'pt' ? ptStr : enStr, 250, 110);

        c.font = '11px "JetBrains Mono", monospace';
        c.fillStyle = 'rgba(255,255,255,0.6)';
        
        const ptSub = activeCategory === 'defence' 
          ? 'Clique em qualquer lugar da tela para posicionar suas torres!' 
          : 'Pressione ESPAÇO ou clique na tela para SALTAR obstáculos.';
        const enSub = activeCategory === 'defence'
          ? 'Click anywhere on the screen to deploy laser turrets!'
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
              label={lang === 'pt' ? "Tower Defense" : "Tower Defense"}
              active={activeCategory === 'defence'}
              onClick={() => setActiveCategory('defence')}
              subtitle={lang === 'pt' ? "Grade trigonométrica & laser" : "Grid targeting & laser fire"}
              icon={<Swords className="w-4 h-4 text-cyber-cyan" />}
            />
            <CategoryTabBtn
              label={lang === 'pt' ? "Unlimited Runner" : "Unlimited Runner"}
              active={activeCategory === 'runner'}
              onClick={() => setActiveCategory('runner')}
              subtitle={lang === 'pt' ? "Desvios em alta velocidade" : "Avoid obstacles at extreme h-speed"}
              icon={<Award className="w-4 h-4 text-cyber-pink" />}
            />
            <CategoryTabBtn
              label={lang === 'pt' ? "Physics Platformer" : "Physics Platformer"}
              active={activeCategory === 'platformer'}
              onClick={() => setActiveCategory('platformer')}
              subtitle={lang === 'pt' ? "Propulsão e gravidade laser" : "Thrusters, pipes and custom gravity"}
              icon={<Heart className="w-4 h-4 text-cyber-yellow" />}
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
                  <span className="text-[10px] font-mono text-cyber-cyan tracking-widest uppercase font-bold">
                    GAME RECON: TD_GRID_A* // PLAYABLE
                  </span>
                  <h5 className="font-display font-bold text-lg text-white">
                    Tower Defense Sandbox
                  </h5>
                </div>
              )}
              {activeCategory === 'runner' && (
                <div>
                  <span className="text-[10px] font-mono text-cyber-pink tracking-widest uppercase font-bold">
                    GAME RECON: RUN_SCROLL_GEN // PLAYABLE
                  </span>
                  <h5 className="font-display font-bold text-lg text-white">
                    Unlimited Corridor Runner
                  </h5>
                </div>
              )}
              {activeCategory === 'platformer' && (
                <div>
                  <span className="text-[10px] font-mono text-cyber-yellow tracking-widest uppercase font-bold">
                    GAME RECON: SPACE_VELOCITY_THRUST // PLAYABLE
                  </span>
                  <h5 className="font-display font-bold text-lg text-white">
                    Spaceship Flight Physics
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
