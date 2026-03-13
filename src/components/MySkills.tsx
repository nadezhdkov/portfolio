import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchGitHubSkills } from "@/lib/github";
import { Skeleton } from "@/components/ui/skeleton";

const MySkills = () => {
  const { data: skills, isLoading, error } = useQuery({
    queryKey: ["github-skills"],
    queryFn: () => fetchGitHubSkills("nadezhdkov"),
  });

  return (
    <section id="skills" className="section-spacing bg-background">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left */}
          <div>
            <h2 className="section-title mb-4">My Skills</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              With years of experience in digital design and software engineering, I've developed expertise across multiple platforms and tools to deliver exceptional results.
            </p>
          </div>

          {/* Right - skill cards */}
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card-surface flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-1.5 w-full" />
                  </div>
                </div>
              ))
            ) : error || !skills || skills.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Failed to load skills from GitHub.</p>
            ) : (
              skills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card-surface flex items-center gap-4 group hover:border-foreground/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0 group-hover:bg-foreground/10 transition-colors overflow-hidden p-2">
                    <img 
                      src={skill.icon} 
                      alt={skill.name} 
                      className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${skill.name}&background=random&color=fff`;
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-foreground text-sm">{skill.name}</h4>
                      <span className="text-xs text-muted-foreground">{skill.level}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 truncate">{skill.desc}</p>
                    <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.15 }}
                        className="h-full bg-foreground rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MySkills;
