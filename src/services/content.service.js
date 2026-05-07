import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "cbs_content_items";

const SUBJECTS = ["Mathematics", "Science", "English", "History", "Art", "Music", "Geography", "Biology", "Computer Science", "Physical Education"];

function makeTimestamp(offsetHours) {
  return Date.now() + offsetHours * 60 * 60 * 1000;
}

const INITIAL_ITEMS = [
  {
    id: "c-001",
    title: "Introduction to Algebra",
    subject: "Mathematics",
    description: "Covering linear equations, polynomials, and basic algebraic operations for Grade 8 students.",
    fileUrl: "https://picsum.photos/seed/algebra101/800/500",
    fileName: "algebra_intro.jpg",
    teacherId: "teacher-1",
    teacherName: "Ms. Alice Teacher",
    status: "approved",
    rejectionReason: null,
    startTime: makeTimestamp(-3),
    endTime: makeTimestamp(10),
    rotationDuration: 30,
    createdAt: makeTimestamp(-48),
  },
  {
    id: "c-002",
    title: "The Water Cycle Explained",
    subject: "Science",
    description: "A visual guide to evaporation, condensation, and precipitation processes.",
    fileUrl: "https://picsum.photos/seed/watercycle/800/500",
    fileName: "water_cycle.jpg",
    teacherId: "teacher-1",
    teacherName: "Ms. Alice Teacher",
    status: "approved",
    rejectionReason: null,
    startTime: makeTimestamp(-1),
    endTime: makeTimestamp(8),
    rotationDuration: 20,
    createdAt: makeTimestamp(-36),
  },
  {
    id: "c-003",
    title: "Shakespeare's Major Works",
    subject: "English",
    description: "An overview of Hamlet, Macbeth, and A Midsummer Night's Dream.",
    fileUrl: "https://picsum.photos/seed/shakespeare/800/500",
    fileName: "shakespeare.jpg",
    teacherId: "teacher-1",
    teacherName: "Ms. Alice Teacher",
    status: "approved",
    rejectionReason: null,
    startTime: makeTimestamp(24),
    endTime: makeTimestamp(36),
    rotationDuration: 25,
    createdAt: makeTimestamp(-24),
  },
  {
    id: "c-004",
    title: "World War II Timeline",
    subject: "History",
    description: "Key events from 1939 to 1945 visualised on an interactive timeline.",
    fileUrl: "https://picsum.photos/seed/ww2history/800/500",
    fileName: "ww2_timeline.jpg",
    teacherId: "teacher-1",
    teacherName: "Ms. Alice Teacher",
    status: "pending",
    rejectionReason: null,
    startTime: makeTimestamp(48),
    endTime: makeTimestamp(60),
    rotationDuration: 15,
    createdAt: makeTimestamp(-12),
  },
  {
    id: "c-005",
    title: "Watercolour Techniques Poster",
    subject: "Art",
    description: "Step-by-step guide to wet-on-wet and dry brush watercolour techniques.",
    fileUrl: "https://picsum.photos/seed/watercolor/800/500",
    fileName: "watercolour.jpg",
    teacherId: "teacher-1",
    teacherName: "Ms. Alice Teacher",
    status: "pending",
    rejectionReason: null,
    startTime: makeTimestamp(12),
    endTime: makeTimestamp(24),
    rotationDuration: 10,
    createdAt: makeTimestamp(-8),
  },
  {
    id: "c-006",
    title: "Music Theory: Notes & Scales",
    subject: "Music",
    description: "Understanding treble clef notation, major and minor scales for beginners.",
    fileUrl: "https://picsum.photos/seed/musicnotes/800/500",
    fileName: "music_theory.jpg",
    teacherId: "teacher-1",
    teacherName: "Ms. Alice Teacher",
    status: "rejected",
    rejectionReason: "Image resolution is too low for the display boards. Please re-upload at 1920×1080 or higher.",
    startTime: makeTimestamp(-72),
    endTime: makeTimestamp(-60),
    rotationDuration: 20,
    createdAt: makeTimestamp(-96),
  },
  {
    id: "c-007",
    title: "Ancient Egyptian Civilisation",
    subject: "History",
    description: "Pyramids, pharaohs, hieroglyphics, and life along the River Nile.",
    fileUrl: "https://picsum.photos/seed/egypt/800/500",
    fileName: "ancient_egypt.jpg",
    teacherId: "teacher-1",
    teacherName: "Ms. Alice Teacher",
    status: "approved",
    rejectionReason: null,
    startTime: makeTimestamp(-50),
    endTime: makeTimestamp(-40),
    rotationDuration: 30,
    createdAt: makeTimestamp(-120),
  },
  {
    id: "c-008",
    title: "Photosynthesis Deep Dive",
    subject: "Biology",
    description: "Chlorophyll, light reactions, and the Calvin cycle explained with diagrams.",
    fileUrl: "https://picsum.photos/seed/photosynthesis/800/500",
    fileName: "photosynthesis.jpg",
    teacherId: "teacher-1",
    teacherName: "Ms. Alice Teacher",
    status: "pending",
    rejectionReason: null,
    startTime: makeTimestamp(6),
    endTime: makeTimestamp(14),
    rotationDuration: 25,
    createdAt: makeTimestamp(-6),
  },
  {
    id: "c-009",
    title: "Grammar & Syntax Rules",
    subject: "English",
    description: "Subject-verb agreement, punctuation, and common grammar pitfalls.",
    fileUrl: "https://picsum.photos/seed/grammar/800/500",
    fileName: "grammar.jpg",
    teacherId: "teacher-1",
    teacherName: "Ms. Alice Teacher",
    status: "rejected",
    rejectionReason: "Content overlaps with the existing Grammar poster already on display. Please upload something different.",
    startTime: makeTimestamp(-80),
    endTime: makeTimestamp(-70),
    rotationDuration: 15,
    createdAt: makeTimestamp(-100),
  },
  {
    id: "c-010",
    title: "Geometry: Shapes & Areas",
    subject: "Mathematics",
    description: "Formulas for area and perimeter of triangles, circles, and polygons.",
    fileUrl: "https://picsum.photos/seed/geometry/800/500",
    fileName: "geometry.jpg",
    teacherId: "teacher-1",
    teacherName: "Ms. Alice Teacher",
    status: "pending",
    rejectionReason: null,
    startTime: makeTimestamp(36),
    endTime: makeTimestamp(48),
    rotationDuration: 20,
    createdAt: makeTimestamp(-4),
  },
  {
    id: "c-011",
    title: "The Solar System",
    subject: "Science",
    description: "Planet sizes, distances from the Sun, and key facts about each planet.",
    fileUrl: "https://picsum.photos/seed/solarsystem/800/500",
    fileName: "solar_system.jpg",
    teacherId: "teacher-1",
    teacherName: "Ms. Alice Teacher",
    status: "approved",
    rejectionReason: null,
    startTime: makeTimestamp(-2),
    endTime: makeTimestamp(12),
    rotationDuration: 30,
    createdAt: makeTimestamp(-60),
  },
  {
    id: "c-012",
    title: "Figurative Language in Poetry",
    subject: "English",
    description: "Simile, metaphor, personification, and alliteration with vivid examples.",
    fileUrl: "https://picsum.photos/seed/poetry/800/500",
    fileName: "poetry.jpg",
    teacherId: "teacher-1",
    teacherName: "Ms. Alice Teacher",
    status: "pending",
    rejectionReason: null,
    startTime: makeTimestamp(60),
    endTime: makeTimestamp(72),
    rotationDuration: 15,
    createdAt: makeTimestamp(-2),
  },
  {
    id: "c-013",
    title: "The French Revolution",
    subject: "History",
    description: "Causes, key figures (Robespierre, Marie Antoinette), and lasting impact.",
    fileUrl: "https://picsum.photos/seed/frenchrev/800/500",
    fileName: "french_revolution.jpg",
    teacherId: "teacher-1",
    teacherName: "Ms. Alice Teacher",
    status: "rejected",
    rejectionReason: "The text on this poster is too small to read at the standard viewing distance. Please increase font size.",
    startTime: makeTimestamp(-90),
    endTime: makeTimestamp(-78),
    rotationDuration: 20,
    createdAt: makeTimestamp(-110),
  },
  {
    id: "c-014",
    title: "Basic Drawing Techniques",
    subject: "Art",
    description: "Hatching, cross-hatching, stippling, and blending for pencil sketches.",
    fileUrl: "https://picsum.photos/seed/drawing/800/500",
    fileName: "drawing.jpg",
    teacherId: "teacher-1",
    teacherName: "Ms. Alice Teacher",
    status: "approved",
    rejectionReason: null,
    startTime: makeTimestamp(-4),
    endTime: makeTimestamp(6),
    rotationDuration: 25,
    createdAt: makeTimestamp(-72),
  },
  {
    id: "c-015",
    title: "Rhythm and Melody Basics",
    subject: "Music",
    description: "Time signatures, note values, and how melody is constructed.",
    fileUrl: "https://picsum.photos/seed/rhythm/800/500",
    fileName: "rhythm.jpg",
    teacherId: "teacher-1",
    teacherName: "Ms. Alice Teacher",
    status: "pending",
    rejectionReason: null,
    startTime: makeTimestamp(18),
    endTime: makeTimestamp(30),
    rotationDuration: 20,
    createdAt: makeTimestamp(-10),
  },
  {
    id: "c-016",
    title: "Human Digestive System",
    subject: "Biology",
    description: "Organs, enzymes, and the journey of food from mouth to intestine.",
    fileUrl: "https://picsum.photos/seed/digestive/800/500",
    fileName: "digestive.jpg",
    teacherId: "teacher-1",
    teacherName: "Ms. Alice Teacher",
    status: "rejected",
    rejectionReason: "Diagram labels are inconsistent with the curriculum terminology we use. Please revise before resubmitting.",
    startTime: makeTimestamp(-100),
    endTime: makeTimestamp(-88),
    rotationDuration: 30,
    createdAt: makeTimestamp(-130),
  },
  {
    id: "c-017",
    title: "Reading Comprehension Strategies",
    subject: "English",
    description: "Skimming, scanning, inferring, and summarising for exam success.",
    fileUrl: "https://picsum.photos/seed/reading/800/500",
    fileName: "reading.jpg",
    teacherId: "teacher-1",
    teacherName: "Ms. Alice Teacher",
    status: "pending",
    rejectionReason: null,
    startTime: makeTimestamp(72),
    endTime: makeTimestamp(84),
    rotationDuration: 15,
    createdAt: makeTimestamp(-1),
  },
  {
    id: "c-018",
    title: "Statistics and Probability",
    subject: "Mathematics",
    description: "Mean, median, mode, probability trees, and data interpretation.",
    fileUrl: "https://picsum.photos/seed/statistics/800/500",
    fileName: "statistics.jpg",
    teacherId: "teacher-1",
    teacherName: "Ms. Alice Teacher",
    status: "approved",
    rejectionReason: null,
    startTime: makeTimestamp(-5),
    endTime: makeTimestamp(7),
    rotationDuration: 25,
    createdAt: makeTimestamp(-84),
  },
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay() {
  return delay(800 + Math.random() * 700);
}

function getItems() {
  if (typeof window === "undefined") return INITIAL_ITEMS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    /* empty */
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ITEMS));
  return INITIAL_ITEMS;
}

