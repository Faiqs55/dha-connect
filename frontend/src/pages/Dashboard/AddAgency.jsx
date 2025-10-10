import ContainerCenter from "../../Components/ContainerCenter";
import AgencyFormSection from "../../Components/AgencyForm/FormSection/AgencyFormSection";
import { useRef, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import axios from "axios";
import AgencyFormInput from "../../Components/AgencyForm/FormSection/AgencyFormInput";
import { FaPlus } from "react-icons/fa";


const cityOptions = [
  {val: "lahore", label: "Lahore"},
  {val: "karachi", label: "Karachi"},
  {val: "multan", label: "Multan"},
];
const phaseOptions = [
  {val: "phase 1", label: "phase 1"},
  {val: "phase 2", label: "phase 2"},
  {val: "phase 3", label: "phase 3"},
];


const AddAgency = () => {
  const agencyLogoRef = useRef(null);
  const [agencyLogo, setAgencyLogo] = useState(null);
  const [agencyLogoPreview, setAgencyLogoPreview] = useState(null);
  const [uploadImageUrl, setUploadImageUrl] = useState(null);
  const [cloudinaryError, setCloudinaryError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // State for multiple agency members - now includes staff image
  const [agencyMembers, setAgencyMembers] = useState([
    {
      staffName: "",
      staffDesignation: "",
      staffPhone: "",
      staffImage: null,
      staffImagePreview: null,
      staffImageUrl: null,
    },
  ]);

  // Refs for staff image inputs
  const staffImageRefs = useRef([]);

  const cloudName = "dhdgrfseu";
  const uploadPreset = "dha-agency-logo";

  // Add new agency member section
  const addAgencyMember = () => {
    setAgencyMembers([
      ...agencyMembers,
      {
        staffName: "",
        staffDesignation: "",
        staffPhone: "",
        staffImage: null,
        staffImagePreview: null,
        staffImageUrl: null,
      },
    ]);
  };

  // Remove specific agency member section
  const removeAgencyMember = (index) => {
    if (agencyMembers.length > 1) {
      const updatedMembers = [...agencyMembers];
      updatedMembers.splice(index, 1);
      setAgencyMembers(updatedMembers);
    }
  };

  // Handle input change for agency members
  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...agencyMembers];
    updatedMembers[index][field] = value;
    setAgencyMembers(updatedMembers);
  };

  // Handle staff image upload
  const handleStaffImageUpload = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // You might want to show error for specific staff member
        alert("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      const updatedMembers = [...agencyMembers];
      updatedMembers[index].staffImage = file;
      updatedMembers[index].staffImageUrl = null;

      const reader = new FileReader();
      reader.onload = (e) => {
        const newUpdatedMembers = [...agencyMembers];
        newUpdatedMembers[index].staffImagePreview = e.target.result;
        setAgencyMembers(newUpdatedMembers);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop for staff images
  const handleStaffDragOver = (e) => {
    e.preventDefault();
  };

  const handleStaffDrop = (e, index) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        handleStaffImageUpload({ target: { files: [file] } }, index);
      }
    }
  };

  // Handle delete staff image
  const handleDeleteStaffImage = (index) => {
    const updatedMembers = [...agencyMembers];
    updatedMembers[index].staffImage = null;
    updatedMembers[index].staffImagePreview = null;
    updatedMembers[index].staffImageUrl = null;
    setAgencyMembers(updatedMembers);

    if (staffImageRefs.current[index]) {
      staffImageRefs.current[index].value = "";
    }
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setCloudinaryError("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setCloudinaryError("Please select an image file");
        return;
      }
      setAgencyLogo(file);
      setUploadImageUrl(null);
      setCloudinaryError(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        setAgencyLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        handleLogoUpload({ target: { files: [file] } });
      }
    }
  };

  const handleDeleteLogo = () => {
    setAgencyLogo(null);
    setAgencyLogoPreview(null);
    setUploadImageUrl(null);
    setCloudinaryError(null);

    if (agencyLogoRef.current) {
      agencyLogoRef.current.value = "";
    }
  };

  // Generic function to upload any image to Cloudinary
  const uploadImageToCloudinary = async (imageFile) => {
    if (!imageFile) {
      return null;
    }

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      const errMessage =
        error.response?.data?.error?.message || "Failed To upload Image";
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload agency logo
      const logoUrl = await uploadImageToCloudinary(agencyLogo);

      if (logoUrl) {
        // Upload all staff images
        const staffWithImages = await Promise.all(
          agencyMembers.map(async (member) => {
            let staffImageUrl = null;
            if (member.staffImage) {
              staffImageUrl = await uploadImageToCloudinary(member.staffImage);
            }
            return {
              staffName: member.staffName,
              staffDesignation: member.staffDesignation,
              staffPhone: member.staffPhone,
              staffImageUrl: staffImageUrl,
            };
          })
        );

        const formData = {
          agencyLogo: logoUrl,
          staff: staffWithImages.filter(
            (member) =>
              member.staffName ||
              member.staffDesignation ||
              member.staffPhone ||
              member.staffImageUrl
          ),
        };

        console.log("Final Form Data:", formData);
        alert("Form submitted successfully! Check console for data.");
      } else {
        alert("Agency logo upload failed");
      }
    } catch (error) {
      console.log("Form submission Error: ", error);
      alert("An error occurred during submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-head bg-gray-100">
        <ContainerCenter className="py-15">
          <h1 className="text-4xl">Agency Creation Form</h1>
        </ContainerCenter>
      </div>

      <form onSubmit={handleSubmit} className="py-10">
        <ContainerCenter>
          {/* AGENCY LOGO SECTION */}
          <AgencyFormSection title={"Agency Logo"}>
            <input
              type="file"
              className="hidden"
              ref={agencyLogoRef}
              onChange={handleLogoUpload}
              accept="image/*"
            />

            {!agencyLogoPreview ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => {
                  agencyLogoRef.current.click();
                }}
                className="file-input bg-gray-200 text-gray-600 text-center py-6 rounded-md cursor-pointer hover:bg-gray-300 transition-colors"
              >
                <p>
                  Drag & Drop your files or{" "}
                  <span className="underline">Browse</span>
                </p>
              </div>
            ) : (
              <div className="relative w-full bg-gray-200 py-6 flex items-center justify-center">
                <img
                  src={agencyLogoPreview}
                  alt="Agency logo preview"
                  className="max-h-40"
                />
                <button
                  type="button"
                  onClick={handleDeleteLogo}
                  className="absolute top-5 right-5 bg-red-500 text-white p-3 rounded-sm cursor-pointer"
                >
                  <FaRegTrashAlt />
                </button>
              </div>
            )}

            {cloudinaryError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{cloudinaryError}</p>
              </div>
            )}
          </AgencyFormSection>

          {/* AGENCY INFORMATION  */}
          <AgencyFormSection title={"Agency Information"} innerStyle="grid grid-cols-2 gap-4">
            <AgencyFormInput label={"Agency Name"} placeholder={"Agency Name"} name={"agencyName"} />
            <AgencyFormInput label={"Agency Email"} placeholder={"Agency Email"} name={"agencyEmail"} />
            <AgencyFormInput label={"Ceo Name"} placeholder={"Ceo Name"} name={"ceoName"} />
            <AgencyFormInput label={"Ceo Phone 1"} placeholder={"Ceo Phone 1"} name={"ceoPhone1"} />
            <AgencyFormInput label={"Ceo Phone 2"} placeholder={"Ceo Phone 2"} name={"ceoPhone2"} />
            <AgencyFormInput label={"Whatsapp"} placeholder={"Whatsapp"} name={"whatsapp"} />
          </AgencyFormSection>

          {/* AGENCY LOCATION  */}
          <AgencyFormSection title={"Location"}>
  
          </AgencyFormSection>

          {/* AGENCY MEMBERS SECTION */}
          <AgencyFormSection title={"Agency Members"}>
            {agencyMembers.map((member, index) => (
              <div
                key={index}
                className="relative border border-gray-300 p-6 rounded-md mb-6"
              >
                {/* Remove button - only show if more than one member exists */}
                {agencyMembers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAgencyMember(index)}
                    className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-sm cursor-pointer hover:bg-red-600 transition-colors"
                  >
                    <FaRegTrashAlt />
                  </button>
                )}

                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Member {index + 1}
                </h3>

                <div className="grid grid-cols-3 gap-5 mb-6">
                  <AgencyFormInput
                    name={`staffName-${index}`}
                    placeholder={"Name"}
                    label={"Name"}
                    value={member.staffName}
                    onChange={(e) =>
                      handleMemberChange(index, "staffName", e.target.value)
                    }
                  />
                  <AgencyFormInput
                    name={`staffDesignation-${index}`}
                    placeholder={"Designation"}
                    label={"Designation"}
                    value={member.staffDesignation}
                    onChange={(e) =>
                      handleMemberChange(
                        index,
                        "staffDesignation",
                        e.target.value
                      )
                    }
                  />
                  <AgencyFormInput
                    name={`staffPhone-${index}`}
                    placeholder={"Phone"}
                    label={"Phone"}
                    value={member.staffPhone}
                    onChange={(e) =>
                      handleMemberChange(index, "staffPhone", e.target.value)
                    }
                  />
                </div>

                {/* Staff Image Upload Section */}
                <div className="mt-4">
                  <h4 className="text-md font-medium mb-3">Staff Image</h4>
                  <input
                    type="file"
                    className="hidden"
                    ref={(el) => (staffImageRefs.current[index] = el)}
                    onChange={(e) => handleStaffImageUpload(e, index)}
                    accept="image/*"
                  />

                  {!member.staffImagePreview ? (
                    <div
                      onDragOver={handleStaffDragOver}
                      onDrop={(e) => handleStaffDrop(e, index)}
                      onClick={() => staffImageRefs.current[index].click()}
                      className="file-input bg-gray-200 text-gray-600 text-center py-4 rounded-md cursor-pointer hover:bg-gray-300 transition-colors"
                    >
                      <p>
                        Drag & Drop staff image or{" "}
                        <span className="underline">Browse</span>
                      </p>
                    </div>
                  ) : (
                    <div className="relative w-full bg-gray-200 py-4 flex items-center justify-center">
                      <img
                        src={member.staffImagePreview}
                        alt={`Staff ${index + 1} preview`}
                        className="max-h-32"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteStaffImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-sm cursor-pointer"
                      >
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Add More Members Button */}
            <button
              type="button"
              onClick={addAgencyMember}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              <FaPlus />
              Add Another Member
            </button>
          </AgencyFormSection>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !agencyLogo}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Create Agency"}
            </button>
          </div>
        </ContainerCenter>
      </form>
    </div>
  );
};

export default AddAgency;
