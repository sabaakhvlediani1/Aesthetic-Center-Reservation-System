import { Op } from "sequelize";
import { Reservation } from "../infra/models/reservation.model.js";
import { Service } from "../infra/models/service.model.js";
import { Staff } from "../infra/models/staff.model.js";

export class ReservationRepository {
  async findByDate(date: string) {
    return Reservation.findAll({
      where: { date },
      include: [
        { model: Service, as: "services", through: { attributes: [] } },
        {
          model: Staff,
          as: "specialist",
          attributes: ["id", "firstName", "lastName", "photo"],
        },
      ],
      order: [["startTime", "ASC"]],
    });
  }

  async findById(id: string) {
    return Reservation.findByPk(id, {
      include: [
        { model: Service, as: "services", through: { attributes: [] } },
        {
          model: Staff,
          as: "specialist",
          attributes: ["id", "firstName", "lastName", "photo"],
        },
      ],
    });
  }

  async checkConflict(
    specialistId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludeId?: string
  ) {
    const where: any = {
      specialistId,
      date,
      [Op.and]: [
        { startTime: { [Op.lt]: endTime } },
        { endTime: { [Op.gt]: startTime } },
      ],
    };
    if (excludeId) where.id = { [Op.ne]: excludeId };
    return Reservation.findOne({ where });
  }

  async create(data: any, serviceIds: string[]) {
    const reservation = await Reservation.create(data);
    await (reservation as any).setServices(serviceIds);
    return this.findById(reservation.id);
  }

  async update(id: string, data: any, serviceIds?: string[]) {
    await Reservation.update(data, { where: { id } });
    if (serviceIds !== undefined) {
      const reservation = await Reservation.findByPk(id);
      if (reservation) {
        await (reservation as any).setServices(serviceIds);
      }
    }
    return this.findById(id);
  }

  async delete(id: string) {
    return Reservation.destroy({ where: { id } });
  }
}
