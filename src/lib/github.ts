export interface GitHubLanguage {
  name: string;
  level: number;
  icon: string;
  desc: string;
}

const LANGAUGE_CONFIG: Record<string, { icon: string; desc: string }> = {
  JavaScript: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    desc: "Dynamic web development and interactive UI logic",
  },
  TypeScript: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    desc: "Type-safe application development and robust architecture",
  },
  HTML: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    desc: "Semantic structure and modern web standards",
  },
  CSS: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    desc: "Advanced styling, layouts, and responsive design",
  },
  Java: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    desc: "Enterprise-grade backend systems and scalable logic",
  },
  Python: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    desc: "Data analysis, automation, and backend services",
  },
  Ruby: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",
    desc: "Full-stack development and elegant scripting",
  },
  PHP: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    desc: "Server-side scripting and modern CMS solutions",
  },
  C: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
    desc: "System-level programming and performance optimization",
  },
  "C++": {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    desc: "High-performance applications and game development",
  },
  "C#": {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
    desc: "Cross-platform development and enterprise software",
  },
  Go: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg",
    desc: "Cloud-native services and concurrency-first systems",
  },
  Rust: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg",
    desc: "Memory-safe systems programming and WASM development",
  },
  Swift: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
    desc: "iOS and macOS native application development",
  },
  Kotlin: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
    desc: "Modern Android development and JVM-based services",
  },
};

export const fetchGitHubSkills = async (username: string): Promise<GitHubLanguage[]> => {
  try {
    // 1. Fetch repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    if (!reposResponse.ok) throw new Error("Failed to fetch repositories");
    const repos = await reposResponse.json();

    // 2. Aggregate languages from all repositories
    const languageStats: Record<string, number> = {};
    let totalValue = 0;

    for (const repo of repos) {
      if (repo.language) {
        languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
        totalValue += 1;
      }
    }

    // 3. Process and format skills
    const skills: GitHubLanguage[] = Object.entries(languageStats)
      .map(([name, count]) => {
        const config = LANGAUGE_CONFIG[name] || {
          icon: `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name.toLowerCase()}/${name.toLowerCase()}-original.svg`,
          desc: `Expertise in ${name} development and problem solving`,
        };

        return {
          name,
          level: Math.round((count / totalValue) * 100),
          icon: config.icon,
          desc: config.desc,
        };
      })
      .sort((a, b) => b.level - a.level)
      .slice(0, 6); // Keep top 6 languages

    // Fallback for some common language icons if the URL pattern fails
    skills.forEach(skill => {
        if (skill.name === "SCSS") {
            skill.icon = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg";
        }
    });

    return skills;
  } catch (error) {
    console.error("Error fetching GitHub skills:", error);
    return [];
  }
};
