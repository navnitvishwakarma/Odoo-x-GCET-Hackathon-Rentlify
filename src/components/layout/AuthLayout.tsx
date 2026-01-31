import React from 'react';
import { Outlet } from 'react-router-dom';
import { DynamicBackground } from '@/components/auth/DynamicBackground';
import { Header } from '@/components/header';

export function AuthLayout() {
    return (
        <div className="relative min-h-screen flex flex-col">
            <Header />
            <DynamicBackground />
            <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md z-10 transition-all duration-300">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
