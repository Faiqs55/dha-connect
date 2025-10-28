class Property {
    apiURL;
    constructor(parameters) {
        this.apiURL = process.env.NEXT_PUBLIC_API_URL;
    }

    async addProperty(data, token){
        try {
            if(!token){
                console.log("No Token");
                return;
            }

            const res = await fetch(`${this.apiURL}/property`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(data)
            });

            return res.json();
        } catch (error) {
            console.log(error);
            
        }
    }
}

const propertyService = new Property();
export default propertyService;