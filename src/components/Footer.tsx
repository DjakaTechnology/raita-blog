import Link from "next/link";
import Image from "next/image";
import logoDark from "../../public/logo-dark.svg";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col gap-3">
          <Link href="https://raita.ai" className="flex items-center">
            <Image src={logoDark} alt="Raita logo" className="h-12 w-auto" unoptimized />
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-gray-50">Content</h3>
          <nav className="flex flex-col gap-2 text-sm">
            <Link href="/blog" className="hover:text-gray-50 transition-colors">Blog</Link>
            <Link href="/wiki" className="hover:text-gray-50 transition-colors">Wiki</Link>
          </nav>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-gray-50">Product</h3>
          <nav className="flex flex-col gap-2 text-sm">
            <Link href="https://raita.ai" className="hover:text-gray-50 transition-colors">Home</Link>
          </nav>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-700 text-center text-sm opacity-60">
        <p>&copy; {new Date().getFullYear()} Raita. All rights reserved.</p>
      </div>
    </footer>
  );
}
