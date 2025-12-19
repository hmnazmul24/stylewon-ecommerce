import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <Image
        src="/logo.png"
        className="drop-shadow-xs drop-shadow-black/60 h-16 w-auto"
        height={150}
        width={150}
        alt="Logo"
      />
    </Link>
  );
}
