import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Printer, Home } from "lucide-react";
import { useEffect } from "react";

export default function OrderConfirmationPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId, total } = location.state || { orderId: "ORD-UNKNOWN", total: 0 }; // Fallback

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6">
            <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-xl text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10" />
                </div>

                <h1 className="text-3xl font-serif italic tracking-tight">Payment Successful!</h1>
                <p className="text-muted-foreground">
                    Thank you for your purchase. Your order has been confirmed.
                </p>

                <div className="bg-secondary/30 rounded-2xl p-6 space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Order ID</span>
                        <span className="font-mono font-medium">{orderId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount Paid</span>
                        <span className="font-semibold">₹{total + 50}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span>{new Date().toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <button
                        onClick={handlePrint}
                        className="w-full py-3 bg-secondary text-foreground hover:bg-secondary/80 rounded-xl font-medium flex justify-center items-center gap-2 transition-colors print:hidden"
                    >
                        <Printer className="w-4 h-4" /> Print Receipt
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium flex justify-center items-center gap-2 transition-colors print:hidden"
                    >
                        <Home className="w-4 h-4" /> Return Home
                    </button>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .bg-card, .bg-card * {
                        visibility: visible;
                    }
                    .bg-card {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        border: none;
                        shadow: none;
                    }
                    .print\\:hidden { // Double escape for JS string
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
