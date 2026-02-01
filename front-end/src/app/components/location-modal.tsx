import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { MapPin, Building2, Landmark, ArrowRight, X } from 'lucide-react';

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectLocation: (location: string) => void;
}

const majorCities = [
    { name: 'Bengaluru', icon: Building2 },
    { name: 'Mumbai', icon: Landmark },
    { name: 'Hyderabad', icon: Building2 },
    { name: 'Pune', icon: Landmark },
    { name: 'Delhi', icon: Landmark }, // India Gate-ish
    { name: 'Gurugram', icon: Building2 },
    { name: 'Noida', icon: Building2 },
    { name: 'Chennai', icon: Landmark },
];

const otherCities = [
    'Jaipur', 'Kolkata', 'Ahmedabad', 'Chandigarh', 'Lucknow', 'Gandhinagar'
];

export function LocationModal({ isOpen, onClose, onSelectLocation }: LocationModalProps) {
    const [pincode, setPincode] = useState('');

    const handlePincodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pincode.length === 6) {
            onSelectLocation(`Pincode: ${pincode}`);
            onClose();
        } else {
            alert("Please enter a valid 6-digit pincode");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] border-none shadow-2xl bg-white p-0 overflow-hidden">
                <div className="p-6 relative">
                    <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>

                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl text-center font-serif text-[#1a3c40]">Select Delivery Location</DialogTitle>
                    </DialogHeader>

                    {/* Pincode Section */}
                    <div className="mb-8">
                        <form onSubmit={handlePincodeSubmit} className="relative max-w-md mx-auto">
                            <Input
                                placeholder="Enter your pincode"
                                className="h-12 pl-6 pr-12 rounded-full border-2 border-[#2c8b93]/50 focus-visible:ring-0 focus-visible:border-[#2c8b93] text-lg bg-white"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                maxLength={6}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                variant="ghost"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#2c8b93] hover:bg-transparent hover:text-[#1a4d52]"
                            >
                                <ArrowRight className="w-6 h-6" />
                            </Button>
                        </form>
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-border flex-1" />
                        <span className="text-sm text-muted-foreground font-medium px-2">Or select your city</span>
                        <div className="h-px bg-border flex-1" />
                    </div>

                    {/* Major Cities Grid */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        {majorCities.map((city) => (
                            <button
                                key={city.name}
                                onClick={() => { onSelectLocation(city.name); onClose(); }}
                                className="flex flex-col items-center gap-2 group p-2 rounded-xl hover:bg-[#e0f2f1] transition-colors"
                            >
                                <div className="w-16 h-16 bg-[#b2dfdb]/50 rounded-xl flex items-center justify-center text-[#00695c] group-hover:bg-[#b2dfdb] transition-colors">
                                    <city.icon strokeWidth={1.5} className="w-8 h-8" />
                                </div>
                                <span className="text-sm font-medium text-[#37474f]">{city.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Other Cities List */}
                    <div className="text-center">
                        <h4 className="text-lg font-serif text-[#1a3c40] mb-4">Other Cities</h4>
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                            {otherCities.map((city) => (
                                <button
                                    key={city}
                                    onClick={() => { onSelectLocation(city); onClose(); }}
                                    className="text-sm font-medium text-[#455a64] hover:text-[#00695c] hover:underline transition-colors"
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
