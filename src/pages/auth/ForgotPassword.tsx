import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <Card className="w-full shadow-2xl border-white/20 bg-card/80 backdrop-blur-sm">
            <AnimatePresence mode="wait">
                {!isSubmitted ? (
                    <motion.div
                        key="forgot-form"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <CardHeader className="text-center">
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-primary/20 text-primary w-12 h-12 rounded-full flex items-center justify-center shadow-inner">
                                    <Mail className="w-6 h-6" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
                            <CardDescription>
                                Enter your email and we'll send you a link to reset your password.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-input-background focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <Button type="submit" className="w-full h-11 font-semibold shadow-lg shadow-primary/20" disabled={isLoading}>
                                    {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                                </Button>
                                <div className="text-center">
                                    <Link
                                        to="/login"
                                        className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Login
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success-message"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-6"
                    >
                        <CardHeader className="text-center">
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-green-500/20 text-green-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
                            <CardDescription className="text-base mt-2">
                                If an account exists for <span className="font-semibold text-foreground">{email}</span>,
                                a password reset link has been sent.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Didn't receive the email? Check your spam folder or try again.
                            </p>
                            <Button
                                variant="outline"
                                className="w-full h-11 border-white/20 bg-white/5 hover:bg-white/10"
                                onClick={() => setIsSubmitted(false)}
                            >
                                Resend Link
                            </Button>
                            <div>
                                <Link
                                    to="/login"
                                    className="text-sm text-primary font-bold hover:underline"
                                >
                                    Return to Login
                                </Link>
                            </div>
                        </CardContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}
