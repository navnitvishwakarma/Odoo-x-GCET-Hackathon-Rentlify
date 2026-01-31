import React, { useState } from 'react';
import { AppProvider } from '@/app/context/app-context';
import { Header } from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import { LoginPage } from '@/app/pages/login-page';
import { SignupPage } from '@/app/pages/signup-page';
import { HomePage } from '@/app/pages/home-page';
import { ListingsPage } from '@/app/pages/listings-page';
import { ProductDetailPage } from '@/app/pages/product-detail-page';
import { BookingPage } from '@/app/pages/booking-page';
import { BookingConfirmationPage } from '@/app/pages/booking-confirmation-page';
import { CustomerDashboardPage } from '@/app/pages/customer-dashboard-page';
import { VendorDashboardPage } from '@/app/pages/vendor-dashboard-page';
import { AdminDashboardPage } from '@/app/pages/admin-dashboard-page';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleNavigate = (page: string, productId?: string) => {
    setCurrentPage(page);
    if (productId) {
      setSelectedProductId(productId);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'signup':
        return <SignupPage onNavigate={handleNavigate} />;
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'listings':
        return <ListingsPage onNavigate={handleNavigate} />;
      case 'product-detail':
        return selectedProductId ? (
          <ProductDetailPage productId={selectedProductId} onNavigate={handleNavigate} />
        ) : (
          <HomePage onNavigate={handleNavigate} />
        );
      case 'booking':
        return selectedProductId ? (
          <BookingPage productId={selectedProductId} onNavigate={handleNavigate} />
        ) : (
          <HomePage onNavigate={handleNavigate} />
        );
      case 'booking-confirmation':
        return <BookingConfirmationPage onNavigate={handleNavigate} />;
      case 'customer-dashboard':
        return <CustomerDashboardPage onNavigate={handleNavigate} />;
      case 'vendor-dashboard':
        return <VendorDashboardPage onNavigate={handleNavigate} />;
      case 'admin-dashboard':
        return <AdminDashboardPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onNavigate={handleNavigate} currentPage={currentPage} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
