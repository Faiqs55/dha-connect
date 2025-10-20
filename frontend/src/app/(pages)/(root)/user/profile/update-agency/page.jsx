"use client";
import ContainerCenter from "@/Components/ContainerCenter";
import AgencyFormSection from "@/Components/AgencyFormSection";
import { useRef, useState, useEffect } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import axios from "axios";
import AgencyFormInput from "@/Components/AgencyFormInput";
import AgencyFormSelect from "@/Components/AgencyFormSelect";
import agencyService from "@/services/agency.service";
import Toast from "@/Components/Toast";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";

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

const page = () => {
  const router = useRouter();
  const { value: token, isLoaded } = useLocalStorage("userToken", null);
  const [agencyData, setAgencyData]  = useState(null);
  const agencyLogoRef = useRef(null);
  const [agencyLogo, setAgencyLogo] = useState(null);
  const [agencyLogoPreview, setAgencyLogoPreview] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [shouldDeleteCurrentImage, setShouldDeleteCurrentImage] = useState(false);
  const [cloudinaryError, setCloudinaryError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState(null);
  
  // State for form data
  const [formData, setFormData] = useState({
    agencyName: "",
    agencyVideo: "",
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

  // Fetch agency data on component mount
  useEffect(() => {
    const fetchAgencyData = async () => {
      if (!token) return;
      
      try {
        setIsLoading(true);
        const res = await agencyService.getMyAgency(token);
        
        if (res.success && res.data) {
          const agency = res.data;
          setAgencyData(res.data);  
          
          // Set form data
          setFormData({
            agencyName: agency.agencyName || "",
            agencyVideo: agency.agencyVideo || "",
            agencyEmail: agency.agencyEmail || "",
            ceoName: agency.ceoName || "",
            ceoPhone: agency.ceoPhone || "",
            whatsapp: agency.whatsapp || "",
            city: agency.city || cityOptions[0].val,
            phase: agency.phase || phaseOptions[0].val,
            address: agency.address || "",
            facebook: agency.facebook || "",
            youtube: agency.youtube || "",
            twitter: agency.twitter || "",
            instagram: agency.instagram || "",
            about: agency.about || "",
            website: agency.website || "",
          });

          // Set current image
          if (agency.agencyLogo) {
            setCurrentImageUrl(agency.agencyLogo);
            setAgencyLogoPreview(agency.agencyLogo);
          }
        } else {
          setResult({
            result: "Error!",
            message: "Failed to fetch agency data",
            color: "red",
          });
        }
      } catch (error) {
        setResult({
          result: "Error!",
          message: error.message,
          color: "red",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgencyData();
  }, [token, isLoaded]);

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
      setCloudinaryError(null);
      // Reset delete flag when new image is selected
      setShouldDeleteCurrentImage(false);

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
    // Only remove from UI, don't delete from Cloudinary yet
    setAgencyLogo(null);
    setAgencyLogoPreview(null);
    setShouldDeleteCurrentImage(true); // Mark for deletion on submit
    setCloudinaryError(null);

    if (agencyLogoRef.current) {
      agencyLogoRef.current.value = "";
    }
  };

  const handleCancelDelete = () => {
    // Restore the original image preview
    setAgencyLogoPreview(currentImageUrl);
    setShouldDeleteCurrentImage(false);
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
    
    if (!token) {
      setResult({
        result: "Error!",
        message: "Authentication token not found. Please log in again.",
        color: "red",
      });
      return;
    }
    
    if (!agencyData?._id) {
      setResult({
        result: "Error!",
        message: "Agency data not loaded properly.",
        color: "red",
      });
      return;
    }
    
    setIsSubmitting(true);
    setResult(null);
    
    try {
      let logoUrl = currentImageUrl;

      // Scenario 1: User deleted the image and didn't select a new one
      if (shouldDeleteCurrentImage && !agencyLogo) {
        // Don't change the logoUrl - keep the current image
        // This means the image will NOT be set to null in the database
        console.log("User deleted image but didn't select new one - keeping current image");
        // logoUrl remains as currentImageUrl
      }
      // Scenario 2: User selected a new image
      else if (agencyLogo) {
        // Upload new image to Cloudinary
        const newLogoUrl = await uploadImageToCloudinary(agencyLogo);
        
        if (newLogoUrl) {
          logoUrl = newLogoUrl;
          console.log("Uploaded new image to Cloudinary:", newLogoUrl);
        } else {
          setResult({
            result: "Error!",
            message: "Could not upload the new Agency Logo",
            color: "red",
          });
          return;
        }
      }
      // Scenario 3: No changes to image (keep currentImageUrl as is)

      // Prepare the final data object
      const finalData = {
        // Agency Information
        agencyName: formData.agencyName,
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

        // Images - only update if we have a new image or explicitly want to remove
        agencyLogo: logoUrl,
      };

      console.log("Updating agency with data:", finalData);

      // Update agency
      const res = await agencyService.updateAgency(agencyData._id, finalData, token);
    
      if (!res.success) {
        setResult({
          result: "Error!",
          message: res.message || "Something went wrong while updating the agency.",
          color: "red",
        });
        return;
      }

      setResult({
        result: "Success!",
        message: `Agency has been updated successfully.`,
        color: "green",
      });

      // Update local state to reflect changes
      setCurrentImageUrl(logoUrl);
      setAgencyLogoPreview(logoUrl);
      setAgencyLogo(null);
      setShouldDeleteCurrentImage(false);

      // Redirect to agencies list after successful update
      setTimeout(() => {
        router.push("/agencies");
      }, 2000);

    } catch (error) {
      console.error("Update error:", error);
      setResult({
        result: "Error!",
        message: error.message || "An unexpected error occurred",
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-head bg-gray-100">
        <ContainerCenter className="py-15">
          <div className="flex justify-center items-center py-20">
            <p className="text-xl">Loading agency data...</p>
          </div>
        </ContainerCenter>
      </div>
    );
  }

  return (
    <>
      <div className="page-head bg-gray-100">
        <ContainerCenter className="py-15">
          <h1 className="text-4xl">Update Agency</h1>
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

            {/* Show cancel delete button if user has deleted the preview but hasn't submitted yet */}
            {shouldDeleteCurrentImage && !agencyLogoPreview && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800 mb-2">
                  Image will be kept as is unless you select a new one.
                </p>
                <button
                  type="button"
                  onClick={handleCancelDelete}
                  className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Cancel Delete
                </button>
              </div>
            )}

            {cloudinaryError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{cloudinaryError}</p>
              </div>
            )}
          </AgencyFormSection>

          {/* Rest of your form sections remain the same */}
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
              required
            />
            <AgencyFormInput
              label={"Agency Video URL"}
              placeholder={"Enter youtube video Link"}
              name={"agencyVideo"}
              value={formData.agencyVideo}
              onChange={handleInputChange}
            />
            <AgencyFormInput
              label={"Agency Email"}
              placeholder={"Agency Email"}
              name={"agencyEmail"}
              value={formData.agencyEmail}
              onChange={handleInputChange}
              required
            />
            <AgencyFormInput
              label={"Ceo Name"}
              placeholder={"Ceo Name"}
              name={"ceoName"}
              value={formData.ceoName}
              onChange={handleInputChange}
              required
            />
            <AgencyFormInput
              label={"Ceo Phone"}
              placeholder={"Ceo Phone"}
              name={"ceoPhone"}
              value={formData.ceoPhone}
              onChange={handleInputChange}
              required
            />
            <AgencyFormInput
              label={"Whatsapp"}
              placeholder={"Whatsapp"}
              name={"whatsapp"}
              value={formData.whatsapp}
              onChange={handleInputChange}
            />
          </AgencyFormSection>

          {/* ... rest of your form sections ... */}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 mt-10 w-full text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Update Agency"}
          </button>
        </ContainerCenter>
      </form>
    </>
  );
};

export default page;