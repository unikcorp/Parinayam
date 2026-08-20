"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { SimpleHeader } from "@/components/layout/simple-header";
import { Button } from "@/components/ui/button";
import { useCmsPage } from "@/hooks/use-cms-page";
import { ApiError } from "@/lib/api";

export default function LegalPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useCmsPage(slug);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface">
      <SimpleHeader
        mobileTitle={data?.cms_title ?? "Page"}
        right={
          <Button variant="outline" size="sm" className="hidden lg:inline-flex" render={<Link href="/" />}>
            Back to home
          </Button>
        }
      />

      <div className="mx-auto w-full max-w-190 px-5 py-10 lg:px-6 lg:py-14">
        {isLoading ? (
          <p className="py-16 text-center text-sm text-faint">Loading…</p>
        ) : error instanceof ApiError && error.status === 404 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-destructive">This page isn&apos;t available.</p>
          </div>
        ) : data ? (
          <>
            <h1 className="mb-6 text-2xl font-extrabold tracking-[-0.02em] text-primary-deep lg:mb-8 lg:text-[32px]">
              {data.cms_title}
            </h1>
            <div
              className="text-[14px] leading-[1.75] text-[#4A5568] [&_h1]:mb-2 [&_h1]:font-extrabold [&_h1]:text-primary-deep [&_h2]:mb-2 [&_h2]:font-extrabold [&_h2]:text-primary-deep [&_h3]:mb-2 [&_h3]:font-extrabold [&_h3]:text-primary-deep [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:text-primary-deep [&_a]:text-primary [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: data.cms_content }}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
