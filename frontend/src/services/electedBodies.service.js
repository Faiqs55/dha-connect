class ElectedBodies {
  apiURL;
  constructor(parameters) {
    this.apiURL = process.env.NEXT_PUBLIC_API_URL;
  }

  async createMember(token, data) {
    try {
      if (!token) {
        return { success: false, message: "Authentication token is required" };
      }

      // Create FormData for file upload
      const formData = new FormData();
      
      // Append all fields to FormData
      Object.keys(data).forEach(key => {
        if (key === 'photo' && data[key] instanceof File) {
          formData.append('photo', data[key]);
        } else {
          formData.append(key, data[key]);
        }
      });

      const res = await fetch(`${this.apiURL}/elected-bodies`, {
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
      return { success: false, message: "Network error occurred while creating member" };
    }
  }

  async updateMember(token, id, data) {
    try {
      if (!token) {
        return { success: false, message: "Authentication token is required" };
      }

      // Create FormData for file upload
      const formData = new FormData();
      
      // Append all fields to FormData
      Object.keys(data).forEach(key => {
        if (key === 'photo' && data[key] instanceof File) {
          formData.append('photo', data[key]);
        } else {
          formData.append(key, data[key]);
        }
      });

      const res = await fetch(`${this.apiURL}/elected-bodies/${id}`, {
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
      return { success: false, message: "Network error occurred while updating member" };
    }
  }

  async getMembers(query = {}) {
    try {
      let fetchURL = `${this.apiURL}/elected-bodies`;
      
      if (query && Object.keys(query).length > 0) {
        const params = new URLSearchParams();
        Object.keys(query).forEach((key) => {
          if (query[key] !== '' && query[key] !== undefined) {
            params.append(key, query[key]);
          }
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
      return { success: false, message: "Network error occurred while fetching members" };
    }
  }

  async getMemberById(id) {
    try {
      const url = `${this.apiURL}/elected-bodies/${id}`;
      const res = await fetch(url);
      return res.json();
    } catch (error) {
      console.log(error);
      return { success: false, message: "Network error occurred while fetching member" };
    }
  }

  async deleteMember(token, id) {
    try {
      if (!token) {
        return { success: false, message: "Authentication token is required" };
      }

      const res = await fetch(`${this.apiURL}/elected-bodies/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return res.json();
    } catch (error) {
      console.log(error);
      return { success: false, message: "Network error occurred while deleting member" };
    }
  }
}

const electedBodiesService = new ElectedBodies();
export default electedBodiesService;