import { Router } from "express";
import { reservationController } from "../controllers/reservation.controller.js";

const router = Router();

router.get("/", reservationController.getByDate);
router.post("/", reservationController.create);
router.put("/:id", reservationController.update);
router.delete("/:id", reservationController.delete);

export default router;
