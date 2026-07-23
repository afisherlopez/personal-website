export type PageId =
  | "about"
  | "bookshelf"
  | "writing"
  | "projects"
  | "photobook";

export interface NavItem {
  id: PageId;
  label: string;
}

export interface AboutDetailSection {
  title: string;
  text: string;
  linkLabel?: string;
  linkHref?: string;
  linkTrailingText?: string;
}

export interface AboutSectionContent {
  id: "about";
  title: string;
  intro: string;
  details: AboutDetailSection[];
  imageSrc: string;
  imageAlt: string;
}

export interface PageSection {
  id: Exclude<PageId, "about" | "bookshelf" | "writing">;
  title: string;
  paragraphs: string[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export const siteBrand = "AFL";
export const defaultPage: PageId = "about";

export const navItems: NavItem[] = [
  { id: "about", label: "about" },
  { id: "bookshelf", label: "bookshelf" },
  { id: "writing", label: "writing" },
  { id: "projects", label: "projects" },
  { id: "photobook", label: "photobook" },
];

export const aboutSection: AboutSectionContent = {
  id: "about",
  title: "Hi, I'm Anna!",
  intro:
    "I'm living in San Francisco, exploring how the world around us can bring us closer to the people around us and learning how to make the perfect iced tea.",
  details: [
    {
      title: "Currently",
      text: "I'm interning at ",
      linkLabel: "Blue Forest",
      linkHref: "https://blueforest.org",
      linkTrailingText:
        ", working to protect our forests and their communities from wildfires.",
    },
    {
      title: "Previously",
      text: "I grew up and played frisbee in Takoma Park, Maryland, then studied computer science and physics and adventured in the outdoors at Stanford.",
    },
  ],
  imageSrc: "/images/pfp.jpg",
  imageAlt: "Portrait of Anna",
};

export const pageSections: PageSection[] = [
  {
    id: "photobook",
    title: "Photobook section in progress!",
    paragraphs: [
      "",
    ],
  },
];

export const footerPrimaryLinks: FooterLink[] = [
  { label: "email", href: "mailto:annafisherlopez@gmail.com" },
  { label: "linkedin", href: "https://www.linkedin.com/in/anna-fisher-lopez" },
];
