class Agent {
  apiURL;
  constructor() {
    this.apiURL = process.env.NEXT_PUBLIC_API_URL;
  }

 async addAgent(token, agentData) {
    try {
      // For FormData, we don't set Content-Type header
      let res = await fetch(`${this.apiURL}/agent`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: agentData, // agentData should be FormData
      });

      return res.json();
    } catch (error) {
      console.log(error.message);
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

  async updateAgent(token, id, agentData) {
    try {
      let res = await fetch(`${this.apiURL}/agent/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: agentData, // agentData should be FormData
      });

      return res.json();
    } catch (error) {
      console.log(error.message);
    }
  }
}

const agentService = new Agent();
export default agentService;
