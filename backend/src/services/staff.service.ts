import { StaffRepository } from "../repositories/staff.repository.js";
import fs from "fs/promises";
import path from "path";

const repository = new StaffRepository();

export class StaffService {

  async getAllStaff(search?: string) {
    return await repository.findAll(search);
  }


  async createStaff(data: { firstName: string; lastName: string }, photo?: Express.Multer.File) {
    const staffData: any = { ...data };

    if (photo) {
      staffData.photo = `/uploads/staff/${photo.filename}`;
    }

    return await repository.create(staffData);
  }

  async updateStaff(id: string, data: any, newPhoto?: Express.Multer.File) {
    const existingStaff = await repository.findById(id);
    if (!existingStaff) throw new Error("Staff member not found");

    const updateData = { ...data };

    if (newPhoto) {
      if (existingStaff.photo) {
        this.deletePhotoFile(existingStaff.photo);
      }
      updateData.photo = `/uploads/staff/${newPhoto.filename}`;
    }

    return await repository.update(id, updateData);
  }

  async deleteStaff(id: string) {
    const staff = await repository.findById(id);
    if (staff && staff.photo) {
      this.deletePhotoFile(staff.photo);
    }
    return await repository.delete(id);
  }

  private async deletePhotoFile(photoPath: string) {
    try {
      const fullPath = path.join(process.cwd(), "public", photoPath);
      await fs.unlink(fullPath);
    } catch (err) {
      console.error("Failed to delete local file:", err);
    }
  }
}