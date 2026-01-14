// src/services/inventoryService.js
const API_URL = "https://localhost:5001/api/Inventory";
const usersAPI_URL = "https://localhost:5001/api/Users";

export async function getAllInventory() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch inventory");
  return res.json();
}

export async function getInventoryById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Item not found");
  return res.json();
}

export async function createInventory(item) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Failed to create item");
  return res.json();
}

export async function updateInventory(id, item) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Failed to update item");
}

export async function deleteInventory(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete item");
}

export async function createUser(user) {
const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Failed to create item");
  return res.json();
}