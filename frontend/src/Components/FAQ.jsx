import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const FAQ = () => {
  const faqData = [
    {
      question: "Why should I choose DHA Connect?",
      answer:
        "DHA Connect offers premium properties with trusted agents, modern infrastructure, and a seamless buying experience.",
    },
    {
      question: "In which cities do you offer your services?",
      answer:
        "We provide services in major cities including Lahore, Islamabad, Karachi, and more.",
    },
    {
      question: "What kind of properties are listed on your website?",
      answer:
        "We list residential plots, commercial plots, houses, and apartments for sale and rent.",
    },
    {
      question: "How do I contact someone if I have problems with DHA Connect?",
      answer:
        "You can contact our support team via call, WhatsApp, or the contact form on our website.",
    },
    {
      question: "What are the steps to buy a property through DHA Connect?",
      answer:
        "Select your property → Contact the agent → Visit site → Complete booking and payment process.",
    },
    {
      question: "How soon would I receive a call from you after placing my requirement?",
      answer:
        "Our team usually contacts you within 24 hours to understand your requirements.",
    },
    {
      question: "Do you offer home loan services?",
      answer:
        "Yes, we assist with home loans and guide you through the process with partnered banks.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full mt-15">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl mb-10">Frequently Asked Questions</h2>

        <div className="divide-y divide-gray-200 border border-gray-100 rounded-lg bg-white shadow-sm">
          {faqData.map((item, index) => (
            <motion.div key={index} layout>
              <motion.button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-5 md:p-6 text-left hover:bg-gray-50 transition-colors duration-300"
              >
                <span className="text-gray-800 font-medium text-base sm:text-lg">
                  {item.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Plus className="w-5 h-5 text-gray-500" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="px-5 md:px-6 pb-5 text-gray-600 text-sm sm:text-base leading-relaxed bg-white"
                  >
                    {item.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;