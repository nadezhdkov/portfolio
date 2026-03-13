import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "I dive deep into your personal goals and business vision.",
    desc: "I design focused, impactful mockups for modern brands.",
  },
  {
    num: "02",
    title: "I design focused, impactful mockups for modern brands.",
    desc: "Clean, beautiful designs that convert and inspire.",
  },
  {
    num: "03",
    title: "Sometimes websites feel boring, presentations feel stale.",
    desc: "I bring fresh perspective to every project I touch.",
  },
  {
    num: "04",
    title: "Your website goes live, optimized and ready to make impact.",
    desc: "Launch with confidence, knowing everything is pixel-perfect.",
  },
];

const stats = [
  { value: "10+", label: "Years of Experience" },
  { value: "98", label: "Client Satisfaction" },
  { value: "80+", label: "Completed Projects" },
];

const HowIWork = () => {
  return (
    <section id="process" className="section-spacing">
      <div className="section-container">
        <h2 className="section-title mb-10">How I Work</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-surface"
            >
              <span className="badge-pill mb-4 inline-block">{step.num}</span>
              <h4 className="font-semibold text-foreground text-sm leading-snug mb-2">
                {step.title}
              </h4>
              <p className="text-xs text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-surface text-center"
            >
              <div className="stat-number mb-1">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowIWork;
