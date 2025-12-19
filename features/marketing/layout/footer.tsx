import ThemeToggle from "@/components/shared/toggle-theme";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-dashed">
      <div className="mx-auto max-w-5xl px-4 py-10 xl:px-0">
        {/* Top Section */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h4 className="mb-3 text-base font-semibold">Shop</h4>
            <ul className="text-foreground space-y-2 text-sm">
              <li>Men</li>
              <li>Women</li>
              <li>Kids</li>
              <li>Accessories</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-base font-semibold">Support</h4>
            <ul className="text-foreground space-y-2 text-sm">
              <li>Contact Us</li>
              <li>FAQs</li>
              <li>Shipping</li>
              <li>Returns</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-base font-semibold">Company</h4>
            <ul className="text-foreground space-y-2 text-sm">
              <li>About Us</li>
              <li>Careers</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          <ThemeToggle />
        </div>
        <div className="text-foreground mt-10 flex justify-between border-t border-dashed pt-5 text-sm">
          <p>© 2025 ModernShop. All rights reserved.</p>
          <p className="text-xs">Crafted with ❤️</p>
        </div>
      </div>
      {/* Divider */}
    </footer>
  );
}
