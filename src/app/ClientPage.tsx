'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import Sidebar from '@/components/Sidebar';
import OrderTable from '@/components/OrderTable';
import FloorPlan from '@/components/FloorPlan';
import MenuEditor from '@/components/MenuEditor';
import InventoryDashboard from '@/components/InventoryDashboard';
import StaffRota from '@/components/StaffRota';
import OrderEntry from '@/components/OrderEntry';
import PaymentsDashboard from '@/components/PaymentsDashboard';
import Reservations from '@/components/Reservations';
import Customers from '@/pages/Customers';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import TenantManager from '@/components/TenantManager';
import StaffManagement from '@/components/StaffManagement';
import BrandingSettings from '@/components/BrandingSettings';
import BottomNav from '@/components/BottomNav';
import NotificationTray from '@/components/NotificationTray';
import NotificationBell from '@/components/NotificationBell';
import LoginPage from '@/pages/LoginPage';
import { Plus, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientPage() {
    const currentTenantId = useStore(state => state.currentTenantId);
    const currentView = useStore(state => state.currentView);
    const branding = useStore(state => state.branding);
    const setView = useStore(state => state.setView);
    const isAuthenticated = useStore(state => state.isAuthenticated);
    const user = useStore(state => state.user);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const hexToRgb = (hex: string) => {
        if (!hex || typeof hex !== 'string') return '56 189 248';
        const cleanHex = hex.replace('#', '');
        if (cleanHex.length === 3) {
            const r = parseInt(cleanHex[0] + cleanHex[0], 16);
            const g = parseInt(cleanHex[1] + cleanHex[1], 16);
            const b = parseInt(cleanHex[2] + cleanHex[2], 16);
            return `${r} ${g} ${b}`;
        }
        if (cleanHex.length === 6) {
            const r = parseInt(cleanHex.substring(0, 2), 16);
            const g = parseInt(cleanHex.substring(2, 4), 16);
            const b = parseInt(cleanHex.substring(4, 6), 16);
            return `${r} ${g} ${b}`;
        }
        return '56 189 248';
    };

    useEffect(() => {
        if (!isMounted) return;
        const root = document.documentElement;
        const pRgb = hexToRgb(branding.primaryColor);
        const sRgb = hexToRgb(branding.secondaryColor);

        root.style.setProperty('--primary', pRgb);
        root.style.setProperty('--secondary', sRgb);
        root.style.setProperty('--primary-glow', `rgb(${pRgb} / 0.15)`);
        root.style.setProperty('--secondary-glow', `rgb(${sRgb} / 0.15)`);

        if (branding.themeMode === 'light') {
            root.classList.add('light');
            root.classList.remove('dark');
        } else {
            root.classList.add('dark');
            root.classList.remove('light');
        }
    }, [branding.primaryColor, branding.secondaryColor, branding.themeMode, isMounted]);

    const renderView = () => {
        switch (currentView) {
            case 'FloorPlan': return <FloorPlan />;
            case 'Menu': return <MenuEditor />;
            case 'Inventory': return <InventoryDashboard />;
            case 'Staff': return <StaffRota />;
            case 'OrderEntry': return <OrderEntry />;
            case 'Payments': return <PaymentsDashboard />;
            case 'Reservations': return <Reservations />;
            case 'Customers': return <Customers />;
            case 'Analytics': return <AnalyticsDashboard />;
            case 'StaffUsers': return <StaffManagement />;
            case 'Tenants': return <TenantManager />;
            case 'Branding': return <BrandingSettings />;
            case 'Dashboard':
            default: return <OrderTable />;
        }
    };

    if (!isMounted) return null;

    if (!isAuthenticated) {
        return <LoginPage />;
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 flex flex-col items-center">
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {branding.logoUrl ? (
                        <img src={branding.logoUrl} alt="Logo" className="w-8 h-8 rounded-lg object-contain" />
                    ) : (
                        <LayoutDashboard className="text-primary w-6 h-6" />
                    )}
                    <span className="font-bold text-lg">{branding.appName}</span>
                </div>
                <div className="flex items-center gap-3">
                    <NotificationBell />
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 bg-glass/20 rounded-xl text-primary"
                    >
                        <Plus className={`transition-transform duration-300 ${isSidebarOpen ? 'rotate-45' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="container max-w-6xl grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 p-4 md:p-8 mt-16 md:mt-0 relative">
                <NotificationTray />

                <div className={`
          fixed md:relative inset-0 z-40 md:z-auto transition-transform duration-300 transform
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          bg-background/95 md:bg-transparent backdrop-blur-2xl md:backdrop-blur-none
        `}>
                    <div className="h-full overflow-y-auto p-8 md:p-0">
                        <Sidebar onClose={() => setIsSidebarOpen(false)} />
                    </div>
                </div>

                <motion.div
                    className="flex flex-col gap-8 min-w-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <header className="hidden md:flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    {branding.logoUrl ? (
                                        <img src={branding.logoUrl} alt="Logo" className="w-8 h-8 rounded-lg object-contain" />
                                    ) : (
                                        <LayoutDashboard className="text-primary w-6 h-6" />
                                    )}
                                    <h1 className="text-3xl font-bold">{currentView === 'Dashboard' ? branding.appName : currentView}</h1>
                                </div>
                                <p className="text-xs text-muted font-medium">Location: <span className="text-secondary">{user?.tenantId}</span></p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <NotificationBell />
                            {currentView === 'Dashboard' && (
                                <button
                                    onClick={() => setView('OrderEntry')}
                                    className="flex items-center gap-2 bg-gradient-to-br from-primary to-secondary text-white px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                                >
                                    <Plus size={18} />
                                    New Order
                                </button>
                            )}
                        </div>
                    </header>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentView}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="pb-24 md:pb-0">
                                {renderView()}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>
            <BottomNav />
        </div>
    );
}
