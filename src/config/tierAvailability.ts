export interface RevealedItem {
  id: string;
  name: string;
  imageUrl?: string;
  link?: string;
}

export interface SwagTierConfig {
  id: string;
  name: string;
  pointsRequired: number;
  remainingSpots: number;
  totalSpots: number;
  remainingPercentage: number;
  spotsLeftLabel: string;
  image: string;
  description: string;
  revealedCount: number;
  revealedItems: RevealedItem[];
}

export const TIER_AVAILABILITY_CONFIG: SwagTierConfig[] = [
  {
    id: "trooper",
    name: "Trooper Tier",
    pointsRequired: 50,
    remainingSpots: 3716,
    totalSpots: 6000,
    remainingPercentage: 61.93,
    spotsLeftLabel: "3,716 / 6,000 spots left",
    image: "https://services.google.com/fh/files/misc/trooper261026.png",
    description: "Official merchandise and rewards for Trooper Tier.",
    revealedCount: 2,
    revealedItems: [
      {
        id: "trooper-magic-mug",
        name: "Arcade Magic Mug",
        imageUrl: "/images/updates/arcade-magic-mug.gif",
        link: "https://discuss.google.dev/t/swag-drop-the-arcade-magic-mug/407455",
      },
      {
        id: "trooper-travel-bottle",
        name: "Arcade Travel Bottle",
        imageUrl: "/images/updates/arcade-travel-bottle.gif",
        link: "https://discuss.google.dev/t/swag-drop-the-arcade-travel-bottle/405316",
      },
    ],
  },
  {
    id: "ranger",
    name: "Ranger Tier",
    pointsRequired: 75,
    remainingSpots: 1890,
    totalSpots: 4000,
    remainingPercentage: 47.25,
    spotsLeftLabel: "1,890 / 4,000 spots left",
    image: "https://services.google.com/fh/files/misc/ranger261026.png",
    description: "Official merchandise and rewards for Ranger Tier.",
    revealedCount: 3,
    revealedItems: [
      {
        id: "ranger-magic-mug",
        name: "Arcade Magic Mug",
        imageUrl: "/images/updates/arcade-magic-mug.gif",
        link: "https://discuss.google.dev/t/swag-drop-the-arcade-magic-mug/407455",
      },
      {
        id: "ranger-travel-bottle",
        name: "Arcade Travel Bottle",
        imageUrl: "/images/updates/arcade-travel-bottle.gif",
        link: "https://discuss.google.dev/t/swag-drop-the-arcade-travel-bottle/405316",
      },
      {
        id: "ranger-backpack",
        name: "Arcade Backpack",
        imageUrl: "/images/updates/arcade-backpack.gif",
        link: "https://discuss.google.dev/t/swag-drop-the-arcade-backpack/399232",
      },
    ],
  },
  {
    id: "champion",
    name: "Champion Tier",
    pointsRequired: 95,
    remainingSpots: 447,
    totalSpots: 3000,
    remainingPercentage: 14.9,
    spotsLeftLabel: "447 / 3,000 spots left",
    image: "https://services.google.com/fh/files/misc/champion_legend16.png",
    description: "Official merchandise and rewards for Champion Tier.",
    revealedCount: 2,
    revealedItems: [
      {
        id: "champion-popup-pro",
        name: "Arcade Popup Pro",
        imageUrl: "/images/updates/arcade-popup-pro.gif",
        link: "https://discuss.google.dev/t/swag-drop-the-arcade-popup-pro/403522",
      },
      {
        id: "champion-shield-jacket",
        name: "Arcade Weather Shield Jacket",
        imageUrl: "/images/updates/weather-shield-jacket.gif",
        link: "https://discuss.google.dev/t/swag-drop-the-arcade-weather-shield-jacket/397353",
      },
    ],
  },
  {
    id: "legend",
    name: "Legend Tier",
    pointsRequired: 120,
    remainingSpots: 1151,
    totalSpots: 2500,
    remainingPercentage: 46.04,
    spotsLeftLabel: "1,151 / 2,500 spots left",
    image: "https://services.google.com/fh/files/misc/champion_legend16.png",
    description: "Official merchandise and rewards for Legend Tier.",
    revealedCount: 2,
    revealedItems: [
      {
        id: "legend-popup-pro",
        name: "Arcade Popup Pro",
        imageUrl: "/images/updates/arcade-popup-pro.gif",
        link: "https://discuss.google.dev/t/swag-drop-the-arcade-popup-pro/403522",
      },
      {
        id: "legend-shield-jacket",
        name: "Arcade Weather Shield Jacket",
        imageUrl: "/images/updates/weather-shield-jacket.gif",
        link: "https://discuss.google.dev/t/swag-drop-the-arcade-weather-shield-jacket/397353",
      },
    ],
  },
];
