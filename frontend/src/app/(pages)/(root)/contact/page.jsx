"use client";

import { useState } from "react";
import ContainerCenter from "@/Components/ContainerCenter";
import { FaPhoneAlt, FaGlobe, FaEnvelopeOpenText, FaMapMarkerAlt } from "react-icons/fa";
import AlertResult from "@/Components/AlertResult";
import contactService from "@/services/contact.service";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.subject || !form.message) {
      setToast({ success: false, message: "Please fill in all the fields" });
      return;
    }

    setSubmitting(true);
    setToast(null);

    const response = await contactService.submitContactQuery(form);
    setToast({
      success: response.success,
      message:
        response.message ||
        (response.success
          ? "Thanks for reaching out! Our team will contact you soon."
          : "Failed to submit your message"),
    });

    if (response.success) {
      setForm({ name: "", email: "", subject: "", message: "" });
    }

    setSubmitting(false);
  };

  return (
    <div className="bg-gray-100 py-16">
      <ContainerCenter className="max-w-7xl">
        <AlertResult data={toast} onClose={() => setToast(null)} />
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-semibold text-slate-900">Get in Touch</h1>
          <p className="mt-3 text-sm text-slate-500">
            Reach out to the DHA Connects team—we’re here to answer your questions and guide your next move.
          </p>
        </header>

        <div className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              <iframe
                title="DHA Connects Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3405.5141298621334!2d74.28070327482024!3d31.455695674260363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190569f820f8fb%3A0x8ec5b1077020ee69!2sIOI%20Technologies%20Private%20Limited!5e0!3m2!1sen!2s!4v1730955200000!5m2!1sen!2s"
                className="h-72 w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Find Us There</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                DHA Connects, Pakistan’s trusted real estate platform by Excellent Technologies, launched in 2024.
              </p>
            </div>

            <div className="space-y-4 text-sm font-medium text-slate-700">
              <ContactItem icon={FaPhoneAlt} label="Phone" value={"+92-322-0001112"} href="tel:+923220001112" />
              <ContactItem icon={FaGlobe} label="Web" value="https://dhaconnects.com" href="https://dhaconnects.com" />
              <ContactItem icon={FaEnvelopeOpenText} label="E-mail" value="info@dhaconnects.com" href="mailto:info@dhaconnects.com" />
              <ContactItem icon={FaMapMarkerAlt} label="Office" value="438 Block J3, Johar Town, Lahore" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                placeholder="Your Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <InputField
                placeholder="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <InputField
              placeholder="Subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              rows={6}
              placeholder="Message"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-gray-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-900 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-blue-800 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {submitting ? "Sending..." : "Submit Message"}
            </button>
          </form>
        </div>
      </ContainerCenter>
    </div>
  );
}

function ContactItem({ icon: Icon, label, value, href }) {
  const content = (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-blue-100 text-blue-700">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-widest text-slate-400">{label}</span>
        <span className="text-sm font-semibold text-slate-700">{value}</span>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block rounded-2xl border border-transparent px-2 py-1 transition hover:border-blue-200 hover:bg-blue-50">
        {content}
      </a>
    );
  }

  return <div className="px-2 py-1">{content}</div>;
}

function InputField({ name, type = "text", placeholder, value, onChange, required }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full rounded-xl border border-slate-200 bg-gray-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
    />
  );
}


