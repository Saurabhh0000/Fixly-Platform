import fixlyApi from "../api/fixlyApi";

export async function sendContactMessage(payload) {
  const res = await fixlyApi.post("/api/contact", payload);
  return res.data;
}

export async function getAdminContacts(params) {
  const res = await fixlyApi.get("/api/admin/contact", { params });
  return res.data;
}

export async function updateContactStatus(id, status) {
  const res = await fixlyApi.patch(`/api/admin/contact/${id}/status`, { status });
  return res.data;
}