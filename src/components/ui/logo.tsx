import Image from "next/image";
import { siteConfig } from "@/config/site";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src={siteConfig.assets.logo}
      alt={`${siteConfig.name} Logo`}
      width={100}
      height={100}
      className={className}
      priority
    />
  );
}
