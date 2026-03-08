import { Request, Response } from "express";
import { ReservationService } from "../services/reservation.service.js";

const svc = new ReservationService();

export const reservationController = {
  async getByDate(req: Request, res: Response): Promise<void> {
    try {
      const date = req.query.date as string;
      if (!date) {
        res.status(400).json({ error: "date query param required" });
        return;
      }
      res.json(await svc.getByDate(date));
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
};
