import { motion } from 'framer-motion';
import { Camera, Car, Armchair, Hammer } from 'lucide-react';

const activeRentals = [
    { id: 1, type: 'Camera', icon: Camera, top: '30%', left: '25%', city: 'New York', label: 'Sony A7III rented just now' },
    { id: 2, type: 'Vehicle', icon: Car, top: '45%', left: '48%', city: 'London', label: 'Tesla Model 3 booked for weekend' },
    { id: 3, type: 'Furniture', icon: Armchair, top: '35%', left: '80%', city: 'Tokyo', label: 'Sofa Set delivery scheduled' },
    { id: 4, type: 'Tool', icon: Hammer, top: '65%', left: '32%', city: 'Sao Paulo', label: 'Power Drill rented for 2 days' },
];

export function CommunityMap() {
    return (
        <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-no-repeat bg-center bg-contain opacity-[0.03] pointer-events-none invert"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Live Community Activity</h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        See what's happening on Rentlify right now around the world.
                    </p>
                </div>

                <div className="relative h-[400px] w-full max-w-5xl mx-auto bg-slate-800/30 rounded-3xl border border-slate-700/50 backdrop-blur-sm shadow-2xl overflow-hidden">
                    {/* Abstract Map Grid Lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                    {/* Pulse Markers */}
                    {activeRentals.map((rental, index) => (
                        <motion.div
                            key={rental.id}
                            className="absolute"
                            style={{ top: rental.top, left: rental.left }}
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.5, duration: 0.5 }}
                        >
                            <div className="relative group">
                                {/* Pulse Effect */}
                                <span className="absolute -inset-4 rounded-full bg-blue-500/20 animate-ping"></span>
                                <span className="absolute -inset-1 rounded-full bg-blue-500/40"></span>

                                {/* Icon */}
                                <div className="relative w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50 cursor-pointer z-10">
                                    <rental.icon className="w-4 h-4 text-white" />
                                </div>

                                {/* Tooltip Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.5 + 0.3 }}
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white text-slate-900 rounded-xl p-3 w-48 shadow-xl text-center pointer-events-none"
                                >
                                    <p className="text-xs font-bold text-blue-600 mb-0.5">{rental.city}</p>
                                    <p className="text-xs font-medium leading-snug">{rental.label}</p>

                                    {/* Arrow */}
                                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white"></div>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Stats Overlay */}
                    <div className="absolute bottom-6 left-6 flex gap-4">
                        <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-lg border border-slate-700">
                            <span className="text-emerald-400 font-bold mr-2">●</span>
                            <span className="text-sm font-medium">124 Active Rentals</span>
                        </div>
                        <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-lg border border-slate-700">
                            <span className="text-blue-400 font-bold mr-2">●</span>
                            <span className="text-sm font-medium">12 New Listings</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
