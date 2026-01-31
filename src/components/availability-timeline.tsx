import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    format,
    addDays,
    startOfToday,
    isSameDay,
    eachDayOfInterval
} from 'date-fns';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Info
} from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Types for our availability data
export type AvailabilityStatus = 'available' | 'partial' | 'booked';

interface DayData {
    date: Date;
    status: AvailabilityStatus;
    bookings?: {
        id: string;
        period: string; // e.g. "10:00 AM - 2:00 PM"
    }[];
}

interface AvailabilityTimelineProps {
    className?: string;
    initialDate?: Date;
}

export function AvailabilityTimeline({ className }: AvailabilityTimelineProps) {
    const [currentStartDate, setCurrentStartDate] = useState(startOfToday());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Generate 14 days of mock data starting from current view
    const daysToShow = 14;
    const days: DayData[] = eachDayOfInterval({
        start: currentStartDate,
        end: addDays(currentStartDate, daysToShow - 1)
    }).map((date, i) => {
        // Mock random status logic for demonstration
        const rand = Math.random();
        let status: AvailabilityStatus = 'available';
        let bookings: { id: string; period: string }[] | undefined;

        if (rand > 0.8) {
            status = 'booked';
            bookings = [{ id: 'b1', period: 'All Day' }];
        } else if (rand > 0.6) {
            status = 'partial';
            bookings = [{ id: 'b2', period: 'Booked until 2 PM' }];
        }

        return { date, status, bookings };
    });

    const handlePrev = () => {
        // Prevent going before today
        const newDate = addDays(currentStartDate, -7);
        if (newDate >= startOfToday()) {
            setCurrentStartDate(newDate);
        } else {
            setCurrentStartDate(startOfToday());
        }
    };

    const handleNext = () => {
        setCurrentStartDate(addDays(currentStartDate, 7));
    };

    const getStatusColor = (status: AvailabilityStatus) => {
        switch (status) {
            case 'available':
                return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25';
            case 'partial':
                return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/25';
            case 'booked':
                return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/25 opacity-70 cursor-not-allowed';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };

    const getStatusDot = (status: AvailabilityStatus) => {
        switch (status) {
            case 'available': return 'bg-emerald-500';
            case 'partial': return 'bg-amber-500';
            case 'booked': return 'bg-rose-500';
        }
    };

    return (
        <Card className={cn("overflow-hidden border-border/50 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl shadow-lg", className)}>
            <div className="p-4 md:p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className='space-y-1'>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-primary" />
                            Availability Timeline
                        </h3>
                        <p className="text-xs text-muted-foreground">Select dates to check availability</p>
                    </div>

                    {/* Legend */}
                    <div className="hidden md:flex items-center gap-4 text-xs font-medium bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Available</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            <span>Partial</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            <span>Booked</span>
                        </div>
                    </div>
                </div>

                {/* Timeline Controls & Strip */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-end gap-2 mb-2 md:absolute md:-top-10 md:right-0">
                        <Button variant="outline" size="icon" className="h-7 w-7 rounded-full" onClick={handlePrev} disabled={isSameDay(currentStartDate, startOfToday())}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-7 w-7 rounded-full" onClick={handleNext}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Scrollable Container */}
                    <div className="flex gap-2 overflow-x-auto pb-4 pt-1 px-1 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent -mx-1">
                        <AnimatePresence mode="popLayout">
                            {days.map((day, index) => {
                                const isSelected = selectedDate && isSameDay(day.date, selectedDate);
                                const isToday = isSameDay(day.date, new Date());

                                return (
                                    <TooltipProvider key={day.date.toISOString()}>
                                        <Tooltip delayDuration={300}>
                                            <TooltipTrigger asChild>
                                                <motion.button
                                                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    onClick={() => day.status !== 'booked' && setSelectedDate(day.date)}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center min-w-[70px] h-[90px] rounded-2xl border transition-all duration-300 relative group",
                                                        getStatusColor(day.status),
                                                        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                                                        isToday && "bg-accent/10 border-accent text-accent-foreground"
                                                    )}
                                                >
                                                    {/* Status Dot */}
                                                    <span className={cn(
                                                        "absolute top-3 right-3 w-1.5 h-1.5 rounded-full",
                                                        getStatusDot(day.status)
                                                    )} />

                                                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 mb-1">
                                                        {format(day.date, 'EEE')}
                                                    </span>
                                                    <span className={cn(
                                                        "text-2xl font-bold font-mono",
                                                        isToday && "text-primary"
                                                    )}>
                                                        {format(day.date, 'd')}
                                                    </span>
                                                    <span className="text-[10px] mt-1 font-medium truncate max-w-[60px]">
                                                        {day.bookings ? 'Booked' : 'Open'}
                                                    </span>

                                                    {/* Selection Check */}
                                                    {isSelected && (
                                                        <div className="absolute -bottom-2 bg-primary text-primary-foreground rounded-full p-0.5">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                        </div>
                                                    )}
                                                </motion.button>
                                            </TooltipTrigger>
                                            <TooltipContent className="p-3 rounded-xl bg-slate-900 border-none text-white shadow-xl">
                                                <div className="text-xs space-y-1">
                                                    <p className="font-semibold">{format(day.date, 'PPPP')}</p>
                                                    <div className="flex items-center gap-2">
                                                        {day.status === 'booked' ? (
                                                            <XCircle className="w-3 h-3 text-rose-500" />
                                                        ) : day.status === 'partial' ? (
                                                            <AlertCircle className="w-3 h-3 text-amber-500" />
                                                        ) : (
                                                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                        )}
                                                        <span className="capitalize">{day.status}</span>
                                                    </div>
                                                    {day.bookings?.map((b, idx) => (
                                                        <p key={idx} className="text-white/60 pl-5">{b.period}</p>
                                                    ))}
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Selected Date Helper Text */}
                <AnimatePresence mode="wait">
                    {selectedDate ? (
                        <motion.div
                            key="selected"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10 text-sm"
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                <span className="font-medium">Selected: {format(selectedDate, 'MMMM d, yyyy')}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">Ready to book</span>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 text-sm text-muted-foreground p-3"
                        >
                            <Info className="w-4 h-4" />
                            <span>Click a green or yellow date to select your rental start time.</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Card>
    );
}
