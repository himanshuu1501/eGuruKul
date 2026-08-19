import { ArrowLeft, Users, BarChart3 } from "lucide-react";
import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="flex">
      <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700  p-5 sticky top-0  h-screen">
        <div className="space-y-4 ">
          <Link to="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 mb-4">
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>
          <Link to="dashboard" className="flex items-center gap-2">
            <BarChart3 size={22} />
            <h1>Dashboard</h1>
          </Link>
          <Link to="instructor-applications" className="flex items-center gap-2">
            <Users size={22} />
            <h1>Instructor Applications</h1>
          </Link>
        </div>
      </div>
    <div className="flex-1 p-10 ">
        <Outlet/>
      </div>
    </div>
  );
};

export default AdminSidebar;
