"use client";

import Link from "next/link";

interface AuthFooterProps {
  text: string;
  linkText: string;
  href: string;
}

export default function AuthFooter({ text, linkText, href }: AuthFooterProps) {
  return (
    <div className="mt-12 text-center">
      <span className="text-white/30 text-[11px] font-bold uppercase tracking-widest">{text} </span>
      <Link href={href} className="text-primary font-black uppercase tracking-widest text-[11px] hover:text-white transition-colors ml-1 italic">
        {linkText}
      </Link>
    </div>
  );
}
