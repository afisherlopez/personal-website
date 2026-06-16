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
          maxWidth: "960px",
          margin: "0 auto",
          padding: "0.75rem 1.35rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          fontFamily: '"Faculty Glyphic", sans-serif',
          color: "#1f2937",
          fontSize: "0.66rem",
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
            gap: "0.65rem",
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
