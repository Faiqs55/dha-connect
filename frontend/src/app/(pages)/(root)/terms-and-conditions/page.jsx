"use client";

import ContainerCenter from "@/Components/ContainerCenter";
import {
  FaGavel,
  FaHandshake,
  FaCookieBite,
  FaLock,
  FaComments,
  FaExternalLinkAlt,
  FaShieldAlt,
  FaBan,
} from "react-icons/fa";

const sections = [
  {
    title: "Welcome to DHA Connect",
    icon: FaHandshake,
    paragraphs: [
      "These terms and conditions outline the rules and regulations for using DHA Connect, located at https://dhaconnect.com.",
      "By accessing this website we assume you accept these terms. Do not continue to use DHA Connect if you do not agree with any part of the terms listed." ,
      "Throughout these Terms, \"Client\", \"You\" and \"Your\" refer to the person using the website and compliant with the Company’s policies. \"The Company\", \"Ourselves\", \"We\", \"Our\" and \"Us\" refer to DHA Connect. \"Party\", \"Parties\" or \"Us\" includes both you and us." ,
      "All terms refer to the offer, acceptance and consideration of payment necessary to support you in the most appropriate manner for delivering our services, in accordance with applicable law."
    ],
  },
  {
    title: "Cookies",
    icon: FaCookieBite,
    paragraphs: [
      "We employ the use of cookies. By accessing DHA Connect, you agreed to use cookies in agreement with our Privacy Policy.",
      "Cookies enhance functionality, store visitor preferences, and simplify repeat visits. Some affiliate or advertising partners may also use cookies."
    ],
  },
  {
    title: "License",
    icon: FaGavel,
    paragraphs: [
      "Unless otherwise stated, DHA Connect and/or its licensors own the intellectual property rights for all material on the site. All rights are reserved for your personal use, subject to restrictions contained in these terms.",
      "You must not republish, sell, rent, sub-license, reproduce, duplicate, copy, or redistribute DHA Connect content without permission.",
      "This Agreement begins on the date you access the website."
    ],
  },
  {
    title: "User Comments",
    icon: FaComments,
    paragraphs: [
      "Parts of this website may allow users to post opinions and information. DHA Connect does not filter, edit, publish or review Comments before they appear.",
      "Comments reflect the views of their authors. To the extent permitted by law, DHA Connect shall not be liable for any damages caused or suffered from any use of Comments.",
      "We reserve the right to monitor all Comments and remove those deemed inappropriate, offensive or in breach of these Terms.",
      "By posting, you confirm you have the necessary rights, your content does not infringe third-party intellectual property, is not defamatory or unlawful, and will not be used for solicitation or unlawful activity. You grant DHA Connect a non-exclusive license to use, reproduce, edit, and authorize others to do so in any media."
    ],
  },
  {
    title: "Hyperlinking to Our Content",
    icon: FaExternalLinkAlt,
    paragraphs: [
      "Certain organizations—such as government agencies, search engines, news organizations, and online directory distributors—may link to our site without prior written approval if the link is not deceptive, does not imply false sponsorship, and fits contextually.",
      "We may consider and approve link requests from other groups (community sites, charities, internet portals, professional firms, and educational bodies) when the link benefits both parties and aligns with our standards.",
      "Approved organizations may link using our corporate name, the linked URL, or other appropriate descriptions, but may not use DHA Connect logos or artwork without a trademark license agreement."
    ],
  },
  {
    title: "Content Liability",
    icon: FaShieldAlt,
    paragraphs: [
      "We shall not be held responsible for content that appears on third-party websites linking to us. You agree to protect and defend us against all claims arising from your website.",
      "No links should appear on any website that may be interpreted as libelous, obscene, criminal, or that infringes third-party rights."
    ],
  },
  {
    title: "Reservation & Removal of Links",
    icon: FaLock,
    paragraphs: [
      "We reserve the right to request removal of any link to our website. Upon request, you agree to remove links immediately.",
      "We may amend these terms and our linking policy at any time. By linking to our website, you agree to stay informed of and comply with updates.",
      "If you find a link on our site offensive for any reason, contact us. While we are not obligated to respond, we will consider removal requests."
    ],
  },
  {
    title: "Disclaimer & Limitation of Liability",
    icon: FaBan,
    paragraphs: [
      "We strive to keep information accurate and updated but do not guarantee completeness or availability. Use of the website is at your own risk.",
      "Nothing in this disclaimer will limit or exclude liability for death or personal injury, fraud or fraudulent misrepresentation, or liabilities otherwise not permitted under law.",
      "As long as the site and services are provided free of charge, we will not be liable for any loss or damage of any nature."
    ],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-gray-100 py-16">
      <ContainerCenter className="max-w-5xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-semibold text-slate-900">Terms & Conditions</h1>
          <p className="mt-3 text-sm text-slate-500">
            Welcome to DHA Connect. These terms outline the rules for using our website and services. By continuing, you agree to the guidelines below.
          </p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm md:px-10 md:py-10">
          <div className="space-y-8">
            {sections.map(({ title, icon: Icon, paragraphs }) => (
              <article key={title} className="flex flex-col gap-4 sm:flex-row">
                <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-3">
                  <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
                  <div className="space-y-3 text-sm leading-6 text-slate-600">
                    {paragraphs.map((text) => (
                      <p key={text}>{text}</p>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </ContainerCenter>
    </div>
  );
}


