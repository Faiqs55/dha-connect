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

      const res = await fetch(`${this.apiURL}/property`, {
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

  async getAllProperties(query) {
    try {
      let fetchURL = `${this.apiURL}/property/`;      
      if (query) {
        if (query.category === "All") delete query.category;
        if (query.title === "") delete query.title;

        const queryKeys = Object.keys(query);
        queryKeys.forEach((key) => {
          fetchURL += `?${key}=${query[key]}`;
        });
      }

      console.log(fetchURL);
      

      const res = await fetch(fetchURL);
      return res.json();
    } catch (error) {
      console.log(error);
    }
  }

  async getAgentProperties(token, query = null) {
    try {
      let fetchURL = `${this.apiURL}/property/get/agent/properties`;
      if (query) {
        if (query.category === "All") delete query.category;
        if (query.title === "") delete query.title;

        const queryKeys = Object.keys(query);
        queryKeys.forEach((key) => {
          fetchURL += `?${key}=${query[key]}`;
        });
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
}

const propertyService = new Property();
export default propertyService;
