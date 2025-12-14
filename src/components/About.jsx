import React from "react";
import {
  FaHistory,
  FaBullseye,
  FaLightbulb,
  FaCheckCircle,
  FaUsers,
  FaClock,
  FaShieldAlt,
  FaAward,
} from "react-icons/fa";

const About = () => {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/src/assets/aboutImage/aboutHero.jpg)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/70"></div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              About <span className="text-amber-400">DorjiHub</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
              Revolutionizing the tailoring industry by connecting customers,
              tailors, and excellence through seamless digital solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=800&auto=format&fit=crop"
                  alt="Our Story"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-6">
                <FaHistory className="text-4xl text-amber-500" />
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  Our History
                </h2>
              </div>
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p>
                  DorjiHub was born from a simple observation: the traditional
                  tailoring process was plagued with miscommunication, lost
                  measurements, and endless back-and-forth conversations.
                </p>
                <p>
                  Founded in 2023, we set out to bridge the gap between
                  customers seeking perfect-fit clothing and skilled tailors
                  delivering exceptional craftsmanship. Our platform emerged as
                  a solution to modernize an age-old industry.
                </p>
                <p>
                  What started as a small initiative has now grown into a
                  comprehensive platform serving thousands of customers and
                  tailors, transforming how custom clothing is created and
                  delivered.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-100 p-4 rounded-xl">
                  <FaBullseye className="text-4xl text-amber-600" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Our Mission
                </h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                To empower the tailoring community by providing a seamless
                digital platform that enhances communication, streamlines
                workflows, and delivers exceptional customer experiences.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-amber-500 text-xl mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    Eliminate miscommunication between customers and tailors
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-amber-500 text-xl mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    Preserve and organize all tailoring details digitally
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-amber-500 text-xl mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    Support tailors in growing their business efficiently
                  </span>
                </li>
              </ul>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-xl p-8 lg:p-10 text-white hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white/20 p-4 rounded-xl">
                  <FaLightbulb className="text-4xl text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Our Vision</h2>
              </div>
              <p className="text-white/90 text-lg leading-relaxed mb-6">
                To become the world's leading platform for custom tailoring,
                where technology meets craftsmanship to create perfectly fitted
                clothing for everyone, everywhere.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-white text-xl mt-1 flex-shrink-0" />
                  <span className="text-white/90">
                    Revolutionize the global tailoring industry
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-white text-xl mt-1 flex-shrink-0" />
                  <span className="text-white/90">
                    Make custom clothing accessible to all
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-white text-xl mt-1 flex-shrink-0" />
                  <span className="text-white/90">
                    Build a thriving community of skilled artisans
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-amber-500">DorjiHub?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're not just a platform; we're your partner in achieving
              perfectly tailored clothing
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-3xl text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Expert Network
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with verified, skilled tailors who deliver exceptional
                craftsmanship
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-3xl text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Time Saving
              </h3>
              <p className="text-gray-600 leading-relaxed">
                No more repeated explanations. Your preferences are saved and
                ready
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-3xl text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Secure Platform
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your data and measurements are protected with enterprise-level
                security
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaAward className="text-3xl text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Quality Assured
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Track every step of your order and ensure premium quality
                delivery
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
