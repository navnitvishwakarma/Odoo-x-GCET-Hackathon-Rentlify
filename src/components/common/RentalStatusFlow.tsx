import { motion } from 'framer-motion';
import {
    FileText,
    CheckCircle2,
    PackageCheck,
    Clock,
    RotateCcw,
    Flag,
    Check
} from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type RentalStatus = 'quotation' | 'confirmed' | 'picked_up' | 'active' | 'returned' | 'closed';

interface RentalStatusFlowProps {
    currentStatus: RentalStatus;
    className?: string;
    timestamps?: Partial<Record<RentalStatus, string>>; // Optional mapping of status to date strings
}

const STEPS: { id: RentalStatus; label: string; icon: any; description: string }[] = [
    {
        id: 'quotation',
        label: 'Quotation',
        icon: FileText,
        description: 'Order placed, awaiting approval'
    },
    {
        id: 'confirmed',
        label: 'Confirmed',
        icon: CheckCircle2,
        description: 'Booking approved by vendor'
    },
    {
        id: 'picked_up',
        label: 'Picked Up',
        icon: PackageCheck,
        description: 'Item collected by customer'
    },
    {
        id: 'active',
        label: 'Active',
        icon: Clock,
        description: 'Rental period in progress'
    },
    {
        id: 'returned',
        label: 'Returned',
        icon: RotateCcw,
        description: 'Item returned to vendor'
    },
    {
        id: 'closed',
        label: 'Closed',
        icon: Flag,
        description: 'Transaction completed'
    },
];

export function RentalStatusFlow({ currentStatus, className, timestamps }: RentalStatusFlowProps) {
    const currentIndex = STEPS.findIndex(step => step.id === currentStatus);
    const progress = ((currentIndex) / (STEPS.length - 1)) * 100;

    return (
        <Card className={cn("p-6 w-full overflow-hidden bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm border-border/50", className)}>
            <div className="relative">
                {/* Progress Bar Background */}
                <div className="absolute top-5 left-0 w-full h-1 bg-muted rounded-full -z-10" />

                {/* Active Progress Bar */}
                <motion.div
                    className="absolute top-5 left-0 h-1 bg-primary rounded-full -z-10"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                />

                {/* Steps */}
                <div className="flex justify-between items-start w-full">
                    {STEPS.map((step, index) => {
                        const isCompleted = index < currentIndex;
                        const isCurrent = index === currentIndex;
                        const isPending = index > currentIndex;

                        return (
                            <div key={step.id} className="flex flex-col items-center group relative cursor-help">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <motion.div
                                                className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 bg-background",
                                                    isCompleted && "bg-primary border-primary text-primary-foreground",
                                                    isCurrent && "border-primary text-primary ring-4 ring-primary/20",
                                                    isPending && "border-muted-foreground/30 text-muted-foreground/30"
                                                )}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                {isCompleted ? (
                                                    <Check className="w-5 h-5" />
                                                ) : (
                                                    <step.icon className="w-5 h-5" />
                                                )}
                                            </motion.div>
                                        </TooltipTrigger>
                                        <TooltipContent className="text-xs max-w-[150px] text-center">
                                            <p className="font-semibold mb-1">{step.label}</p>
                                            <p className="text-muted-foreground">{step.description}</p>
                                            {timestamps?.[step.id] && (
                                                <p className="mt-2 pt-2 border-t border-border/50 font-mono text-[10px] opacity-80">
                                                    {timestamps[step.id]}
                                                </p>
                                            )}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                {/* Status Label (Hidden on small mobile for non-active/first/last if crowded, but simplified here) */}
                                <div className={cn(
                                    "mt-3 text-center transition-colors duration-300 absolute top-10 w-24 -left-7",
                                    isCurrent ? "text-primary font-bold" : "text-muted-foreground font-medium",
                                    isPending && "opacity-50"
                                )}>
                                    <p className="text-xs leading-tight">{step.label}</p>
                                    {isCurrent && (
                                        <motion.div
                                            layoutId="active-indicator"
                                            className="w-1 h-1 bg-primary rounded-full mx-auto mt-1"
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Spacer for labels */}
            <div className="h-8" />
        </Card>
    );
}
