"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

const measureScript = `(function(){var el=document.getElementById("site-header");if(!el)return;var apply=function(){document.documentElement.style.setProperty("--site-header-height",el.getBoundingClientRect().height+"px")};apply();if(window.__pcsHeaderObserver)window.__pcsHeaderObserver.disconnect();if(window.ResizeObserver){window.__pcsHeaderObserver=new ResizeObserver(apply);window.__pcsHeaderObserver.observe(el)}})();`;

export function SiteHeaderFrame({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = () => {
      document.documentElement.style.setProperty("--site-header-height", `${el.getBoundingClientRect().height}px`);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header ref={ref} id="site-header" className={className}>
        {children}
      </header>
      <script dangerouslySetInnerHTML={{ __html: measureScript }} />
    </>
  );
}
