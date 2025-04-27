import React, { useEffect } from "react";
import authService from "../../authService";
import {GLOBAL_HOST} from '../../App'

const RegisterUser = React.memo(({ userId }) => {
  useEffect(() => {
    const register = async () => {
      const userName = authService.getUserName();
      const tokenData = authService.getTokenData();
      const storageKey = `user_registered_${userId}`;

      if (localStorage.getItem(storageKey)) {
        console.log("User already registered (cached)");
        return;
      }

      try {
        const response = await fetch(`${GLOBAL_HOST}/users/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.status === 200) {
          console.log("User exists in database");
          localStorage.setItem(storageKey, "true");
          return;
        }

        if (response.status !== 400) {
          throw new Error(`Unexpected status: ${response.status}`);
        }

        const userRegisterDto = {
          id: userId,
          email: tokenData.email || `${userName}@example.com`,
          firstname: tokenData.given_name || "Unknown",
          lastname: tokenData.family_name || "Unknown",
        };

        const registerResponse = await fetch(`${GLOBAL_HOST}/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userRegisterDto),
        });

        if (!registerResponse.ok) {
          throw new Error(`Registration failed. Status: ${registerResponse.status}`);
        }

        console.log("User registered successfully");
        localStorage.setItem(storageKey, "true");
      } catch (error) {
        console.error("Registration error:", error);
      }
    };

    register();
  }, [userId]);

  return null;
});

export default RegisterUser;
