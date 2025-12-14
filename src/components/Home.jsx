import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [
    {
      id: 1,
      image: "/src/assets/homeImage/slide1.jpg",
      title: "Welcome to DorjiHub",
      subtitle:
        "Your complete solution for managing tailors, customers, and orders in one place.",
      titleAnimation: "animate-slideInLeft",
      subtitleAnimation: "animate-fadeInUp",
      imageAnimation: "animate-zoomIn",
    },
    {
      id: 2,
      image: "/src/assets/homeImage/slide2.jpg",
      title: "Perfect Fit, Every Time",
      subtitle:
        "Book your tailor online, track your orders, and manage measurements seamlessly.",
      titleAnimation: "animate-fadeInDown",
      subtitleAnimation: "animate-slideInLeft",
      imageAnimation: "animate-slideInRight",
    },
    {
      id: 3,
      image: "/src/assets/homeImage/slide3.jpg",
      title: "Your Personal Tailor Assistant",
      subtitle:
        "From measurements to delivery, DorjiHub keeps every detail organized for you.",
      titleAnimation: "animate-bounceIn",
      subtitleAnimation: "animate-slideInRight",
      imageAnimation: "animate-scaleIn",
    },
    {
      id: 4,
      image: "/src/assets/homeImage/slide4.jpg",
      title: "Smart Tailoring Starts Here",
      subtitle:
        "Connect customers, tailors, and admins with a modern platform.",
      titleAnimation: "animate-slideInRight",
      subtitleAnimation: "animate-fadeInUp",
      imageAnimation: "animate-panZoom",
    },
  ];

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const goToSlide = (index) => {
    if (!isAnimating && index !== currentSlide) {
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  // Auto-play slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <>
      <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden bg-gray-900">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image */}
            <div
              className={`absolute inset-0 bg-cover bg-center ${
                index === currentSlide ? slide.imageAnimation : ""
              }`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Content */}
            <div className="relative z-20 h-full flex items-center justify-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-4xl mx-auto text-center">
                  {/* Title */}
                  <h1
                    className={`text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight ${
                      index === currentSlide ? slide.titleAnimation : ""
                    }`}
                    style={{ animationDelay: "0.2s" }}
                  >
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p
                    className={`text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 leading-relaxed ${
                      index === currentSlide ? slide.subtitleAnimation : ""
                    }`}
                    style={{ animationDelay: "0.4s" }}
                  >
                    {slide.subtitle}
                  </p>

                  {/* CTA Buttons */}
                  <div
                    className={`flex flex-col sm:flex-row gap-4 justify-center ${
                      index === currentSlide ? "animate-fadeInUp" : ""
                    }`}
                    style={{ animationDelay: "0.6s" }}
                  >
                    <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/50">
                      Get Started
                    </button>
                    <button className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 md:p-4 rounded-full transition-all duration-300 hover:scale-110 group"
          aria-label="Previous slide"
        >
          <FaChevronLeft className="text-xl md:text-2xl group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 md:p-4 rounded-full transition-all duration-300 hover:scale-110 group"
          aria-label="Next slide"
        >
          <FaChevronRight className="text-xl md:text-2xl group-hover:scale-110 transition-transform" />
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? "bg-amber-500 w-12 h-3"
                  : "bg-white/50 hover:bg-white/75 w-3 h-3"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Story Section 1 - Text Left, Image Right */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Text Content */}
            <div className="order-2 lg:order-1 lg:pr-8 xl:pr-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 xl:mb-8 leading-tight">
                Perfect Communication With{" "}
                <span className="text-amber-500">Zero Confusion</span>
              </h2>
              <div className="space-y-4 xl:space-y-6 text-gray-700 text-lg xl:text-xl leading-relaxed">
                <p>
                  Great tailoring begins with great communication. DorjiHub
                  ensures that every fabric choice, every measurement, and every
                  tiny design request is clearly understood and preserved.
                </p>
                <p>
                  No misunderstandings. No forgotten details. Just smooth
                  collaboration that leads to beautifully stitched results —
                  every single time.
                </p>
                <p className="hidden xl:block">
                  Whether you're a customer sharing your vision or a tailor
                  capturing precise requirements, DorjiHub acts as your reliable
                  communication bridge, ensuring nothing gets lost in
                  translation.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl group h-[350px] md:h-[450px] xl:h-[550px] 2xl:h-[600px]">
                <img
                  src="/src/assets/homeImage/story1.jpg"
                  alt="Perfect Communication"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section 2 - Image Left, Text Right */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Image */}
            <div className="order-1">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl group h-[350px] md:h-[450px] xl:h-[550px] 2xl:h-[600px]">
                <img
                  src="/src/assets/homeImage/story2.jpg"
                  alt="Tailoring Without Hassle"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Text Content */}
            <div className="order-2 lg:pl-8 xl:pl-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 xl:mb-8 leading-tight">
                Experience Tailoring{" "}
                <span className="text-amber-500">Without the Hassle</span>
              </h2>
              <div className="space-y-4 xl:space-y-6 text-gray-700 text-lg xl:text-xl leading-relaxed">
                <p>
                  From choosing a design to receiving the final stitched outfit,
                  DorjiHub makes every step effortless.
                </p>
                <p>
                  Customers don't need to explain the same details again or
                  worry about missed updates. Everything — measurements, photos,
                  and progress tracking — stays neatly arranged in one place.
                </p>
                <p>
                  Enjoy tailor-made clothing without the usual back-and-forth
                  hassle.
                </p>
                <p className="hidden xl:block">
                  Say goodbye to endless phone calls and forgotten
                  conversations. DorjiHub streamlines the entire tailoring
                  journey, saving time for both customers and tailors while
                  delivering exceptional results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
