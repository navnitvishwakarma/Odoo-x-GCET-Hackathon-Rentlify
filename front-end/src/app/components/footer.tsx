import { motion } from "motion/react";
import { Shield, Truck, RefreshCw, Phone } from "lucide-react";

export function Footer({ onSupportClick }: { onSupportClick?: () => void }) {
  return (
    <footer className="bg-card border-t border-border mt-24">
      {/* Trust Indicators */}
      <div className="border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 cursor-pointer" onClick={onSupportClick}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-start gap-4"
            >
              <div className="p-3 bg-secondary/50 rounded-2xl">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="mb-1">Free Delivery</h4>
                <p className="text-sm text-muted-foreground">
                  On all orders over ₹500
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="p-3 bg-secondary/50 rounded-2xl">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="mb-1">Flexible Returns</h4>
                <p className="text-sm text-muted-foreground">
                  30-day return policy
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-start gap-4"
            >
              <div className="p-3 bg-secondary/50 rounded-2xl">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="mb-1">Secure Payments</h4>
                <p className="text-sm text-muted-foreground">
                  100% protected transactions
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-start gap-4"
            >
              <div className="p-3 bg-secondary/50 rounded-2xl">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="mb-1">24/7 Support</h4>
                <p className="text-sm text-muted-foreground">
                  Always here to help
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-2xl tracking-tight">Rentlify</h3>
            <p className="text-muted-foreground max-w-xs">
              Premium furniture and appliances rental platform.
              Rent monthly or buy and own forever.
            </p>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h4 className="text-sm uppercase tracking-wider">About</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sustainability
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={onSupportClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </button>
              </li>
              <li>
                <button onClick={onSupportClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Track Order
                </a>
              </li>
              <li>
                <button onClick={onSupportClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h4 className="text-sm uppercase tracking-wider">Policies</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Rental Agreement
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Return Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 Rentlify. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Instagram
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Twitter
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Facebook
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pinterest
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}