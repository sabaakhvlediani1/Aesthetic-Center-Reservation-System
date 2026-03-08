import { Request, Response } from "express";
import { ServicesService } from "../services/services.service.js";

const svc = new ServicesService();

export const serviceController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const search = req.query.search as string | undefined;
      res.json(await svc.getAll(search));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      res.status(201).json(await svc.create(req.body));
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const result = await svc.update(req.params.id as string, req.body);
      if (!result) { res.status(404).json({ error: "Not found" }); return; }
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await svc.delete(req.params.id as string);
      res.status(204).send();
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  },

  async getColumns(req: Request, res: Response): Promise<void> {
    try {
      res.json(await svc.getColumns());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  },

  async addColumn(req: Request, res: Response): Promise<void> {
    try {
      res.status(201).json(await svc.addColumn(req.body.name));
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async reorderColumns(req: Request, res: Response): Promise<void> {
    try {
      res.json(await svc.reorderColumns(req.body.columns));
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async deleteColumn(req: Request, res: Response): Promise<void> {
    try {
      await svc.deleteColumn(req.params.id as string);
      res.status(204).send();
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  },
};
