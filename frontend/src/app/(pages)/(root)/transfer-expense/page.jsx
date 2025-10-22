"use client";

import {useState} from 'react'
import Modal from '@/Components/Modal'
import ContainerCenter from '@/Components/ContainerCenter';

const PHASES = [
  { label: "DHA Phase 1", filename: "DHA Phase 1.jpg" },
  { label: "DHA Phase 2", filename: "DHA Phase 2.jpg" },
  { label: "DHA Phase 3-yz block", filename: "DHA Phase 3-yz- block.jpg" },
  { label: "DHA Phase 3", filename: "DHA Phase 3.jpg" },
  { label: "DHA Phase 4", filename: "DHA Phase 4.jpg" },
  { label: "DHA Phase 5 M block", filename: "DHA Phase 5 m block.jpg" },
  { label: "DHA Phase 5", filename: "DHA Phase 5.jpg" },
  { label: "DHA Phase 6 RAYA", filename: "DHA Phase 6 RAYA.jpg" },
  { label: "DHA Phase 6", filename: "DHA Phase 6.jpg" },
  { label: "DHA Phase 6 (C+M+N)", filename: "DHA Phase 6(C+M+N ) block.jpg" },
  { label: "DHA Phase 7 blocks", filename: "DHA Phase 7 (p+q+t+u+x+y+z2 block).jpg" },
  { label: "DHA Phase 7", filename: "DHA Phase 7.jpg" },
  { label: "DHA Phase 8 (s)", filename: "DHA Phase 8 (s-block).jpg" },
  { label: "DHA Phase 8 (a+v)", filename: "DHA Phase 8-(a+v block).jpg" },
  { label: "DHA Phase 8 (w+t)", filename: "DHA Phase 8-(w+t block).jpg" },
  { label: "DHA Phase 8 (x)", filename: "DHA Phase 8-(x block).jpg" },
  { label: "DHA Phase 8 (y)", filename: "DHA Phase 8-(y block).jpg" },
  { label: "DHA Phase 8 (z IVY Green)", filename: "DHA Phase 8-(z-block) IVY- Green.jpg" },
  { label: "DHA Phase 8 BWC", filename: "DHA Phase 8-bwc.jpg" },
  { label: "DHA Phase 8 (u+v)", filename: "DHA Phase 8(u+v block).jpg" },
  { label: "DHA Phase 9P (a+p+q)", filename: "DHA Phase 9P-(a+p+q-block).jpg" },
  { label: "DHA Phase 9P (j)", filename: "DHA Phase 9P-(j-block).jpg" },
  { label: "DHA Phase 9P", filename: "DHA Phase 9P.jpg" },
  { label: "DHA Phase 9T", filename: "DHA Phase 9T.jpg" },
  { label: "DHA Phase 10", filename: "DHA Phase 10.jpg" }
];

const page = () => {

    const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFilename, setSelectedFilename] = useState("");

  const openModal = (filename) => {
    setSelectedFilename(filename);
    setSelectedImage(`/dha-data/${filename}`);
    setModalOpen(true);
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
            className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 p-6 flex flex-col sm:flex-row justify-between items-center"
          >
            <h3 className="text-xl font-semibold text-gray-700 mb-4 sm:mb-0">
              {phase.label}
            </h3>

            <div className="flex gap-4">
              <button
                onClick={() => openModal(phase.filename)}
                className="px-6 cursor-pointer py-2 rounded-md border border-gray-400 hover:border-[#114085] hover:text-[#114085] transition duration-200 font-medium"
              >
                View
              </button>

              <a
                href={`/dha-data/${phase.filename}`}
                download={phase.filename}
                className="px-6 py-2 rounded-md bg-[#114085] text-white font-medium"
              >
                Download
              </a>
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
    </div>
    </ContainerCenter>
  )
}

export default page