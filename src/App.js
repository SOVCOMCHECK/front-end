import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import HomePage from "./pages/HomePage/HomePage";
import FileUploadComponent from "./components/FileUploadComponent/FileUploadComponent";
import authService from "./authService";
import RegisterUser from "./components/RegisterUser/RegisterUser";
import UserChecksList from "./components/UserChecksList/UserChecksList";
import CheckDetails from "./components/CheckDetails/CheckDetails";
import SockJS from 'sockjs-client'; // Импортируем SockJS
import { Client } from '@stomp/stompjs'; // Импортируем Stomp Client

const GLOBAL_HOST = `http://158.160.109.57:8080`;

const kc = authService.kc;

function App() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [stompClient, setStompClient] = useState(null);


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
        console.log(authService.getUserId());
        if (!auth) {
          
          console.error("Authentication failed");
          kc.login();
        } else {
          console.log("User Name:", authService.getUserName());
          setLoading(false);

          const tokenRefreshInterval = setInterval(() => {
            kc.updateToken(60).catch(() => kc.logout());
          }, 60000);

          return () => clearInterval(tokenRefreshInterval);
        }
      })
      .catch((error) => {
        console.error("Keycloak initialization failed:", error);
        setLoading(false);
      });

      // const client = new Client({
      //   brokerURL: `${GLOBAL_HOST.replace('http', 'ws')}/ws`,
      //   connectHeaders: {},
      //   debug: (str) => console.log(str),
      //   reconnectDelay: 5000,
      //   heartbeatIncoming: 4000,
      //   heartbeatOutgoing: 4000,
      // });
  
      // client.onConnect = (frame) => {
      //   console.log('Connected: ' + frame);
      //   client.subscribe(`/topic/notifications/${authService.getUserId()}`, (message) => {
      //     const messageBody = JSON.parse(message.body);
      //     setNotifications((prevNotifications) => [...prevNotifications, messageBody]);
      //   });
      // };
  
      // client.onWebSocketError = (error) => {
      //   console.error('WebSocket error:', error);
      // };
  
      // client.onStompError = (frame) => {
      //   console.error('Broker reported error: ' + frame.headers['message']);
      //   console.error('Additional details: ' + frame.body);
      // };
  
      // client.activate();
      // setStompClient(client);
  
      // return () => {
      //   if (client) {
      //     client.deactivate();
      //   }
      // };


  }, []);

  const handleLogout = () => {
    kc.logout();
  };

  // const dismissNotification = (index) => {
  //   setNotifications((prevNotifications) =>
  //     prevNotifications.filter((_, i) => i !== index)
  //   );
  // };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Header logoText={"SovcomCheck"} avatarUrl={""} onLogout={handleLogout} />

      {/* Всплывающие уведомления */}
      {/* <div style={{ position: "fixed", top: 20, right: 20, zIndex: 1000 }}>
        {notifications.map((notification, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#f0f0f0",
              padding: "10px",
              margin: "5px 0",
              border: "1px solid #ccc",
              borderRadius: "5px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <span>{notification.message}</span>
            <button
              style={{ marginLeft: "10px", cursor: "pointer" }}
              onClick={() => dismissNotification(index)}
            >
              Dismiss
            </button>
          </div>
        ))}
      </div> */}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<UserChecksList />} />
        <Route path="/check" element={<FileUploadComponent />} />
        <Route path="/check/:id" element={<CheckDetails />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
export { GLOBAL_HOST };