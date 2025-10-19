class Agency {
    apiURL;
    constructor() {
        this.apiURL = process.env.NEXT_PUBLIC_API_URL
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

    async getAllAgencies(query) {
        try {
            let fetchURL = `${this.apiURL}/agency`;
            if(query){
                const queryKeys = Object.keys(query);
                queryKeys.forEach(key => {
                    fetchURL += `?${key}=${query[key]}` 
                });
            }            
            let res = await fetch(fetchURL);
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

    async updateAgency(id, data, token){
        try {            
            const res = await fetch(`${this.apiURL}/agency/${id}`, {
                method: "PUT",
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
};

const agencyService = new Agency();
export default agencyService;