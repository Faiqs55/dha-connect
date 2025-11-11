class ContactService {
  apiURL;
  constructor() {
    this.apiURL = process.env.NEXT_PUBLIC_API_URL;
  }

  async submitContactQuery(data) {
    try {
      const res = await fetch(`${this.apiURL}/contact-queries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({
          message: `HTTP ${res.status}: ${res.statusText}`,
        }));
        return {
          success: false,
          message: errorData.message || "Failed to submit contact query",
        };
      }

      return res.json();
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to submit contact form right now",
      };
    }
  }

  async getContactQueries(token) {
    try {
      if (!token) {
        return { success: false, message: "Authentication token is required." };
      }

      const res = await fetch(`${this.apiURL}/contact-queries`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({
          message: `HTTP ${res.status}: ${res.statusText}`,
        }));
        return {
          success: false,
          message: errorData.message || "Failed to fetch contact queries",
        };
      }

      return res.json();
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to fetch contact queries",
      };
    }
  }
}

const contactService = new ContactService();
export default contactService;


