import api from "../services/axios";

export interface ApiService {
  id: string;
  name: string;
  price: number;
  color: string;
  customFields: Record<string, string>;
}

export interface ApiServiceColumn {
  id: string;
  name: string;
  order: number;
}

export const servicesApi = {
  getAll: (search?: string): Promise<ApiService[]> =>
    api.get("/services", { params: search ? { search } : {} }).then((r) => r.data),

  create: (data: Omit<ApiService, "id">): Promise<ApiService> =>
    api.post("/services", data).then((r) => r.data),

  update: (id: string, data: Partial<ApiService>): Promise<ApiService> =>
    api.put(`/services/${id}`, data).then((r) => r.data),

  delete: (id: string): Promise<void> => api.delete(`/services/${id}`).then(() => undefined),

  getColumns: (): Promise<ApiServiceColumn[]> =>
    api.get("/services/columns").then((r) => r.data),

  addColumn: (name: string): Promise<ApiServiceColumn> =>
    api.post("/services/columns", { name }).then((r) => r.data),

  reorderColumns: (columns: { id: string; order: number }[]): Promise<ApiServiceColumn[]> =>
    api.put("/services/columns/reorder", { columns }).then((r) => r.data),

  deleteColumn: (id: string): Promise<void> =>
    api.delete(`/services/columns/${id}`).then(() => undefined),
};
