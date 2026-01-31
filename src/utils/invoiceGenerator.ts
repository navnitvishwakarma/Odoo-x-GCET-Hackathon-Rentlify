import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

interface BookingDetails {
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
}

export const generateInvoicePDF = (bookingDetails: BookingDetails) => {
    // 1. Initialize Document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Calculations
    const rentalCost = bookingDetails.duration * bookingDetails.pricePerDay;
    const serviceFee = rentalCost * 0.10;
    const gstRate = 0.18;
    const gstAmount = (rentalCost + serviceFee) * gstRate;
    const grandTotal = rentalCost + serviceFee + gstAmount + bookingDetails.securityDeposit;

    // 2. Header Section
    doc.setFontSize(24);
    doc.setTextColor(59, 130, 246); // Primary Blue
    doc.text("Rentlify", 20, 25);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Premium Rental Marketplace", 20, 30);

    // Invoice Meta
    const invoiceId = `INV-${Math.floor(Math.random() * 100000)}`;
    const invoiceDate = format(new Date(), 'dd MMM yyyy');

    doc.setFontSize(30);
    doc.setTextColor(200);
    doc.text("INVOICE", pageWidth - 20, 25, { align: 'right' });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Invoice #: ${invoiceId}`, pageWidth - 20, 35, { align: 'right' });
    doc.text(`Date: ${invoiceDate}`, pageWidth - 20, 40, { align: 'right' });
    doc.text(`Status: DRAFT`, pageWidth - 20, 45, { align: 'right' });

    // 3. Billing Details (From / To)
    const yPos = 60;

    // From (Vendor)
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("FROM", 20, yPos);

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(bookingDetails.vendorName, 20, yPos + 7);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(bookingDetails.vendorLocation, 20, yPos + 12);
    doc.text("GSTIN: 27AABCU9603R1ZN", 20, yPos + 17);

    // To (Customer) 
    doc.setTextColor(150);
    doc.text("BILL TO", pageWidth / 2 + 10, yPos);

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(bookingDetails.customerName, pageWidth / 2 + 10, yPos + 7);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(bookingDetails.customerEmail, pageWidth / 2 + 10, yPos + 12);

    // 4. Product Details Line
    doc.setDrawColor(230);
    doc.line(20, yPos + 30, pageWidth - 20, yPos + 30);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Rental Item: ${bookingDetails.productName}`, 20, yPos + 40);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Duration: ${format(bookingDetails.startDate, 'MMM dd')} - ${format(bookingDetails.endDate, 'MMM dd')} (${bookingDetails.duration} days)`, 20, yPos + 46);

    // 5. Pricing Table
    autoTable(doc, {
        startY: yPos + 55,
        head: [['Description', 'Rate', 'Amount']],
        body: [
            ['Rental Charges', `$${bookingDetails.pricePerDay}/day`, `$${rentalCost.toFixed(2)}`],
            ['Service Fee (10%)', '10%', `$${serviceFee.toFixed(2)}`],
            ['GST (18%)', '18%', `$${gstAmount.toFixed(2)}`],
            ['Security Deposit (Refundable)', '-', `$${bookingDetails.securityDeposit.toFixed(2)}`],
        ],
        foot: [['Total Payable', '', `$${grandTotal.toFixed(2)}`]],
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 4 },
        columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 40, halign: 'right' },
            2: { cellWidth: 40, halign: 'right' },
        },
    });

    // 6. Footer
    const finalY = (doc as any).lastAutoTable.finalY + 20;

    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("Thank you for choosing Rentlify!", pageWidth / 2, finalY, { align: 'center' });
    doc.text("This invoice is computer generated and no signature is required.", pageWidth / 2, finalY + 5, { align: 'center' });

    // 7. Save
    doc.save(`Invoice_${invoiceId}.pdf`);
};
