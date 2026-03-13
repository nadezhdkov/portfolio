import { motion } from "framer-motion";
import profileImg from "@/assets/profile.jpg";
import { Mail, ArrowUpRight } from "lucide-react";

const CTAFooter = () => {
  return (
    <section id="contact" className="px-4 md:px-8 pb-8">
      <div className="cta-section section-container py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
              Let's shape
              <br />
              something
              <br />
              remarkable,
              <br />
              <span className="font-serif italic font-normal">together.</span>
            </h2>
            <p className="text-sm opacity-70">
              Got a project in mind? Let's create something great.
            </p>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-start md:items-end gap-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden grayscale">
                <img src={profileImg} alt="Davies Williams" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-sm">Davies Williams</p>
                <p className="text-xs opacity-70">Digital Designer & Developer</p>
              </div>
            </div>

            <a
              href="mailto:daviesdesign@gmail.com"
              className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity"
            >
              <Mail size={16} />
              daviesdesign@gmail.com
            </a>

            <div className="flex gap-3 mt-2">
              <a
                href="#"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary-foreground text-primary text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Schedule a Call
                <ArrowUpRight size={14} />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-primary-foreground/30 text-sm font-medium hover:bg-primary-foreground/10 transition-colors"
              >
                Copy Email
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="section-container pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          © 2024 Davies Williams. All rights reserved.
        </p>
        <div className="flex gap-6">
          {["Twitter", "Dribbble", "LinkedIn", "Behance"].map((s) => (
            <a key={s} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {s}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTAFooter;
