export interface LeaderboardEntry {
  profileUrl: string;
  name: string;
  photoUrl?: string;
  points: number;
  badges: number;
  lastUpdated: string;
  rank?: number;
  isDemo?: boolean;
}

const RAW_LEADERBOARD_DATA: LeaderboardEntry[] = [
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user1",
    name: "Irwansyah",
    photoUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    points: 128,
    badges: 94,
    lastUpdated: "2026-09-24T18:30:00.000Z",
    rank: 1,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user2",
    name: "Ranith Reddy",
    photoUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    points: 126,
    badges: 92,
    lastUpdated: "2026-09-24T17:15:00.000Z",
    rank: 2,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user3",
    name: "Janakiram N",
    photoUrl:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    points: 124.5,
    badges: 90,
    lastUpdated: "2026-09-24T16:45:00.000Z",
    rank: 3,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user4",
    name: "Nandan R",
    photoUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    points: 123,
    badges: 89,
    lastUpdated: "2026-09-24T15:20:00.000Z",
    rank: 4,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user5",
    name: "TËJÃSSVÎ",
    photoUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    points: 121,
    badges: 87,
    lastUpdated: "2026-09-24T14:10:00.000Z",
    rank: 5,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user6",
    name: "CloudNinja",
    points: 120,
    badges: 86,
    lastUpdated: "2026-09-24T13:40:00.000Z",
    rank: 6,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user7",
    name: "TheArchitect",
    points: 119,
    badges: 85,
    lastUpdated: "2026-09-24T12:30:00.000Z",
    rank: 7,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user8",
    name: "DataWizard",
    points: 117.5,
    badges: 84,
    lastUpdated: "2026-09-24T11:15:00.000Z",
    rank: 8,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user9",
    name: "CodeQueen",
    points: 116,
    badges: 83,
    lastUpdated: "2026-09-24T10:05:00.000Z",
    rank: 9,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user10",
    name: "DevOpsGuru",
    points: 115,
    badges: 82,
    lastUpdated: "2026-09-24T09:20:00.000Z",
    rank: 10,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user11",
    name: "AIEnthusiast",
    points: 114,
    badges: 81,
    lastUpdated: "2026-09-23T22:50:00.000Z",
    rank: 11,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user12",
    name: "SecurityPro",
    points: 113,
    badges: 80,
    lastUpdated: "2026-09-23T21:10:00.000Z",
    rank: 12,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user13",
    name: "K8sMaster",
    points: 112,
    badges: 79,
    lastUpdated: "2026-09-23T19:35:00.000Z",
    rank: 13,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user14",
    name: "MLExpert",
    points: 111,
    badges: 78,
    lastUpdated: "2026-09-23T18:15:00.000Z",
    rank: 14,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user15",
    name: "CloudSurfer",
    points: 110,
    badges: 77,
    lastUpdated: "2026-09-23T16:40:00.000Z",
    rank: 15,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user16",
    name: "TerraformKing",
    points: 109,
    badges: 76,
    lastUpdated: "2026-09-23T15:20:00.000Z",
    rank: 16,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user17",
    name: "DataScientist",
    points: 108,
    badges: 75,
    lastUpdated: "2026-09-23T14:00:00.000Z",
    rank: 17,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user18",
    name: "APIWizard",
    points: 107,
    badges: 74,
    lastUpdated: "2026-09-23T12:45:00.000Z",
    rank: 18,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user19",
    name: "BigQueryQueen",
    points: 106,
    badges: 73,
    lastUpdated: "2026-09-23T11:10:00.000Z",
    rank: 19,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user20",
    name: "ContainerKing",
    points: 105,
    badges: 72,
    lastUpdated: "2026-09-23T09:30:00.000Z",
    rank: 20,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user21",
    name: "GitHubStar",
    points: 104,
    badges: 71,
    lastUpdated: "2026-09-22T22:15:00.000Z",
    rank: 21,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user22",
    name: "VisionAPI",
    points: 103,
    badges: 70,
    lastUpdated: "2026-09-22T20:50:00.000Z",
    rank: 22,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user23",
    name: "NetworkNinja",
    photoUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    points: 102,
    badges: 69,
    lastUpdated: "2026-09-22T19:25:00.000Z",
    rank: 23,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user24",
    name: "FirebaseGuru",
    photoUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    points: 101.5,
    badges: 68,
    lastUpdated: "2026-09-22T17:40:00.000Z",
    rank: 24,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user25",
    name: "VertexAI",
    points: 101,
    badges: 68,
    lastUpdated: "2026-09-22T16:10:00.000Z",
    rank: 25,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user26",
    name: "AppEngine",
    points: 100,
    badges: 67,
    lastUpdated: "2026-09-22T14:30:00.000Z",
    rank: 26,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user27",
    name: "CloudRun",
    points: 99,
    badges: 66,
    lastUpdated: "2026-09-22T13:00:00.000Z",
    rank: 27,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user28",
    name: "GKEMaster",
    points: 98.5,
    badges: 65,
    lastUpdated: "2026-09-22T11:20:00.000Z",
    rank: 28,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user29",
    name: "PubSubPro",
    points: 98,
    badges: 65,
    lastUpdated: "2026-09-22T09:40:00.000Z",
    rank: 29,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user30",
    name: "SpannerHero",
    points: 97,
    badges: 64,
    lastUpdated: "2026-09-21T21:50:00.000Z",
    rank: 30,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user31",
    name: "DataflowAce",
    points: 96,
    badges: 63,
    lastUpdated: "2026-09-21T20:15:00.000Z",
    rank: 31,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user32",
    name: "CloudSQLDev",
    points: 95.5,
    badges: 63,
    lastUpdated: "2026-09-21T18:30:00.000Z",
    rank: 32,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user33",
    name: "IAMSpecialist",
    points: 95,
    badges: 62,
    lastUpdated: "2026-09-21T16:55:00.000Z",
    rank: 33,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user34",
    name: "ComputeEngineDev",
    photoUrl:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    points: 94,
    badges: 62,
    lastUpdated: "2026-09-21T15:10:00.000Z",
    rank: 34,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user35",
    name: "CloudStoragePro",
    points: 93.5,
    badges: 61,
    lastUpdated: "2026-09-21T13:25:00.000Z",
    rank: 35,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user36",
    name: "LookerMaster",
    points: 93,
    badges: 61,
    lastUpdated: "2026-09-21T11:40:00.000Z",
    rank: 36,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user37",
    name: "CloudArmorElite",
    points: 92,
    badges: 60,
    lastUpdated: "2026-09-21T09:50:00.000Z",
    rank: 37,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user38",
    name: "DataprocDev",
    points: 91.5,
    badges: 60,
    lastUpdated: "2026-09-20T22:30:00.000Z",
    rank: 38,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user39",
    name: "CloudComposerAce",
    points: 91,
    badges: 59,
    lastUpdated: "2026-09-20T20:45:00.000Z",
    rank: 39,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user40",
    name: "AnthosPioneer",
    points: 90,
    badges: 59,
    lastUpdated: "2026-09-20T19:00:00.000Z",
    rank: 40,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user41",
    name: "AlloyDBChampion",
    points: 89.5,
    badges: 58,
    lastUpdated: "2026-09-20T17:15:00.000Z",
    rank: 41,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user42",
    name: "ArtifactRegistryPro",
    points: 89,
    badges: 58,
    lastUpdated: "2026-09-20T15:30:00.000Z",
    rank: 42,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user43",
    name: "CloudBuildHero",
    points: 88,
    badges: 57,
    lastUpdated: "2026-09-20T13:45:00.000Z",
    rank: 43,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user44",
    name: "SecretManagerDev",
    points: 87.5,
    badges: 57,
    lastUpdated: "2026-09-20T12:00:00.000Z",
    rank: 44,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user45",
    name: "EventarcExpert",
    points: 87,
    badges: 56,
    lastUpdated: "2026-09-20T10:15:00.000Z",
    rank: 45,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user46",
    name: "CloudDeployPro",
    points: 86.5,
    badges: 56,
    lastUpdated: "2026-09-19T21:30:00.000Z",
    rank: 46,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user47",
    name: "CloudDNSWizard",
    points: 86,
    badges: 55,
    lastUpdated: "2026-09-19T19:40:00.000Z",
    rank: 47,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user48",
    name: "CloudNATNinja",
    points: 85.5,
    badges: 55,
    lastUpdated: "2026-09-19T17:50:00.000Z",
    rank: 48,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user49",
    name: "CloudCDNScout",
    points: 85,
    badges: 54,
    lastUpdated: "2026-09-19T15:20:00.000Z",
    rank: 49,
  },
  {
    profileUrl: "https://www.cloudskillsboost.google/public_profiles/user50",
    name: "ArcadeRookie",
    points: 85,
    badges: 54,
    lastUpdated: "2026-09-19T13:10:00.000Z",
    rank: 50,
  },
];

export const INITIAL_LEADERBOARD_DATA: LeaderboardEntry[] =
  RAW_LEADERBOARD_DATA.map((entry, index) => {
    const url = entry.profileUrl.toLowerCase();
    const isConfirmedReal =
      index < 5 ||
      url.endsWith("/user1") ||
      url.endsWith("/user2") ||
      url.endsWith("/user3") ||
      url.endsWith("/user4") ||
      url.endsWith("/user5") ||
      url.endsWith("/user23") ||
      url.endsWith("/user24") ||
      url.endsWith("/user34") ||
      !url.includes("/public_profiles/user");

    return {
      ...entry,
      isDemo: !isConfirmedReal,
      photoUrl: isConfirmedReal ? entry.photoUrl : undefined,
    };
  });
