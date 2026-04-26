import apiClient from "../axios";

// 🎯 GET ALL
export const getBeds = async () => {
  const res = await apiClient.get("/BedManagement");

  // 🔥 mapping من backend → UI
  return res.data.map(item => ({
    id: item.id,
    ward: item.name,
    totalBeds: item.totalBeds,
    availableBeds: item.availableBeds,
    usedBeds: item.totalBeds - item.availableBeds,
  }));
};

// 🔼 increase
export const increaseBed = (id) => {
  return apiClient.put(`/BedManagement/${id}/increase`);
};

// 🔽 decrease
export const decreaseBed = (id) => {
  return apiClient.put(`/BedManagement/${id}/decrease`);
};