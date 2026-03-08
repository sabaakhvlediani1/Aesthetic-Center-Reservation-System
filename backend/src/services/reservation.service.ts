import { ReservationRepository } from "../repositories/reservation.repository.js";

const repo = new ReservationRepository();

export class ReservationService {
  async getByDate(date: string) {
    return repo.findByDate(date);
  }

  async create(data: any) {
    const { specialistId, date, startTime, duration, serviceIds = [] } = data;
    const endTime = this.calcEnd(startTime, duration);

    const conflict = await repo.checkConflict(specialistId, date, startTime, endTime);
    if (conflict) throw new Error("Time slot is already occupied");

    return repo.create({ specialistId, date, startTime, duration, endTime }, serviceIds);
  }

  async update(id: string, data: any) {
    const { specialistId, date, startTime, duration, serviceIds } = data;
    const endTime = this.calcEnd(startTime, duration);

    const conflict = await repo.checkConflict(specialistId, date, startTime, endTime, id);
    if (conflict) throw new Error("Time slot is already occupied");

    return repo.update(id, { specialistId, date, startTime, duration, endTime }, serviceIds);
  }

  async delete(id: string) {
    return repo.delete(id);
  }

  private calcEnd(start: string, durationMin: number): string {
    const [h, m] = start.split(":").map(Number);
    const total = h * 60 + m + durationMin;
    const hh = Math.floor(total / 60);
    const mm = total % 60;
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  }
}
