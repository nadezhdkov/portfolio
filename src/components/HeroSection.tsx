import { motion } from "framer-motion";
import profileImg from "@/assets/profile.jpg";

const HeroSection = () => {
  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          {/* Left text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-muted-foreground max-w-[200px] text-center md:text-left"
          >
            I craft digital experiences that merge creativity with functionality
          </motion.p>

          {/* Profile image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden grayscale">
              <img
                src={profileImg}
                alt="Davies Williams"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Right text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-muted-foreground max-w-[200px] text-center md:text-right"
          >
            Based in London, UK — available for freelance & full-time positions
          </motion.p>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-6xl md:text-8xl lg:text-9xl font-black text-foreground text-center tracking-tighter uppercase"
        >
          DIGITAL
          <br />
          DESIGNER
        </motion.h1>
      </div>
    </section>
  );
};

export default HeroSection;
