import { useEffect } from "react";

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  adStyle?: React.CSSProperties;
  className?: string;
}

/**
 * Google AdSense Display Ad Component
 *
 * Usage:
 * <AdSenseAd adSlot="1234567890" adFormat="auto" />
 *
 * Get your ad slot ID from Google AdSense dashboard after creating an ad unit.
 */
export function AdSenseAd({
  adSlot,
  adFormat = "auto",
  adStyle = { display: "block" },
  className = "",
}: AdSenseAdProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={adStyle}
      data-ad-client="ca-pub-2634488321937643"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive="true"
    />
  );
}

/**
 * Sidebar Ad (300x250 or 300x600)
 * Good for desktop dashboard sidebar
 */
export function SidebarAd() {
  return (
    <div className="hidden lg:block">
      <div className="sticky top-20 mb-4">
        <p className="text-xs text-muted-foreground mb-2">Advertisement</p>
        <AdSenseAd
          adSlot="1234567890" // Replace with your actual ad slot
          adFormat="auto"
          adStyle={{ display: "block", minHeight: "250px" }}
          className="border rounded-lg"
        />
      </div>
    </div>
  );
}

/**
 * Horizontal Banner Ad (728x90 or responsive)
 * Good for below hero, above footer, between sections
 */
export function HorizontalBannerAd() {
  return (
    <div className="w-full my-8">
      <p className="text-xs text-muted-foreground mb-2 text-center">
        Advertisement
      </p>
      <div className="max-w-4xl mx-auto">
        <AdSenseAd
          adSlot="0987654321" // Replace with your actual ad slot
          adFormat="horizontal"
          adStyle={{ display: "block", minHeight: "90px" }}
          className="border rounded-lg"
        />
      </div>
    </div>
  );
}

/**
 * In-Feed Ad (Multiplex)
 * Good for leaderboard entries, between list items
 */
export function InFeedAd() {
  return (
    <div className="my-4">
      <p className="text-xs text-muted-foreground mb-2">Sponsored</p>
      <AdSenseAd
        adSlot="1122334455" // Replace with your actual ad slot
        adFormat="fluid"
        adStyle={{ display: "block" }}
        className="border rounded-lg p-4"
      />
    </div>
  );
}

/**
 * Mobile Banner Ad (320x50 or 320x100)
 * Shows only on mobile devices
 */
export function MobileBannerAd() {
  return (
    <div className="lg:hidden my-4">
      <p className="text-xs text-muted-foreground mb-2 text-center">
        Advertisement
      </p>
      <AdSenseAd
        adSlot="5544332211" // Replace with your actual ad slot
        adFormat="auto"
        adStyle={{ display: "block", minHeight: "50px" }}
        className="border rounded-lg"
      />
    </div>
  );
}

/**
 * Square Ad (250x250)
 * Versatile, works in many layouts
 */
export function SquareAd() {
  return (
    <div className="my-4">
      <p className="text-xs text-muted-foreground mb-2">Advertisement</p>
      <div className="max-w-xs mx-auto">
        <AdSenseAd
          adSlot="6677889900" // Replace with your actual ad slot
          adFormat="rectangle"
          adStyle={{ display: "block", width: "250px", height: "250px" }}
          className="border rounded-lg"
        />
      </div>
    </div>
  );
}
