import React, { useEffect, useState } from "react";
import HomePage from "./components/HomePage";
import BookshelfPage from "./components/pages/BookshelfPage";
import WritingPage from "./components/pages/WritingPage";
import ProjectsPage from "./components/pages/ProjectsPage";
import { defaultPage, navItems, type PageId } from "./content/homePageContent";

const pageIds = new Set(navItems.map((item) => item.id));

function getHashSegments(hash: string): string[] {
  const normalized = hash.replace(/^#\/?/, "").trim().toLowerCase();
  return normalized ? normalized.split("/").filter(Boolean) : [];
}

function getRouteFromHash(): { page: PageId; segments: string[] } {
  const segments = getHashSegments(window.location.hash);
  const candidate = segments[0];

  if (pageIds.has(candidate as PageId)) {
    return { page: candidate as PageId, segments: segments.slice(1) };
  }

  return { page: defaultPage, segments: [] };
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(defaultPage);
  const [routeSegments, setRouteSegments] = useState<string[]>([]);

  useEffect(() => {
    const syncFromHash = () => {
      const route = getRouteFromHash();
      setCurrentPage(route.page);
      setRouteSegments(route.segments);

      const rawSegments = getHashSegments(window.location.hash);
      if (!rawSegments.length || !pageIds.has(rawSegments[0] as PageId)) {
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

  return <HomePage currentPage={currentPage} />;
}