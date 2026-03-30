import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import TaskOwnerSidebar from './TaskOwnerSidebar';

const TaskOwnerLayout = () => {
    return (
        <div className="min-h-screen bg-transparent flex flex-col overflow-hidden">
            <Navbar />
            <div className="flex-1 flex overflow-hidden">
                <TaskOwnerSidebar />
                <main className="flex-1 overflow-y-auto relative custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default TaskOwnerLayout;
