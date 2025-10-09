import { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";

export default function AddAgencyDhaPlus() {
  const [form, setForm] = useState({
    agencyName: "",
    agencyEmail: "",
    ceoName: "",
    ceoPhone1: "",
    ceoPhone2: "",
    city: "",
    phase: "",
    address: "",
    website: "",
    staff: [
      {
        staffName: "",
        staffDesignation: "",
        staffPhone: "",
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStaffChange = (index, e) => {
    const { name, value } = e.target;
    const updatedStaff = [...form.staff];
    updatedStaff[index][name] = value;
    setForm((prev) => ({ ...prev, staff: updatedStaff }));
  };

  const addStaff = () => {
    setForm((prev) => ({
      ...prev,
      staff: [...prev.staff, { staffName: "", staffDesignation: "", staffPhone: "" }],
    }));
  };

  const removeStaff = (index) => {
    const updated = [...form.staff];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, staff: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", form);
    alert("✅ Agency data submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white shadow-lg text-center">
        <h1 className="text-3xl font-bold tracking-wide">🏢 Add Agency (DHA Plus)</h1>
        <p className="mt-2 text-blue-100 text-sm sm:text-base">
          Enter your agency details below to get listed professionally
        </p>
      </header>

      {/* Form Container */}
      <div className="flex-grow flex justify-center items-start py-10 px-4 sm:px-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-5xl bg-white/80 backdrop-blur-lg border border-blue-100 shadow-xl rounded-3xl p-10"
        >
          {/* Agency Info Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              Agency Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {[
                { label: "Agency Name", name: "agencyName", placeholder: "e.g., DHA Property Advisors" },
                { label: "Agency Email", name: "agencyEmail", placeholder: "e.g., info@agency.com", type: "email" },
                { label: "CEO Name", name: "ceoName", placeholder: "e.g., Ali Khan" },
                { label: "CEO Phone 1", name: "ceoPhone1", placeholder: "e.g., 0300-1234567" },
                { label: "CEO Phone 2", name: "ceoPhone2", placeholder: "e.g., 0300-7654321" },
              ].map((item) => (
                <div key={item.name}>
                  <label className="block text-gray-700 font-medium mb-1">{item.label}</label>
                  <input
                    type={item.type || "text"}
                    name={item.name}
                    value={form[item.name]}
                    onChange={handleChange}
                    placeholder={item.placeholder}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                  />
                </div>
              ))}

              <div>
                <label className="block text-gray-700 font-medium mb-1">City</label>
                <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                >
                  <option value="">Select City</option>
                  <option>Lahore</option>
                  <option>Karachi</option>
                  <option>Islamabad</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Phase</label>
                <select
                  name="phase"
                  value={form.phase}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                >
                  <option value="">Select Phase</option>
                  <option>Phase 1</option>
                  <option>Phase 2</option>
                  <option>Phase 3</option>
                  <option>Phase 4</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="e.g., DHA Phase 5, Lahore"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                />
              </div>
            </div>
          </section>

          {/* Staff Info Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              Staff Information
            </h2>

            {form.staff.map((member, index) => (
              <div
                key={index}
                className="border border-blue-100 bg-blue-50/30 rounded-xl p-6 mb-6 shadow-sm relative transition-all duration-200 hover:shadow-md"
              >
                {form.staff.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStaff(index)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Staff Name", name: "staffName", placeholder: "e.g., Ahmed" },
                    { label: "Designation", name: "staffDesignation", placeholder: "e.g., Sales Manager" },
                    { label: "Phone", name: "staffPhone", placeholder: "e.g., 0311-6543210" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-gray-700 font-medium mb-1">{field.label}</label>
                      <input
                        type="text"
                        name={field.name}
                        value={member[field.name]}
                        onChange={(e) => handleStaffChange(index, e)}
                        placeholder={field.placeholder}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addStaff}
              className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition mb-8"
            >
              <PlusCircle size={22} />
              Add More Staff
            </button>
          </section>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="w-full sm:w-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              🚀 Submit Agency
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}