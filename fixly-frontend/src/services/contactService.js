import fixlyApi from "../api/fixlyApi";

export async function sendContactMessage(payload) {
  const res = await fixlyApi.post("/api/contact", payload);
  return res.data;
}