class Agency {
    apiURL;
    constructor() {
        this.apiURL = import.meta.env.VITE_API_URI
    }

    async addAgency(agencyData) {
        try {
            
            let res = await fetch(`${this.apiURL}/agency`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            body: JSON.stringify(agencyData)
            });

            return res.json();
        } catch (error) {
            console.log(error.message);
        }
    }
};

const agencyService = new Agency();
export default agencyService;