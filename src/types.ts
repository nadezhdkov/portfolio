/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  itchUrl?: string;
  tags: string[];
  category: 'gameplay' | 'minecraft' | 'unity' | 'tools';
  metrics: ProjectMetric[];
  status: 'online' | 'compiling' | 'debug';
  version: string;
  screenshotUrl?: string;
  detailedPoints: string[];
  techOverview: string[];
}

export interface Skill {
  name: string;
  category: 'GameDev' | 'Backend' | 'Tools' | 'Creative';
  level: number; // 0-100
  color: string;
  threads: number;
  status: 'LOADED' | 'STANDBY' | 'OPTIMIZING';
}

export interface MinecraftNode {
  id: string;
  name: string;
  status: 'ACTIVE' | 'IDLE' | 'MAINTENANCE';
  tps: number;
  memory: string;
  packets: number;
  connections: string[]; // output node IDs
}

export interface TerminalLog {
  text: string;
  type: 'system' | 'success' | 'warning' | 'error' | 'input';
  timestamp: string;
}

export interface ExperienceTimeline {
  period: string;
  role: string;
  company: string;
  description: string;
  bullets: string[];
  tags: string[];
}
