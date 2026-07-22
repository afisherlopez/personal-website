export type ProjectCategoryId =
  | "currently-working-on"
  | "ml-research"
  | "other-research";

export interface ProjectItem {
  id: string;
  title: string;
  tags: string[];
  oneLineDescription: string;
  repoUrl?: string;
  pdfUrl?: string;
  imageSrc: string;
  overview: string;
  highlights?: string[];
}

export interface ProjectCategory {
  id: ProjectCategoryId;
  label: string;
  items: ProjectItem[];
}

export interface ProjectsPageContent {
  pageTitle: string;
  categories: ProjectCategory[];
}

export const projectsPageContent: ProjectsPageContent = {
  pageTitle: "projects",
  categories: [
    {
      id: "currently-working-on",
      label: "currently working on...",
      items: [
        {
          id: "ember",
          title: "EMBER",
          tags: ["Data Engineering", "Wildfire Economics"],
          oneLineDescription:
            "Quantifying and visualizing the financial impacts of wildfires on water utilities.",
          repoUrl: "https://github.com/afisherlopez/EMBER",
          imageSrc: "/images/projects/blue-forest.jpg",
          overview:
            "At Blue Forest, my co-intern Eric and I are building a scalable database in the form of an interactive Streamlit dashboard called EMBER to measure the impacts of wildfires on water resources and water utilities. I'm heading the software development, product research, and geospatial data collection, and Eric is heading the financial data collection and case study analysis. EMBER is currently only available for internal use at Blue Forest, but the goal is to make it public by the end of the summer!",
        },
      ],
    },
    {
      id: "ml-research",
      label: "ML Research",
      items: [
        {
          id: "matSeparate",
          title: "matSeparate",
          tags: ["Computer Vision"],
          oneLineDescription:
            "Developed a pipeline to perform material-based image segmentation using a novel taxonomical hierarchy approach.",
          repoUrl: "https://github.com/afisherlopez/matSeparate2.0",
          pdfUrl: "/pdfs/matSeparate-paper.pdf",
          imageSrc: "images/projects/matSeparate.jpg",
          overview:
            "For our CS 231N final project, my group and I attempted to create a faster image segmentation pipeline than the SOTA (Segment Anything Model, or SAM) by classifying patches into different material categories, at different hierarchical levels. Although our algorithm ran much more quickly than SAM, the accuracy was much lower. But lots was learned along the way!",
          highlights: [
            "Used Amazon EC2 to train a ResNet-50 and HGNN classifier for material identification with ablations of local and global context.",
            "Developed a segmentation algorithm using a material probability map, bilinear upsampling, and SLIC superpixels.",
            "Capable of segmenting either at a high hierarchical level of materials (e.g. biotic vs. abiotic) or at a finer level (e.g. granite vs. marble vs. tree bark vs. leather, etc.) .",
          ],
        },
        {
          id: "batDictionary",
          title: "Bat Dictionary",
          tags: ["Graph Neural Networks"],
          oneLineDescription:
            "Identified repeating patterns in bat communication chirps using GNNs.",
          repoUrl: "https://github.com/afisherlopez/BatDictionary",
          pdfUrl: "https://medium.com/stanford-cs224w/bat-banter-using-unsupervised-graph-based-clustering-to-discover-phrases-in-bat-communication-b5e11145dbe6?sharedUserId=annafisherlopez",
          imageSrc: "images/projects/bats.jpg",
          overview:
            "I identified recurrent patterns in recordings of bat chirps from Jasper Ridge Biological Preserve using Graph Attention Networks, Deep Modularity Networks. I demonstrated that sequences of chirps can be classified into meaningful clusters, and identified the acoustic features for each chirp which most contributed to its classification, lending interpretable acoustic traits to each cluster. To learn more, read the Medium article I wrote about the project [here](https://medium.com/stanford-cs224w/bat-banter-using-unsupervised-graph-based-clustering-to-discover-phrases-in-bat-communication-b5e11145dbe6?sharedUserId=annafisherlopez).",
        },
        {
          id: "roboPianist",
          title: "RoboPianist",
          tags: ["Reinforcement Learning"],
          oneLineDescription:
            "Investigated the effect of a scale curriculum on a Robot Pianist's ability to play Chopin’s Nocturne in E flat-Major.",
          repoUrl: "https://github.com/ericmartz15/robopianist-224r",
          pdfUrl: "/pdfs/roboPianist_paper.pdf",
          imageSrc: "images/projects/robopianist.webp",
          overview:
            "We built upon an existing RL Robot Pianist model to see what would improve or reduce piano-playing performance. Lots of classical music and ~~traumatic~~ fond memories of childhood piano playing along the way.",
          highlights: [
            "Built upon an Actor-Critic model build by Zakka et al. (see paper for more details)", 
            "Demonstrated that curriculum training, whether it be scales or arpeggios, decreases performance",
            "Showed that introducing a key press timing term into the loss function (called onset timing in the paper) improves performance"
          ]
          },
      ],
    },
    {
      id: "other-research",
      label: "Other Projects",
      items: [
        {
          id: "gravity-waves-research",
          title: "Climate Modeling Research",
          tags: ["Climate Models", "U-Net Training"],
          oneLineDescription:
            "Trained a U-Net model to represent gravity waves in three dimensions for the first time in a major climate model (ERA5).",
          imageSrc: "/images/projects/gravity-waves.jpg",
          overview:
            "Trained a U-Net model to represent gravity waves in three dimensions for the first time in a major climate model (ERA5).",
          highlights: [
            "Contributed to the international consortium [Datawave](https://datawaveproject.github.io), working on improving representation of gravity waves in climate models.",
          ],
        },
        {
          id: "physical-oceanography-research",
          title: "Physical Oceanography Research",
          tags: ["Physical Oceanography", "Data Science"],
          oneLineDescription:
            "Demonstrated the first measurements of seasonality in the Antarctic Coastal Current.",
          imageSrc: "/images/projects/physical-oceanography.jpg",
          overview:
            "Demonstrated the first measurements of seasonality in the Antarctic Coastal Current duing a summer in the Manucharyan Lab at UW's School of Oceanography.",
          highlights: [
            "Cleaned and validated data gathered from CTDs strapped to the heads of many adorable and intrepid elephant seals in the Southern Ocean.",
            "Completed a two week, in-person course called Data Science in Oceanography alongside with students from all over the country and faculty from the UW School of Oceanography.",
          ],
        },
        {
          id: "astrophysics-research",
          title: "Astrophysics Research",
          tags: ["Black Hole Research"],
          oneLineDescription:
            "Examining X-Ray emission spectra from black holes.",
          imageSrc: "/images/projects/kipac.jpeg",
          overview:
            "Did part-time undergraduate research with Dan Wilkins examining X-Ray emission spectra from the black hole at the center of the Markarian 335 galaxy.",
          highlights: [
            "Used Jupyter Notebook and XPEC to fit relativistic and non-relativistic models to X-Ray emission spectra.",
            
          ],
        },
      ],
    },
  ],
};
