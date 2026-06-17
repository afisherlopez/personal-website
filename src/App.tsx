import React, { useEffect, useState } from "react";
import HomePage from "./components/HomePage";
import BookshelfPage from "./components/pages/BookshelfPage";
import { defaultPage, navItems, type PageId } from "./content/homePageContent";

const pageIds = new Set(navItems.map((item) => item.id));

function normalizeHash(hash: string): string {
  return hash.replace(/^#\/?/, "").trim().toLowerCase();
}

function getPageFromHash(): PageId {
  const candidate = normalizeHash(window.location.hash);

  if (pageIds.has(candidate as PageId)) {
    return candidate as PageId;
  }

  return defaultPage;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(defaultPage);

  useEffect(() => {
    const syncFromHash = () => {
      const nextPage = getPageFromHash();
      setCurrentPage(nextPage);

      const normalized = normalizeHash(window.location.hash);
      if (normalized !== nextPage) {
        window.history.replaceState(null, "", `#/${nextPage}`);
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [currentPage]);

  if (currentPage === "bookshelf") {
    return <BookshelfPage currentPage={currentPage} />;
  }

  return <HomePage currentPage={currentPage} />;
}