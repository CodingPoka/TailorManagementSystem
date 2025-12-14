import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./shared/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Product from "./components/Product";
import Testimonial from "./components/Testimonial";
import Footer from "./shared/Footer";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <Navbar />
        <Home />
        <Footer/>
      </div>
    ),
  },
  {
    path: "/about",
    element: (
      <div>
        <Navbar />
        <About />
      </div>
    ),
  },
  {
    path: "/contact",
    element: (
      <div>
        <Navbar />
        <Contact />
      </div>
    ),
  },
  {
    path: "/product",
    element: (
      <div>
        <Navbar />
        <Product />
      </div>
    ),
  },
  {
    path: "/testimonial",
    element: (
      <div>
        <Navbar />
        <Testimonial />
      </div>
    ),
  },
]);
const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
