/**
 * Bookshelf page content lives in this file so you can edit it
 * without touching layout/components.
 */

export type BookshelfCategoryId = "books" | "articles" | "podcasts" | "music";

export interface BookshelfItem {
  title: string;
  creator: string;
  imageSrc: string;
  notes: string;
}

export interface BookshelfCategory {
  id: BookshelfCategoryId;
  label: string;
  items: BookshelfItem[];
}

export interface BookshelfPageContent {
  pageTitle: string;
  categories: BookshelfCategory[];
}

export const bookshelfPageContent: BookshelfPageContent = {
  pageTitle: "bookshelf",
  categories: [
    {
      id: "books",
      label: "books",
      items: [
        {
          title: "The Maniac",
          creator: "Benjamín Labatut",
          imageSrc: "/images/bookshelf/the_maniac.jpg",
          notes:
            "This book explores the life of Jon von Neumann, who was one of the most influential mathematicians of the 20th century, through a series of fictionalized journal entries by those who knew him. Super cool narrative format that I really enjoyed. von Neumann worked on the first model for the conditions necessary for a machine to reproduce, published in a posthumous 'Theory of Self-Reproducing Automata'. He worked on the Manhattan Project (and was a little too Pro Bomb). Also for all you nerds, he invented merge sort. Crazy guy but cool guy, and even cooler storytelling. ",
        },
        {
          title: "When We Cease to Understand the World",
          creator: "Benjamín Labatut",
          imageSrc: "/images/bookshelf/when-we-cease.webp",
          notes: "I really love biographical fiction as a genre. These short stories follow the lives of real people and events, editorializing slightly to make the narrative flow more smoothly (e.g. adding dialogue, even though no one really knows what was said). They are stories of different physicists, from the Nazi's use of meth & cyanide at the end of WWII to legendary physicists serving in the WWI trenches to a genius mathematician so tortured by one of his theories that he ran away and became a hermit. A really fun way to learn more about some of the most interesting parts of the history of modern physics and the people behind it.",
        },
        {
          title: "The Time Traveler's Wife",
          creator: "Audrey Niffenegger",
          imageSrc: "/images/bookshelf/time-travelers-wife.jpg",
          notes: "A beautiful love story told from the perspective of a man who involuntarily time travels and his wife. Fascinating relationship building and deeply emotional.",
        },
      ],
    },
    {
      id: "articles",
      label: "articles",
      items: [
        {
          title: "The 9.9 Percent is the New American Aristocracy",
          creator: "Matthew Stewart",
          imageSrc: "/images/bookshelf/american-aristocracy.jpg",
          notes: "This article came out in 2018, but I still think about it all the time. It changed the way I thought about wealth in America by adding the 9.9% of wealthiest Americans into the conversation of the '1%' which most people think of as the class of elites worth discussing. It's well-written and researched, and has changed my perspective on the role each of us has to play in wealth inequality in this country. Especially since the conversation now is shifting towards viewing tech/AI people as the upper class, it's worth remembering all the sneaky rich people who are invisibly wealthy enough to have been sneakily getting away with it. Read the article in the Atlantic [here](https://www.theatlantic.com/magazine/archive/2018/06/the-birth-of-a-new-american-aristocracy/559130/) if you're part of the 9.9% and have a subscription, otherwise you can read the pdf version [here](https://longevity.stanford.edu/wp-content/uploads/sites/24/2018/09/The-Birth-of-the-New-American-Aristocracy-The-Atlantic-.pdf)",
        },
      ],
    },
    {
      id: "podcasts",
      label: "podcasts",
      items: [
        {
          title: "The Curious Mr. Feynman",
          creator: "Freakonomics",
          imageSrc: "/images/bookshelf/feynman.jpg",
          notes: "Freakonomics talks about the most interesting physics character of all time. What more could you ask for.",
        },
        {
          title: "Coca-Cola",
          creator: "Acquired",
          imageSrc: "/images/bookshelf/coca-cola.avif",
          notes: "One of the most fun Acquired episodes! So much fun history and crazy facts and stories about why Coca-Cola is everywhere today. The U.S. army deemed them a necessity for American success in WWII so they were exempt from the sugar tax. The public actually likes Pepsi better in blind taste tests. There's a reason why you see the logo painted on the sides of buildings all over the world. Great work as usual from the Acquired guys.",
        },
        {
          title: "Season 6 – Beyoncé : LEMONADE",
          creator: "Dissect",
          imageSrc: "/images/bookshelf/lemonade-dissect.jpeg",
          notes: "An entire season of podcasts! Cool analysis of both the album and the movie that goes along with it. Showed me how the album is about how Beyoncé chose to break the generational cycles of infidelity and abuse in her family by choosing to forgive Jay-Z for cheating on her. Crazy stuff. ",
        },
      ],
    },
    {
      id: "music",
      label: "music",
      items: [
        {
          title: "Camp",
          creator: "Childish Gambino",
          imageSrc: "/images/bookshelf/camp.jpg",
          notes: "One of the greatest. Middle school core. Reminds me of driving back on a bus and it's dark out and everyone is sleepy and I'm listening through wired headphones,",
        },
        {
          title: "The Joshua Tree",
          creator: "U2",
          imageSrc: "/images/bookshelf/joshua-tree.jpg",
          notes: "For an Irish band these guys sure do love America. Really amazing vocals and production and such an album of the West. Big sounds creative sounds.",
        },
        {
          title: "Detour",
          creator: "Samara Cyn",
          imageSrc: "/images/bookshelf/detour.jpeg",
          notes: "She's the next big thing. Like Doechii if she didn't make TikTok music. Such a talented artist.",
        },
        {
          title: "Red",
          creator: "Taylor Swift",
          imageSrc: "/images/bookshelf/red.jpg",
          notes: "Her best work. It's a close call though.",
        },
        {
          title: "Lavender Days",
          creator: "Caamp",
          imageSrc: "/images/bookshelf/lavender-days.jpeg",
          notes: "Feels like driving through the mountains and finding yourself and falling in love.",
        },
      ],
    },
  ],
};
