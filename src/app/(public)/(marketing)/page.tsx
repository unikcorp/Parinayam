import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  ShieldCheck,
  Heart,
  MessageCircle,
  Check,
  Lock,
  Users,
  Star,
  Apple,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageSlot } from "@/components/shared/image-slot";
import { ProfileCard } from "@/components/profile/profile-card";
import { PlanCard } from "@/components/shared/plan-card";
import { HeroSearchCard } from "@/components/marketing/hero-search-card";
import { StickyActionBar } from "@/components/shared/sticky-action-bar";
import { Reveal } from "@/components/shared/reveal";
import { AnimatedStat } from "@/components/shared/animated-stat";
import { brand } from "@/data/brand";
import { featuredProfiles } from "@/data/featured-profiles.data";
import { homeStories } from "@/data/stories.data";
import { testimonials } from "@/data/testimonials.data";
import { homeBlogPosts } from "@/data/blog-posts.data";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";

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

const stats = [
  { value: "12,400+", label: "Verified profiles" },
  { value: "3,200+", label: "Marriages arranged" },
  { value: "14", label: "Districts across Kerala" },
  { value: "4.9★", label: "Average member rating" },
];

const steps = [
  {
    icon: FileText,
    tint: "bg-surface-blue text-primary",
    title: "Create your profile",
    desc: "Tell us about yourself, your family and what matters to you.",
  },
  {
    icon: ShieldCheck,
    tint: "bg-success-bg text-success",
    title: "Get verified",
    desc: "A quick ID check earns your badge and unlocks full search.",
  },
  {
    icon: Heart,
    tint: "bg-peach-bg text-peach-text",
    title: "Discover matches",
    desc: "AI-assisted matches curated by preference, horoscope and family values.",
  },
  {
    icon: MessageCircle,
    tint: "bg-surface-cream-2 text-gold-text",
    title: "Connect & meet",
    desc: "Express interest, chat privately, and let the families take it forward.",
  },
];

const whyUs = [
  { icon: ShieldCheck, title: "Manual verification", desc: "Every profile reviewed by our team before going live." },
  { icon: Lock, title: "Photo privacy", desc: "Photos visible only to members you approve." },
  { icon: Users, title: "Family involvement", desc: "Parent-managed profiles with clear labels." },
  { icon: Star, title: "Horoscope matching", desc: "Star, dosham and porutham checks built in." },
];

const verifySteps = [
  { title: "Government ID verified", desc: "Aadhaar or passport checked against the profile name." },
  { title: "Phone & photo verified", desc: "OTP-confirmed number and a live selfie match." },
  { title: "Community reviewed", desc: "Details cross-checked by our Kerala-based team." },
];

