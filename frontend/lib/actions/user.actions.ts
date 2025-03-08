'use server';

"use server"; // Ensures these functions run on the server

export const signIn = async ({ username, password }: { username: string, password: string }) => {
    try {
        const response = await fetch("http://localhost:8000/api/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: { "Content-Type": "application/json" }
        });

        return await response.json();
    } catch (error) {
        console.error("Error signing in:", error.message);
        throw error;
    }
};

export const signUp = async (userData: SignUpParams) => {
    try {
        const response = await fetch("http://localhost:8000/api/create_user", {
            method: "POST",
            body: JSON.stringify(userData), // No need to wrap in an object
            headers: { "Content-Type": "application/json" }
        });

        return await response.json();
    } catch (error) {
        console.error("Error signing up:", error.message);
        throw error;
    }
};


export const fetchUserDetails = async (token) => {
    try {
        const response = await fetch("http://localhost:8000/api/user_info/", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching user details:', error.message);
        throw error;
    }
};
// "use-client";
// export const logoutAccount = () => {
//     try {
//       localStorage.removeItem("authToken"); // Remove token
//       window.location.href = "/login"; // Redirect to login page
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   };
  
