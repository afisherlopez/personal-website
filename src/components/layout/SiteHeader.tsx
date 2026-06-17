import { navItems, siteBrand, type PageId } from "../../content/homePageContent";

interface SiteHeaderProps {
  activePage: PageId;
}

export default function SiteHeader({ activePage }: SiteHeaderProps) {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        borderBottom: "1px solid rgba(17, 24, 39, 0.12)",
        backgroundColor: "#f4fcf2",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "0.82rem clamp(1.1rem, 3vw, 2rem)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          fontFamily: '"Faculty Glyphic", sans-serif',
          color: "#1f2937",
          fontSize: "clamp(0.67rem, 0.18vw + 0.63rem, 0.79rem)",
          letterSpacing: "0.01em",
        }}
      >
        <a href="#/about" style={{ whiteSpace: "nowrap" }}>
          {siteBrand}
        </a>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(0.52rem, 1.1vw, 0.88rem)",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#/${item.id}`}
              style={{
                textDecoration: activePage === item.id ? "underline" : "none",
                textUnderlineOffset: "2px",
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
