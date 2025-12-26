import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./shared/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Product from "./components/Desgin";
import Fabrics from "./components/Fabrics";
import AddToCart from "./components/AddToCart";
import Testimonial from "./components/Testimonial";
import CustomerLogin from "./components/CustomerLogin";
import CustomerRegister from "./components/CustomerRegister";
import CustomerDashboard from "./components/CustomerDashboard";
import CustomerProfile from "./components/CustomerProfile";
import TailorLogin from "./components/TailorLogin";
import TailorRegister from "./components/TailorRegister";
import TailorLayout from "./components/TailorLayout";
import TailorDashboard from "./components/TailorDashboard";
import TailorProfile from "./components/TailorProfile";
import TailorOrders from "./components/TailorOrders";
import TailorPending from "./components/TailorPending";
import TailorCompleted from "./components/TailorCompleted";
import AdminLogin from "./components/AdminLogin";
import AdminRegister from "./components/AdminRegister";
import AdminProfile from "./components/AdminProfile";
import AdminDashboard from "./components/AdminDashboard";
import AdminDesign from "./components/AdminDesign";
import AdminFabrics from "./components/AdminFabrics";
import AllOrders from "./components/AllOrders";
import AllCustomer from "./components/AllCustomer";
import AllTailor from "./components/AllTailor";
import AdminNavbar from "./components/AdminNavbar";
import Footer from "./shared/Footer";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <Navbar />
        <Home />
        <Footer />
      </div>
    ),
  },
  {
    path: "/about",
    element: (
      <div>
        <Navbar />
        <About />
        <Footer />
      </div>
    ),
  },
  {
    path: "/contact",
    element: (
      <div>
        <Navbar />
        <Contact />
        <Footer />
      </div>
    ),
  },
  {
    path: "/design",
    element: (
      <div>
        <Navbar />
        <Product />
        <Footer />
      </div>
    ),
  },
  {
    path: "/fabrics",
    element: (
      <div>
        <Navbar />
        <Fabrics />
        <Footer />
      </div>
    ),
  },
  {
    path: "/cart",
    element: (
      <div>
        <Navbar />
        <AddToCart />
        <Footer />
      </div>
    ),
  },
  {
    path: "/testimonial",
    element: (
      <div>
        <Navbar />
        <Testimonial />
        <Footer />
      </div>
    ),
  },
  {
    path: "/customer-login",
    element: (
      <div>
        <CustomerLogin />
      </div>
    ),
  },
  {
    path: "/customer-register",
    element: (
      <div>
        <CustomerRegister />
      </div>
    ),
  },
  {
    path: "/customer-dashboard",
    element: (
      <div>
        <Navbar />
        <CustomerDashboard />
        <Footer />
      </div>
    ),
  },
  {
    path: "/customer-profile",
    element: (
      <div>
        <Navbar />
        <CustomerProfile />
        <Footer />
      </div>
    ),
  },
  {
    path: "/tailor-login",
    element: (
      <div>
        <TailorLogin />
      </div>
    ),
  },
  {
    path: "/tailor-register",
    element: (
      <div>
        <TailorRegister />
      </div>
    ),
  },
  {
    path: "/tailor-dashboard",
    element: <TailorLayout />,
    children: [
      {
        index: true,
        element: <TailorDashboard />,
      },
    ],
  },
  {
    path: "/tailor-profile",
    element: <TailorLayout />,
    children: [
      {
        index: true,
        element: <TailorProfile />,
      },
    ],
  },
  {
    path: "/tailor-orders",
    element: <TailorLayout />,
    children: [
      {
        index: true,
        element: <TailorOrders />,
      },
    ],
  },
  {
    path: "/tailor-pending",
    element: <TailorLayout />,
    children: [
      {
        index: true,
        element: <TailorPending />,
      },
    ],
  },
  {
    path: "/tailor-completed",
    element: <TailorLayout />,
    children: [
      {
        index: true,
        element: <TailorCompleted />,
      },
    ],
  },
  {
    path: "/admin-login",
    element: (
      <div>
        <AdminLogin />
      </div>
    ),
  },
  {
    path: "/admin-register",
    element: (
      <div>
        <AdminRegister />
      </div>
    ),
  },
  {
    path: "/admin-dashboard",
    element: (
      <div>
        <AdminNavbar />
        <div className="lg:ml-64 mt-16 p-4 sm:p-6">
          <AdminDashboard />
        </div>
      </div>
    ),
  },
  {
    path: "/admin-profile",
    element: (
      <div>
        <AdminNavbar />
        <div className="lg:ml-64 mt-16 p-4 sm:p-6">
          <AdminProfile />
        </div>
      </div>
    ),
  },
  {
    path: "/admin-designs",
    element: (
      <div>
        <AdminNavbar />
        <div className="lg:ml-64 mt-16 p-4 sm:p-6">
          <AdminDesign />
        </div>
      </div>
    ),
  },
  {
    path: "/admin-fabrics",
    element: (
      <div>
        <AdminNavbar />
        <div className="lg:ml-64 mt-16 p-4 sm:p-6">
          <AdminFabrics />
        </div>
      </div>
    ),
  },
  {
    path: "/admin-orders",
    element: (
      <div>
        <AdminNavbar />
        <div className="lg:ml-64 mt-16 p-4 sm:p-6">
          <AllOrders />
        </div>
      </div>
    ),
  },
  {
    path: "/admin-customers",
    element: (
      <div>
        <AdminNavbar />
        <div className="lg:ml-64 mt-16 p-4 sm:p-6">
          <AllCustomer />
        </div>
      </div>
    ),
  },
  {
    path: "/admin-tailors",
    element: (
      <div>
        <AdminNavbar />
        <div className="lg:ml-64 mt-16 p-4 sm:p-6">
          <AllTailor />
        </div>
      </div>
    ),
  },
]);
const App = () => {
  return (
    <div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1e293b",
            color: "#fff",
            border: "1px solid rgba(239, 68, 68, 0.3)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