function saveItems(items) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export async function fetchContent({ teacherId, status, search, page = 1, pageSize = 10 }) {
  await randomDelay();
  let items = getItems();
  if (teacherId) items = items.filter((c) => c.teacherId === teacherId);
  if (status && status !== "all") items = items.filter((c) => c.status === status);
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (c) =>
        (c.title ?? "").toLowerCase().includes(q) ||
        (c.subject ?? "").toLowerCase().includes(q)
    );
  }
  const total = items.length;
  const paged = items.slice((page - 1) * pageSize, page * pageSize);
  return { items: paged, total };
}

export async function fetchContentStats(teacherId) {
  await randomDelay();
  const items = getItems().filter((c) =>
    teacherId ? c.teacherId === teacherId : true
  );
  return {
    total: items.length,
    pending: items.filter((c) => c.status === "pending").length,
    approved: items.filter((c) => c.status === "approved").length,
    rejected: items.filter((c) => c.status === "rejected").length,
  };
}

export async function fetchRecentContent({ teacherId, limit = 5 }) {
  await randomDelay();
  let items = getItems();
  if (teacherId) items = items.filter((c) => c.teacherId === teacherId);
  return items.slice(0, limit);
}

export async function fetchTeacherLiveContent(teacherId) {
  await randomDelay();
  return getItems().filter(
    (c) => c.teacherId === teacherId && c.status === "approved"
  );
}

export async function uploadContent({ title, subject, description, file, startTime, endTime, rotationDuration, teacherId, teacherName }) {
  await delay(1200);
  if (!file || !["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
    throw new Error("File must be JPG, PNG, or GIF");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("File must be smaller than 10 MB");
  }
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  if (end <= start) {
    throw new Error("End time must be after start time");
  }

  const fileUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const newItem = {
    id: uuidv4(),
    title,
    subject,
    description: description ?? "",
    fileUrl,
    fileName: file.name,
    teacherId,
    teacherName,
    status: "pending",
    rejectionReason: null,
    startTime: start,
    endTime: end,
    rotationDuration: Number(rotationDuration) || 10,
    createdAt: Date.now(),
  };

  const items = getItems();
  items.unshift(newItem);
  saveItems(items);
  return newItem;
}

export function getScheduleStatus(startTime, endTime) {
  const now = Date.now();
  if (now < startTime) return "scheduled";
  if (now > endTime) return "expired";
  return "active";
}

export { SUBJECTS };
