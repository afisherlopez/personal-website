import React, { useEffect, useState } from "react";
import HomePage from "./components/HomePage";
import BookshelfPage from "./components/pages/BookshelfPage";
import WritingPage from "./components/pages/WritingPage";
import ProjectsPage from "./components/pages/ProjectsPage";
import TrainingPage from "./components/pages/TrainingPage";
import { defaultPage, navItems, type PageId } from "./content/homePageContent";

type AppPageId = PageId | "training";

const pageIds = new Set(navItems.map((item) => item.id));
const hiddenPageIds = new Set<AppPageId>(["training"]);

function getHashSegments(hash: string): string[] {
  const normalized = hash.replace(/^#\/?/, "").trim().toLowerCase();
  return normalized ? normalized.split("/").filter(Boolean) : [];
}

function getRouteFromHash(): { page: AppPageId; segments: string[] } {
  const segments = getHashSegments(window.location.hash);
  const candidate = segments[0];

  if (pageIds.has(candidate as PageId)) {
    return { page: candidate as PageId, segments: segments.slice(1) };
  }

  if (hiddenPageIds.has(candidate as AppPageId)) {
    return { page: candidate as AppPageId, segments: segments.slice(1) };
  }

  return { page: defaultPage, segments: [] };
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPageId>(defaultPage);
  const [routeSegments, setRouteSegments] = useState<string[]>([]);

  useEffect(() => {
    const syncFromHash = () => {
      const route = getRouteFromHash();
      setCurrentPage(route.page);
      setRouteSegments(route.segments);

      const rawSegments = getHashSegments(window.location.hash);
      const isKnownPage =
        pageIds.has(rawSegments[0] as PageId) ||
        hiddenPageIds.has(rawSegments[0] as AppPageId);
      if (!rawSegments.length || !isKnownPage) {
        window.history.replaceState(null, "", `#/${route.page}`);
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [currentPage, routeSegments]);

  if (currentPage === "bookshelf") {
    return <BookshelfPage currentPage={currentPage} />;
  }

  if (currentPage === "writing") {
    return <WritingPage currentPage={currentPage} routeSegments={routeSegments} />;
  }

  if (currentPage === "projects") {
    return <ProjectsPage currentPage={currentPage} />;
  }

  if (currentPage === "training") {
    return <TrainingPage />;
  }

  return <HomePage currentPage={currentPage as PageId} />;
}