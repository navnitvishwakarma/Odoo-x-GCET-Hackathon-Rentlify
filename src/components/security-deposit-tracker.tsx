import { motion } from 'framer-motion';
import {
    ShieldCheck,
    Lock,
    Search,
    CheckCircle2,
    AlertCircle,
    Banknote,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export type DepositStatus = 'held' | 'inspection' | 'released' | 'deducted';

interface DepositEvent {
    step: number;
    label: string;
    description: string;
    date?: string;
    status: 'pending' | 'current' | 'completed' | 'issue';
}

interface SecurityDepositTrackerProps {
    amount: number;
    currency?: string;
    status: DepositStatus;
    rentalId?: string;
    className?: string;
}

export function SecurityDepositTracker({
    amount,
    currency = '₹',
    status,
    className
}: SecurityDepositTrackerProps) {

    // Logic to determine step state based on overall status
    const getSteps = (): DepositEvent[] => {
        const steps: DepositEvent[] = [
            {
                step: 1,
                label: 'Deposit Held',
                description: 'Securely frozen via payment gateway',
                date: 'Jan 24, 2026', // Mock date
                status: 'completed'
            },
            {
                step: 2,
                label: 'Inspection',
                description: 'Vendor verifies item condition',
                date: status === 'held' ? undefined : 'Feb 02, 2026',
                status: status === 'held' ? 'pending' : (status === 'inspection' ? 'current' : 'completed')
            },
            {
                step: 3,
                label: status === 'deducted' ? 'Partial Refund' : 'Released',
                description: status === 'deducted' ? 'Deduction applied for damages' : 'Full amount refunded to source',
                status: (status === 'released' || status === 'deducted') ? (status === 'deducted' ? 'issue' : 'completed') : 'pending'
            }
        ];
        return steps;
    };

    const steps = getSteps();
    const currentStepIndex = steps.findIndex(s => s.status === 'current' || s.status === 'pending') - 1;
    const activeStep = currentStepIndex === -2 ? 2 : (currentStepIndex === -1 ? 0 : currentStepIndex + 1); // Logic to find active visual step

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'completed': return 'bg-emerald-500 text-white border-emerald-500';
            case 'current': return 'bg-amber-500 text-white border-amber-500 animate-pulse';
            case 'issue': return 'bg-rose-500 text-white border-rose-500';
            default: return 'bg-muted text-muted-foreground border-border';
        }
    };

    const getStatusIcon = (stepIdx: number, s: string) => {
        if (s === 'issue') return <AlertCircle className="w-4 h-4" />;
        if (s === 'completed') return <CheckCircle2 className="w-4 h-4" />;
        if (stepIdx === 0) return <Lock className="w-4 h-4" />;
        if (stepIdx === 1) return <Search className="w-4 h-4" />;
        return <Banknote className="w-4 h-4" />;
    };

    return (
        <Card className={cn("overflow-hidden border-border/50 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl shadow-sm", className)}>
            <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-xl">
                            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Security Deposit</h3>
                            <p className="text-xs text-muted-foreground">Rentlify Trust Protection</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-foreground tabular-nums">
                            {currency}{amount.toLocaleString()}
                        </div>
                        <Badge variant={status === 'released' ? 'default' : 'outline'} className={cn(
                            "text-[10px] px-2 py-0.5 h-auto ml-auto",
                            status === 'released' && "bg-emerald-500 hover:bg-emerald-600",
                            status === 'held' && "text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800"
                        )}>
                            {status === 'released' ? 'Refunded' : status === 'held' ? 'Active Hold' : 'Processing'}
                        </Badge>
                    </div>
                </div>

                {/* Stepper */}
                <div className="relative">
                    {/* Connecting Line background */}
                    <div className="absolute top-[1.125rem] left-4 right-4 h-0.5 bg-muted -z-10" />

                    {/* Connecting Line Progress */}
                    <motion.div
                        className={cn(
                            "absolute top-[1.125rem] left-4 h-0.5 bg-emerald-500 -z-10 origin-left transition-all duration-500",
                        )}
                        initial={{ scaleX: 0 }}
                        animate={{
                            scaleX: status === 'released' ? 1 : status === 'inspection' ? 0.5 : 0.1
                        }}
                    />

                    <div className="flex justify-between relative z-10">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={cn(
                                        "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors duration-300 shadow-sm",
                                        getStatusColor(step.status)
                                    )}
                                >
                                    {getStatusIcon(idx, step.status)}
                                </motion.div>

                                <div className="mt-3 text-center max-w-[120px]">
                                    <p className={cn(
                                        "text-xs font-semibold mb-0.5",
                                        step.status === 'pending' && "text-muted-foreground"
                                    )}>
                                        {step.label}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground leading-tight hidden md:block">
                                        {step.description}
                                    </p>
                                    {step.date && (
                                        <span className="inline-block mt-1 text-[9px] font-medium px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
                                            {step.date}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trust Footer */}
                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground bg-muted/20 -mx-5 -mb-5 px-5 py-3">
                    <span className="flex items-center gap-1.5">
                        <Lock className="w-3 h-3" />
                        Top-tier bank security
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-primary cursor-pointer transition-colors">
                        View Policy <ArrowRight className="w-3 h-3" />
                    </span>
                </div>
            </div>
        </Card>
    );
}
