import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import HomePage from "./pages/HomePage/HomePage";
import FileUploadComponent from "./components/FileUploadComponent/FileUploadComponent";
import authService from "./authService";

function App() {
  const [loading, setLoading] = useState(true);
  const registeredRef = useRef(false); // мемоизация регистрации
  const kc = authService.kc;

  useEffect(() => {
    if (kc.authenticated !== undefined) {
      setLoading(false);
      return;
    }

    kc.init({
      onLoad: "login-required",
      checkLoginIframe: true,
    })
      .then((auth) => {
        if (!auth) {
          console.error("Authentication failed");
          kc.login();
        } else {
          console.log("User Name:", authService.getUserName());
          console.log("User Roles:", authService.getUserRoles());

          setLoading(false);
          if (!registeredRef.current) {
            registerUserInBackend();
          }

          const tokenRefreshInterval = setInterval(() => {
            kc.updateToken(60).catch(() => {
              kc.logout();
            });
          }, 60000);

          return () => clearInterval(tokenRefreshInterval);
        }
      })
      .catch((error) => {
        console.error("Keycloak initialization failed:", error);
        setLoading(false);
      });
  }, []);

  const registerUserInBackend = async () => {
    try {
      const userId = authService.getUserId();
      const userName = authService.getUserName();
      const tokenData = authService.getTokenData();

      const response = await fetch(`http://localhost:8080/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        console.log("User already exists in the database");
        registeredRef.current = true;
        return;
      }

      if (response.status !== 400) {
        throw new Error(`Unexpected error during user existence check. Status: ${response.status}`);
      }

      const userRegisterDto = {
        id: userId,
        email: tokenData.email || `${userName}@example.com`,
        firstname: tokenData.given_name || "Unknown",
        lastname: tokenData.family_name || "Unknown",
      };

      const registerResponse = await fetch("http://localhost:8080/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userRegisterDto),
      });

      if (!registerResponse.ok) {
        throw new Error(`Failed to register user. Status: ${registerResponse.status}`);
      }

      console.log("User registered in backend successfully");
      registeredRef.current = true;
    } catch (error) {
      console.error("Error during user registration:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Header logoText={'SovcomCheck'} avatarUrl={''} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<div>History Page</div>} />
        <Route path="/check" element={<FileUploadComponent />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
