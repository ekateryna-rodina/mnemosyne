import { ICard } from "../models/card";

export type UserNumber = 1 | 2 | 3;

export const users = {
  1: {
    id: "60661620194cdf0019553b65",
    email: "test@gmail.com",
  },
  2: {
    id: "60661620194cdf0019553b66",
    email: "test2@gmail.com",
  },
  3: {
    id: "60661620194cdf0019553b67",
    email: "test3@gmail.com",
  },
};

const userId1 = users[1].id;
const userId2 = users[2].id;
const userId3 = users[3].id;

export const cards: ICard[] = [
  {
    keywords: [
      {
        question: "Where is this team based?",
        answer: "Houston",
      },
    ],
    phrase:
      "The Houston Rockets are an American professional basketball team based in Houston, Texas.",
    tags: ["sport", "american", "basketball"],
    userId: userId1,
  },
  {
    keywords: [
      {
        question: "What is the name of the village?",
        answer: "Stachy",
      },
    ],
    phrase:
      "Stachy is a village in the administrative district of Gmina Wielbark, within Szczytno County, Warmian-Masurian Voivodeship, in northern Poland.",
    tags: ["geography", "poland"],
    userId: userId1,
  },
  {
    keywords: [
      {
        answer: "Loufoulakari",
      },
    ],
    phrase:
      "The Loufoulakari Falls (French: Chutes de Loufoulakari) lie 80 km south west of Brazzaville in the Republic of the Congo at the confluence of the Loufoulakari River and the Congo River.",
    tags: ["geography", "congo"],
    userId: userId1,
  },
  {
    keywords: [
      {
        answer: "William BeatonWilliam Beaton",
      },
    ],
    phrase:
      "William Beaton is a Scottish former footballer who played in the Football League for Aston Villa.",
    tags: ["sport", "football"],
    userId: userId2,
  },
  {
    keywords: [
      {
        question: "What is the name of album?",
        answer: "Me & My Piano",
      },
    ],
    phrase:
      "Me & My Piano is the debut album from American pop singer Krystal Harris as Krystal.",
    tags: ["music", "pop", "american"],
    userId: userId3,
  },
  {
    keywords: [
      {
        question: "Where this animal live?",
        answer: "Kenya",
      },
    ],
    phrase:
      "Cordylus beraduccii, the Maasai girdled lizard, is a species of girdled lizard that lives in Kenya and Tanzania.",
    tags: ["nature", "animals", "lizard"],
    userId: userId3,
  },

  {
    keywords: [
      {
        question: "What is the name of the band?",
        answer: "Green Milk from the Planet Orange",
      },
    ],
    phrase:
      "Green Milk from the Planet Orange are a band from Tokyo formed in 2001 after the breakup of the band No rest for the dead.[1] Their music combines elements of psychedelic rock, prog-rock and punk.",
    tags: ["tokyo", "rock", "psychedelic"],
    userId: userId3,
  },
  {
    keywords: [
      {
        answer: "torpedo boats",
      },
    ],
    phrase:
      "The Tumleren class was a class of three torpedo boats built for the Royal Danish Navy. ",
    tags: ["history", "war", "navy"],
    userId: userId2,
  },
  {
    keywords: [
      {
        answer: "tennis",
      },
    ],
    phrase:
      "Simon Larose is a former professional tennis player. He was Canada's top-ranked singles player for some months during 2003 and 2004.",
    tags: ["sport", "tennis"],
    userId: userId3,
  },
  {
    keywords: [
      {
        question: "What is a number the Amendment?",
        answer: "Fifth",
      },
    ],
    isPublic: true,
    phrase:
      "Murphy v. Waterfront Commission of New York Harbor, 378 U.S. 52 (1964), was a United States Supreme Court case concerning the self-incrimination clause in the Fifth Amendment to the United States Constitution. ",
    tags: ["politics", "usa", "supreme court"],
    userId: userId1,
  },

  {
    keywords: [
      {
        question: "What is name of a person?",
        answer: "Sartelli",
      },
    ],
    phrase:
      "In the fifties, Sartelli started a project at the Luigi Lolli Provincial psychiatric hospital in Imola to teach painting to patients whose creations were exhibited in an exibition in Imola in 1954: it was the first time in Italia. ",
    tags: ["art", "italy", "modern"],
    userId: userId3,
  },
  {
    keywords: [
      {
        answer: "Italian",
      },
    ],
    phrase:
      "Sartelli, one of the most important Italian artists of the nineteen-hundreds",
    tags: ["art"],
    userId: userId3,
  },
  {
    keywords: [
      {
        answer: "Costa Rica",
      },
    ],
    phrase:
      "Talamancan mythology includes the traditional beliefs of the Bribri and Cabécar, two groups of indigenous peoples in Costa Rica living in the Talamanca region. ",
    tags: ["mythology", "south america"],
    userId: userId3,
  },
  {
    keywords: [
      {
        answer: "The Cordillera de Talamanca",
      },
    ],
    phrase:
      "The Cordillera de Talamanca is a mountain range that lies on the southeast half of Costa Rica and the far west of Panama. ",
    tags: ["geography", "south america"],
    userId: userId2,
  },
  {
    keywords: [
      {
        question: "What is the name of the line?",
        answer: "Bakerloo",
      },
    ],
    phrase:
      "The Bakerloo line is a London Underground line that goes via Baker Street and Waterloo.",
    tags: ["transportation", "uk"],
    userId: userId1,
  },
  {
    keywords: [
      {
        question: "Where is it located?",
        answer: "Coney Island",
      },
    ],
    phrase:
      "The original Switchback Railway was the first roller coaster at Coney Island in Brooklyn, New York City, and one of the earliest designed for amusement in the United States.",
    // image: require("./img/Thompsons_Switchback_Railway_1884.jpeg"),
    tags: ["entertaiment", "history", "usa"],
    userId: userId3,
    isPublic: true,
  },
  {
    keywords: [
      {
        answer: "Switchback",
      },
    ],
    isPublic: true,
    phrase:
      "The original Switchback Railway was the first roller coaster at Coney Island in Brooklyn, New York City, and one of the earliest designed for amusement in the United States.",
    // image: require("./img/Thompsons_Switchback_Railway_1884.jpeg"),
    tags: ["entertaiment", "history", "usa"],
    userId: userId3,
  },
];
