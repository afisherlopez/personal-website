import React from "react";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { type PageId } from "../../content/homePageContent";
import { writingPageContent, type WritingEntry } from "../../content/writingContent";

interface WritingPageProps {
  currentPage: PageId;
  routeSegments: string[];
}

function unescapeMarkdown(text: string): string {
  return text.replace(/\\([\\`*{}\[\]()#+\-.!_>])/g, "$1");
}

function renderInlineFormatting(text: string): React.ReactNode[] {
  const tokenPattern = /(\*\*[^*]+\*\*|\*[^*\n][^*]*\*|\[[^\]]+\]\([^)]+\))/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null = tokenPattern.exec(text);

  while (match) {
    const [fullMatch] = match;
    const matchStart = match.index;

    if (matchStart > lastIndex) {
      nodes.push(unescapeMarkdown(text.slice(lastIndex, matchStart)));
    }

    if (fullMatch.startsWith("**")) {
      nodes.push(
        <strong key={`writing-bold-${matchStart}`}>{unescapeMarkdown(fullMatch.slice(2, -2))}</strong>,
      );
    } else if (fullMatch.startsWith("*")) {
      nodes.push(<em key={`writing-italic-${matchStart}`}>{unescapeMarkdown(fullMatch.slice(1, -1))}</em>);
    } else {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(fullMatch);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        const normalizedHref = href.trim();
        const isExternal =
          normalizedHref.startsWith("http://") || normalizedHref.startsWith("https://");

        nodes.push(
          <a
            key={`writing-link-${matchStart}`}
            href={normalizedHref}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer" : undefined}
            style={{ textDecoration: "underline", color: "#344a75" }}
          >
            {unescapeMarkdown(label)}
          </a>,
        );
      } else {
        nodes.push(unescapeMarkdown(fullMatch));
      }
    }

    lastIndex = matchStart + fullMatch.length;
    match = tokenPattern.exec(text);
  }

  if (lastIndex < text.length) {
    nodes.push(unescapeMarkdown(text.slice(lastIndex)));
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

function renderBodyBlocks(body: string, preserveLineBreaks = false): React.ReactNode[] {
  const blocks = body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block, index) => {
    const normalizedBlock = preserveLineBreaks
      ? block.replace(/\r/g, "").trimEnd()
      : block.replace(/\s*\n+\s*/g, " ").trim();
    const imageMatch = /^!\[(.*?)\]\((.*?)\)$/.exec(block);
    const centeredParagraphMatch =
      /^<p\s+align=["']center["']>(.*?)<\/p>$/i.exec(normalizedBlock);
    const isIntroQuoteBlock = index <= 1 && /^\*.*\*$/.test(normalizedBlock);

    if (centeredParagraphMatch) {
      return (
        <div
          key={`writing-separator-${index}`}
          style={{
            textAlign: "center",
            fontSize: "1.05rem",
            color: "#6b7280",
            letterSpacing: "0.18em",
            margin: "1.5rem 0 1.65rem",
            lineHeight: 1.2,
          }}
        >
          {unescapeMarkdown(centeredParagraphMatch[1].trim())}
        </div>
      );
    }

    if (imageMatch) {
      const [, alt, src] = imageMatch;
      return (
        <div key={`writing-image-${index}`} style={{ margin: "1.35rem 0" }}>
          <ImageWithFallback
            src={normalizeImageSrc(src)}
            alt={alt || "Writing image"}
            style={{
              width: "100%",
              maxHeight: "460px",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          />
        </div>
      );
    }

    return (
      <p
        key={`writing-paragraph-${index}`}
        className={preserveLineBreaks ? "writing-poetry-line" : "writing-prose-line"}
        style={{
          fontSize: "0.98rem",
          lineHeight: 1.82,
          color: "#2d3748",
          marginBottom: "1.35rem",
          textIndent:
            preserveLineBreaks || isIntroQuoteBlock || normalizedBlock.startsWith("*")
              ? 0
              : "1.25em",
          textAlign: isIntroQuoteBlock ? "center" : "left",
          whiteSpace: preserveLineBreaks ? "pre" : "normal",
        }}
      >
        {renderInlineFormatting(normalizedBlock)}
      </p>
    );
  });
}

export default function WritingPage({ currentPage, routeSegments }: WritingPageProps) {
  const selectedEntryId = routeSegments[0];
  const selectedEntry: WritingEntry | undefined = selectedEntryId
    ? writingPageContent.entries.find((entry) => entry.id === selectedEntryId)
    : undefined;

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
        {selectedEntry ? (
          <section style={{ maxWidth: "700px", margin: "0 auto" }}>
            <a
              href="#/writing"
              style={{
                display: "inline-block",
                marginBottom: "1rem",
                fontSize: "0.78rem",
                color: "#6b7280",
              }}
            >
              ← back to writing
            </a>

            <h1
              style={{
                fontSize: "clamp(1.34rem, 0.34vw + 1.23rem, 1.62rem)",
                fontWeight: 800,
                letterSpacing: "0.01em",
                marginBottom: "0.55rem",
              }}
            >
              {selectedEntry.title}
            </h1>

            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.8rem" }}>
              {selectedEntry.publishedOn}
            </p>

            <div
              style={{
                borderBottom: "1px solid rgba(17, 24, 39, 0.45)",
                width: "100%",
                marginBottom: "2rem",
              }}
            />

            <div style={{ overflowX: selectedEntry.preserveLineBreaks ? "auto" : "visible" }}>
              {renderBodyBlocks(selectedEntry.body, selectedEntry.preserveLineBreaks)}
            </div>
          </section>
        ) : (
          <section style={{ marginBottom: "3rem", maxWidth: "700px", marginInline: "auto" }}>
            <h1
              style={{
                fontSize: "clamp(1.4rem, 0.55vw + 1.22rem, 1.86rem)",
                fontWeight: 800,
                letterSpacing: "0.01em",
                marginBottom: "1.8rem",
                textTransform: "lowercase",
              }}
            >
              {writingPageContent.pageTitle}
            </h1>

            <div>
              {writingPageContent.entries.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) auto",
                    alignItems: "center",
                    gap: "0.8rem",
                    borderBottom: "1px solid rgba(17, 24, 39, 0.1)",
                    padding: "0.75rem 0",
                  }}
                >
                  <a
                    href={`#/writing/${entry.id}`}
                    style={{
                      fontFamily: '"Faculty Glyphic", sans-serif',
                      fontSize: "clamp(0.86rem, 0.14vw + 0.82rem, 0.96rem)",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    {entry.title}
                  </a>

                  <span style={{ fontSize: "0.74rem", color: "#6b7280", textAlign: "right" }}>
                    {entry.publishedOn}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
