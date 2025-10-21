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

    async checkUserLogin(token){
      try {
        const res = await fetch(`${this.apiURL}/user`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        
        return res.json();
      } catch (error) {
        console.log(error);
      }
    }

    async forgotPassword(email){
      try {
        const res = await fetch(`${this.apiURL}/user/forgot-password`, {
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({email})
        });

        return res.json();
      } catch (error) {
        console.log(error);
      }
    }

    async resetPassword(token, password){
      try {
        const res = await fetch(`${this.apiURL}/user/reset-password`, {
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({token, password})
        });

        return res.json();
      } catch (error) {
        console.log(error);
      }
    }
};

const authService = new Auth();
export default authService;