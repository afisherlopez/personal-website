import React, { useState } from "react";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { type PageId } from "../../content/homePageContent";
import { bookshelfPageContent, type BookshelfItem } from "../../content/bookshelfContent";

interface BookshelfPageProps {
  currentPage: PageId;
}

function renderInlineLinks(text: string): React.ReactNode[] {
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null = linkPattern.exec(text);

  while (match) {
    const [fullMatch, label, href] = match;
    const matchStart = match.index;

    if (matchStart > lastIndex) {
      nodes.push(text.slice(lastIndex, matchStart));
    }

    const normalizedHref = href.trim();
    const isExternal =
      normalizedHref.startsWith("http://") || normalizedHref.startsWith("https://");

    nodes.push(
      <a
        key={`note-link-${matchStart}`}
        href={normalizedHref}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        style={{ textDecoration: "underline", color: "#344a75" }}
      >
        {label}
      </a>,
    );

    lastIndex = matchStart + fullMatch.length;
    match = linkPattern.exec(text);
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function normalizeImageSrc(src: string): string {
  const trimmed = src.trim();

  if (!trimmed) {
    return "/images/pfp.jpg";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (trimmed.startsWith("/images/")) {
    return trimmed;
  }

  if (trimmed.startsWith("images/")) {
    return `/${trimmed}`;
  }

  if (trimmed.startsWith("public/images/")) {
    return `/${trimmed.replace(/^public\//, "")}`;
  }

  if (trimmed.startsWith("docs/images/")) {
    return `/${trimmed.replace(/^docs\//, "")}`;
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export default function BookshelfPage({ currentPage }: BookshelfPageProps) {
  const [selectedItem, setSelectedItem] = useState<BookshelfItem | null>(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4fcf2",
        color: "#1f2937",
        fontFamily: '"Faculty Glyphic", sans-serif',
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SiteHeader activePage={currentPage} />

      <main
        style={{
          maxWidth: "950px",
          width: "100%",
          margin: "0 auto",
          flex: 1,
          padding: "6.35rem clamp(1.125rem, 3.75vw, 2.55rem) 2.2rem",
        }}
      >
        <section style={{ marginBottom: "2.8rem" }}>
          <h1
            style={{
              fontSize: "clamp(1.4rem, 0.55vw + 1.22rem, 1.86rem)",
              fontWeight: 800,
              letterSpacing: "0.01em",
              marginBottom: "0.45rem",
              textTransform: "lowercase",
            }}
          >
            {bookshelfPageContent.pageTitle}
          </h1>
        </section>

        {bookshelfPageContent.categories.map((category) => (
          <section key={category.id} style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "0.94rem",
                fontWeight: 700,
                marginBottom: "0.5rem",
                textTransform: "lowercase",
              }}
            >
              {category.label}
            </h2>
            <div style={{ borderBottom: "2px solid rgba(17, 24, 39, 0.7)" }} />

            <div>
              {category.items.map((item) => (
                <div
                  key={`${category.id}-${item.title}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) auto",
                    gap: "0.8rem",
                    alignItems: "center",
                    borderBottom: "1px solid rgba(17, 24, 39, 0.1)",
                    padding: "0.8rem 0",
                  }}
                >
                  <button
                    onClick={() => setSelectedItem(item)}
                    style={{
                      textAlign: "left",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: '"Faculty Glyphic", sans-serif',
                      fontSize: "clamp(0.79rem, 0.14vw + 0.76rem, 0.88rem)",
                    }}
                  >
                    {item.title}
                  </button>

                  <span
                    style={{
                      fontSize: "0.74rem",
                      color: "#6b7280",
                      textAlign: "right",
                    }}
                  >
                    {item.creator}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <SiteFooter />

      {selectedItem ? (
        <div
          onClick={() => setSelectedItem(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            backgroundColor: "rgba(12, 19, 24, 0.34)",
            backdropFilter: "blur(1.5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.8rem",
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "min(900px, 100%)",
              maxHeight: "90vh",
              backgroundColor: "#f4fcf2",
              border: "1px solid rgba(17, 24, 39, 0.2)",
              borderRadius: "10px",
              boxShadow: "0 20px 52px rgba(17, 24, 39, 0.22)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <button
              aria-label="Close popup"
              onClick={() => setSelectedItem(null)}
              style={{
                position: "absolute",
                top: "0.55rem",
                right: "0.55rem",
                border: "1px solid rgba(17, 24, 39, 0.24)",
                borderRadius: "6px",
                padding: "0.2rem 0.5rem",
                fontSize: "0.84rem",
                lineHeight: 1,
                cursor: "pointer",
                backgroundColor: "#f4fcf2",
                zIndex: 3,
              }}
            >
              x
            </button>

            <div
              className="bookshelf-modal-scroll"
              style={{
                overflowY: "auto",
              }}
            >
              <div
                className="bookshelf-modal-desktop"
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(180px, 280px) minmax(0, 1fr)",
                }}
              >
                <div
                  className="bookshelf-modal-image-pane"
                  style={{ borderRight: "1px solid rgba(17, 24, 39, 0.16)" }}
                >
                  <ImageWithFallback
                    className="bookshelf-modal-image"
                    src={normalizeImageSrc(selectedItem.imageSrc)}
                    alt={selectedItem.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: "260px",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div style={{ padding: "1.25rem 1.3rem 1.45rem" }}>
                  <div
                    className="bookshelf-modal-heading"
                    style={{
                      marginBottom: "1.1rem",
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: "1.08rem", fontWeight: 700 }}>{selectedItem.title}</h3>
                      <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>{selectedItem.creator}</p>
                    </div>
                  </div>

                  <p
                    className="bookshelf-modal-notes"
                    style={{
                      fontSize: "0.88rem",
                      lineHeight: 1.72,
                      color: "#2d3748",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {renderInlineLinks(selectedItem.notes)}
                  </p>
                </div>
              </div>

              <div className="bookshelf-modal-mobile">
              <div
                className="bookshelf-modal-top-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(180px, 280px) minmax(0, 1fr)",
                }}
              >
                <div
                  className="bookshelf-modal-image-pane"
                  style={{ borderRight: "1px solid rgba(17, 24, 39, 0.16)" }}
                >
                  <ImageWithFallback
                    className="bookshelf-modal-image"
                    src={normalizeImageSrc(selectedItem.imageSrc)}
                    alt={selectedItem.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: "260px",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div className="bookshelf-modal-heading-pane" style={{ padding: "1.15rem 1.2rem 1rem" }}>
                  <div
                    className="bookshelf-modal-heading"
                    style={{
                      marginBottom: "0.2rem",
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: "1.08rem", fontWeight: 700 }}>{selectedItem.title}</h3>
                      <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>{selectedItem.creator}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="bookshelf-modal-notes-wrap"
                style={{
                  padding: "1.1rem 1.2rem 1.35rem",
                  borderTop: "1px solid rgba(17, 24, 39, 0.12)",
                }}
              >
                <p
                  className="bookshelf-modal-notes"
                  style={{
                    fontSize: "0.88rem",
                    lineHeight: 1.72,
                    color: "#2d3748",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {renderInlineLinks(selectedItem.notes)}
                </p>
              </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
