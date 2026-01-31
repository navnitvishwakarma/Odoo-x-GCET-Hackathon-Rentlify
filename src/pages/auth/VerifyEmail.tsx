import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, RefreshCcw, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function VerifyEmailPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    // If there's a token in URL, simulate immediate verification
    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                setIsVerified(true);
            }, 2000);
        }
    }, [searchParams]);

    // Auto redirect after verification
    useEffect(() => {
        if (isVerified) {
            const timer = setTimeout(() => {
                navigate('/profile');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVerified, navigate]);

    const handleResend = () => {
        setIsResending(true);
        setTimeout(() => {
            setIsResending(false);
        }, 2000);
    };

    return (
        <Card className="w-full shadow-2xl border-white/20 bg-card/80 backdrop-blur-sm">
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-12 flex flex-col items-center justify-center text-center"
                    >
                        <div className="relative">
                            <Loader2 className="w-16 h-16 text-primary animate-spin mb-4 opacity-50" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 bg-primary rounded-full" />
                            </div>
                        </div>
                        <p className="text-xl font-bold tracking-tight">Verifying your email...</p>
                        <p className="text-sm text-muted-foreground mt-1">Please wait a moment</p>
                    </motion.div>
                ) : isVerified ? (
                    <motion.div
                        key="verified"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-6"
                    >
                        <CardHeader className="text-center">
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-green-500 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-xl shadow-green-500/20 ring-4 ring-green-500/10">
                                    <CheckCircle className="w-12 h-12" />
                                </div>
                            </div>
                            <CardTitle className="text-3xl font-extrabold tracking-tight">Email Verified!</CardTitle>
                            <CardDescription className="text-base text-foreground/80 font-medium">
                                Your account is now active. You can start renting items.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <p className="text-sm text-muted-foreground italic bg-muted/30 py-2 rounded-full">
                                Redirecting to dashboard in 3 seconds...
                            </p>
                            <Button className="w-full h-11 font-bold shadow-lg shadow-primary/20" onClick={() => navigate('/profile')}>
                                Go to Dashboard Now
                            </Button>
                        </CardContent>
                    </motion.div>
                ) : (
                    <motion.div
                        key="pending"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <CardHeader className="text-center">
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-primary/20 text-primary w-14 h-14 rounded-full flex items-center justify-center shadow-lg">
                                    <Mail className="w-7 h-7" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
                            <CardDescription>
                                We've sent a verification link to your email. Please check your inbox and click the link to activate your account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="bg-muted/30 p-4 rounded-xl border border-white/10 text-sm text-muted-foreground text-center">
                                <p>Didn't receive the email? Check your spam folder or click below to resend.</p>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full h-11 border-white/20 bg-white/5 hover:bg-white/10 font-semibold"
                                onClick={handleResend}
                                disabled={isResending}
                            >
                                {isResending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin text-primary" />
                                        Resending...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCcw className="w-4 h-4 mr-2" />
                                        Resend Verification Link
                                    </>
                                )}
                            </Button>
                            <div className="text-center">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4"
                                >
                                    Back to Login
                                </button>
                            </div>
                        </CardContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}