function StoryCard({
  story,
  imgClassName,
  compact,
}: {
  story: (typeof homeStories)[number];
  imgClassName: string;
  compact?: boolean;
}) {
  return (
    <div className="group h-full overflow-hidden rounded-2xl border border-[#F0E9DD] bg-card transition-all duration-200 hover:-translate-y-1.5 hover:shadow-card-hover">
      <div className="overflow-hidden">
        <ImageSlot
          label="Couple photo — wedding"
          className={`w-full transition-transform duration-500 ease-out group-hover:scale-105 ${imgClassName}`}
        />
      </div>
      <div className={compact ? "p-4" : "p-4.5 lg:p-6"}>
        <div className={compact ? "text-sm font-extrabold text-primary-deep" : "text-base font-extrabold text-primary-deep lg:text-[19px]"}>
          {story.couple}
        </div>
        <div className={compact ? "mt-0.5 mb-1.5 text-[11px] font-semibold text-gold" : "mt-1 mb-2 text-xs font-semibold text-gold lg:mb-3"}>
          Married {story.when} · {story.place}
        </div>
        <p className={compact ? "text-[12.5px] leading-[1.55] text-muted-foreground" : "text-[13px] leading-[1.6] text-muted-foreground lg:text-[15px] lg:leading-[1.65]"}>
          &ldquo;{story.quote}&rdquo;
        </p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={websiteJsonLd} />
      {/* HERO */}
      <section className="bg-hero-gradient relative overflow-hidden px-5 pt-8 pb-8 lg:px-18 lg:pt-18 lg:pb-0">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="lg:pb-18">
            <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both inline-flex items-center gap-2 rounded-full border border-[#F0E4D6] bg-card px-3.5 py-2 text-xs font-semibold text-gold-text duration-700 lg:px-4 lg:text-[13px]">
              <span className="size-2 animate-pulse rounded-full bg-gold" />
              Trusted by the {brand.community} community of Kerala
            </div>
            <h1 className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both mt-4.5 text-[36px] leading-[1.12] font-extrabold tracking-[-0.02em] text-primary-deep delay-100 duration-700 lg:mt-6 lg:text-[60px] lg:leading-[1.08] lg:tracking-[-0.025em]">
              Where families meet, and life stories begin.
            </h1>
            <p className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both mt-3 max-w-xl text-[15.5px] leading-[1.6] text-muted-foreground delay-200 duration-700 lg:mt-5 lg:text-[19px] lg:leading-[1.65]">
              Verified profiles, family-first matchmaking, and complete
              privacy — a premium matrimony experience designed for every
              generation.
            </p>

            <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both mt-6 hidden items-center gap-3.5 delay-300 duration-700 lg:flex">
              <Button size="cta" render={<Link href="/register" />}>
                Register Free
              </Button>
              <Button
                variant="outline"
                size="cta"
                className="border-[#E3D5C2] bg-white/70"
                render={<Link href="/login" />}
              >
                Login
              </Button>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both mt-6 flex items-center gap-5 text-[12.5px] font-semibold text-muted-foreground delay-400 duration-700 lg:mt-9 lg:text-sm">
              <span className="inline-flex items-center gap-2">
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-success-bg text-success">
                  <Check className="size-3" />
                </span>
                100% verified profiles
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-surface-blue text-primary">
                  <Lock className="size-3" />
                </span>
                Privacy protected
              </span>
            </div>
          </div>

          <div className="animate-in fade-in zoom-in-95 fill-mode-both relative flex justify-center delay-150 duration-700 lg:self-end">
            <div className="group relative w-[300px] lg:w-[460px]">
              <div className="relative h-[340px] w-full overflow-hidden rounded-[26px] border-[5px] border-white shadow-[0_20px_44px_rgba(127,29,29,0.16)] transition-shadow duration-300 lg:h-[520px] lg:rounded-[30px] lg:border-[6px] lg:shadow-[0_30px_60px_rgba(127,29,29,0.18)] lg:group-hover:shadow-[0_36px_72px_rgba(127,29,29,0.26)]">
                <Image
                  src="/photos/couple.jpg"
                  alt="A married couple in traditional Kerala wedding attire"
                  fill
                  priority
                  sizes="(max-width: 1024px) 300px, 460px"
                  className="object-cover object-top transition-transform duration-500 lg:group-hover:scale-105"
                />
              </div>
              <div className="animate-float absolute top-9 -left-4 hidden items-center gap-3 rounded-2xl bg-card px-4.5 py-3.5 shadow-[0_16px_40px_rgba(127,29,29,0.14)] lg:-left-18 lg:flex">
                <span className="flex size-10 items-center justify-center rounded-full bg-success-bg text-success">
                  <Heart className="size-4.5 fill-current" />
                </span>
                <div>
                  <div className="text-sm font-bold text-primary-deep">
                    Interest Accepted
                  </div>
                  <div className="text-xs text-faint">Aswin &amp; Aiswarya · Kochi</div>
                </div>
              </div>
              <div
                className="animate-float absolute bottom-4.5 -left-3 flex items-center gap-2.5 rounded-2xl bg-card px-3.5 py-2.5 shadow-[0_12px_30px_rgba(127,29,29,0.16)] lg:bottom-18 lg:-right-15 lg:left-auto lg:gap-3 lg:px-4.5 lg:py-3.5"
                style={{ animationDelay: "1s" }}
              >
                <span className="bg-gold-gradient flex size-8.5 items-center justify-center rounded-xl text-xs font-extrabold text-white lg:size-11 lg:text-sm">
                  92%
                </span>
                <div>
                  <div className="text-[12.5px] font-bold text-primary-deep lg:text-sm">
                    AI Match Score
                  </div>
                  <div className="text-[11px] text-faint">Highly compatible</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* mobile register CTA */}
        <div className="mt-6 flex flex-col gap-2.5 lg:hidden">
          <Button size="cta" className="w-full" render={<Link href="/register" />}>
            Register Free
          </Button>
        </div>
      </section>

      {/* search card — sibling of the hero section (not a descendant), so the
          hero's overflow-hidden (used to clip the decorative floating shapes)
          can't clip off the bottom of this card when it overlaps upward. */}
      <div id="search" className="relative z-10 mt-6 px-5 lg:-mt-12 lg:px-18">
        <HeroSearchCard />
      </div>

      {/* STATS */}
      <section className="bg-card px-5 py-7 lg:px-18 lg:pt-32 lg:pb-16">
        <div className="grid grid-cols-2 gap-3.5 text-center lg:grid-cols-4 lg:gap-6">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100}>
              <div className="rounded-2xl bg-surface p-4.5 transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover lg:bg-transparent lg:p-2 lg:hover:bg-surface lg:hover:shadow-card-hover">
                <AnimatedStat
                  value={s.value}
                  className="text-[27px] font-extrabold tracking-[-0.02em] text-primary tabular-nums lg:text-[44px]"
                />
                <div className="mt-1 text-[12.5px] font-semibold text-faint lg:text-[15px]">
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-surface px-5 py-9 lg:px-18 lg:py-18">
        <div className="mb-6 lg:mb-13 lg:text-center">
          <div className="mb-2 text-xs font-bold tracking-[0.12em] text-gold uppercase lg:mb-3 lg:text-[13px]">
            How it works
          </div>
          <h2 className="text-[26px] font-extrabold tracking-[-0.02em] text-primary-deep lg:text-4xl">
            Four simple steps to forever
          </h2>
        </div>
        <div className="flex flex-col gap-3.5 lg:grid lg:grid-cols-4 lg:gap-6">
          {steps.map((st, i) => (
            <Reveal key={st.title} delay={i * 120}>
              <div className="group flex items-start gap-4 rounded-2xl border border-card-border bg-card p-4.5 transition-all duration-200 lg:flex-col lg:gap-0 lg:p-7 lg:hover:-translate-y-1.5 lg:hover:shadow-card-hover">
                <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 lg:mb-5 lg:size-13 ${st.tint}`}>
                  <st.icon className="size-5 lg:size-6" />
                </span>
                <div>
                  <div className="text-[11px] font-bold text-gold lg:text-[13px]">
                    STEP {i + 1}
                  </div>
                  <div className="mt-0.5 mb-1 text-base font-bold text-primary-deep lg:mt-2 lg:mb-2.5 lg:text-xl">
                    {st.title}
                  </div>
                  <div className="text-[13.5px] leading-[1.55] text-muted-foreground lg:text-[15px] lg:leading-[1.6]">
                    {st.desc}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURED PROFILES */}
      <section className="bg-card py-9 pl-5 lg:px-18 lg:py-20">
        <div className="mb-5 flex items-end justify-between pr-5 lg:mb-10 lg:pr-0">
          <div>
            <div className="mb-2 text-xs font-bold tracking-[0.12em] text-gold uppercase lg:mb-3 lg:text-[13px]">
              Featured profiles
            </div>
            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-primary-deep lg:text-4xl">
              Premium members{" "}
              <span className="hidden lg:inline">near you</span>
            </h2>
          </div>
          <Button variant="outline" className="hidden lg:inline-flex" render={<Link href="/search" />}>
            View all profiles →
          </Button>
          <Link href="/search" className="text-[13px] font-bold text-primary lg:hidden">
            View all →
          </Link>
        </div>
        <div className="pn-scroll-x flex gap-3.5 overflow-x-auto pr-5 [scrollbar-width:none] lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pr-0 [&::-webkit-scrollbar]:hidden">
          {featuredProfiles.map((p, i) => (
            <Reveal key={p.name} delay={i * 100} className="shrink-0 lg:w-auto">
              <ProfileCard
                name={p.name}
                age={p.age}
                occupation={p.job}
                location={p.place}
                matchPercent={p.match}
                premium={p.premium}
                online={p.online}
                verified
                className="w-55 shrink-0 lg:w-auto"
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-primary-deep px-5 py-10 text-white lg:px-18 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal from="left">
            <div className="mb-2 text-xs font-bold tracking-[0.12em] text-gold-light uppercase lg:mb-3 lg:text-[13px]">
              Why choose us
            </div>
            <h2 className="mb-3 text-[26px] leading-[1.2] font-extrabold tracking-[-0.02em] lg:mb-5 lg:text-4xl lg:leading-[1.15]">
              Matchmaking built on trust, not just algorithms
            </h2>
            <p className="mb-6 text-[14.5px] leading-[1.65] text-white/70 lg:mb-9 lg:text-[17px] lg:leading-[1.7]">
              Every profile is manually reviewed and identity-verified before
              it appears in search. Your photos and contact details stay
              private until you choose to share them.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
              {whyUs.map((w) => (
                <div key={w.title} className="group flex items-start gap-3.5">
                  <span className="flex size-9.5 shrink-0 items-center justify-center rounded-xl bg-white/8 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/15 lg:size-10">
                    <w.icon className="size-4.5" />
                  </span>
                  <div>
                    <div className="text-[15px] font-bold">{w.title}</div>
                    <div className="mt-0.5 text-[13px] leading-[1.5] text-white/70">
                      {w.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal from="right" delay={150} className="rounded-3xl border border-white/12 bg-white/6 p-5 transition-colors duration-300 hover:bg-white/8 lg:p-10">
            <div className="mb-1.5 flex items-center gap-3 lg:mb-6">
              <span className="animate-pop flex size-10 items-center justify-center rounded-full border-2 border-gold-light bg-primary text-lg lg:size-14">
                <Check className="size-4.5 lg:size-5" />
              </span>
              <div>
                <div className="text-[17px] font-extrabold lg:text-2xl">
                  The Verified Badge
                </div>
                <div className="hidden text-sm text-white/70 lg:block">
                  What the red tick means on {brand.name}
                </div>
              </div>
            </div>
            <div className="text-[13px] leading-[1.6] text-white/70 lg:hidden">
              Government ID verified · Phone &amp; live selfie confirmed ·
              Reviewed by our Kerala-based team.
            </div>
            <div className="hidden lg:block">
              {verifySteps.map((v) => (
                <div key={v.title} className="flex gap-3.5 border-t border-white/10 py-4 transition-colors duration-200 hover:bg-white/4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-success-bg text-xs font-extrabold text-success">
                    <Check className="size-3.5" />
                  </span>
                  <div>
                    <div className="text-[15px] font-bold">{v.title}</div>
                    <div className="mt-0.5 text-[13px] text-white/70">{v.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section id="stories" className="bg-surface-cream py-9 pl-5 lg:px-18 lg:py-20">
        <div className="mb-5 flex items-end justify-between pr-5 lg:mb-10 lg:pr-0">
          <div>
            <div className="mb-2 text-xs font-bold tracking-[0.12em] text-gold uppercase lg:mb-3 lg:text-[13px]">
              Success stories
            </div>
            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-primary-deep lg:text-4xl">
              3,200+ marriages and counting
            </h2>
          </div>
          <Button variant="outline" className="hidden lg:inline-flex" render={<Link href="/stories" />}>
            View all stories →
          </Button>
          <Link href="/stories" className="text-[13px] font-bold text-primary lg:hidden">
            View all →
          </Link>
        </div>

        {/* mobile: uniform horizontal scroll */}
        <div className="pn-scroll-x flex gap-3.5 overflow-x-auto pr-5 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
          {homeStories.map((story, i) => (
            <Reveal key={story.couple} delay={i * 120} className="w-65 shrink-0">
              <StoryCard story={story} imgClassName="h-42.5" />
            </Reveal>
          ))}
        </div>

        {/* desktop: featured story + two stacked */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-7">
          <Reveal className="lg:col-span-2">
            <StoryCard story={homeStories[0]} imgClassName="h-72" />
          </Reveal>
          <div className="flex flex-col gap-7">
            {homeStories.slice(1).map((story, i) => (
              <Reveal key={story.couple} delay={(i + 1) * 120} className="flex-1">
                <StoryCard story={story} imgClassName="h-32" compact />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section id="plans" className="bg-card px-5 py-9 lg:px-18 lg:py-24">
        <div className="mb-8 lg:mb-16 lg:flex lg:items-end lg:justify-between lg:gap-10">
          <div>
            <div className="mb-2 text-xs font-bold tracking-[0.12em] text-gold uppercase lg:mb-3 lg:text-[13px]">
              Membership
            </div>
            <h2 className="text-[26px] font-extrabold tracking-[-0.02em] text-primary-deep lg:text-4xl">
              Simple, honest pricing
            </h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground lg:mt-0 lg:text-right lg:text-[17px]">
            Start free. Upgrade when you&apos;re ready to connect.
          </p>
        </div>
        <div className="mx-auto flex max-w-[1120px] flex-col gap-4.5 lg:grid lg:grid-cols-3 lg:items-center lg:gap-7">
          <Reveal delay={0}>
            <PlanCard
              name="Free"
              price="₹0"
              period="forever"
              ctaLabel="Get started"
              features={[
                "Create a full profile",
                "Browse verified profiles",
                "5 interests per month",
                "Daily match suggestions",
              ]}
            />
          </Reveal>
          <Reveal delay={120} className="lg:z-10 lg:scale-[1.05]">
            <PlanCard
              name="Premium"
              price="₹2,900"
              period="/ 3 months"
              badge="Most popular"
              dark
              ctaLabel="Go Premium"
              features={[
                "Unlimited interests & chat",
                "View contact numbers",
                "See who visited you",
                "Horoscope match reports",
                "Priority in search results",
              ]}
            />
          </Reveal>
          <Reveal delay={240}>
            <PlanCard
              name="Elite"
              price="₹7,500"
              period="/ 6 months"
              ctaLabel="Talk to us"
              className="border-gold-light"
              features={[
                "Everything in Premium",
                "Dedicated relationship manager",
                "Handpicked weekly matches",
                "Profile highlight & Elite badge",
                "Family meeting coordination",
              ]}
            />
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-surface px-5 py-9 lg:px-18 lg:py-24">
        <div className="grid grid-cols-1 gap-4.5 lg:grid-cols-3 lg:gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 100} className={i === 1 ? "lg:-translate-y-5" : ""}>
              <div className="rounded-2xl border border-card-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover lg:p-7.5">
                <div className="mb-3 text-gold">★★★★★</div>
                <p className="mb-5 text-[15px] leading-[1.7] text-foreground/85">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <span className="flex size-10.5 items-center justify-center rounded-full bg-surface-blue text-[15px] font-extrabold text-primary">
                    {t.initials}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-primary-deep">{t.name}</div>
                    <div className="text-xs text-faint">{t.meta}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

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
                  <ImageSlot
                    label="Article image"
                    className="h-40 w-full transition-transform duration-500 ease-out group-hover:scale-105 lg:h-47.5"
                  />
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
