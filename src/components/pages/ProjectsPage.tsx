import React, { useEffect, useState } from "react";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { type PageId } from "../../content/homePageContent";
import { projectsPageContent, type ProjectItem } from "../../content/projectsContent";

interface ProjectsPageProps {
  currentPage: PageId;
}

interface SelectedProjectState {
  project: ProjectItem;
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

export default function ProjectsPage({ currentPage }: ProjectsPageProps) {
  const [selectedProject, setSelectedProject] = useState<SelectedProjectState | null>(null);

  useEffect(() => {
    if (!selectedProject) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProject(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedProject]);

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
            {projectsPageContent.pageTitle}
          </h1>
        </section>

        {projectsPageContent.categories.map((category) => (
          <section key={category.id} style={{ marginBottom: "3.1rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.08rem, 0.3vw + 1rem, 1.24rem)",
                fontWeight: 700,
                marginBottom: "0.85rem",
              }}
            >
              {category.label}
            </h2>

            <div
              className="projects-row-list"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {category.items.map((project) => (
                <button
                  key={project.id}
                  onClick={() =>
                    setSelectedProject({
                      project,
                    })
                  }
                  style={{
                    textAlign: "left",
                    width: "100%",
                    border: "none",
                    borderRadius: "0",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    transition: "transform 0.18s ease, box-shadow 0.18s ease",
                    padding: "0.38rem 0",
                    display: "grid",
                    gridTemplateColumns: "minmax(190px, 240px) minmax(0, 1fr)",
                    alignItems: "center",
                    gap: "0.95rem",
                  }}
                >
                  <div
                    className="projects-row-polaroid"
                    style={{
                      border: "2px solid rgba(17, 24, 39, 0.19)",
                      borderRadius: "3px",
                      backgroundColor: "#ffffff",
                      padding: "0.36rem 0.36rem 0.88rem",
                      boxShadow: "0 5px 14px rgba(17, 24, 39, 0.09)",
                      transform: "none",
                    }}
                  >
                    <ImageWithFallback
                      className="projects-row-image"
                      src={normalizeImageSrc(project.imageSrc)}
                      alt={project.title}
                      style={{
                        width: "100%",
                        aspectRatio: "3 / 2",
                        objectFit: "cover",
                        borderRadius: "1px",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: "0.45rem",
                      padding: "0.15rem 0.1rem",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "clamp(0.94rem, 0.16vw + 0.9rem, 1.05rem)",
                        fontWeight: 700,
                        lineHeight: 1.25,
                      }}
                    >
                      {project.title}
                    </h3>

                    <p
                      style={{
                        fontSize: "0.81rem",
                        color: "#4b5563",
                        lineHeight: 1.5,
                      }}
                    >
                      {project.oneLineDescription}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.42rem",
                        alignItems: "center",
                      }}
                    >
                      {project.tags.map((tag) => (
                        <span
                          key={`${project.id}-${tag}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            border: "1px solid rgba(17, 24, 39, 0.2)",
                            borderRadius: "5px",
                            padding: "0.22rem 0.54rem",
                            fontSize: "0.65rem",
                            letterSpacing: "0.03em",
                            color: "#374151",
                            width: "fit-content",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </main>

      <SiteFooter />

      {selectedProject ? (
        <div
          onClick={() => setSelectedProject(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            backgroundColor: "rgba(12, 19, 24, 0.42)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "min(1000px, 100%)",
              maxHeight: "calc(100vh - 2rem)",
              backgroundColor: "transparent",
              border: "none",
              borderRadius: "0",
              boxShadow: "0 26px 58px rgba(17, 24, 39, 0.24)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <button
              aria-label="Close popup"
              onClick={() => setSelectedProject(null)}
              style={{
                position: "absolute",
                top: "0.75rem",
                right: "0.75rem",
                width: "2rem",
                height: "2rem",
                border: "1px solid rgba(17, 24, 39, 0.24)",
                borderRadius: "999px",
                fontSize: "1rem",
                lineHeight: 1,
                cursor: "pointer",
                backgroundColor: "#f8fbf4",
                zIndex: 3,
              }}
            >
              x
            </button>

            <div
              className="projects-modal-scroll"
              style={{ overflowY: "auto", maxHeight: "calc(100vh - 2rem)" }}
            >
              <div
                className="projects-whiteboard"
                style={{
                  margin: "0",
                  border: "1px solid rgba(17, 24, 39, 0.2)",
                  borderRadius: "8px",
                  backgroundColor: "#f8fbf4",
                  padding: "1.05rem",
                }}
              >
                <div
                  className="projects-whiteboard-top"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(235px, 270px) minmax(0, 1fr)",
                    gap: "1.35rem",
                    alignItems: "center",
                  }}
                >
                  <div className="projects-board-polaroid-wrap" style={{ position: "relative", paddingTop: "0.7rem" }}>
                    <div
                      className="projects-board-polaroid"
                      style={{
                        border: "2px solid rgba(17, 24, 39, 0.2)",
                        borderRadius: "3px",
                        backgroundColor: "#ffffff",
                        padding: "0.36rem 0.36rem 0.92rem",
                        boxShadow: "0 8px 16px rgba(17, 24, 39, 0.12)",
                      }}
                    >
                      <ImageWithFallback
                        className="projects-board-polaroid-image"
                        src={normalizeImageSrc(selectedProject.project.imageSrc)}
                        alt={selectedProject.project.title}
                        style={{
                          width: "100%",
                          aspectRatio: "3 / 2",
                          objectFit: "cover",
                          borderRadius: "1px",
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className="projects-board-meta"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: "0.62rem",
                      paddingTop: "0.45rem",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "clamp(1.16rem, 0.38vw + 1.07rem, 1.42rem)",
                        fontWeight: 700,
                        lineHeight: 1.28,
                      }}
                    >
                      {selectedProject.project.title}
                    </h3>

                    <p style={{ fontSize: "0.84rem", color: "#4b5563", lineHeight: 1.55 }}>
                      {selectedProject.project.oneLineDescription}
                    </p>

                    {selectedProject.project.repoUrl || selectedProject.project.pdfUrl ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.38rem", marginTop: "0.05rem" }}>
                        {selectedProject.project.repoUrl ? (
                          <a
                            href={selectedProject.project.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontSize: "0.8rem",
                              color: "#2f4c7b",
                              textDecoration: "none",
                              width: "fit-content",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.42rem",
                            }}
                          >
                            <span
                              aria-hidden
                              style={{
                                width: "1rem",
                                height: "1rem",
                                display: "inline-flex",
                                color: "#1f2937",
                              }}
                            >
                              <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
                                <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 0 0 8.2 11.4c.6.1.8-.25.8-.57v-2.2c-3.34.72-4.04-1.6-4.04-1.6-.54-1.39-1.33-1.76-1.33-1.76-1.08-.73.08-.72.08-.72 1.2.08 1.83 1.22 1.83 1.22 1.06 1.83 2.8 1.3 3.49 1 .1-.77.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.92 0-1.31.47-2.37 1.22-3.21-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.76.84 1.22 1.9 1.22 3.2 0 4.6-2.81 5.63-5.49 5.93.43.37.82 1.1.82 2.22v3.28c0 .32.22.68.82.56A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
                              </svg>
                            </span>
                            <span style={{ textDecoration: "underline", textUnderlineOffset: "2px" }}>
                              Link to Repo
                            </span>
                          </a>
                        ) : null}

                        {selectedProject.project.pdfUrl ? (
                          <a
                            href={selectedProject.project.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontSize: "0.8rem",
                              color: "#2f4c7b",
                              textDecoration: "none",
                              width: "fit-content",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.42rem",
                            }}
                          >
                            <span
                              aria-hidden
                              style={{
                                width: "1rem",
                                height: "1rem",
                                display: "inline-flex",
                                color: "#1f2937",
                              }}
                            >
                              <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 2.4L17.6 8H14V4.4ZM8 13h8v1.6H8V13Zm0 3.2h8v1.6H8v-1.6Zm0-6.4h4.8v1.6H8V9.8Z" />
                              </svg>
                            </span>
                            <span style={{ textDecoration: "underline", textUnderlineOffset: "2px" }}>
                              Read the paper
                            </span>
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div
                  className="projects-board-notes"
                  style={{
                    marginTop: "1.2rem",
                    border: "1px solid rgba(17, 24, 39, 0.18)",
                    borderRadius: "6px",
                    backgroundColor: "rgba(255, 255, 255, 0.72)",
                    padding: "0.9rem 1rem 0.95rem",
                  }}
                >
                  <p style={{ fontSize: "0.88rem", color: "#2d3748", lineHeight: 1.68 }}>
                    {selectedProject.project.overview}
                  </p>

                  {selectedProject.project.highlights?.length ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.45rem",
                        marginTop: "0.75rem",
                      }}
                    >
                      {selectedProject.project.highlights.map((highlight) => (
                        <p
                          key={highlight}
                          style={{
                            fontSize: "0.8rem",
                            color: "#374151",
                            lineHeight: 1.55,
                          }}
                        >
                          • {highlight}
                        </p>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
