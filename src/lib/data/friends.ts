export type Friend = { name: string; initials: string; color: string };

// Placeholder social graph until club membership is backed by real accounts.
export const FRIENDS: Friend[] = [
  { name: "Jennifer Petrone", initials: "JP", color: "#FF6FA0" },
  { name: "Leanne Wolfson", initials: "LW", color: "#6FA4F0" },
  { name: "Cooper Wolfson", initials: "CW", color: "#8C6FF0" },
  { name: "Ronnie Petrone", initials: "RP", color: "#4E9E8C" },
  { name: "Brad Frey", initials: "BF", color: "#E0A23E" },
  { name: "Alissa Petrone", initials: "AP", color: "#B06FDB" },
  { name: "Ben Mcgrail", initials: "BM", color: "#3EA0A0" },
  { name: "Walker Wolfson", initials: "WW", color: "#8C6FF0" },
];

export const ME = "Walker Wolfson";

export const DISCOVER_CLUBS_INITIAL = [
  { id: "nycbar", name: "NYC Bar Athletes", members: 482 },
  { id: "goggins", name: "Goggins Disciples", members: 1290 },
  { id: "beastmode", name: "Beast Mode Bros", members: 76 },
  { id: "sunrise", name: "Sunrise Calisthenics", members: 214 },
];
