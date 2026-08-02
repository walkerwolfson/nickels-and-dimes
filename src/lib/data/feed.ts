export type FeedPost = {
  id: number;
  person: string;
  initials: string;
  color: string;
  time: string;
  lines: string[];
  likes: number;
  comments: number;
};

// Placeholder feed until club membership + real posts are wired up.
export const DEMO_FEED: FeedPost[] = [
  {
    id: 1,
    person: "Jennifer Petrone",
    initials: "JP",
    color: "#FF6FA0",
    time: "1h ago",
    lines: ["120 push-ups", "40 pull-ups"],
    likes: 6,
    comments: 2,
  },
  {
    id: 2,
    person: "Cooper Wolfson",
    initials: "CW",
    color: "#8C6FF0",
    time: "3h ago",
    lines: ["Nickels and Dimes — 12 rounds"],
    likes: 4,
    comments: 1,
  },
  {
    id: 3,
    person: "Leanne Wolfson",
    initials: "LW",
    color: "#6FA4F0",
    time: "5h ago",
    lines: ["Plank — 4:12"],
    likes: 3,
    comments: 0,
  },
  {
    id: 4,
    person: "Brad Frey",
    initials: "BF",
    color: "#E0A23E",
    time: "Yesterday",
    lines: ["Murph — completed"],
    likes: 9,
    comments: 3,
  },
];
