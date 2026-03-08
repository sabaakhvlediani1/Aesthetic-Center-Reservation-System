import { Request, Response } from "express";
import { StaffService } from "../services/staff.service.js";

const staffService = new StaffService();

export const staffController = {

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const search = req.query.search as string | undefined;
      const staff = await staffService.getAllStaff(search);
      res.json(staff);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const newStaff = await staffService.createStaff(req.body, req.file);
      res.status(201).json(newStaff);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const updated = await staffService.updateStaff(id, req.body, req.file);
      
      if (!updated) {
        res.status(404).json({ error: "Staff member not found" });
        return;
      }
      
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await staffService.deleteStaff(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};