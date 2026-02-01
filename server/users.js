export const users = new Map();

const COLORS = [
  "#47e73c",
  "#db34bf",
  "#414442",
  "#88580d",
  "#9b59b6",
  "#1abc9c",
  "#e74c3c",
  "#f1c40f",
  "#3498db",
  "#e67e22",
];

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function addUser(socketId) {
  const user = {
    id: socketId,
    color: getRandomColor(),
  };
  users.set(socketId, user);
  return user;
}

export function removeUser(socketId) {
  users.delete(socketId);
}

export function getAllUsers() {
  return Array.from(users.values());
}

