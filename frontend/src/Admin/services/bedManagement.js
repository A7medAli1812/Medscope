import apiClient from "../../api/axiosInstance";

// GET ALL wards/beds
export const getBeds = async () => {
  const res = await apiClient.get(`/BedManagement?_t=${Date.now()}`);
  return res.data.map(item => {
    let total = Number(item.totalBeds);
    let available = Number(item.availableBeds);
    
    // Protect against backend garbage data (like ICU having 39 available out of 11)
    if (available > total) available = total;
    if (available < 0) available = 0;

    return {
      id: item.id,
      ward: item.name,
      totalBeds: total,
      availableBeds: available,
      usedBeds: total - available
    };
  });
};


export const increaseBed = async (id) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`https://med-scope1.runasp.net/api/BedManagement/${id}/increase`, {
    method: 'PUT',
    headers: {
      'accept': '*/*',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  });
  if (!res.ok) throw new Error("Failed to increase");
  return res.json();
};

export const decreaseBed = async (id) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`https://med-scope1.runasp.net/api/BedManagement/${id}/decrease`, {
    method: 'PUT',
    headers: {
      'accept': '*/*',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  });
  if (!res.ok) throw new Error("Failed to decrease");
  return res.json();
};