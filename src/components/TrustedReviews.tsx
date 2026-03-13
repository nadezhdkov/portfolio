// import { motion } from "framer-motion";
// import { Star } from "lucide-react";

// const reviews = [
//   {
//     name: "James Martin",
//     role: "CEO, TechVision",
//     text: "Davies transformed our brand presence completely. His attention to detail and ability to create intuitive user experiences is truly exceptional.",
//     rating: 5,
//   },
//   {
//     name: "Sarah Collins",
//     role: "Founder, StartupHub",
//     text: "The website Davies created exceeded our expectations. His understanding of modern design trends and ability to align them with our brand was remarkable.",
//     rating: 5,
//   },
//   {
//     name: "Lisa Watson",
//     role: "Marketing Dir, Nexus",
//     text: "Working with Davies was an incredible experience. His creative vision, along with his technical skills, resulted in a website that truly stands out.",
//     rating: 5,
//   },
// ];

// const TrustedReviews = () => {
//   return (
//     <section id="reviews" className="section-spacing bg-background">
//       <div className="section-container">
//         <h2 className="section-title mb-10 text-center">Trusted Reviews</h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {reviews.map((review, i) => (
//             <motion.div
//               key={review.name}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: i * 0.1 }}
//               className="card-surface bg-background"
//             >
//               <div className="flex gap-0.5 mb-3">
//                 {Array.from({ length: review.rating }).map((_, j) => (
//                   <Star key={j} size={14} className="fill-foreground text-foreground" />
//                 ))}
//               </div>
//               <p className="text-sm text-muted-foreground leading-relaxed mb-6">
//                 "{review.text}"
//               </p>
//               <div className="flex items-center gap-3">
//                 <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
//                   <span className="text-xs font-semibold text-foreground">
//                     {review.name.split(" ").map(n => n[0]).join("")}
//                   </span>
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold text-foreground">{review.name}</p>
//                   <p className="text-xs text-muted-foreground">{review.role}</p>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default TrustedReviews;
