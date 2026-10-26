"use client";

import { useState } from "react";
import Image from "next/image";

interface EditorialImageProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
}

export default function EditorialImage({
  src,
  alt,
  sizes,
  className = "object-cover",
}: EditorialImageProps) {
  const [isUnavailable, setIsUnavailable] = useState(false);

  if (isUnavailable) {
    return (
      <div
        role="img"
        aria-label={`Photographie indisponible : ${alt}`}
        className="absolute inset-0 flex items-center justify-center bg-[#F1EEE7] px-6 text-center"
      >
        <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#827D75]">
          Photographie momentanément indisponible
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      onError={() => setIsUnavailable(true)}
    />
  );
}
