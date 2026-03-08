import { Op } from "sequelize";
import { Staff } from "../infra/models/staff.model.js";

export class StaffRepository {
  async findAll(search?: string) {
    const queryOptions: any = {
      order: [['lastName', 'ASC'], ['firstName', 'ASC']],
    };

    if (search) {
      const searchWildcard = `%${search}%`;
      queryOptions.where = {
        [Op.or]: [
          { firstName: { [Op.iLike]: searchWildcard } },
          { lastName: { [Op.iLike]: searchWildcard } }
        ]
      };
    }

    return Staff.findAll(queryOptions);
  }

  async findById(id: string) {
    return Staff.findByPk(id);
  }

  async create(data: any) {
    return Staff.create(data);
  }

  async update(id: string, data: any) {
    const [affectedCount, updatedRows] = await Staff.update(data, { 
      where: { id },
      returning: true 
    });
    
    return affectedCount > 0 ? updatedRows[0] : null;
  }

  async delete(id: string) {
    return Staff.destroy({ where: { id } });
  }
}