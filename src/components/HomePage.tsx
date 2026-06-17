import React from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import SiteHeader from "./layout/SiteHeader";
import SiteFooter from "./layout/SiteFooter";
import {
  aboutSection,
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
              <div className="about-header-block">
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
              </div>

              <div className="about-body-block">
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
                          target="_blank"
                          rel="noreferrer"
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
      <SiteFooter />
    </div>
  );
}
