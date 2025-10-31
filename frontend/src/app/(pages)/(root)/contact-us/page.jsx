"use client";
import ContainerCenter from "@/Components/ContainerCenter";
import React, { useState } from "react";

export default function page() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    setFormData({ name: "", email: "", message: "" });
    alert("Thanks for your message! We'll contact you soon.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Map Section */}
      <ContainerCenter>
        <section className="w-full h-[300px] md:h-[400px] relative">
        <iframe
          title="Our Office Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13616.374733467325!2d74.42858820853012!3d31.46244660030894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919045e15abedc7%3A0x9e7aee8b512cd0b2!2sDHA%20Phase%208%20Commercial%20Broadway%2C%20Lahore!5e0!3m2!1sen!2s!4v1698776715623!5m2!1sen!2s"
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0"
        />
        
        {/* Office Image Overlay */}
        <div className="absolute top-0 right-0 w-full md:w-1/3 h-1/3 md:h-full">
          <div className="relative w-full h-full">
            <img 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80"
              alt="Our office building"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6 text-white">
              <h3 className="text-sm md:text-xl font-bold">Our Office</h3>
              <p className="text-xs md:text-sm mt-1">DHA Phase 8, Lahore</p>
            </div>
          </div>
        </div>
      </section>
      </ContainerCenter>

      {/* Contact Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800">Get In Touch</h1>
            <p className="text-gray-600 mt-2">We'd love to hear from you</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Contact Details */}
            <div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-5">Contact Information</h2>
                
                <div className="space-y-5">
                  <div className="flex">
                    <div className="text-blue-600 mr-4 mt-1 text-lg">
                      📍
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Office Address</h3>
                      <p className="text-gray-600 mt-1">
                        Office #12, Commercial Broadway<br />
                        DHA Phase 8, Lahore, Pakistan
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="text-blue-600 mr-4 mt-1 text-lg">
                      📞
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone Number</h3>
                      <a
                        href="tel:+923001234567"
                        className="text-blue-600 hover:text-blue-800 mt-1 inline-block"
                      >
                        +92 300 1234567
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="text-blue-600 mr-4 mt-1 text-lg">
                      📧
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email Address</h3>
                      <a
                        href="mailto:info@dhaplus.com"
                        className="text-blue-600 hover:text-blue-800 mt-1 inline-block"
                      >
                        info@dhaplus.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-5">Send Us a Message</h2>
              
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Your Message
                  </label>
                  <textarea
                    rows="4"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us how we can help..."
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}