import { Op } from "sequelize";
import { Service } from "../infra/models/service.model.js";

export class ServiceRepository {
  async findAll(search?: string) {
    const options: any = { order: [["name", "ASC"]] };
    if (search) {
      options.where = { name: { [Op.iLike]: `%${search}%` } };
    }
    return Service.findAll(options);
  }

  async findById(id: string) {
    return Service.findByPk(id);
  }

  async create(data: any) {
    return Service.create(data);
  }

  async update(id: string, data: any) {
    const [count, rows] = await Service.update(data, {
      where: { id },
      returning: true,
    });
    return count > 0 ? rows[0] : null;
  }

  async delete(id: string) {
    return Service.destroy({ where: { id } });
  }
}
