import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import HomePage from "./components/HomePage";
import FunFactsPage from "./components/FunFactsPage";
import ProjectsPage from "./components/ProjectsPage";
import ContactPage from "./components/ContactPage";

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
        backgroundImage: `url(https://images.unsplash.com/photo-1632929644466-e68984931d6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWVycmElMjBtb3VudGFpbnMlMjBzdW5zZXQlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzU4MTYxMDQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay to make background more subtle */}
      <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />

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