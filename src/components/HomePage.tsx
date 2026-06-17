import React from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import SiteHeader from "./layout/SiteHeader";
import {
  aboutSection,
  footerPrimaryLinks,
  pageSections,
  type PageId,
} from "../content/homePageContent";

const sharedParagraphStyle = {
  fontSize: "clamp(0.86rem, 0.22vw + 0.8rem, 0.98rem)",
  lineHeight: 1.6,
  color: "#2d3748",
  marginBottom: "0.7rem",
  fontFamily: '"Faculty Glyphic", sans-serif',
};

interface HomePageProps {
  currentPage: PageId;
}

export default function HomePage({ currentPage }: HomePageProps) {
  const isExternalLink = (href: string) => href.startsWith("http");
  const currentSection = pageSections.find((section) => section.id === currentPage);

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
          flex: 1,
          margin: "0 auto",
          padding: "5.9rem clamp(1.125rem, 3.75vw, 2.55rem) 1.4rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {currentPage === "about" ? (
          <section className="mb-12">
            <div
              className="about-grid"
              style={{
                display: "grid",
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: "clamp(1.26rem, 0.46vw + 1.14rem, 1.56rem)",
                    marginBottom: "0.8rem",
                    fontWeight: 700,
                    fontFamily: '"Faculty Glyphic", sans-serif',
                  }}
                >
                  {aboutSection.title}
                </h1>

                <p style={{ ...sharedParagraphStyle, marginBottom: "2.3rem" }}>
                  {aboutSection.intro}
                </p>

                {aboutSection.details.map((detail) => (
                  <div key={detail.title} style={{ marginBottom: "2.3rem" }}>
                    <h2
                      style={{
                        fontSize: "clamp(1rem, 0.25vw + 0.94rem, 1.14rem)",
                        marginBottom: "0.6rem",
                        fontWeight: 700,
                        fontFamily: '"Faculty Glyphic", sans-serif',
                      }}
                    >
                      {detail.title}
                    </h2>

                    <p style={{ ...sharedParagraphStyle, marginBottom: 0 }}>
                      {detail.text}
                      {detail.linkLabel && detail.linkHref ? (
                        <a
                          href={detail.linkHref}
                          target={isExternalLink(detail.linkHref) ? "_blank" : undefined}
                          rel={isExternalLink(detail.linkHref) ? "noreferrer" : undefined}
                          style={{ textDecoration: "underline", color: "#344a75" }}
                        >
                          {detail.linkLabel}
                        </a>
                      ) : null}
                      {detail.linkTrailingText ?? ""}
                    </p>
                  </div>
                ))}
              </div>

              <div className="about-image-wrap">
                <ImageWithFallback
                  src={aboutSection.imageSrc}
                  alt={aboutSection.imageAlt}
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    height: "auto",
                    objectFit: "cover",
                    borderRadius: "0.12rem",
                  }}
                />
              </div>
            </div>
          </section>
        ) : currentSection ? (
          <section className="mb-10">
            <h1
              style={{
                fontSize: "clamp(1.2rem, 0.4vw + 1.1rem, 1.46rem)",
                marginBottom: "0.8rem",
                fontWeight: 700,
                fontFamily: '"Faculty Glyphic", sans-serif',
              }}
            >
              {currentSection.title}
            </h1>

            {currentSection.paragraphs.map((paragraph) => (
              <p key={paragraph} style={sharedParagraphStyle}>
                {paragraph}
              </p>
            ))}
          </section>
        ) : null}

      </main>

      <footer
        style={{
          width: "100%",
          borderTop: "1px solid rgba(17, 24, 39, 0.12)",
        }}
      >
        <div
          style={{
            maxWidth: "950px",
            margin: "0 auto",
            padding: "0.85rem clamp(1.125rem, 3.75vw, 2.55rem) 0.2rem",
            fontSize: "clamp(0.74rem, 0.14vw + 0.69rem, 0.82rem)",
            color: "#4a5568",
            fontFamily: '"Faculty Glyphic", sans-serif',
            textAlign: "right",
          }}
        >
          <div
            style={{
              marginBottom: "0.75rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              justifyContent: "flex-end",
            }}
          >
            {footerPrimaryLinks.map((link, index) => (
              <span key={link.label} style={{ display: "inline-flex", gap: "0.5rem" }}>
                <a
                  href={link.href}
                  target={isExternalLink(link.href) ? "_blank" : undefined}
                  rel={isExternalLink(link.href) ? "noreferrer" : undefined}
                >
                  {link.label}
                </a>
                {index < footerPrimaryLinks.length - 1 ? <span>&middot;</span> : null}
              </span>
            ))}
          </div>
        </div>
      </footer>

      <div
        style={{
          width: "100%",
          padding: "0.15rem 1rem 0.85rem",
          fontSize: "clamp(0.6rem, 0.12vw + 0.57rem, 0.68rem)",
          color: "#6b7280",
          fontFamily: '"Faculty Glyphic", sans-serif',
          textAlign: "right",
        }}
      >
        <a href="https://sambeskind.info" target="_blank" rel="noreferrer">
          design inspo from sambeskind.info
        </a>
      </div>
    </div>
  );
}
