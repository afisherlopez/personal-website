import React from "react";
import HomePage from "./components/HomePage";
import backgroundImage from "./images/mt-whitney-background.JPG";

export type Page = "home" | "funfacts" | "projects" | "contact";

export default function App() {
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay to make background more visible - reduced from 85% to 55% */}
      <div className="absolute inset-0 bg-background/55 backdrop-blur-sm" />

      <div className="relative z-10">
        <HomePage onNavigate={() => {}} />
      </div>
    </div>
  );
}