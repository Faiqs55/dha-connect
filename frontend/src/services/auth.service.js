class Auth {
    apiURL;
    constructor(parameters) {
        this.apiURL = process.env.NEXT_PUBLIC_API_URL;
    }

    async loginUser (email, password){
          try {
            const res = await fetch(`${this.apiURL}/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email, password})
            });

            return res.json();
            
          } catch (error) {
            console.log(error.message)
          }
    }
};

const authService = new Auth();
export default authService;