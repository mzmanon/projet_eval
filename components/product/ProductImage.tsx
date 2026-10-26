"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import Image from "next/image";

interface ProductImageProps {
  src: string;
  alt: string;
  house: string;
  name: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

function isSupabaseStorageAsset(src: string) {
  return /^https:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\//.test(src);
}

function isConfiguredRemoteImage(src: string) {
  try {
    const url = new URL(src);
    return (
      url.protocol === "https:" &&
      [
        "images.unsplash.com",
        "upload.wikimedia.org",
        "commons.wikimedia.org",
      ].includes(url.hostname)
    );
  } catch {
    return false;
  }
}

function isApprovedProductAsset(src: string) {
  return (
    src.startsWith("/") ||
    isSupabaseStorageAsset(src) ||
    isConfiguredRemoteImage(src)
  );
}

export default function ProductImage({
  src,
  alt,
  house,
  name,
  sizes,
  priority = false,
  className = "object-contain",
}: ProductImageProps) {
  const [isUnavailable, setIsUnavailable] = useState(false);
  const canRenderImage = isApprovedProductAsset(src) && !isUnavailable;

  if (!canRenderImage) {
    return (
      <div
        role="img"
        aria-label={`Photographie indisponible : ${house} ${name}`}
        className="absolute inset-0 flex items-center justify-center bg-[#F1EEE7] px-2 text-center"
      >
        <span className="text-[8px] font-medium uppercase tracking-[0.18em] text-[#A58C62]">
          Photographie indisponible
        </span>
      </div>
    );
  }

  if (isSupabaseStorageAsset(src)) {
    return (
      // Supabase assets are supplied by the product team at runtime. Native img avoids
      // coupling their project hostname to Next's static remote-image allowlist.
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full ${className}`}
        onError={() => setIsUnavailable(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setIsUnavailable(true)}
    />
  );
}
