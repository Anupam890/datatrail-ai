"use client";

import Link from "next/link";

interface AuthFooterProps {
  text: string;
  linkText: string;
  href: string;
}

export default function AuthFooter({ text, linkText, href }: AuthFooterProps) {
  return (
    <div className="mt-8 text-center text-sm">
      <span className="text-muted-foreground">{text} </span>
      <Link href={href} className="text-primary font-bold hover:underline">
        {linkText}
      </Link>
    </div>
  );
}
