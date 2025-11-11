class Phase {
  apiURL;
  constructor() {
    this.apiURL = process.env.NEXT_PUBLIC_API_URL;
  }

  async getPhases() {
    try {
      const res = await fetch(`${this.apiURL}/phases`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return res.json();
    } catch (error) {
      console.log(error);
    }
  }

  async createOrUpdatePhaseRecord(token, data) {
    try {
      const res = await fetch(`${this.apiURL}/phases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      return res.json();
    } catch (error) {
      console.log(error);
    }
  }

  async getPhaseHistory(phaseName) {
    try {
      const res = await fetch(`${this.apiURL}/phases/${encodeURIComponent(phaseName)}/history`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return res.json();
    } catch (error) {
      console.log(error);
    }
  }

  async deletePhaseRecord(token, id) {
    try {
      const res = await fetch(`${this.apiURL}/phases/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return res.json();
    } catch (error) {
      console.log(error);
    }
  }

  async getAllPhasesRecords(token) {
    try {
      if (!this.apiURL) {
        console.error("API URL is not configured. Please set NEXT_PUBLIC_API_URL in your .env file");
        return { 
          success: false, 
          message: "API URL is not configured. Please check your environment variables." 
        };
      }

      if (!token) {
        return { 
          success: false, 
          message: "Authentication token is required." 
        };
      }

      // Use optimized backend endpoint that returns all records in one request
      const url = `${this.apiURL}/phases/all`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if response is OK before parsing JSON
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `HTTP ${res.status}: ${res.statusText}` }));
        console.error(`API Error (${res.status}):`, errorData);
        return { 
          success: false, 
          message: errorData.message || `Failed to fetch: ${res.status} ${res.statusText}` 
        };
      }

      return res.json();
    } catch (error) {
      console.error("Error fetching all phases records:", error);
      return { 
        success: false, 
        message: error.message || "An error occurred while fetching all records. Please check your connection and ensure the backend server is running." 
      };
    }
  }

  // NEW API METHODS
  async getAllPhases() {
    try {
      const res = await fetch(`${this.apiURL}/phases`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `HTTP ${res.status}: ${res.statusText}` }));
        return { 
          success: false, 
          message: errorData.message || `Failed to fetch: ${res.status} ${res.statusText}` 
        };
      }

      return res.json();
    } catch (error) {
      console.error("Error fetching phases:", error);
      return { 
        success: false, 
        message: error.message || "An error occurred while fetching phases." 
      };
    }
  }

  async getPhaseNames(includeInactive = false) {
    try {
      const queryParam = includeInactive ? "?includeInactive=true" : "";
      const res = await fetch(`${this.apiURL}/phase-names${queryParam}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `HTTP ${res.status}: ${res.statusText}` }));
        return {
          success: false,
          message: errorData.message || `Failed to fetch: ${res.status} ${res.statusText}`,
        };
      }

      return res.json();
    } catch (error) {
      console.error("Error fetching phase names:", error);
      return {
        success: false,
        message: error.message || "An error occurred while fetching phase names.",
      };
    }
  }

  async createPhaseName(token, data) {
    try {
      if (!token) {
        return {
          success: false,
          message: "Authentication token is required.",
        };
      }

      const res = await fetch(`${this.apiURL}/phase-names`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `HTTP ${res.status}: ${res.statusText}` }));
        return {
          success: false,
          message: errorData.message || `Failed to create: ${res.status} ${res.statusText}`,
        };
      }

      return res.json();
    } catch (error) {
      console.error("Error creating phase name:", error);
      return {
        success: false,
        message: error.message || "An error occurred while creating phase name.",
      };
    }
  }

  async updatePhaseName(token, id, data) {
    try {
      if (!token) {
        return {
          success: false,
          message: "Authentication token is required.",
        };
      }

      const res = await fetch(`${this.apiURL}/phase-names/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `HTTP ${res.status}: ${res.statusText}` }));
        return {
          success: false,
          message: errorData.message || `Failed to update: ${res.status} ${res.statusText}`,
        };
      }

      return res.json();
    } catch (error) {
      console.error("Error updating phase name:", error);
      return {
        success: false,
        message: error.message || "An error occurred while updating phase name.",
      };
    }
  }

  async createPhase(token, data) {
    try {
      const res = await fetch(`${this.apiURL}/phases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `HTTP ${res.status}: ${res.statusText}` }));
        return { 
          success: false, 
          message: errorData.message || `Failed to create: ${res.status} ${res.statusText}` 
        };
      }

      return res.json();
    } catch (error) {
      console.error("Error creating phase:", error);
      return { 
        success: false, 
        message: error.message || "An error occurred while creating phase." 
      };
    }
  }

  async updatePhase(token, id, data) {
    try {
      const res = await fetch(`${this.apiURL}/phases/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `HTTP ${res.status}: ${res.statusText}` }));
        return { 
          success: false, 
          message: errorData.message || `Failed to update: ${res.status} ${res.statusText}` 
        };
      }

      return res.json();
    } catch (error) {
      console.error("Error updating phase:", error);
      return { 
        success: false, 
        message: error.message || "An error occurred while updating phase." 
      };
    }
  }

  async deletePhase(token, id) {
    try {
      const res = await fetch(`${this.apiURL}/phases/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `HTTP ${res.status}: ${res.statusText}` }));
        return { 
          success: false, 
          message: errorData.message || `Failed to delete: ${res.status} ${res.statusText}` 
        };
      }

      return res.json();
    } catch (error) {
      console.error("Error deleting phase:", error);
      return { 
        success: false, 
        message: error.message || "An error occurred while deleting phase." 
      };
    }
  }
}

const phaseService = new Phase();
export default phaseService;

