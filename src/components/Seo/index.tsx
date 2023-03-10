"use client";
import { usePathname } from "next/navigation";
import { NextSeo, NextSeoProps } from "next-seo";
import { OpenGraph } from "next-seo/lib/types";

export type SeoProps = Pick<NextSeoProps, "nofollow" | "noindex" | "title"> &
  Pick<OpenGraph, "type">;

export default function Seo({
  nofollow = false,
  noindex = false,
  title,
  type = "article",
}: SeoProps): JSX.Element {
  const pathname = usePathname();

  return (
    <NextSeo
      canonical={`https://planning-poker.kk-web.link${pathname || ""}`}
      defaultTitle="プランニングポーカー"
      description="オンライン版プランニングポーカーです。"
      nofollow={nofollow}
      noindex={noindex}
      openGraph={{
        type,
        images: [
          {
            alt: "プランニングポーカー",
            height: 256,
            type: "image/png",
            url: "https://planning-poker.kk-web.link/pp.png",
            width: 256,
          },
        ],
        url: "https://planning-poker.kk-web.link/",
      }}
      title={title}
      titleTemplate="%s - プランニングポーカー"
      twitter={{
        cardType: "summary",
      }}
      useAppDir={true}
    />
  );
}
