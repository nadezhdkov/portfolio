<!-- TECH STACK BADGES -->
<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-latest-EF008F?style=flat-square&logo=framer&logoColor=white" />
</p>
<p align="center">
  <img src="https://img.shields.io/badge/Unity-Engine-CCCCCC?style=flat-square&logo=unity&logoColor=black" />
  <img src="https://img.shields.io/badge/C%23-Patterns-239120?style=flat-square&logo=csharp&logoColor=white" />
  <img src="https://img.shields.io/badge/Spigot%2FPaper-API-FF6B35?style=flat-square&logo=minecraft&logoColor=white" />
  <img src="https://img.shields.io/badge/Web_Audio-API-FF4154?style=flat-square&logo=googlechrome&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
</p>
<p align="center">
  <img src="https://img.shields.io/badge/Architecture-Modular-8B5CF6?style=flat-square" />
  <img src="https://img.shields.io/badge/Portfolio-HopeGM_Engine-00FF88?style=flat-square" />
</p>

---

<h1 align="center">Developer Engine Portfolio</h1>

<p align="center">
  <strong>A production-grade, immersive developer portfolio built with a cyberpunk/minimalist aesthetic — inspired by Unreal Engine dashboards, Linear, and Raycast.</strong>
</p>

<p align="center">
  <em>"Engineered to demonstrate real craft — not just to display code, but to embody it."</em>
</p>

---

## 📌 Overview

This portfolio was purpose-built to showcase the engineering depth of **Hope / HopeGM** across multiple domains of software and game development. Every section is a living technical demo — interactive, animated, and architecturally deliberate.

**Core expertise areas demonstrated:**

| Domain | Technologies |
|---|---|
| 🎮 Game Development | Unity Engine, C# design patterns |
| ⚙️ Gameplay Programming | Custom physics, optimized game loops |
| 🟩 Minecraft Systems | Spigot/Paper API, Netty packet manipulation, NMS hooks |
| 🔧 Backend & Tooling | REST APIs, WebSockets, Gradle, CLI tooling, telemetry |

---

## ✨ Feature Breakdown

### 💻 1. Interactive Diagnostic Terminal
> `src/components/TerminalPanel.tsx`

A fully functional in-browser terminal inspired by Raycast's command palette and sci-fi UI conventions. Visitors can explore professional information by typing real commands:

| Command | Output |
|---|---|
| `help` | Lists all available commands |
| `neofetch` | Developer stats, OS-style output |
| `about` | Biography, philosophy, and design principles |
| `projects` | Summary of portfolio highlights |
| `skills` | ASCII proficiency table |
| `ping` | Simulated latency to `spigot-cluster` |
| `contact` | Secure contact channels |
| `clear` | Resets the terminal buffer |

---

### 📈 2. SpigotVM Metrics Dashboard
> `src/components/EngineMetrics.tsx`

A real-time telemetry panel that mimics the live output of a production Minecraft server:

- **TPS Waveform Graph** — tick-accurate rendering hovering around `20.0 TPS`, with realistic jitter every second
- **Heap RAM Monitor** — dynamic memory consumption simulation with periodic **Garbage Collection** sweeps visualized in real time
- **Packet I/O Rate** — async packet throughput per second via simulated NMS hooks
- **CPU Load Jitter** — fluctuating load graph reflecting real server behavior patterns

---

### 🌐 3. Clustered Network Topology Map
> `src/components/MinecraftSystems.tsx`

An isometric visualization of a massively multiplayer Minecraft network infrastructure:

- **Proxy Node** — Velocity/BungeeCord handling inbound IP routing
- **Lobby Spigots** — Static load-balanced user transition management
- **Paper Arena Instances** — Independent minigame servers running dynamic packet injection (e.g., BedWars with raw NMS packet overrides)

> Click any node to reveal live-simulated latency, system specs, and configuration details.

---

### 🛠️ 4. Unity Physics Sandbox
> `src/components/UnityShowcase.tsx`

An interactive game-loop laboratory. Tweak core engine variables and observe real-time effects on:

- **Draw Call count**
- **Garbage allocation rate**
- **FixedUpdate sampling frequency (Hz)**

Designed to demonstrate understanding of Unity's internal performance model and how parameter choices cascade into engine behavior.

---

### 🔈 5. Procedural Web Audio Synthesizer
> `src/utils/audio.ts`

A fully runtime-generated audio engine — **zero `.mp3` files, zero network requests**. Built directly on the browser's native Web Audio API oscillator nodes:

- Terminal keyclick SFX
- System beeps and alerts
- Successful compilation chord sequences

No CORS issues. No asset loading. Pure synthesis.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript + Vite 6 |
| **Styling** | Tailwind CSS v4 — neon palette, glassmorphism, high-contrast utility design |
| **Animation** | Framer Motion (`motion/react`) — reveals, stagger layouts, tab transitions |
| **Icons** | Lucide React |
| **Audio** | Web Audio API (native oscillators, no external assets) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `v18+`
- **npm** or **yarn**

### Installation & Development

```bash
# 1. Clone the repository
git clone https://github.com/hopegm/engine-portfolio.git
cd engine-portfolio

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open your browser at `http://localhost:3000` (or the port Vite assigns).

### Production Build

```bash
npm run build
```

Output will be in the `dist/` directory, ready for static hosting (Vercel, Netlify, GitHub Pages, etc.).

---

## 📁 Project Structure

```
/
├── public/                     # Static assets
└── src/
    ├── components/             # Isolated feature modules
    │   ├── EngineMetrics.tsx   # SpigotVM telemetry dashboard
    │   ├── LoadingScreen.tsx   # Animated boot sequence
    │   ├── MinecraftSystems.tsx# Cluster topology map
    │   ├── NoiseOverlay.tsx    # CRT scanline & grain overlay
    │   ├── SkillGraph.tsx      # Proficiency visualization
    │   ├── TerminalPanel.tsx   # Interactive CLI terminal
    │   └── UnityShowcase.tsx   # Physics sandbox lab
    ├── utils/
    │   └── audio.ts            # Procedural Web Audio synthesizer
    ├── App.tsx                 # Central orchestrator & section router
    ├── data.ts                 # Structured mock data
    ├── types.ts                # Shared TypeScript interfaces
    ├── index.css               # @theme config & scanline effects
    └── main.tsx                # React entry point
├── index.html
├── package.json
└── vite.config.ts
```

---

## 🧠 Design Philosophy

This project is not a template — it's a statement. Every component was designed to reflect how I think about systems: with precision, intentionality, and attention to the boundary between what's visible and what's running underneath.

> The interface *is* the portfolio. The code *is* the demo.

---

<p align="center">
  Built with precision by <strong>RickMr.</strong> &nbsp;🕹️&nbsp;
  <br/>
  <sub>No templates. No shortcuts. Just craft.</sub>
</p>
