"use client";

import {useState} from 'react'
import Modal from '@/Components/Modal'
import ContainerCenter from '@/Components/ContainerCenter';
import { FiShare2, FiX, FiLink, FiCopy } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp, FaEnvelope, FaMicrosoft } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { HiOutlineQrCode, HiOutlineUsers } from "react-icons/hi2";

const PHASES = [
  { label: "DHA Phase 1", filename: "/te/dp1.jpg" },
  { label: "DHA Phase 2", filename: "/te/dp2.jpg" },
  { label: "DHA Phase 3-yz block", filename: "/te/dp3-yz.jpg" },
  { label: "DHA Phase 3", filename: "/te/dp3.jpg" },
  { label: "DHA Phase 4", filename: "/te/dp4.jpg" },
  { label: "DHA Phase 5 M block", filename: "/te/dp5-mb.jpg" },
  { label: "DHA Phase 5", filename: "/te/dp5.jpg" },
  { label: "DHA Phase 6 RAYA", filename: "/te/dp6-r.jpg" },
  { label: "DHA Phase 6", filename: "/te/dp6-cmn.jpg" },
  { label: "DHA Phase 6 (C+M+N)", filename: "/te/dp6-cmn.jpg" },
  { label: "DHA Phase 7 blocks", filename: "/te/dp7-b.jpg" },
  { label: "DHA Phase 7", filename: "/te/dp7.jpg" },
  { label: "DHA Phase 8 (s)", filename: "/te/dp8-s.jpg" },
  { label: "DHA Phase 8 (x)", filename: "/te/dp8-x.jpg" },
  { label: "DHA Phase 8 (y)", filename: "/te/dp8-y.jpg" },
  { label: "DHA Phase 8 (z IVY Green)", filename: "/te/dp8-z.jpg" },
  { label: "DHA Phase 9P (a+p+q)", filename: "/te/dp9.jpg" },
  { label: "DHA Phase 9P (j)", filename: "/te/dp9-j.jpg" },
  { label: "DHA Phase 9P", filename: "/te/dp9.jpg" },
  { label: "DHA Phase 9T", filename: "/te/dp9-t.jpg" },
];

function SharePlatform({ name, href, icon: Icon, iconColor, iconBgColor }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center gap-2 sm:gap-2.5 rounded-lg sm:rounded-xl p-2 sm:p-3 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:scale-105 active:scale-95"
    >
      <div className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full shadow-sm transition-transform group-hover:scale-110 ${iconBgColor || "bg-slate-100"}`}>
        <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${iconColor || "text-slate-700"}`} />
      </div>
      <span className="text-[10px] sm:text-xs font-medium text-slate-700 text-center leading-tight">{name}</span>
    </a>
  );
}

