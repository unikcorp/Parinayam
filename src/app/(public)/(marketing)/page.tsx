import Link from "next/link";
import Image from "next/image";
import { Apple, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageSlot } from "@/components/shared/image-slot";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustStats } from "@/components/landing/TrustStats";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeaturedProfiles } from "@/components/landing/FeaturedProfiles";
import { WhyParinayam } from "@/components/landing/WhyParinayam";
import { SuccessStories } from "@/components/landing/SuccessStories";
import { Testimonials } from "@/components/landing/Testimonials";
import { PrivacySection } from "@/components/landing/PrivacySection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { StickyActionBar } from "@/components/shared/sticky-action-bar";
import { Reveal } from "@/components/shared/reveal";
import { brand } from "@/data/brand";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { fetchFeaturedProfiles } from "@/lib/featured-profiles";

export const metadata = buildMetadata({
  title: "Find your life partner",
  description: brand.tagline,
  path: "/",
});

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: brand.name,
  url: siteUrl,
  email: brand.supportEmail,
  telephone: brand.supportPhone,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: brand.name,
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default async function LandingPage() {
  const featuredProfiles = await fetchFeaturedProfiles();

  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={websiteJsonLd} />

      <HeroSection />

      <TrustStats />
      <HowItWorks />
      <FeaturedProfiles profiles={featuredProfiles} />
      <WhyParinayam />
      <SuccessStories />

      <Testimonials />

      <PrivacySection />

      {/* APP DOWNLOAD */}
      <section className="bg-card px-5 py-3 pb-9 lg:px-18 lg:py-20">
        <Reveal className="bg-dark-panel-gradient relative overflow-hidden rounded-[22px] p-7 text-center text-white lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:gap-12 lg:rounded-[28px] lg:p-16 lg:text-left">
          <div>
            <h2 className="mb-2.5 text-[23px] leading-[1.2] font-extrabold tracking-[-0.02em] lg:mb-4 lg:text-[38px] lg:leading-[1.15]">
              Take {brand.name} with you
            </h2>
            <p className="mx-auto mb-5 max-w-md text-sm leading-[1.6] text-white/70 lg:mx-0 lg:mb-8 lg:text-[17px] lg:leading-[1.7]">
              Instant match alerts, private chat and voice introductions —
              right from your pocket.
            </p>
            <div className="flex justify-center gap-2.5 lg:justify-start lg:gap-3.5">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3.5 text-[13.5px] font-bold transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/18 active:translate-y-0 active:scale-[0.98] lg:flex-none lg:px-6.5">
                <Apple className="size-4" /> App Store
              </button>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3.5 text-[13.5px] font-bold transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/18 active:translate-y-0 active:scale-[0.98] lg:flex-none lg:px-6.5">
                <PlayCircle className="size-4" /> Google Play
              </button>
            </div>
          </div>
          <div className="hidden justify-center lg:flex">
            <ImageSlot
              label="App screenshot"
              className="animate-float mb-[-110px] h-95 w-60 rounded-[34px] border-[5px] border-white/20 shadow-[0_24px_60px_rgba(0,0,0,0.3)]"
            />
          </div>
        </Reveal>
      </section>

      <FinalCTA />

      <div className="h-20 lg:hidden" />
      <StickyActionBar className="lg:hidden">
        <Button size="cta" className="flex-1" render={<Link href="/register" />}>
          Register Free
        </Button>
        <Button variant="outline" size="cta" render={<Link href="/login" />}>
          Login
        </Button>
      </StickyActionBar>
    </>
  );
}
