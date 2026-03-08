import { ServiceColumn } from "../infra/models/serviceColumn.model.js";

export class ServiceColumnRepository {
  async findAll() {
    return ServiceColumn.findAll({ order: [["order", "ASC"]] });
  }

  async create(name: string) {
    const count = await ServiceColumn.count();
    return ServiceColumn.create({ name, order: count });
  }

  async updateOrder(columns: { id: string; order: number }[]) {
    await Promise.all(
      columns.map(({ id, order }) =>
        ServiceColumn.update({ order }, { where: { id } })
      )
    );
    return this.findAll();
  }

  async delete(id: string) {
    return ServiceColumn.destroy({ where: { id } });
  }
}
