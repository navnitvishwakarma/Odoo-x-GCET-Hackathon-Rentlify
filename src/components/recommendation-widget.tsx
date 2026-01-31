import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Tent, Hammer, PartyPopper, ArrowRight, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Step = 'activity' | 'duration' | 'budget' | 'results';

interface RecommendationWidgetProps {
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultActivity?: string;
}

export function RecommendationWidget({ isOpen: externalIsOpen, onOpenChange, defaultActivity }: RecommendationWidgetProps) {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const [step, setStep] = useState<Step>('activity');
    const [selections, setSelections] = useState({
        activity: '',
        duration: '',
        budget: '',
    });

    const isControlled = typeof externalIsOpen !== 'undefined';
    const isOpen = isControlled ? externalIsOpen : internalIsOpen;
    const setIsOpen = (value: boolean) => {
        if (onOpenChange) onOpenChange(value);
        if (!isControlled) setInternalIsOpen(value);
    };

    // Effect to handle default activity when opening
    useEffect(() => {
        if (isOpen && defaultActivity) {
            setSelections(prev => ({ ...prev, activity: defaultActivity }));
            setStep('duration');
        } else if (!isOpen) {
            // Optional: reset when closed, or keep state
        }
    }, [isOpen, defaultActivity]);

    const reset = () => {
        setStep('activity');
        setSelections({ activity: '', duration: '', budget: '' });
    };

    const activityOptions = [
        { id: 'trip', label: 'Trip', icon: Camera, color: 'bg-orange-100 text-orange-600' },
        { id: 'project', label: 'Project', icon: Hammer, color: 'bg-blue-100 text-blue-600' },
        { id: 'event', label: 'Event', icon: PartyPopper, color: 'bg-purple-100 text-purple-600' },
        { id: 'camping', label: 'Camping', icon: Tent, color: 'bg-green-100 text-green-600' },
    ];

    const durationOptions = ['1 Day', '3 Days', '1 Week +'];
    const budgetOptions = ['Budget', 'Standard', 'Premium'];

    const handleSelect = (field: keyof typeof selections, value: string) => {
        setSelections(prev => ({ ...prev, [field]: value }));
        if (field === 'activity') setStep('duration');
        if (field === 'duration') setStep('budget');
        if (field === 'budget') setStep('results');
    };

    const getRecommendations = () => {
        // Mock logic
        return [
            { name: 'Sony A7III Kit', price: '$85/day', image: '/images/products/canon_eos_r5.png' },
            { name: 'DJI Mavic 3', price: '$65/day', image: '/images/products/dji_mavic_3.png' },
            { name: 'GoPro Hero 11', price: '$25/day', image: '/images/products/power_drill.png' },
        ];
    };

    if (!isOpen) {
        return (
            <div className="container mx-auto px-4 -mt-10 relative z-20 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="max-w-[700px] mx-auto"
                >
                    <div
                        onClick={() => setIsOpen(true)}
                        className="group relative bg-gradient-to-r from-white/90 to-blue-50/90 dark:from-slate-900/90 dark:to-slate-800/90 backdrop-blur-lg rounded-2xl p-4 sm:p-5 flex items-center justify-between cursor-pointer border border-white/50 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-300 ease-out overflow-hidden"
                    >
                        {/* Subtle Glow Pulse */}
                        <div className="absolute top-0 left-0 w-20 h-full bg-white/20 skew-x-12 -translate-x-32 group-hover:animate-shine transition-all" />

                        <div className="flex items-center gap-5 relative z-10">
                            {/* Icon Container with Glow */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>
                                <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                                    <Sparkles className="w-7 h-7" />
                                </div>
                            </div>

                            <div className="text-left space-y-0.5">
                                <h3 className="font-semibold text-xl text-slate-800 dark:text-slate-100 flex items-center gap-2 font-display tracking-tight">
                                    <span>🤖</span>
                                    Not sure what to rent?
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                    Tell us your plan and we’ll recommend the perfect gear
                                </p>
                            </div>
                        </div>

                        {/* Action Arrow */}
                        <div className="relative z-10 pl-4 sm:pl-0">
                            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 -mt-8 relative z-20 mb-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-3xl mx-auto"
            >
                <Card className="border-0 shadow-2xl bg-white/95 dark:bg-card/95 backdrop-blur-xl overflow-hidden ring-1 ring-black/5">
                    <CardContent className="p-0">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex justify-between items-start">
                            <div>
                                <Badge className="bg-white/20 text-white border-none hover:bg-white/30 mb-2">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    AI Assistant
                                </Badge>
                                <h2 className="text-2xl font-bold">What are you planning?</h2>
                                <p className="text-blue-100 text-sm mt-1">Answer 3 quick questions to get personalized suggestions.</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20 rounded-full"
                                onClick={() => {
                                    setIsOpen(false);
                                    setTimeout(reset, 300);
                                }}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="p-6 min-h-[300px]">
                            <AnimatePresence mode="wait">
                                {step === 'activity' && (
                                    <motion.div
                                        key="activity"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="grid grid-cols-2 gap-4"
                                    >
                                        {activityOptions.map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => handleSelect('activity', option.id)}
                                                className="flex flex-col items-center p-6 rounded-xl border-2 border-transparent bg-muted/30 hover:bg-muted hover:border-primary/20 transition-all group text-center"
                                            >
                                                <div className={`w-16 h-16 rounded-full ${option.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                                    <option.icon className="w-8 h-8" />
                                                </div>
                                                <span className="font-semibold">{option.label}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}

                                {step === 'duration' && (
                                    <motion.div
                                        key="duration"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <h3 className="text-xl font-semibold text-center mb-8">How long do you need it?</h3>
                                        <div className="flex justify-center gap-4">
                                            {durationOptions.map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => handleSelect('duration', opt)}
                                                    className="px-8 py-4 rounded-full border-2 border-muted hover:border-primary hover:bg-primary/5 transition-all text-lg font-medium"
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {step === 'budget' && (
                                    <motion.div
                                        key="budget"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <h3 className="text-xl font-semibold text-center mb-8">What's your budget style?</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {budgetOptions.map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => handleSelect('budget', opt)}
                                                    className="p-6 rounded-xl border-2 border-muted hover:border-primary hover:bg-primary/5 transition-all text-lg font-medium text-center"
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {step === 'results' && (
                                    <motion.div
                                        key="results"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center"
                                    >
                                        <div className="flex items-center justify-center gap-2 text-green-600 mb-6">
                                            <Sparkles className="w-5 h-5" />
                                            <span className="font-semibold">Match Found! Perfect for your {selections.activity}</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                            {getRecommendations().map((item, i) => (
                                                <div key={i} className="bg-background rounded-xl p-3 shadow-sm border text-left group cursor-pointer hover:border-primary/50 transition-colors">
                                                    <div className="h-32 rounded-lg bg-muted mb-3 overflow-hidden">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                    </div>
                                                    <h4 className="font-semibold text-sm">{item.name}</h4>
                                                    <p className="text-primary text-sm font-bold">{item.price}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex gap-3 justify-center">
                                            <Button size="lg" className="rounded-full px-8" onClick={() => { setIsOpen(false); reset(); }}>
                                                View Bundle Details
                                            </Button>
                                            <Button variant="outline" size="lg" className="rounded-full" onClick={reset}>
                                                Start Over
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Progress */}
                        {step !== 'results' && (
                            <div className="bg-muted/30 p-4 border-t flex justify-center gap-2">
                                <div className={`h-2 w-16 rounded-full transition-colors ${step === 'activity' ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
                                <div className={`h-2 w-16 rounded-full transition-colors ${step === 'duration' ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
                                <div className={`h-2 w-16 rounded-full transition-colors ${step === 'budget' ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
