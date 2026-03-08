import { Staff } from "../models/staff.model.js";
import { Reservation } from "../models/reservation.model.js";
import { Service } from "../models/service.model.js";
import { ReservationService as ReservationServiceModel } from "../models/reservationService.model.js";

export function setupAssociations() {
  Staff.hasMany(Reservation, { foreignKey: "specialistId", as: "reservations" });
  Reservation.belongsTo(Staff, { foreignKey: "specialistId", as: "specialist" });

  Reservation.belongsToMany(Service, {
    through: ReservationServiceModel,
    foreignKey: "reservationId",
    otherKey: "serviceId",
    as: "services",
  });

  Service.belongsToMany(Reservation, {
    through: ReservationServiceModel,
    foreignKey: "serviceId",
    otherKey: "reservationId",
    as: "reservations",
  });
}