function ShareModal({ phaseName, shareUrl, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const sharePlatforms = [
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${phaseName} - ${shareUrl}`)}`,
      icon: FaWhatsapp,
      iconBgColor: "bg-[#25d366]",
      iconColor: "text-white",
    },
    {
      name: "Mail",
      href: `mailto:?subject=${encodeURIComponent(phaseName)}&body=${encodeURIComponent(shareUrl)}`,
      icon: FaEnvelope,
      iconBgColor: "bg-blue-500",
      iconColor: "text-white",
    },
    {
      name: "Outlook",
      href: `https://outlook.live.com/owa/?path=/mail/action/compose&subject=${encodeURIComponent(phaseName)}&body=${encodeURIComponent(shareUrl)}`,
      icon: FaMicrosoft,
      iconBgColor: "bg-[#0078d4]",
      iconColor: "text-white",
    },
    {
      name: "Microsoft Teams",
      href: `https://teams.microsoft.com/share?href=${encodeURIComponent(shareUrl)}`,
      icon: HiOutlineUsers,
      iconBgColor: "bg-[#6264a7]",
      iconColor: "text-white",
    },
    {
      name: "Gmail",
      href: `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(phaseName)}&body=${encodeURIComponent(shareUrl)}`,
      icon: SiGmail,
      iconBgColor: "bg-[#ea4335]",
      iconColor: "text-white",
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      icon: FaFacebookF,
      iconBgColor: "bg-[#1877f2]",
      iconColor: "text-white",
    },
    {
      name: "Twitter",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(phaseName)}`,
      icon: FaTwitter,
      iconBgColor: "bg-[#1d9bf0]",
      iconColor: "text-white",
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      icon: FaLinkedinIn,
      iconBgColor: "bg-[#0a66c2]",
      iconColor: "text-white",
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 py-6 transition-opacity duration-200" 
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl max-h-[90vh] overflow-hidden flex flex-col transition-transform duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-2 sm:mb-3">{phaseName}</h2>
              <div className="flex items-center gap-2 rounded-lg sm:rounded-xl border border-slate-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm">
                <FiLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-slate-700 truncate flex-1 font-medium">{shareUrl}</span>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="p-1 sm:p-1.5 rounded-md sm:rounded-lg hover:bg-slate-100 transition text-slate-600 hover:text-slate-900"
                    title="Copy link"
                  >
                    <FiCopy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1 sm:p-1.5 rounded-md sm:rounded-lg hover:bg-slate-100 transition text-slate-600 hover:text-slate-900"
                    title="More options"
                  >
                    <HiOutlineQrCode className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
              {copied && (
                <div className="mt-1.5 sm:mt-2 text-xs text-green-600 font-medium flex items-center gap-1">
                  <span>✓</span>
                  <span>Link copied to clipboard</span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 rounded-lg sm:rounded-xl p-1.5 sm:p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              aria-label="Close"
            >
              <FiX className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto flex-1">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-900 mb-4 sm:mb-5 uppercase tracking-wider">Share using</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
            {sharePlatforms.map((platform) => (
              <SharePlatform
                key={platform.name}
                name={platform.name}
                href={platform.href}
                icon={platform.icon}
                iconBgColor={platform.iconBgColor}
                iconColor={platform.iconColor}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const page = () => {

    const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFilename, setSelectedFilename] = useState("");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sharePayload, setSharePayload] = useState({ phaseName: "", shareUrl: "" });

  const openModal = (filename) => {
    setSelectedFilename(filename);
    setSelectedImage(`${filename}`);
    setModalOpen(true);
  };

  const handleShare = (phaseLabel) => {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/transfer-expense` : '';
    setSharePayload({
      phaseName: phaseLabel,
      shareUrl: shareUrl
    });
    setShareModalOpen(true);
  };

  return (
    <ContainerCenter className="py-12">
        <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-center text-4xl font-semibold uppercase mb-4">
        DHA Lahore — Transfer Expense
      </h1>
      <p className="text-gray-600 mb-8 text-center">
        Select your desired phase below to view or download its transfer expense details.
      </p>

      <div className="flex flex-col gap-6 mt-5">
        {PHASES.map((phase, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 p-6 flex flex-col md:flex-row justify-between items-center"
          >
            <h3 className="text-xl font-semibold text-gray-700 mb-4 md:mb-0">
              {phase.label}
            </h3>

            <div className="flex gap-2 md:gap-4">
              <button
                onClick={() => openModal(phase.filename)}
                className="md:px-6 px-3 py-1 text-sm md:text-base cursor-pointer md:py-2 rounded-md border border-gray-400 hover:border-[#114085] hover:text-[#114085] transition duration-200 font-medium"
              >
                View
              </button>

              <a
                href={`${phase.filename}`}
                download={phase.filename}
                className="md:px-6 px-3 py-1 text-sm md:text-base md:py-2 rounded-md bg-[#114085] text-white font-medium hover:bg-[#0d3366] transition duration-200"
              >
                Download
              </a>

              <button
                onClick={() => handleShare(phase.label)}
                className="md:px-6 px-3 py-1 text-sm md:text-base md:py-2 rounded-md border border-[#114085] bg-white text-[#114085] font-medium hover:bg-[#114085] hover:text-white transition duration-200 flex items-center gap-2"
              >
                <FiShare2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageUrl={selectedImage}
        filename={selectedFilename}
      />

      {shareModalOpen && (
        <ShareModal
          phaseName={sharePayload.phaseName}
          shareUrl={sharePayload.shareUrl}
          onClose={() => setShareModalOpen(false)}
        />
      )}
    </div>
    </ContainerCenter>
  )
}

export default page