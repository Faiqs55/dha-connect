class Agent {
    apiURL;
  constructor() {
    this.apiURL = process.env.NEXT_PUBLIC_API_URL;
  }

  async addAgent(token, data){
        try {
            const res = await fetch(`${this.apiURL}/agent`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            return res.json();
        } catch (error) {
            console.log(error);
        }
  }
}


const agentService = new Agent();
export default agentService;