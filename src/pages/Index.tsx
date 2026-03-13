import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RecentWorks from "@/components/RecentWorks";
import WhatIOffer from "@/components/WhatIOffer";
import MySkills from "@/components/MySkills";
import HowIWork from "@/components/HowIWork";
import TrustedReviews from "@/components/TrustedReviews";
import FAQSection from "@/components/FAQSection";
import LatestInsights from "@/components/LatestInsights";
import CTAFooter from "@/components/CTAFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <RecentWorks />
      <WhatIOffer />
      <MySkills />
      <HowIWork />
      <TrustedReviews />
      <FAQSection />
      <LatestInsights />
      <CTAFooter />
    </div>
  );
};

export default Index;
