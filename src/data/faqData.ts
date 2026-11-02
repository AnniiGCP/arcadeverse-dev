export interface FAQItemData {
  id: string;
  question: string;
  answer: string;
}

export const faqItems: FAQItemData[] = [
  {
    id: "faq-what-is-arcade",
    question: "What is Google Cloud Arcade and how do I earn free swag?",
    answer:
      "Google Cloud Arcade is a gamified learning program where participants complete Google Cloud activities such as games, skill badges, and other challenges to earn Arcade points. Depending on the program rules and your accumulated points, you may become eligible for milestone rewards or swag when the official redemption window opens.",
  },
  {
    id: "faq-points-calculation",
    question:
      "How are Arcade points calculated for games, skill badges, and milestones?",
    answer:
      "Arcade points are awarded according to the rules of the current Google Cloud Arcade program. Different activities, including games, skill badges, and milestone achievements, can have different point values. ArcadeVerse helps you calculate and track your points based on the information you provide and the applicable Arcade scoring rules.",
  },
  {
    id: "faq-calculate-points",
    question: "How do I calculate my Arcade points using ArcadeVerse?",
    answer:
      "Open ArcadeVerse and use the Arcade Points Calculator. Enter your completed games, skill badges, and other applicable achievements. ArcadeVerse calculates your estimated points and helps you understand your progress toward Arcade milestones.",
  },
  {
    id: "faq-affiliation",
    question: "Is ArcadeVerse officially affiliated with Google Cloud?",
    answer:
      "No. ArcadeVerse is an independent community-built tool and is not officially affiliated with, endorsed by, or sponsored by Google Cloud or Google. Google Cloud Arcade, Google Cloud, and related trademarks belong to their respective owners.",
  },
  {
    id: "faq-facilitator-program",
    question: "What is the Google Cloud Arcade Facilitator Program?",
    answer:
      "The Google Cloud Arcade Facilitator Program is a program associated with Google Cloud Arcade that provides facilitators with opportunities to participate in and support the Arcade learning community. Facilitator activities and point systems may differ from the regular Arcade participant program, so always refer to the current official program information for the latest rules.",
  },
  {
    id: "faq-prize-counter",
    question: "When does the Arcade Prize Counter open for swag redemption?",
    answer:
      "The Arcade Prize Counter opens according to the schedule announced by the official Google Cloud Arcade program. Opening dates, available rewards, eligibility requirements, and redemption rules can change between programs or seasons. Always check the official Google Cloud Arcade announcements for the latest information.",
  },
  {
    id: "faq-missing-badges",
    question: "Why are my recent badges not showing up on ArcadeVerse?",
    answer:
      "There can be a delay between completing a Google Cloud skill badge and its information becoming available through the sources used by ArcadeVerse. Your badge may also not appear if your profile information is unavailable, the badge has not been indexed yet, or the underlying Google Cloud data has not updated. Try checking again later and make sure the relevant information is publicly accessible where required.",
  },
  {
    id: "faq-multiple-accounts",
    question: "Can I track multiple Google Cloud Arcade accounts?",
    answer:
      "ArcadeVerse is designed to help you track your Arcade progress, but account/profile tracking depends on the information and functionality currently supported by the platform. Make sure you only track accounts and profiles that you are authorized to use.",
  },
  {
    id: "faq-free-to-use",
    question: "Is ArcadeVerse free to use?",
    answer:
      "Yes. ArcadeVerse is designed as a free community tool for Google Cloud Arcade participants. Some features may depend on the availability of external Google Cloud data or services.",
  },
  {
    id: "faq-join-community",
    question: "How can I join the ArcadeVerse community?",
    answer:
      "You can join the ArcadeVerse community through the community channels and links provided on the website. Follow ArcadeVerse for updates about Google Cloud Arcade, new tools, calculators, badge tracking, milestones, and other community resources.",
  },
];
