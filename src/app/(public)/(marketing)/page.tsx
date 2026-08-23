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
import { homeBlogPosts } from "@/data/blog-posts.data";
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

      {/* BLOG */}
      <section id="blog" className="bg-card px-5 pt-2 pb-9 lg:px-18 lg:pt-4 lg:pb-20">
        <div className="mb-5 flex items-end justify-between lg:mb-10">
          <div>
            <div className="mb-2 text-xs font-bold tracking-[0.12em] text-gold uppercase lg:mb-3 lg:text-[13px]">
              From the blog
            </div>
            <h2 className="text-xl font-extrabold tracking-[-0.02em] text-primary-deep lg:text-[36px]">
              Advice for your journey
            </h2>
          </div>
          <Button variant="outline" className="hidden lg:inline-flex" render={<Link href="/blog" />}>
            All articles →
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-7">
          {homeBlogPosts.map((post, i) => (
            <Reveal key={post.title} delay={i * 100}>
              <div className="group overflow-hidden rounded-2xl border border-card-border transition-all duration-200 lg:hover:-translate-y-1.5 lg:hover:shadow-card-hover">
                <div className="overflow-hidden">
                  {post.image ? (
                    <div className="relative h-40 w-full overflow-hidden transition-transform duration-500 ease-out group-hover:scale-105 lg:h-47.5">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-top"
                      />
                    </div>
                  ) : (
                    <ImageSlot
                      label="Article image"
                      className="h-40 w-full transition-transform duration-500 ease-out group-hover:scale-105 lg:h-47.5"
                    />
                  )}
                </div>
                <div className="p-5">
                  <div className="text-xs font-bold tracking-wide text-primary uppercase">
                    {post.tag}
                  </div>
                  <div className="mt-2 mb-2 text-base leading-[1.35] font-bold text-primary-deep transition-colors duration-200 group-hover:text-primary lg:text-[18px]">
                    {post.title}
                  </div>
                  <div className="text-xs text-faint">{post.meta}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
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
