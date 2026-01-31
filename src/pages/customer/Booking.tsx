import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, Shield, CreditCard, Check, Loader2 } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useProduct } from '@/hooks/useProducts';
import { useCreateBooking } from '@/hooks/useBookings';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { InvoicePreview } from '@/components/invoice/InvoicePreview';

export function BookingPage() {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: product, isLoading } = useProduct(productId);
  const createBookingMutation = useCreateBooking();

  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Product not found</p>
        <Button onClick={() => navigate('/listings')} className="mt-4">
          Back to Listings
        </Button>
      </div>
    );
  }

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return days * product.price.perDay;
  };

  const handleConfirm = () => {
    if (!startDate || !endDate) return;

    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = days * product.price.perDay;

    createBookingMutation.mutate({
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id,
      productName: product.name,
      productImage: product.images[0],
      customerId: user?.id || 'u1',
      customerName: user?.name || 'Guest User',
      vendorId: product.vendorId,
      vendorName: product.vendorName,
      location: product.location,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      totalPrice: totalPrice,
      status: 'pending',
      duration: days,
      durationType: 'day',
    }, {
      onSuccess: () => {
        toast.success('Booking requested successfully!');
        navigate('/customer/dashboard'); // Or a confirmation page
      },
      onError: () => {
        toast.error('Failed to create booking. Please try again.');
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
                  }`}
              >
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-20 h-1 ${step > s ? 'bg-primary' : 'bg-muted'
                    }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-24 mt-2">
          <span className={`text-sm ${step >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
            Dates
          </span>
          <span className={`text-sm ${step >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
            Details
          </span>
          <span className={`text-sm ${step >= 3 ? 'text-foreground' : 'text-muted-foreground'}`}>
            Payment
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Select Rental Period</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-input-background"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-50 bg-white dark:bg-zinc-950 border shadow-md" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-input-background"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-50 bg-white dark:bg-zinc-950 border shadow-md" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => !startDate || date < startDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {startDate && endDate && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Rental Duration</p>
                    <p className="text-lg">
                      {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setStep(2)}
                  disabled={!startDate || !endDate}
                >
                  Continue
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Delivery & Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-input-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your delivery address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="bg-input-background"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Special Instructions (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special requests or instructions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-input-background"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={() => setStep(3)}
                    disabled={!phone || !address}
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="bg-input-background"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      type="text"
                      placeholder="MM/YY"
                      className="bg-input-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      className="bg-input-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    type="text"
                    placeholder="John Doe"
                    className="bg-input-background"
                  />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg flex items-start gap-2">
                  <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="mb-1">Your payment is secure</p>
                    <p className="text-muted-foreground">
                      We use industry-standard encryption to protect your payment information.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button className="flex-1" size="lg" onClick={() => setShowInvoice(true)} disabled={createBookingMutation.isPending}>
                    {createBookingMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Review & Pay
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product */}
              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <ImageWithFallback
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm line-clamp-2 mb-1">{product.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span className="line-clamp-1">{product.location}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Dates */}
              {startDate && endDate && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Rental Period</p>
                    <p className="text-sm">
                      {format(startDate, 'MMM dd, yyyy')} - {format(endDate, 'MMM dd, yyyy')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                  <Separator />
                </>
              )}

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Daily Rate</span>
                  <span>${product.price.perDay}/day</span>
                </div>
                {startDate && endDate && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days × $
                        {product.price.perDay}
                      </span>
                      <span>${calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span>${(calculateTotal() * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Security Deposit</span>
                      <span>${product.securityDeposit}</span>
                    </div>
                  </>
                )}
              </div>

              <Separator />

              {/* Total */}
              {startDate && endDate && (
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="text-xl text-primary">
                    ${(calculateTotal() + calculateTotal() * 0.1 + product.securityDeposit).toFixed(2)}
                  </span>
                </div>
              )}

              <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
                Security deposit will be refunded after the rental period ends and the item is returned in good condition.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Invoice Preview Modal */}
      {product && startDate && endDate && (
        <InvoicePreview
          isOpen={showInvoice}
          onClose={() => setShowInvoice(false)}
          onConfirm={handleConfirm}
          isProcessing={createBookingMutation.isPending}
          bookingDetails={{
            productName: product.name,
            productImage: product.images[0],
            vendorName: product.vendorName,
            vendorLocation: product.location, // Mocking location as simpler field
            customerName: user?.name || 'Guest Customer',
            customerEmail: user?.email || 'guest@example.com',
            startDate: startDate,
            endDate: endDate,
            duration: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
            pricePerDay: product.price.perDay,
            securityDeposit: product.securityDeposit,
          }}
        />
      )}
    </div>
  );
}
