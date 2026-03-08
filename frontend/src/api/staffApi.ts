import api from "../services/axios";

export interface ApiStaff {
  id: string;
  firstName: string;
  lastName: string;
  photo?: string | null;
}

export const getPhotoUrl = (photo?: string | null): string =>
  photo ? `http://localhost:5000${photo}` : `https://ui-avatars.com/api/?name=?&background=e0e0e0&color=555&size=40`;

export const staffApi = {
  getAll: (search?: string): Promise<ApiStaff[]> =>
    api.get("/staff", { params: search ? { search } : {} }).then((r) => r.data),

  create: (formData: FormData): Promise<ApiStaff> =>
    api
      .post("/staff", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data),

  update: (id: string, formData: FormData): Promise<ApiStaff> =>
    api
      .put(`/staff/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data),

  delete: (id: string): Promise<void> => api.delete(`/staff/${id}`).then(() => undefined),
};
