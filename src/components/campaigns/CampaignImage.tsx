"use client";

import { useCampaignImage } from "@/hooks/useCampaignImage";

interface CampaignImageProps {
  imageUrl: string | null;
  externalUrl: string | null | undefined;
  isExternal: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function CampaignImage({ 
  imageUrl, 
  externalUrl, 
  isExternal,
  className = "",
  style = {}
}: CampaignImageProps) {
  const { imageUrl: fetchedImageUrl, isLoading } = useCampaignImage(
    isExternal && !imageUrl && externalUrl ? externalUrl : null
  );

  const displayImage = imageUrl || fetchedImageUrl;
  const backgroundStyle: React.CSSProperties = {
    ...style,
    backgroundImage: displayImage
      ? `url(${displayImage})`
      : "linear-gradient(135deg, hsl(var(--primary)/0.3) 0%, hsl(var(--accent)/0.3) 100%)",
    opacity: isLoading ? 0.7 : 1,
    transition: "opacity 0.3s ease-in-out",
  };

  return (
    <div
      className={`bg-cover bg-center ${className}`}
      style={backgroundStyle}
    />
  );
}
