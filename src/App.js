import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import HomePage from "./pages/HomePage/HomePage";
import FileUploadComponent from "./components/FileUploadComponent/FileUploadComponent";
import authService from "./authService";

const kc = authService.kc;

function App() {
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