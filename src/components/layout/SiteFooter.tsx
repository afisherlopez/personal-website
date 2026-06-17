import { footerPrimaryLinks } from "../../content/homePageContent";

interface SiteFooterProps {
  maxWidth?: string;
  horizontalPadding?: string;
}

export default function SiteFooter({
  maxWidth = "950px",
  horizontalPadding = "clamp(1.125rem, 3.75vw, 2.55rem)",
}: SiteFooterProps) {
  const isExternalLink = (href: string) => href.startsWith("http");

  return (
    <>
      <footer
        style={{
          width: "100%",
          borderTop: "1px solid rgba(17, 24, 39, 0.12)",
        }}
      >
        <div
          style={{
            maxWidth,
            margin: "0 auto",
            padding: `0.85rem ${horizontalPadding} 0.2rem`,
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
    </>
  );
}
