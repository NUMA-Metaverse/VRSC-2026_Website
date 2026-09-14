import type { Metadata, Viewport } from "next";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_URL,
  optionalEnv,
  siteUrl,
} from "@/lib/site";
import { event } from "@/data/event";
import { presentationDates } from "@/data/recruitment";
import "./globals.css";

const verificationOther = {
  ...(optionalEnv("NEXT_PUBLIC_BING_SITE_VERIFICATION") && {
    "msvalidate.01": optionalEnv("NEXT_PUBLIC_BING_SITE_VERIFICATION"),
  }),
  ...(optionalEnv("NEXT_PUBLIC_BAIDU_SITE_VERIFICATION") && {
    "baidu-site-verification": optionalEnv("NEXT_PUBLIC_BAIDU_SITE_VERIFICATION"),
  }),
  ...(optionalEnv("NEXT_PUBLIC_NAVER_SITE_VERIFICATION") && {
    "naver-site-verification": optionalEnv("NEXT_PUBLIC_NAVER_SITE_VERIFICATION"),
  }),
};

const googleVerification =
  optionalEnv("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION") ??
  "YMO6A8rlWpn0SweNCLanLDRfy47We-_QQunMsFc-uBY";

const verification: Metadata["verification"] = {
  ...(googleVerification && {
    google: googleVerification,
  }),
  ...(optionalEnv("NEXT_PUBLIC_YANDEX_SITE_VERIFICATION") && {
    yandex: optionalEnv("NEXT_PUBLIC_YANDEX_SITE_VERIFICATION"),
  }),
  ...(optionalEnv("NEXT_PUBLIC_YAHOO_SITE_VERIFICATION") && {
    yahoo: optionalEnv("NEXT_PUBLIC_YAHOO_SITE_VERIFICATION"),
  }),
  ...(Object.keys(verificationOther).length > 0 && { other: verificationOther }),
};

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  category: "event",
  creator: "全国学生VRサークル活動報告大会",
  publisher: "全国学生VRサークル活動報告大会",
  alternates: {
    canonical: "/",
    languages: {
      "ja-JP": "/",
    },
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "ja_JP",
    siteName: SITE_NAME,
    url: SITE_URL,
    images: [{
      url: siteUrl("/ogp.jpg"),
      width: 1200,
      height: 630,
      alt: SITE_NAME,
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [siteUrl("/ogp.jpg")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  ...(Object.keys(verification).length > 0 && { verification }),
};

export const viewport: Viewport = {
  themeColor: "#f7f5ec",
  colorScheme: "light",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: SITE_NAME,
  alternateName: SITE_SHORT_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: [siteUrl("/ogp.jpg"), siteUrl("/event-2026/hero.webp")],
  startDate: presentationDates[0].dateTime,
  endDate: "2026-10-11T22:50:00+09:00",
  eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  inLanguage: "ja-JP",
  location: {
    "@type": "VirtualLocation",
    url: SITE_URL,
    name: event.venue.label,
  },
  organizer: {
    "@type": "Organization",
    name: "全日本大学メタバース連盟 NUMA（共催：東京大学VRサークル UT-virtual）",
    url: SITE_URL,
  },
  subEvent: presentationDates.map((date, index) => ({
    "@type": "Event",
    name: `${SITE_SHORT_NAME} ${index + 1}日目`,
    startDate: date.dateTime,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "VirtualLocation",
      url: SITE_URL,
    },
  })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}

