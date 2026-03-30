import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import ManagerSidebar from './ManagerSidebar';

const ManagerLayout = () => {
    return (
        <div className="min-h-screen bg-transparent flex flex-col overflow-hidden">
            <Navbar />
            <div className="flex-1 flex overflow-hidden">
                <ManagerSidebar />
                <main className="flex-1 overflow-y-auto relative custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ManagerLayout;
