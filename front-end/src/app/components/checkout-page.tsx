import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Truck, Calendar, CreditCard, ShieldCheck, MapPin, Landmark, Smartphone, Check, UserCheck, Upload, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Separator } from "@/app/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { useState, useEffect } from "react";

export function CheckoutPage({ onBack, rentalData }: { onBack: () => void; rentalData?: { product: any; duration: string } | null }) {
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [selectedDate, setSelectedDate] = useState("Feb 1, Sun");
    const [kycStatus, setKycStatus] = useState<"idle" | "uploading" | "verified">("idle");
    const [formData, setFormData] = useState({
        countryCode: "+91",
        phone: "",
        pincode: "",
        city: "",
        state: "",
        address: "",
        fullName: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        if (formData.phone.length !== 10) newErrors.phone = "Phone number must be 10 digits";
        if (!formData.fullName) newErrors.fullName = "Name is required";
        if (!formData.address) newErrors.address = "Address is required";
        if (formData.pincode.length !== 6) newErrors.pincode = "Invalid pincode";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.state) newErrors.state = "State is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileUpload = () => {
        setKycStatus("uploading");
        setTimeout(() => setKycStatus("verified"), 2000);
    };

    const steps = [
        { id: 1, title: "Delivery details", icon: MapPin },
        { id: 2, title: "Identity verification", icon: UserCheck },
        { id: 3, title: "Schedule delivery", icon: Calendar },
        { id: 4, title: "Payment method", icon: CreditCard },
    ];

    const currentProduct = rentalData?.product || {
        name: "Gaming Laptop Pro",
        image: "https://images.unsplash.com/photo-1673431738089-c4fc9c2e96a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        rentPrice: 3500,
    };

    const currentDuration = rentalData?.duration || "6";

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
                >
                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span>{rentalData ? "Back to Product" : "Back to Cart"}</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Checkout Flow */}
                    <div className="lg:col-span-8 space-y-12">
                        <h1 className="text-4xl tracking-tight">Checkout</h1>

                        {/* Stepper Header */}
                        <div className="flex items-center gap-4 md:gap-8">
                            {steps.map((s, i) => (
                                <div key={s.id} className="flex items-center gap-3">
                                    <div
                                        onClick={() => step > s.id && setStep(s.id)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors cursor-pointer ${step >= s.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                            }`}>
                                        {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                                    </div>
                                    <span
                                        onClick={() => step > s.id && setStep(s.id)}
                                        className={`hidden md:block text-sm font-medium cursor-pointer ${step >= s.id ? "text-foreground" : "text-muted-foreground"}`}>
                                        {s.title}
                                    </span>
                                    {i < steps.length - 1 && <div className="w-8 md:w-16 h-px bg-border" />}
                                </div>
                            ))}
                        </div>

                        <div className="space-y-10">
                            {/* Step 1: Address */}
                            <section className={`space-y-6 ${step !== 1 ? "opacity-40" : ""}`}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-muted-foreground" />
                                        <h2 className="text-2xl">Delivery address</h2>
                                    </div>
                                    {step > 1 && (
                                        <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-primary underline px-0">Change</Button>
                                    )}
                                </div>
                                {step === 1 && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName" className={errors.fullName ? "text-destructive" : ""}>Full name</Label>
                                            <Input
                                                id="fullName"
                                                value={formData.fullName}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, fullName: e.target.value })}
                                                placeholder="John Doe"
                                                className="h-12 rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className={errors.phone ? "text-destructive" : ""}>Phone number</Label>
                                            <div className="flex gap-2">
                                                <Select value={formData.countryCode} onValueChange={(v) => setFormData({ ...formData, countryCode: v })}>
                                                    <SelectTrigger className="w-[100px] h-12 rounded-xl">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="+91">🇮🇳 +91</SelectItem>
                                                        <SelectItem value="+1">🇺🇸 +1</SelectItem>
                                                        <SelectItem value="+44">🇬🇧 +44</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Input
                                                    id="phone"
                                                    maxLength={10}
                                                    value={formData.phone}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                                                    placeholder="98765 43210"
                                                    className="h-12 rounded-xl flex-1"
                                                />
                                            </div>
                                            {errors.phone && <p className="text-[10px] text-destructive">{errors.phone}</p>}
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <Label htmlFor="address" className={errors.address ? "text-destructive" : ""}>Suite / Apartment / Street</Label>
                                            <Input
                                                id="address"
                                                value={formData.address}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, address: e.target.value })}
                                                placeholder="123 Luxury Avenue"
                                                className="h-12 rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pincode" className={errors.pincode ? "text-destructive" : ""}>Pincode</Label>
                                            <Input
                                                id="pincode"
                                                maxLength={6}
                                                value={formData.pincode}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, "") })}
                                                placeholder="400001"
                                                className="h-12 rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="city" className={errors.city ? "text-destructive" : ""}>City</Label>
                                            <Input
                                                id="city"
                                                value={formData.city}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, city: e.target.value })}
                                                placeholder="Mumbai"
                                                className="h-12 rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="state" className={errors.state ? "text-destructive" : ""}>State</Label>
                                            <Input
                                                id="state"
                                                value={formData.state}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, state: e.target.value })}
                                                placeholder="Maharashtra"
                                                className="h-12 rounded-xl"
                                            />
                                        </div>
                                        <div className="md:col-span-2 pt-4">
                                            <Button onClick={() => validateStep1() && setStep(2)} className="h-12 px-8 rounded-full">Continue to Identity</Button>
                                        </div>
                                    </motion.div>
                                )}
                            </section>

                            <Separator />

                            {/* Step 2: Identity Verification */}
                            <section className={`space-y-6 ${step !== 2 ? "opacity-40" : ""}`}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <UserCheck className="w-5 h-5 text-muted-foreground" />
                                        <h2 className="text-2xl">Identity verification</h2>
                                    </div>
                                    {step > 2 && (
                                        <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="text-primary underline px-0">Change</Button>
                                    )}
                                </div>
                                {step === 2 && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                        <p className="text-muted-foreground">To process your rental, we need to verify your identity. Please upload a government-issued ID (AADHAAR / PAN).</p>

                                        <div className={`p-8 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 ${kycStatus === "verified" ? "border-green-200 bg-green-50/50" : "border-border bg-muted/20"}`}>
                                            {kycStatus === "idle" ? (
                                                <>
                                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <Upload className="w-6 h-6 text-primary" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="font-medium">Direct upload or drag & drop</p>
                                                        <p className="text-xs text-muted-foreground mt-1">JPEG, PNG or PDF (Max. 5MB)</p>
                                                    </div>
                                                    <Button variant="outline" onClick={handleFileUpload} className="h-10 px-6 rounded-full border-primary/20 hover:bg-primary/5">
                                                        Select File
                                                    </Button>
                                                </>
                                            ) : kycStatus === "uploading" ? (
                                                <>
                                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                                    <p className="text-sm font-medium">Analyzing document...</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                                        <Check className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="font-medium text-green-700">Identity successfully verified</p>
                                                        <p className="text-xs text-green-600/80 mt-1">Verified via automated KYC</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="flex gap-4">
                                            <Button onClick={() => setStep(3)} disabled={kycStatus !== "verified"} className="h-12 px-8 rounded-full">Continue to Schedule</Button>
                                            <Button variant="ghost" onClick={() => setStep(1)} className="h-12 px-8 rounded-full underline">Back</Button>
                                        </div>
                                    </motion.div>
                                )}
                            </section>

                            <Separator />

                            {/* Step 3: Date */}
                            <section className={`space-y-6 ${step !== 3 ? "opacity-40" : ""}`}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-muted-foreground" />
                                        <h2 className="text-2xl">Schedule delivery</h2>
                                    </div>
                                    {step > 3 && (
                                        <Button variant="ghost" size="sm" onClick={() => setStep(3)} className="text-primary underline px-0">Change</Button>
                                    )}
                                </div>
                                {step === 3 && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                        {formData.city && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-green-50/50 border border-green-100 flex gap-3 items-center">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                <p className="text-xs text-green-700">Delivering to <strong>{formData.city}, {formData.state}</strong> on <strong>{selectedDate}</strong></p>
                                            </motion.div>
                                        )}
                                        <p className="text-muted-foreground">Select a date and time for delivery and professional installation.</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {["Feb 1, Sun", "Feb 2, Mon", "Feb 3, Tue", "Feb 4, Wed"].map((date, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setSelectedDate(date)}
                                                    className={`p-4 rounded-2xl border transition-all text-center ${selectedDate === date ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:border-muted-foreground"}`}
                                                >
                                                    <p className="text-sm font-medium">{date}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Available</p>
                                                </button>
                                            ))}
                                        </div>
                                        {selectedDate && (
                                            <p className="text-sm font-medium text-primary">Delivery scheduled for: {selectedDate} between 10 AM - 2 PM</p>
                                        )}
                                        <div className="flex gap-4">
                                            <Button onClick={() => setStep(4)} className="h-12 px-8 rounded-full">Continue to Payment</Button>
                                            <Button variant="ghost" onClick={() => setStep(2)} className="h-12 px-8 rounded-full underline">Back</Button>
                                        </div>
                                    </motion.div>
                                )}
                            </section>

                            <Separator />

                            {/* Step 4: Payment */}
                            <section className={`space-y-6 ${step !== 4 ? "opacity-40" : ""}`}>
                                <div className="flex items-center gap-3">
                                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                                    <h2 className="text-2xl">Payment method</h2>
                                </div>
                                {step === 4 && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <Label
                                                htmlFor="card"
                                                className={`flex flex-col items-center gap-4 p-6 rounded-3xl border cursor-pointer transition-all ${paymentMethod === "card" ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:border-muted-foreground"
                                                    }`}
                                            >
                                                <RadioGroupItem value="card" id="card" className="sr-only" />
                                                <CreditCard className="w-6 h-6" />
                                                <div className="text-center">
                                                    <p className="font-medium">Card</p>
                                                    <p className="text-[10px] text-muted-foreground">Credit / Debit</p>
                                                </div>
                                            </Label>

                                            <Label
                                                htmlFor="upi"
                                                className={`flex flex-col items-center gap-4 p-6 rounded-3xl border cursor-pointer transition-all ${paymentMethod === "upi" ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:border-muted-foreground"
                                                    }`}
                                            >
                                                <RadioGroupItem value="upi" id="upi" className="sr-only" />
                                                <Smartphone className="w-6 h-6" />
                                                <div className="text-center">
                                                    <p className="font-medium">UPI</p>
                                                    <p className="text-[10px] text-muted-foreground">GPay, PhonePe</p>
                                                </div>
                                            </Label>

                                            <Label
                                                htmlFor="emi"
                                                className={`flex flex-col items-center gap-4 p-6 rounded-3xl border cursor-pointer transition-all ${paymentMethod === "emi" ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:border-muted-foreground"
                                                    }`}
                                            >
                                                <RadioGroupItem value="emi" id="emi" className="sr-only" />
                                                <Landmark className="w-6 h-6" />
                                                <div className="text-center">
                                                    <p className="font-medium">EMI</p>
                                                    <p className="text-[10px] text-muted-foreground">Starting ₹1,200/mo</p>
                                                </div>
                                            </Label>
                                        </RadioGroup>

                                        {paymentMethod === "card" && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid md:grid-cols-2 gap-4 p-6 rounded-3xl bg-muted/30 border border-border">
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label htmlFor="cardNumber">Card number</Label>
                                                    <Input id="cardNumber" placeholder="0000 0000 0000 0000" className="h-12 bg-card rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="expiry">Expiry</Label>
                                                    <Input id="expiry" placeholder="MM/YY" className="h-12 bg-card rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="cvv">CVV</Label>
                                                    <Input id="cvv" placeholder="123" className="h-12 bg-card rounded-xl" />
                                                </div>
                                            </motion.div>
                                        )}

                                        {paymentMethod === "upi" && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-6 rounded-3xl bg-muted/30 border border-border space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="upiId">UPI ID</Label>
                                                    <div className="flex gap-2">
                                                        <Input id="upiId" placeholder="username@bank" className="h-12 bg-card rounded-xl" />
                                                        <Button variant="outline" className="h-12 px-6 rounded-xl">Verify</Button>
                                                    </div>
                                                    <p className="text-[10px] text-muted-foreground">Example: 9876543210@okaxis or user@upi</p>
                                                </div>
                                            </motion.div>
                                        )}

                                        {paymentMethod === "emi" && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-6 rounded-3xl bg-muted/30 border border-border space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Select Bank</Label>
                                                    <Select>
                                                        <SelectTrigger className="h-12 bg-card rounded-xl">
                                                            <SelectValue placeholder="Choose your bank" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="hdfc">HDFC Bank</SelectItem>
                                                            <SelectItem value="icici">ICICI Bank</SelectItem>
                                                            <SelectItem value="sbi">SBI Bank</SelectItem>
                                                            <SelectItem value="axis">Axis Bank</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Select Tenure</Label>
                                                    <RadioGroup className="grid grid-cols-2 gap-3">
                                                        <Label className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card cursor-pointer hover:border-primary">
                                                            <RadioGroupItem value="3m" />
                                                            <div className="text-xs">
                                                                <p className="font-medium">3 Months</p>
                                                                <p className="text-muted-foreground">₹2,100/mo</p>
                                                            </div>
                                                        </Label>
                                                        <Label className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card cursor-pointer hover:border-primary">
                                                            <RadioGroupItem value="6m" />
                                                            <div className="text-xs">
                                                                <p className="font-medium">6 Months</p>
                                                                <p className="text-muted-foreground">₹1,100/mo</p>
                                                            </div>
                                                        </Label>
                                                    </RadioGroup>
                                                </div>
                                            </motion.div>
                                        )}
                                        <div className="flex gap-4">
                                            <Button className="h-12 px-8 rounded-full">Finalize Payment</Button>
                                            <Button variant="ghost" onClick={() => setStep(3)} className="h-12 px-8 rounded-full underline">Back to Schedule</Button>
                                        </div>
                                    </motion.div>
                                )}
                            </section>
                        </div>
                    </div>

                    {/* Right Column: Sticky Summary */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-12 space-y-6">
                            <div className="p-8 rounded-3xl bg-secondary/30 border border-border space-y-6">
                                <h2 className="text-xl font-medium">Order summary</h2>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-border bg-card">
                                            <img src={currentProduct.image} alt={currentProduct.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium line-clamp-1">{currentProduct.name}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Rental · {currentDuration} months</p>
                                        </div>
                                        <span className="text-sm font-medium">₹{currentProduct.rentPrice.toLocaleString()}</span>
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Monthly Rent</span>
                                            <span>₹{currentProduct.rentPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Delivery Fee</span>
                                            <span>FREE</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Security Deposit</span>
                                            <span>₹{(currentProduct.rentPrice * 0.7).toFixed(0).toLocaleString()}</span>
                                        </div>
                                        <Separator className="my-2" />
                                        <div className="flex justify-between font-medium text-lg">
                                            <span>Total upfront</span>
                                            <span>₹{(currentProduct.rentPrice * 1.7).toFixed(0).toLocaleString()}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Wait, the security deposit is 100% refundable!</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        className="w-full h-14 rounded-full text-lg font-medium shadow-xl shadow-primary/10 disabled:opacity-50"
                                        disabled={step < 4}
                                    >
                                        Place Order
                                    </Button>
                                    <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
                                        <ShieldCheck className="w-3 h-3 text-green-600" />
                                        Secure checkout powered by Stripe
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-card border border-border flex items-start gap-4">
                                <Truck className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
                                <div className="text-sm">
                                    <h4 className="font-medium">Peace of mind</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">Cancel anytime before delivery for a full refund. 24/7 support available.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
