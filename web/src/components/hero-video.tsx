"use client";

import { useEffect, useRef } from "react";

export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    const pending = video.play();
    if (pending) pending.catch(() => undefined);
  }, []);

  return (
    <video
      ref={ref}
      className="hero-video absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster="/media/hero-poster.jpg"
      aria-hidden="true"
    >
      <source src="/media/hero.mp4" type="video/mp4" />
    </video>
  );
}
