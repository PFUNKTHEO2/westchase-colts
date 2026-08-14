import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SponsorBanner } from "@/components/SponsorBanner";
import { TitleSponsorSection } from "@/components/TitleSponsorSection";

import { CardGallery } from "@/components/CardGallery";
import { MintWall } from "@/components/MintWall";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyProdigyCards } from "@/components/WhyProdigyCards";
import { PricingSection } from "@/components/PricingSection";
import { Milestones } from "@/components/Milestones";
import { Leaderboard } from "@/components/Leaderboard";
import { SocialShare } from "@/components/SocialShare";
import { Footer } from "@/components/Footer";
import { teamConfig } from "@/lib/data";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>{teamConfig.name} - Support Your Athletes</title>
        <meta
          name="description"
          content={`Support ${teamConfig.name} athletes. ${teamConfig.tagline}. Collect exclusive ProdigyCards and help us reach our $${teamConfig.fundraisingGoal.toLocaleString()} fundraising goal!`}
        />
        <meta property="og:title" content={`${teamConfig.name} - Support Your Athletes`} />
        <meta
          property="og:description"
          content={`Support ${teamConfig.name} athletes. Collect exclusive ProdigyCards!`}
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen">
        <Navbar />
        <main>
          <Hero />
          <CardGallery />
          <MintWall />
          <SponsorBanner />
          <TitleSponsorSection />
          <HowItWorks />
          <WhyProdigyCards />
          <PricingSection />
          <Milestones />
          <Leaderboard />
          <SocialShare />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
