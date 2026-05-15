"use client";
export function FooterScript({ code }: { code?: string }) {
  if (!code) return null;
  return <div dangerouslySetInnerHTML={{ __html: code }} />;
}
