import api from "../services/axios";
import type { ApiService } from "./servicesApi";
import type { ApiStaff } from "./staffApi";

export interface ApiReservation {
  id: string;
  specialistId: string;
  date: string;
  startTime: string;
  duration: number;
  endTime: string;
  services: ApiService[];
  specialist: ApiStaff;
}

export const reservationsApi = {
  getByDate: (date: string): Promise<ApiReservation[]> =>
    api.get("/reservations", { params: { date } }).then((r) => r.data),

  create: (data: {
    specialistId: string;
    date: string;
    startTime: string;
    duration: number;
    serviceIds: string[];
  }): Promise<ApiReservation> => api.post("/reservations", data).then((r) => r.data),

  update: (
    id: string,
    data: {
      specialistId: string;
      date: string;
      startTime: string;
      duration: number;
      serviceIds?: string[];
    }
  ): Promise<ApiReservation> => api.put(`/reservations/${id}`, data).then((r) => r.data),

  delete: (id: string): Promise<void> =>
    api.delete(`/reservations/${id}`).then(() => undefined),
};
