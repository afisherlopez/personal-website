import theLakeBody from "./writing/the-lake.md?raw";
import successStoryBody from "./writing/success-story.md?raw";
import foundInTheNothingnessBody from "./writing/found-in-the-nothingness.md?raw";
import theIntegralBody from "./writing/the-integral.md?raw";
import wayOpensBody from "./writing/way-opens.md?raw";

export interface WritingEntry {
  id: string;
  title: string;
  publishedOn: string;
  body: string;
  preserveLineBreaks?: boolean;
}

export interface WritingPageContent {
  pageTitle: string;
  entries: WritingEntry[];
}

/**
 * Editing guide:
 * - Add or remove entries in `entries`
 * - Keep each entry body in a separate `.md` file under `src/content/writing/`
 * - Import the body at the top of this file and assign it in `entries`
 * - Markdown-style links are supported in body text: [my link](https://example.com)
 * - Image blocks are supported on their own line:
 *   ![Alt text](/images/writing/your-image.jpg)
 */
export const writingPageContent: WritingPageContent = {
  pageTitle: "writing",
  entries: [
    {
      id: "the-lake",
      title: "The Lake",
      publishedOn: "Mar 17, 2026",
      body: theLakeBody,
    },
    {
      id: "way-opens",
      title: "The Way Opens",
      publishedOn: "May 4, 2024",
      body: wayOpensBody,
      preserveLineBreaks: true,
    },
    /*
    {
      id: "the-integral",
      title: "Integral",
      publishedOn: "May 29, 2024",
      body: theIntegralBody,
    },
    */
    {
      id: "found-in-the-nothingness",
      title: "Found in the Nothingness",
      publishedOn: "Oct 17, 2021",
      body: foundInTheNothingnessBody,
    },
    {
      id: "success-story",
      title: "Success Story",
      publishedOn: "Aug 01, 2021",
      body: successStoryBody,
    },
  ],
};
