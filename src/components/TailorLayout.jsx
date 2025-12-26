import React from "react";
import { Outlet } from "react-router-dom";
import TailorNavbar from "./TailorNavbar";

const TailorLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TailorNavbar />
      {/* Main content area with proper spacing for navbar */}
      <div className="lg:ml-64 mt-16">
        <Outlet />
      </div>
    </div>
  );
};

export default TailorLayout;
