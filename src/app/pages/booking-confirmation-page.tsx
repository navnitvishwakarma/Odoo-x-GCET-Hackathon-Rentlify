import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { CheckCircle, Download, Mail, Calendar, MapPin } from 'lucide-react';

interface BookingConfirmationPageProps {
  onNavigate: (page: string) => void;
}

export function BookingConfirmationPage({ onNavigate }: BookingConfirmationPageProps) {
  const bookingId = 'RNT-' + Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-accent" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl mb-3">Booking Confirmed!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your rental has been successfully booked. We've sent a confirmation email with all the details.
        </p>

        {/* Booking Details Card */}
        <Card className="mb-8 text-left">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
                <p className="text-xl font-mono">{bookingId}</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Rental Period</p>
                  <p>February 5, 2026 - February 8, 2026</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pickup Location</p>
                  <p>Will be shared by vendor 24 hours before rental starts</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Confirmation Email</p>
                  <p>Sent to your registered email address</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => onNavigate('customer-dashboard')}>
            View My Bookings
          </Button>
          <Button size="lg" variant="outline" onClick={() => onNavigate('home')}>
            Continue Browsing
          </Button>
        </div>

        {/* Info */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg text-left">
          <h3 className="mb-3">What's Next?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent" />
              <span>The vendor will confirm your booking within 24 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent" />
              <span>You'll receive pickup instructions via email and SMS</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent" />
              <span>Security deposit will be held until the item is returned</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent" />
              <span>You can contact the vendor anytime through your dashboard</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
