import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhatWeDo from "@/components/WhatWeDo";
import WhyItMatters from "@/components/WhyItMatters";
import FeaturedStartups from "@/components/FeaturedStartups";
import InvestorBenefits from "@/components/InvestorBenefits";
import FYPTransformer from "@/components/FYPTransformer";
import FundingCalculator from "@/components/FundingCalculator";
import HowItWorks from "@/components/HowItWorks";
import Stats from "@/components/Stats";
import PartnerUniversities from "@/components/PartnerUniversities";
import FAQs from "@/components/FAQs";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import AIToolsFloatingButton from "@/components/AIToolsFloatingButton";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <WhatWeDo />
      <WhyItMatters />
      <FeaturedStartups />
      <InvestorBenefits />
      <FYPTransformer />
      <FundingCalculator />
      <HowItWorks />
      <Stats />
      <PartnerUniversities />
      <FAQs />
      <CallToAction />
      <Footer />
      <AIToolsFloatingButton />
    </div>
  );
};

export default Index;
