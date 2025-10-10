import agencyService from "../../services/agency.service";

const addAgencyHelper = async (formData) => {
if (
      formData.staff[0].staffName === "" &&
      formData.staff[0].staffDesignation === "" &&
      formData.staff[0].staffPhone === ""
    ) {
      delete formData.staff;
    }

    const res = await agencyService.addAgency(formData);
    if (!res.success) {
      return alert(res.message);
    }
}

export default addAgencyHelper;