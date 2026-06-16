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
  fontSize: "0.8rem",
  lineHeight: 1.55,
  color: "#2d3748",
  marginBottom: "0.6rem",
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
          maxWidth: "700px",
          width: "100%",
          flex: 1,
          margin: "0 auto",
          padding: "6.35rem 1.85rem 2rem",
        }}
      >
        {currentPage === "about" ? (
          <section className="mb-16">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) minmax(120px, 165px)",
                alignItems: "start",
                columnGap: "1.5rem",
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: "1.25rem",
                    marginBottom: "0.8rem",
                    fontWeight: 700,
                    fontFamily: '"Faculty Glyphic", sans-serif',
                  }}
                >
                  {aboutSection.title}
                </h1>

                <p style={{ ...sharedParagraphStyle, marginBottom: "1.8rem" }}>
                  {aboutSection.intro}
                </p>

                {aboutSection.details.map((detail) => (
                  <div key={detail.title} style={{ marginBottom: "1.8rem" }}>
                    <h2
                      style={{
                        fontSize: "1.02rem",
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

              <div style={{ justifySelf: "end", width: "100%" }}>
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
          <section className="mb-14">
            <h1
              style={{
                fontSize: "1.25rem",
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

        <footer
          style={{
            marginTop: "1.25rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(17, 24, 39, 0.12)",
            fontSize: "0.72rem",
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
        </footer>
      </main>

      <div
        style={{
          width: "100%",
          padding: "0.2rem 1.35rem 0.9rem",
          fontSize: "0.6rem",
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
