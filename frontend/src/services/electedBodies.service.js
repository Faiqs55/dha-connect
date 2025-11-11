class ElectedBodiesService {
  constructor() {
    this.apiURL = process.env.NEXT_PUBLIC_API_URL;
  }

  buildQuery(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value);
      }
    });
    const queryString = query.toString();
    return queryString ? `?${queryString}` : "";
  }

  async getMembers(params = {}) {
    try {
      const query = this.buildQuery(params);
      const res = await fetch(`${this.apiURL}/elected-bodies${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch elected body members");
      }

      return res.json();
    } catch (error) {
      console.error("Error fetching elected body members:", error);
      return { success: false, message: error.message };
    }
  }

  async getMemberById(id) {
    try {
      const res = await fetch(`${this.apiURL}/elected-bodies/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch elected body member");
      }

      return res.json();
    } catch (error) {
      console.error("Error fetching elected body member:", error);
      return { success: false, message: error.message };
    }
  }

  async createMember(token, payload) {
    try {
      const res = await fetch(`${this.apiURL}/elected-bodies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create elected body member");
      }

      return res.json();
    } catch (error) {
      console.error("Error creating elected body member:", error);
      return { success: false, message: error.message };
    }
  }

  async updateMember(token, id, payload) {
    try {
      const res = await fetch(`${this.apiURL}/elected-bodies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update elected body member");
      }

      return res.json();
    } catch (error) {
      console.error("Error updating elected body member:", error);
      return { success: false, message: error.message };
    }
  }

  async deleteMember(token, id) {
    try {
      const res = await fetch(`${this.apiURL}/elected-bodies/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete elected body member");
      }

      return res.json();
    } catch (error) {
      console.error("Error deleting elected body member:", error);
      return { success: false, message: error.message };
    }
  }
}

const electedBodiesService = new ElectedBodiesService();
export default electedBodiesService;

