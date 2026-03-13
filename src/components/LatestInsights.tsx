import { motion } from "framer-motion";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";

const posts = [
  {
    img: blog1,
    title: "The Role of Typography in Crafting Memorable Experiences",
    date: "Oct 15, 2024",
  },
  {
    img: blog2,
    title: "How Designers Can Streamline Their Creative Process",
    date: "Sep 28, 2024",
  },
  {
    img: blog3,
    title: "Modern Color Trends and How to Balance Bold Design",
    date: "Sep 10, 2024",
  },
];

const LatestInsights = () => {
  return (
    <section id="insights" className="section-spacing bg-background">
      <div className="section-container">
        <h2 className="section-title mb-10">Latest Insights</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="rounded-2xl overflow-hidden mb-3 aspect-[5/4] bg-muted">
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-xs text-muted-foreground mb-1">{post.date}</p>
              <h3 className="text-sm font-semibold text-foreground leading-snug">
                {post.title}
              </h3>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestInsights;
