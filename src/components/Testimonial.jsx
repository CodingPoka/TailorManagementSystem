import React from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const Testimonial = () => {
  const testimonials = [
    {
      id: 1,
      name: "Rajesh Kumar",
      role: "Business Professional",
      image: "https://i.pravatar.cc/150?img=12",
      rating: 5,
      text: "DorjiHub transformed my tailoring experience! The measurements are stored digitally, and I never have to explain my preferences again. My tailor knows exactly what I want every time.",
      date: "2 weeks ago",
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Fashion Designer",
      image: "https://i.pravatar.cc/150?img=45",
      rating: 5,
      text: "As a designer working with multiple tailors, this platform is a game-changer. I can track all my orders, share design references instantly, and maintain perfect communication with every tailor.",
      date: "1 month ago",
    },
    {
      id: 3,
      name: "Mohammed Ali",
      role: "Wedding Planner",
      image: "https://i.pravatar.cc/150?img=33",
      rating: 5,
      text: "Planning weddings means coordinating dozens of outfits. DorjiHub makes it so easy to manage measurements, track progress, and ensure everything is delivered on time. Absolutely love it!",
      date: "3 weeks ago",
    },
    {
      id: 4,
      name: "Anita Desai",
      role: "Teacher",
      image: "https://i.pravatar.cc/150?img=47",
      rating: 4,
      text: "Finally, a platform that understands the customer-tailor relationship! No more lost measurements or miscommunication. Everything is documented and accessible anytime.",
      date: "1 week ago",
    },
    {
      id: 5,
      name: "Vikram Singh",
      role: "Software Engineer",
      image: "https://i.pravatar.cc/150?img=15",
      rating: 5,
      text: "Being tech-savvy, I appreciate how well-designed DorjiHub is. Uploading reference images, tracking order status, and communicating with my tailor has never been easier!",
      date: "2 months ago",
    },
    {
      id: 6,
      name: "Lakshmi Iyer",
      role: "Entrepreneur",
      image: "https://i.pravatar.cc/150?img=26",
      rating: 5,
      text: "I run a busy schedule, and DorjiHub saves me so much time. I can place orders, share requirements, and get updates without endless phone calls. Highly recommend!",
      date: "3 days ago",
    },
    {
      id: 7,
      name: "Arjun Reddy",
      role: "Fitness Trainer",
      image: "https://i.pravatar.cc/150?img=51",
      rating: 4,
      text: "My body measurements change frequently, and DorjiHub makes it easy to update them. My tailor always has the latest info, ensuring a perfect fit every time.",
      date: "1 month ago",
    },
    {
      id: 8,
      name: "Sneha Patel",
      role: "Doctor",
      image: "https://i.pravatar.cc/150?img=38",
      rating: 5,
      text: "Professional attire is important in my field. DorjiHub connects me with skilled tailors and keeps all my preferences organized. The quality and service are outstanding!",
      date: "2 weeks ago",
    },
    {
      id: 9,
      name: "Karan Mehta",
      role: "Marketing Manager",
      image: "https://i.pravatar.cc/150?img=68",
      rating: 5,
      text: "I travel frequently for work and need custom outfits regularly. With DorjiHub, I can coordinate with my tailor from anywhere. It's incredibly convenient and professional.",
      date: "5 days ago",
    },
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`${
              index < rating ? "text-amber-400" : "text-gray-300"
            } text-lg`}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/assets/testiImage/testi.webp)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/70"></div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Trusted by{" "}
              <span className="text-amber-400">Thousands of Happy</span>{" "}
              Customers
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
              See what our customers have to say about their tailoring
              experience with DorjiHub
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real experiences from real people who love using DorjiHub for
              their tailoring needs
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 lg:p-8 group hover:-translate-y-2"
              >
                {/* Quote Icon */}
                <div className="mb-4">
                  <FaQuoteLeft className="text-4xl text-amber-400/20 group-hover:text-amber-400/40 transition-colors" />
                </div>

                {/* Rating */}
                <div className="mb-4">{renderStars(testimonial.rating)}</div>

                {/* Review Text */}
                <p className="text-gray-700 text-base leading-relaxed mb-6">
                  "{testimonial.text}"
                </p>

                {/* Customer Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-400/20"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {testimonial.date}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Join Them?
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Start your seamless tailoring journey with DorjiHub today
            </p>
            <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-10 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/50">
              Get Started Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonial;
