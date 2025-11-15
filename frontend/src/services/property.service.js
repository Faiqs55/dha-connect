class Property {
  apiURL;
  constructor(parameters) {
    this.apiURL = process.env.NEXT_PUBLIC_API_URL;
  }

  async addProperty(data, token) {
    try {
      if (!token) {
        console.log("No Token");
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      
      // Append all fields to FormData
      Object.keys(data).forEach(key => {
        if (key === 'images' && Array.isArray(data[key])) {
          // Append each image file
          data[key].forEach(file => {
            formData.append('images', file);
          });
        } else if (key === 'featureImage' && data[key] instanceof File) {
          formData.append('featureImage', data[key]);
        } else if (key === 'video' && data[key] instanceof File) {
          formData.append('video', data[key]);
        } else if (Array.isArray(data[key])) {
          // Handle arrays (like otherFeatures, plotAmenities)
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });

      const res = await fetch(`${this.apiURL}/property`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type, let browser set it with boundary
        },
        body: formData,
      });

      return res.json();
    } catch (error) {
      console.log(error);
      return { success: false, message: "Network error occurred" };
    }
  }

  async updateProperty(id, data, token) {
    try {
      if (!token) {
        console.log("No Token");
        return { success: false, message: "Authentication token is required" };
      }

      // Create FormData for file upload
      const formData = new FormData();
      
      // Append all fields to FormData
      Object.keys(data).forEach(key => {
        if (key === 'images' && Array.isArray(data[key])) {
          // Append each image file
          data[key].forEach(file => {
            // Check if it's a File object or existing URL
            if (file instanceof File) {
              formData.append('images', file);
            }
          });
        } else if (key === 'featureImage' && data[key] instanceof File) {
          formData.append('featureImage', data[key]);
        } else if (key === 'video' && data[key] instanceof File) {
          formData.append('video', data[key]);
        } else if (Array.isArray(data[key])) {
          // Handle arrays (like otherFeatures, plotAmenities)
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });

      const res = await fetch(`${this.apiURL}/property/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type, let browser set it with boundary
        },
        body: formData,
      });

      return res.json();
    } catch (error) {
      console.log(error);
      return { success: false, message: "Network error occurred while updating property" };
    }
  }

  async getAllProperties(query) {
    try {
      let fetchURL = `${this.apiURL}/property`;
      if (query) {
        if (query.category === "All") delete query.category;
        if (query.title === "") delete query.title;

        const params = new URLSearchParams();
        Object.keys(query).forEach((key) => {
          params.append(key, query[key]);
        });

        const queryString = params.toString();
        if (queryString) {
          fetchURL += `?${queryString}`;
        }
      }

      const res = await fetch(fetchURL);
      return res.json();
    } catch (error) {
      console.log(error);
    }
  }

  async getAgentProperties(token, query = {}) {
    try {
      let fetchURL = `${this.apiURL}/property/get/agent/properties`;
      if (query) {
        if (query.category === "All") delete query.category;
        if (query.title === "") delete query.title;

        const params = new URLSearchParams();
        Object.keys(query).forEach((key) => {
          params.append(key, query[key]);
        });

        const queryString = params.toString();
        if (queryString) {
          fetchURL += `?${queryString}`;
        }
      }

      const res = await fetch(fetchURL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.json();
    } catch (error) {
      console.log(error.message);
    }
  }

  async getPropertyById(id) {
    try {
      const url = `${this.apiURL}/property/${id}`;
      const res = await fetch(url);
      return res.json();
    } catch (error) {
      console.log(error);
    }
  }

  async getAgencyProperties(token, query = {}) {
  try {
    let fetchURL = `${this.apiURL}/property/get/agency/properties`;
    
    if (query) {
      // Remove empty values and "All" filters
      const cleanedQuery = { ...query };
      if (cleanedQuery.category === "All") delete cleanedQuery.category;
      if (cleanedQuery.status === "All") delete cleanedQuery.status;
      if (cleanedQuery.type === "All") delete cleanedQuery.type;
      if (cleanedQuery.agent === "All") delete cleanedQuery.agent;
      if (cleanedQuery.title === "") delete cleanedQuery.title;

      const params = new URLSearchParams();
      Object.keys(cleanedQuery).forEach((key) => {
        params.append(key, cleanedQuery[key]);
      });

      const queryString = params.toString();
      if (queryString) {
        fetchURL += `?${queryString}`;
      }
    }

    const res = await fetch(fetchURL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  } catch (error) {
    console.log(error.message);
    return { success: false, message: "Network error occurred while fetching agency properties" };
  }
}

async updatePropertyStatus(id, status, token) {
  try {
    if (!token) {
      return { success: false, message: "Authentication token is required" };
    }

    const res = await fetch(`${this.apiURL}/property/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    return res.json();
  } catch (error) {
    console.log(error);
    return { success: false, message: "Network error occurred while updating property status" };
  }
}
}

const propertyService = new Property();
export default propertyService;