import { ServiceRepository } from "../repositories/service.repository.js";
import { ServiceColumnRepository } from "../repositories/serviceColumn.repository.js";

const repo = new ServiceRepository();
const colRepo = new ServiceColumnRepository();

export class ServicesService {
  async getAll(search?: string) {
    return repo.findAll(search);
  }

  async create(data: any) {
    return repo.create(data);
  }

  async update(id: string, data: any) {
    const existing = await repo.findById(id);
    if (!existing) throw new Error("Service not found");
    return repo.update(id, data);
  }

  async delete(id: string) {
    return repo.delete(id);
  }

  async getColumns() {
    return colRepo.findAll();
  }

  async addColumn(name: string) {
    return colRepo.create(name);
  }

  async reorderColumns(columns: { id: string; order: number }[]) {
    return colRepo.updateOrder(columns);
  }

  async deleteColumn(id: string) {
    return colRepo.delete(id);
  }
}
