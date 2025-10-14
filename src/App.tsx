import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import HomePage from "./components/HomePage";
import FunFactsPage from "./components/FunFactsPage";
import ProjectsPage from "./components/ProjectsPage";
import ContactPage from "./components/ContactPage";
import backgroundImage from "./images/mt-whitney-background.JPG";

export type Page = "home" | "funfacts" | "projects" | "contact";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={setCurrentPage} />;
      case "funfacts":
        return <FunFactsPage onNavigate={setCurrentPage} />;
      case "projects":
        return <ProjectsPage onNavigate={setCurrentPage} />;
      case "contact":
        return <ContactPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

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
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
            className="min-h-screen"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}