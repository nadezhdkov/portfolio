// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";

// const faqs = [
//   {
//     q: "Do you work with startups as well as established brands?",
//     a: "Absolutely! I work with businesses of all sizes, from early-stage startups to established enterprises. Each project receives the same level of dedication and creativity.",
//   },
//   {
//     q: "Can you design both websites and mobile apps?",
//     a: "Yes, I specialize in both responsive web design and mobile app interfaces. I ensure consistent branding and optimal user experiences across all platforms.",
//   },
//   {
//     q: "Do you handle development, or just design?",
//     a: "I offer both design and front-end development services. For back-end work, I collaborate with trusted developers to deliver complete solutions.",
//   },
//   {
//     q: "How long does a typical project take?",
//     a: "Project timelines vary based on scope. A typical website redesign takes 4-8 weeks, while larger projects may take 3-6 months. I'll provide a detailed timeline during our initial consultation.",
//   },
//   {
//     q: "How do I get started or request a quote?",
//     a: "Simply reach out through the contact form below or send me an email. I'll schedule a free consultation call to discuss your project needs and provide a custom quote.",
//   },
// ];

// const FAQSection = () => {
//   return (
//     <section id="faq" className="section-spacing">
//       <div className="section-container max-w-[700px]">
//         <h2 className="section-title mb-10 text-center">FAQ</h2>

//         <Accordion type="single" collapsible className="w-full">
//           {faqs.map((faq, i) => (
//             <AccordionItem key={i} value={`item-${i}`}>
//               <AccordionTrigger className="text-sm font-medium text-foreground text-left">
//                 {faq.q}
//               </AccordionTrigger>
//               <AccordionContent className="text-sm text-muted-foreground">
//                 {faq.a}
//               </AccordionContent>
//             </AccordionItem>
//           ))}
//         </Accordion>
//       </div>
//     </section>
//   );
// };

// export default FAQSection;
