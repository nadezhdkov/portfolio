import { motion } from "framer-motion";
import { Layers, Monitor, Palette, Code } from "lucide-react";

const services = [
  { icon: Layers, title: "Website Design & Development" },
  { icon: Monitor, title: "Web Application UI & UX Design" },
  { icon: Palette, title: "SaaS Design & Development" },
  { icon: Code, title: "Branding & Identity" },
];

const WhatIOffer = () => {
  return (
    <section id="offer" className="section-spacing bg-background">
      <div className="section-container">
        <h2 className="section-title mb-10">What I Offer</h2>

        <div className="divide-y divide-border">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 py-5 group cursor-pointer hover:pl-2 transition-all duration-300"
            >
              <service.icon size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-lg font-medium text-foreground">{service.title}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatIOffer;
