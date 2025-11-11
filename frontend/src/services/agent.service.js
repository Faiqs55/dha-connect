class Agent {
  apiURL;
  constructor() {
    this.apiURL = process.env.NEXT_PUBLIC_API_URL;
  }

  async addAgent(token, data) {
    try {
      const res = await fetch(`${this.apiURL}/agent`, {
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

  async getAgentById(id) {
    try {
      const res = await fetch(`${this.apiURL}/agent/${id}`);
      return res.json();
    } catch (error) {
      console.log(error);
    }
  }

  async getMyAgents(token, query) {
    try {
      let fetchURL = `${this.apiURL}/agent/my`;
      if (query) {
        const queryKeys = Object.keys(query);
        queryKeys.forEach((key) => {
          fetchURL += `?${key}=${query[key]}`;
        });
      }
      const res = await fetch(fetchURL, {
        method: "get",
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

  async getCurrentAgent(token) {
    try {
      const res = await fetch(`${this.apiURL}/agent`, {
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

  async updateAgent(token, id, payload){
    try {
      const res = await fetch(`${this.apiURL}/agent/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      return res.json();
    } catch (error) {
      console.log(error)
    }
  }
}

const agentService = new Agent();
export default agentService;
