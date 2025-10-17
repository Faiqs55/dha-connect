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

    async getAllAgencies() {
        try {
            let res = await fetch(`${this.apiURL}/agency`);
            return res.json();
        } catch (error) {
            console.log(error.message);
        }
    }

    async getSingleAgency(id) {
        try {
            let res = await fetch(`${this.apiURL}/agency/${id}`);
            return res.json();
        } catch (error) {
            console.log(error.message)
        }
    }
};

const agencyService = new Agency();
export default agencyService;