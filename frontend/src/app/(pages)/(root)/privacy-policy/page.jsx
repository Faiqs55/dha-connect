"use client";

import ContainerCenter from "@/Components/ContainerCenter";
import { FaShieldAlt, FaUserShield, FaCookieBite, FaBalanceScale, FaChild } from "react-icons/fa";

const sections = [
  {
    title: "Consent",
    icon: FaShieldAlt,
    content: [
      "By using our website, you hereby consent to our Privacy Policy and agree to its terms."
    ],
  },
  {
    title: "Information We Collect",
    icon: FaUserShield,
    content: [
      "The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.",
      "If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.",
      "When you register for an account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number."
    ],
  },
  {
    title: "How We Use Your Information",
    icon: FaBalanceScale,
    content: [
      "Provide, operate, and maintain our website.",
      "Improve, personalize, and expand our website.",
      "Understand and analyze how you use our website.",
      "Develop new products, services, features, and functionality.",
      "Communicate with you, either directly or through one of our partners, including for customer service, updates, and marketing and promotional purposes.",
      "Send you emails and find and prevent fraud."
    ],
  },
  {
    title: "Log Files",
    icon: FaShieldAlt,
    content: [
      "DHA Connects follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected includes IP addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and the number of clicks. This data is not linked to anything personally identifiable and is used to analyze trends, administer the site, track user movement, and gather demographic information."
    ],
  },
  {
    title: "Cookies and Web Beacons",
    icon: FaCookieBite,
    content: [
      "Like any other website, DHA Connects uses cookies. These store information including visitors' preferences and pages on the site that were accessed. The information optimizes user experience by customizing web page content based on browser type and other details.",
      'For more general information on cookies, please read "What Are Cookies".'
    ],
  },
  {
    title: "Advertising Partners Privacy Policies",
    icon: FaShieldAlt,
    content: [
      "Third-party ad servers or networks use technologies such as cookies, JavaScript, or web beacons in their advertisements and links on DHA Connects. They automatically receive your IP address when this occurs and use it to measure campaign effectiveness or personalize advertising content.",
      "DHA Connects has no access to or control over these cookies that are used by third-party advertisers."
    ],
  },
  {
    title: "Third-Party Privacy Policies",
    icon: FaShieldAlt,
    content: [
      "DHA Connects's Privacy Policy does not apply to other advertisers or websites. We advise you to consult the privacy policies of these third-party servers for detailed information, including opt-out instructions.",
      "You can choose to disable cookies through your browser options. Detailed information about cookie management with specific web browsers can be found on the browsers' respective websites."
    ],
  },
  {
    title: "CCPA Privacy Rights",
    icon: FaBalanceScale,
    content: [
      "California consumers have rights including: requesting the categories and specific pieces of personal data a business has collected, requesting deletion of personal data, and requesting that personal data not be sold.",
      "If you make a request, we have one month to respond. Please contact us to exercise any of these rights."
    ],
  },
  {
    title: "GDPR Data Protection Rights",
    icon: FaShieldAlt,
    content: [
      "Every user is entitled to the following rights: access, rectification, erasure, restriction of processing, objection to processing, and data portability.",
      "If you make a request, we have one month to respond. Contact us to exercise these rights."
    ],
  },
  {
    title: "Children's Information",
    icon: FaChild,
    content: [
      "We prioritize protecting children while they use the internet. Parents and guardians are encouraged to monitor their children's online activity.",
      "DHA Connects does not knowingly collect personal information from children under 13. If you believe your child provided such information on our website, please contact us immediately so we can remove it from our records."
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gray-100 py-16">
      <ContainerCenter className="max-w-5xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-semibold text-slate-900">Privacy Policy for DHA Connects</h1>
          <p className="mt-3 text-sm text-slate-500">
            At DHA Connects, accessible from https://dhaconnects.com, safeguarding visitor privacy is a top priority. This document outlines the information we collect, how we use it, and the rights you have.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            For additional questions, please reach out to us anytime.
          </p>
        </header>

        <div className="space-y-6">
          {sections.map(({ title, icon: Icon, content }) => (
            <section key={title} className="rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
                  <div className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                    {content.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </ContainerCenter>
    </div>
  );
}


