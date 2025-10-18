import ContainerCenter from "../../Components/ContainerCenter";
import AgencyFormSection from "../../Components/AgencyForm/FormSection/AgencyFormSection";
import { useRef, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import axios from "axios";
import AgencyFormInput from "../../Components/AgencyForm/FormSection/AgencyFormInput";
import AgencyFormSelect from "../../Components/AgencyForm/FormSection/AgencyFormSelect";
import agencyService from "../../services/agency.service";
import Toast from "../../Components/Toast";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

const cityOptions = [
  { val: "lahore", label: "Lahore" },
  { val: "karachi", label: "Karachi" },
  { val: "multan", label: "Multan" },
];
const phaseOptions = [
  { val: "phase1", label: "Phase 1" },
  { val: "phase2", label: "Phase 2" },
  { val: "phase3", label: "Phase 3" },
];

const AddAgency = () => {
  const agencyLogoRef = useRef(null);
  const [agencyLogo, setAgencyLogo] = useState(null);
  const [agencyLogoPreview, setAgencyLogoPreview] = useState(null);
  const [uploadImageUrl, setUploadImageUrl] = useState(null);
  const [cloudinaryError, setCloudinaryError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // State for form data
  const [formData, setFormData] = useState({
    agencyName: "",
    agencyVideo: "",
    password: "",
    agencyEmail: "",
    ceoName: "",
    ceoPhone: "",
    whatsapp: "",
    city: cityOptions[0].val,
    phase: phaseOptions[0].val,
    address: "",
    facebook: "",
    youtube: "",
    twitter: "",
    instagram: "",
    about: "",
    website: "",
  });

  const cloudName = "dhdgrfseu";
  const uploadPreset = "dha-agency-logo";

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select changes
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    setResult(null);
    try {
      // Upload agency logo
      const logoUrl = await uploadImageToCloudinary(agencyLogo);

      if (logoUrl) {
        // Prepare the final data object
        const finalData = {
          // Agency Information
          agencyName: formData.agencyName,
          password: formData.password,
          agencyEmail: formData.agencyEmail,
          ceoName: formData.ceoName,
          ceoPhone: formData.ceoPhone,
          whatsapp: formData.whatsapp,
          agencyVideo: formData.agencyVideo,

          // Location
          city: formData.city,
          phase: formData.phase,
          address: formData.address,

          // Social Media
          facebook: formData.facebook,
          youtube: formData.youtube,
          twitter: formData.twitter,
          instagram: formData.instagram,

          // About
          about: formData.about,
          website: formData.website,

          // Images
          agencyLogo: logoUrl,
        };

        let res = await agencyService.addAgency(finalData);
        if (!res.success) {
          setResult({
            result: `Error! Something Went Wrong.`,
            message: `${res.message}`,
            color: "red",
          });
        }

        setResult({
          result: `The Agency "${res.data.agencyName} has been Added."`,
          message: "Your Agency has been added. You can now add another one.",
          color: "green",
        });
        setFormData({
          agencyName: "",
          password: "",
          agencyEmail: "",
          ceoName: "",
          ceoPhone1: "",
          ceoPhone2: "",
          whatsapp: "",
          city: cityOptions[0].val,
          phase: phaseOptions[0].val,
          address: "",
          facebook: "",
          youtube: "",
          twitter: "",
          instagram: "",
          about: "",
          website: "",
        });
      } else {
        setResult({
          result: `Error! Something Went Wrong.`,
          message: `Could not upload the Agency Logo`,
          color: "red",
        });
      }
    } catch (error) {
      setResult({
        result: `Error! Something Went Wrong.`,
        message: `${error.message}`,
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-head bg-gray-100">
        <ContainerCenter className="py-15">
          <h1 className="text-4xl">Agency Creation Form</h1>
        </ContainerCenter>
      </div>

      <form onSubmit={handleSubmit} className="py-10">
        <ContainerCenter>
          {result && (
            <div className={`mt-10`}>
              <Toast
                color={result?.color}
                result={result?.result}
                message={result?.message}
              />
            </div>
          )}
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
          <AgencyFormSection
            title={"Agency Information"}
            innerStyle="grid md:grid-cols-2 gap-4"
          >
            <AgencyFormInput
              label={"Agency Name"}
              placeholder={"Agency Name"}
              name={"agencyName"}
              value={formData.agencyName}
              onChange={handleInputChange}
            />
            <AgencyFormInput
              label={"Agency Video URL"}
              placeholder={"Enter youtube video Link"}
              name={"agencyVideo"}
              value={formData.agencyVideo}
              onChange={handleInputChange}
            />
            <AgencyFormInput
              label={"Admin Password"}
              placeholder={"Enter Password"}
              name={"password"}
              value={formData.password}
              onChange={handleInputChange}
            />
            <AgencyFormInput
              label={"Agency Email"}
              placeholder={"Agency Email"}
              name={"agencyEmail"}
              value={formData.agencyEmail}
              onChange={handleInputChange}
            />
            <AgencyFormInput
              label={"Ceo Name"}
              placeholder={"Ceo Name"}
              name={"ceoName"}
              value={formData.ceoName}
              onChange={handleInputChange}
            />
            <AgencyFormInput
              label={"Ceo Phone"}
              placeholder={"Ceo Phone"}
              name={"ceoPhone"}
              value={formData.ceoPhone}
              onChange={handleInputChange}
            />
            <AgencyFormInput
              label={"Whatsapp"}
              placeholder={"Whatsapp"}
              name={"whatsapp"}
              value={formData.whatsapp}
              onChange={handleInputChange}
            />
          </AgencyFormSection>

          {/* AGENCY LOCATION  */}
          <AgencyFormSection
            title={"Location"}
            innerStyle={"grid md:grid-cols-2 gap-4"}
          >
            <AgencyFormSelect
              label={"City"}
              options={cityOptions}
              name={"city"}
              value={formData.city}
              onChange={handleSelectChange}
            />
            <AgencyFormSelect
              label={"Phase"}
              options={phaseOptions}
              name={"phase"}
              value={formData.phase}
              onChange={handleSelectChange}
            />
            <AgencyFormInput
              label={"Street Address"}
              name={"address"}
              placeholder={"Street Address"}
              value={formData.address}
              onChange={handleInputChange}
            />
          </AgencyFormSection>

          {/* AGENCY SOCIALS  */}
          <AgencyFormSection
            title={"Socials"}
            innerStyle={"grid md:grid-cols-2 gap-4"}
          >
            <AgencyFormInput
              label={"Facebook"}
              placeholder={"Facebook"}
              name={"facebook"}
              value={formData.facebook}
              onChange={handleInputChange}
            />
            <AgencyFormInput
              label={"Youtube"}
              placeholder={"Youtube"}
              name={"youtube"}
              value={formData.youtube}
              onChange={handleInputChange}
            />
            <AgencyFormInput
              label={"Twitter"}
              placeholder={"Twitter"}
              name={"twitter"}
              value={formData.twitter}
              onChange={handleInputChange}
            />
            <AgencyFormInput
              label={"Instagram"}
              placeholder={"Instagram"}
              name={"instagram"}
              value={formData.instagram}
              onChange={handleInputChange}
            />
          </AgencyFormSection>

          {/* ABOUT AGENCY  */}
          <AgencyFormSection
            title={"About"}
            innerStyle={"grid md:grid-cols-2 gap-4"}
          >
            <AgencyFormInput
              label={"About"}
              placeholder={"About"}
              name={"about"}
              value={formData.about}
              onChange={handleInputChange}
            />
            <AgencyFormInput
              label={"Website"}
              placeholder={"Website"}
              name={"website"}
              value={formData.website}
              onChange={handleInputChange}
            />
          </AgencyFormSection>

          {result && (
            <div className={`mt-10`}>
              <Toast
                color={result?.color}
                result={result?.result}
                message={result?.message}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !agencyLogo}
            className="bg-blue-600 mt-10 w-full text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Create Agency"}
          </button>
        </ContainerCenter>
      </form>
      <Footer />
    </>
  );
};

export default AddAgency;
