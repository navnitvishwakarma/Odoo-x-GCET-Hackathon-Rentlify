import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Building2, User, CreditCard, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { generateInvoicePDF } from '@/utils/invoiceGenerator';

interface InvoicePreviewProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    bookingDetails: {
        productName: string;
        productImage: string;
        vendorName: string;
        vendorLocation: string;
        customerName: string;
        customerEmail: string;
        startDate: Date;
        endDate: Date;
        duration: number;
        pricePerDay: number;
        securityDeposit: number;
    };
    isProcessing?: boolean;
}

export function InvoicePreview({ isOpen, onClose, onConfirm, bookingDetails, isProcessing }: InvoicePreviewProps) {
    // Calculations
    const rentalCost = bookingDetails.duration * bookingDetails.pricePerDay;
    const serviceFee = rentalCost * 0.10; // 10% platform fee
    const gstRate = 0.18; // 18% GST (mock)
    const gstAmount = (rentalCost + serviceFee) * gstRate;
    const grandTotal = rentalCost + serviceFee + gstAmount + bookingDetails.securityDeposit;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
                <div className="bg-muted/30 p-6 border-b border-border flex justify-between items-start">
                    <div>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                <FileText className="w-5 h-5 text-primary" />
                                Invoice Preview
                            </DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-muted-foreground mt-1">Order #INV-DRAFT-{Math.floor(Math.random() * 10000)}</p>
                    </div>
                    <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 px-3 py-1">
                        Draft
                    </Badge>
                </div>

                <div className="p-6 space-y-8">
                    {/* Billed To / From */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-primary">From (Vendor)</h4>
                            <div className="space-y-1">
                                <p className="font-semibold text-lg">{bookingDetails.vendorName}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Building2 className="w-3 h-3" />
                                    <span>GSTIN: 27AABCU9603R1ZN</span>
                                </div>
                                <p className="text-sm text-muted-foreground max-w-[200px]">
                                    {bookingDetails.vendorLocation}<br />
                                    India
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 text-right">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-primary">Bill To (Customer)</h4>
                            <div className="space-y-1">
                                <p className="font-semibold text-lg">{bookingDetails.customerName}</p>
                                <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                                    <User className="w-3 h-3" />
                                    <span>{bookingDetails.customerEmail}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    +91 98765 43210
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Item Details */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4">Rental Details</h4>
                        <div className="bg-muted/20 rounded-lg p-4 flex gap-4 border border-border/50">
                            <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                <img
                                    src={bookingDetails.productImage}
                                    alt={bookingDetails.productName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <p className="font-medium">{bookingDetails.productName}</p>
                                    <p className="text-xs text-muted-foreground">Premium Rental</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Duration</p>
                                    <p className="text-sm font-medium">
                                        {format(bookingDetails.startDate, 'MMM dd')} - {format(bookingDetails.endDate, 'MMM dd')}
                                        <span className="text-muted-foreground ml-1">({bookingDetails.duration} days)</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">Rate</p>
                                    <p className="text-sm font-medium">${bookingDetails.pricePerDay}/day</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Breakdown */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4">Payment Breakdown</h4>
                        <div className="border border-border rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-border/50">
                                    <tr className="bg-muted/10">
                                        <td className="p-3 pl-4 text-muted-foreground">Rental Charges</td>
                                        <td className="p-3 pr-4 text-right font-medium">${rentalCost.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 pl-4 text-muted-foreground">Service Fee (10%)</td>
                                        <td className="p-3 pr-4 text-right font-medium">${serviceFee.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 pl-4 text-muted-foreground">GST (18%)</td>
                                        <td className="p-3 pr-4 text-right font-medium">${gstAmount.toFixed(2)}</td>
                                    </tr>
                                    <tr className="bg-blue-50/50 dark:bg-blue-900/10">
                                        <td className="p-3 pl-4 text-blue-700 dark:text-blue-300 flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4" />
                                            Refundable Security Deposit
                                        </td>
                                        <td className="p-3 pr-4 text-right font-medium text-blue-700 dark:text-blue-300">
                                            ${bookingDetails.securityDeposit.toFixed(2)}
                                        </td>
                                    </tr>
                                    <tr className="bg-primary/5 font-bold text-lg">
                                        <td className="p-4 pl-4">Total Payable</td>
                                        <td className="p-4 pr-4 text-right text-primary">${grandTotal.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-right">
                            * Includes all applicable taxes and fees.
                        </p>
                    </div>
                </div>

                <DialogFooter className="bg-muted/30 p-4 border-t border-border flex flex-row justify-between items-center sm:justify-between gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => generateInvoicePDF(bookingDetails)}
                        className="text-muted-foreground hover:text-primary"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                    </Button>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                            Edit Details
                        </Button>
                        <Button onClick={onConfirm} disabled={isProcessing} className="px-6">
                            {isProcessing ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    Pay ${grandTotal.toFixed(0)}
                                </>
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
