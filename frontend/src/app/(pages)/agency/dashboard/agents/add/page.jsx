"use client";
import React, { useRef, useState } from "react";
import ContainerCenter from "@/Components/ContainerCenter";
import AgencyFormSection from "@/Components/AgencyFormSection";
import AgencyFormInput from "@/Components/AgencyFormInput";
import { FaRegTrashAlt } from "react-icons/fa";
import axios from "axios";
import agentService from "@/services/agent.service";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const page = () => {
  const imageRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [cloudinaryError, setCloudinaryError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { value: userToken, isLoaded } = useLocalStorage("userToken", null);

  const cloudName = "dhdgrfseu";
  const uploadPreset = "dha-agency-logo";

  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    phone: "",
    image: "", // This will store the Cloudinary URL
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (event) => {
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
      setImageFile(file);
      setCloudinaryError(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
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
        handleImageUpload({ target: { files: [file] } });
      }
    }
  };

  const handleDeleteImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setCloudinaryError(null);

    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };

  // Function to upload image to Cloudinary
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
      let imageUrl = "";

      // Upload image if selected
      if (imageFile) {
        const uploadedImageUrl = await uploadImageToCloudinary(imageFile);

        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
        } else {
          setCloudinaryError("Could not upload the image");
          return;
        }
      }

      // Prepare final data with image URL
      const finalData = {
        ...formData,
        image: imageUrl,
      };

      const res = await agentService.addAgent(userToken, finalData);

      if (!res.success) {
        console.log(res);
      } else {
        // Reset form after successful submission
        setFormData({
          name: "",
          designation: "",
          phone: "",
          image: "",
        });
        setImageFile(null);
        setImagePreview(null);
        setCloudinaryError(null);

        if (imageRef.current) {
          imageRef.current.value = "";
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      setCloudinaryError("An error occurred while submitting the form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="text-4xl font-semibold underline">Add new Agent</h1>

      <form className="mb-10 mt-5" onSubmit={handleSubmit}>
        {/* IMAGE UPLOAD SECTION */}
        <AgencyFormSection title={"Agent Image"}>
          <input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={handleImageUpload}
            accept="image/*"
          />

          {!imagePreview ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => {
                imageRef.current.click();
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
                src={imagePreview}
                alt="Agent image preview"
                className="max-h-40"
              />
              <button
                type="button"
                onClick={handleDeleteImage}
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

        {/* AGENT INFORMATION SECTION */}
        <AgencyFormSection
          title={"Add New Agent"}
          innerStyle={"grid grid-cols-3 gap-5"}
        >
          <AgencyFormInput
            label={"Agent Name"}
            placeholder={"Agent Name"}
            name={"name"}
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <AgencyFormInput
            label={"Agent Designation"}
            placeholder={"Enter Designation"}
            name={"designation"}
            value={formData.designation}
            onChange={handleInputChange}
          />
          <AgencyFormInput
            label={"Agent Phone"}
            placeholder={"Enter Phone Number"}
            name={"phone"}
            value={formData.phone}
            onChange={handleInputChange}
          />
        </AgencyFormSection>

        {/* Submit Button */}
        <div className="mt-10">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Add Agent"}
          </button>
        </div>
      </form>
    </>
  );
};

export default page;
