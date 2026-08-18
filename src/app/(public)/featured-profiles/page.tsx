import Link from "next/link";
import { Lock } from "lucide-react";
import { SimpleHeader } from "@/components/layout/simple-header";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/profile/profile-card";
import { fetchFeaturedProfiles } from "@/lib/featured-profiles";

export default async function FeaturedProfilesPage() {
  const profiles = await fetchFeaturedProfiles();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface-cream">
      <SimpleHeader
        mobileTitle="Featured profiles"
        right={
          <Button size="sm" render={<Link href="/register" />}>
            Register Free
          </Button>
        }
      />

      <section className="px-5 pt-9 pb-6 text-center lg:px-12 lg:pt-13 lg:pb-9">
        <div className="mb-2.5 text-xs font-bold tracking-[0.12em] text-gold uppercase lg:mb-3 lg:text-[13px]">
          Featured profiles
        </div>
        <h1 className="mb-2.5 text-[26px] font-extrabold tracking-[-0.02em] text-primary-deep lg:mb-3 lg:text-[44px]">
          Premium members on Parinayam
        </h1>
        <p className="mx-auto max-w-140 text-sm text-muted-foreground lg:text-[16.5px]">
          A preview of our featured members. Log in or register to see full profiles, send
          interest and shortlist a match.
        </p>
      </section>

      {profiles.length === 0 ? (
        <div className="px-5 pb-16 text-center text-sm text-faint">No featured profiles yet — check back soon.</div>
      ) : (
        <div className="grid grid-cols-1 gap-5 px-5 pb-9 sm:grid-cols-2 lg:grid-cols-4 lg:px-12 lg:pb-12">
          {profiles.map((p) => (
            <ProfileCard
              key={p.id}
              teaser
              name={p.name}
              age={p.age}
              gender={p.gender}
              occupation={p.occupation ?? "—"}
              location={p.place}
              photoUrl={p.photoUrl}
              premium={p.isPremium}
              verified={p.verified}
            />
          ))}
        </div>
      )}

      <section className="px-5 pb-16 text-center lg:px-12 lg:pb-24">
        <div className="mx-auto max-w-140 rounded-2xl border border-[#F0E4D6] bg-card px-6 py-8">
          <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-peach-bg text-primary">
            <Lock className="size-5" />
          </div>
          <h2 className="mb-1.5 text-lg font-extrabold text-primary-deep">
            Log in to see more profiles
          </h2>
          <p className="mb-5 text-sm text-muted-foreground">
            These 4 are just a preview — thousands of verified members are waiting inside.
          </p>
          <div className="flex flex-col justify-center gap-2.5 sm:flex-row">
            <Button render={<Link href="/login" />}>Login</Button>
            <Button variant="outline" render={<Link href="/register" />}>
              Register Free
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
