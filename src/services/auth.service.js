// Mock Auth Service
const USERS = [
  {
    id: "teacher-1",
    email: "teacher@school.com",
    password: "password123",
    role: "teacher",
    name: "Ms. Alice Teacher",
  },
  {
    id: "principal-1",
    email: "principal@school.com",
    password: "password123",
    role: "principal",
    name: "Mr. Bob Principal",
  },
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function login({ email, password }) {
  await delay(900 + Math.random() * 600);
  const user = USERS.find((u) => u.email === email && u.password === password);
  if (!user) {
    throw new Error("Invalid credentials");
  }
  // Simulate JWT
  const token = btoa(`${user.id}:${user.role}:${Date.now()}`);
  return {
    token,
    user: { id: user.id, email: user.email, role: user.role, name: user.name },
  };
}

export async function getUserFromToken(token) {
  await delay(500);
  try {
    const [id] = atob(token).split(":");
    const user = USERS.find((u) => u.id === id);
    if (!user) throw new Error("Invalid token");
    return { id: user.id, email: user.email, role: user.role, name: user.name };
  } catch {
    throw new Error("Invalid token");
  }
}

export function getUserFromTokenSync(token) {
  try {
    const [id] = atob(token).split(":");
    const user = USERS.find((u) => u.id === id);
    if (!user) return null;
    return { id: user.id, email: user.email, role: user.role, name: user.name };
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}
