import fixlyApi from "./fixlyApi";

export const getMyProfile = () => fixlyApi.get("/api/profile/me");

export const updateMyProfile = (data) =>
  fixlyApi.put("/api/profile", data);

export const uploadProfilePicture = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return fixlyApi.post("/api/profile/picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const removeProfilePicture = () =>
  fixlyApi.delete("/api/profile/picture");

export const getMyAddresses = (userId) =>
  fixlyApi.get(`/api/addresses/${userId}`);

export const addAddress = (userId, data) =>
  fixlyApi.post(`/api/addresses/${userId}`, data);

export const updateAddress = (addressId, data) =>
  fixlyApi.put(`/api/addresses/${addressId}`, data);

export const deleteAddress = (addressId) =>
  fixlyApi.delete(`/api/addresses/${addressId}`);
