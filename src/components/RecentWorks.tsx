import { motion } from "framer-motion";
import work1 from "@/assets/work-1.jpg";
import work2 from "@/assets/work-2.jpg";
import work3 from "@/assets/work-3.jpg";
import work4 from "@/assets/work-4.jpg";
import work5 from "@/assets/work-5.jpg";

const projects = [
  {
    img: work1,
    category: "App Design",
    date: "Sep 2024",
    title: "Finanza",
    desc: "A comprehensive fintech app design with intuitive data visualization.",
  },
  {
    img: work2,
    category: "Product Design",
    date: "Aug 2024",
    title: "Lumos",
    desc: "Premium tablet showcase with immersive visual experiences.",
  },
  {
    img: work3,
    category: "Product Photography",
    date: "Jul 2024",
    title: "Morphlit",
    desc: "Minimalist product photography for premium audio brand.",
  },
  {
    img: work4,
    category: "App Design",
    date: "Jun 2024",
    title: "Lumora",
    desc: "Mobile app interface with vibrant visual identity.",
  },
  {
    img: work5,
    category: "Web Design",
    date: "May 2024",
    title: "Nexis",
    desc: "Dark-themed website design for creative studio.",
  },
];

const RecentWorks = () => {
  return (
    <section id="works" className="section-spacing">
      <div className="section-container">
        <h2 className="section-title mb-10">Recent Works</h2>

        {/* Top row - 2 large */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {projects.slice(0, 2).map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="rounded-2xl overflow-hidden mb-3 bg-muted aspect-[4/3]">
                <img
                  src={project.img}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-muted-foreground">{project.category}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{project.date}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
              <p className="text-sm text-muted-foreground">{project.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom row - 3 smaller */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {projects.slice(2).map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="rounded-2xl overflow-hidden mb-3 bg-muted aspect-[4/3]">
                <img
                  src={project.img}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-muted-foreground">{project.category}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{project.date}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
              <p className="text-sm text-muted-foreground">{project.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentWorks;
