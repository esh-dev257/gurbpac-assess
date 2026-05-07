// Mock Approval Service
import { fetchContentById } from "./content.service";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getContentItems() {
  return JSON.parse(localStorage.getItem("contentItems") || "[]");
}

function saveContentItems(items) {
  localStorage.setItem("contentItems", JSON.stringify(items));
}

export async function approveContent(id) {
  await delay(1000);
  const items = getContentItems();
  const idx = items.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Content not found");
  items[idx].status = "approved";
  items[idx].rejectionReason = "";
  saveContentItems(items);
  return items[idx];
}

export async function rejectContent(id, reason) {
  await delay(1000);
  if (!reason) throw new Error("Rejection reason required");
  const items = getContentItems();
  const idx = items.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Content not found");
  items[idx].status = "rejected";
  items[idx].rejectionReason = reason;
  saveContentItems(items);
  return items[idx];
}
