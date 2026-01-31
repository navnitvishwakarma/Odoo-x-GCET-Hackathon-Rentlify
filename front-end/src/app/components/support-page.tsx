import { motion, AnimatePresence } from "motion/react";
import {
    Search,
    ChevronDown,
    MessageSquare,
    Phone,
    Mail,
    ShieldCheck,
    RefreshCcw,
    Truck,
    CreditCard,
    LifeBuoy,
    ArrowRight,
    ChevronLeft,
    Info
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";

const FAQS = [
    {
        question: "How does the security deposit work?",
        answer: "A security deposit is collected to ensure the safety of our premium products. It is fully refundable within 7-10 working days after the product is returned and inspected for any major damages.",
        category: "Payment"
    },
    {
        question: "What happens if I accidentally damage a product?",
        answer: "Minor wear and tear is expected and covered. For significant damages, we assess the repair cost and deduct it from the security deposit. We recommend our 'Rentlify Care' protection plan for complete peace of mind.",
        category: "Rentals"
    },
    {
        question: "Can I upgrade my rented product mid-tenure?",
        answer: "Yes, you can upgrade to a different product after completing at least 3 months of your current tenure. A minor processing fee and a change in monthly rent may apply.",
        category: "Rentals"
    },
    {
        question: "What documents are required for KYC?",
        answer: "We typically require a valid Government ID (Aadhar/Pan Card) and proof of address. For high-value rentals, we may request income verification or a linked LinkedIn profile.",
        category: "Account"
    }
];

export function SupportPage({ onBack }: { onBack: () => void }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const filteredFaqs = FAQS.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Header */}
            <section className="bg-secondary/30 border-b border-border py-20">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center space-y-8">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mx-auto mb-8"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back to homepage</span>
                    </button>
                    <div className="space-y-4">
                        <h1 className="text-5xl font-serif italic tracking-tight">How can we help you?</h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto italic">Our dedicated concierge team is available 24/7 to assist with your rentals and purchases.</p>
                    </div>

                    <div className="max-w-2xl mx-auto relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search for articles, policies, or FAQs..."
                            className="h-16 pl-16 pr-8 bg-background border-none rounded-full shadow-2xl focus:ring-2 focus:ring-primary/20 transition-all text-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 space-y-24">
                {/* Support Categories */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: "Rental Policies", icon: LifeBuoy, desc: "Late fees, extensions, and ownership transfers." },
                        { title: "Delivery & Returns", icon: Truck, desc: "Tracking, scheduling, and pickup guidelines." },
                        { title: "Payments & Bill", icon: CreditCard, desc: "Invoices, deposits, and payment methods." },
                        { title: "Damage & Repair", icon: ShieldCheck, desc: "Protection plans and assessment rules." },
                    ].map((cat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className="p-8 rounded-[2rem] bg-card border border-border space-y-6 hover:shadow-2xl transition-all cursor-pointer group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                <cat.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-medium">{cat.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed italic">{cat.desc}</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary pt-2">
                                Read Articles <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    ))}
                </section>

                {/* FAQ & Policies Split */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    {/* FAQ Column */}
                    <div className="lg:col-span-7 space-y-10">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-medium tracking-tight">Frequently Asked Questions</h2>
                            <div className="h-1 w-20 bg-primary/20 rounded-full" />
                        </div>

                        <div className="space-y-4">
                            {filteredFaqs.map((faq, i) => (
                                <div key={i} className="border border-border rounded-2xl overflow-hidden bg-card transition-all hover:border-muted-foreground/30">
                                    <button
                                        onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                        className="w-full px-8 py-6 flex items-center justify-between text-left group"
                                    >
                                        <div className="space-y-1">
                                            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter opacity-70 group-hover:opacity-100">{faq.category}</Badge>
                                            <p className="font-medium text-lg leading-snug">{faq.question}</p>
                                        </div>
                                        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${activeFaq === i ? "rotate-180" : ""}`} />
                                    </button>
                                    <AnimatePresence>
                                        {activeFaq === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="bg-secondary/20"
                                            >
                                                <div className="px-8 pb-8 pt-2 text-muted-foreground leading-relaxed italic border-t border-border/50">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Help Column */}
                    <div className="lg:col-span-5 space-y-12">
                        <section className="space-y-8">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-medium tracking-tight">Contact Concierge</h2>
                                <div className="h-1 w-20 bg-primary/20 rounded-full" />
                            </div>

                            <div className="grid gap-4">
                                <a href="#" className="p-6 rounded-3xl border border-border flex items-center gap-6 hover:bg-secondary/30 transition-all group">
                                    <div className="p-4 bg-primary/5 rounded-2xl text-primary">
                                        <MessageSquare className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Live Chat Support</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Average wait time: 2 mins</p>
                                    </div>
                                    <div className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                </a>
                                <a href="tel:+919876543210" className="p-6 rounded-3xl border border-border flex items-center gap-6 hover:bg-secondary/30 transition-all group">
                                    <div className="p-4 bg-secondary rounded-2xl text-muted-foreground">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Direct Line</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">+91 98765 43210 (24/7)</p>
                                    </div>
                                </a>
                                <a href="mailto:concierge@rentlify.com" className="p-6 rounded-3xl border border-border flex items-center gap-6 hover:bg-secondary/30 transition-all group">
                                    <div className="p-4 bg-secondary rounded-2xl text-muted-foreground">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Email Support</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">concierge@rentlify.com</p>
                                    </div>
                                </a>
                            </div>
                        </section>

                        <section className="p-8 rounded-[2rem] bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white space-y-6 relative overflow-hidden group">
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Info className="w-5 h-5 text-primary" />
                                    <h3 className="font-medium">Emergency Assistance</h3>
                                </div>
                                <p className="text-sm text-neutral-400 italic leading-relaxed">
                                    Need immediate help with a delivery already in progress or a damaged product? Mark your request as 'Urgent' in our portal.
                                </p>
                                <Button className="w-full bg-white text-black hover:bg-primary hover:text-white rounded-xl h-12">Submit Urgent Ticket</Button>
                            </div>
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <LifeBuoy className="w-32 h-32 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
                            </div>
                        </section>
                    </div>
                </section>

                {/* Claims & Policies Quick Overview */}
                <section className="space-y-12 py-12 border-t border-border">
                    <div className="text-center space-y-2">
                        <h2 className="text-4xl font-serif">Platform Guidelines</h2>
                        <p className="text-muted-foreground italic">Summarized policies for our premium community.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { title: "Damage Assessment", icon: RefreshCcw, text: "Wait 24 hours after delivery to report any initial transit damage for a free replacement." },
                            { title: "KYC Verification", icon: ShieldCheck, text: "A one-time digital check is required for all new members to ensure security." },
                            { title: "Ownership", icon: Info, text: "Buy-out options are available for most products after 12 months of rental." },
                        ].map((p, i) => (
                            <div key={i} className="space-y-4">
                                <div className="p-4 bg-secondary w-fit rounded-2xl">
                                    <p.icon className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <h4 className="text-lg font-medium">{p.title}</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed italic">{p.text}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Floating Chat Trigger */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center z-50 group overflow-hidden"
            >
                <MessageSquare className="w-7 h-7" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
        </div>
    );
}
