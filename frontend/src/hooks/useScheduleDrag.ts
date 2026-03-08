import { useState, useCallback } from "react";

export type DragAppointment = {
  id: string;
  specialistId: string;
  startTime: string;
  duration: number;
};

export const useScheduleDrag = (
  appointments: DragAppointment[],
  setAppointments: React.Dispatch<React.SetStateAction<any[]>>,
  getAppointmentTop: (time: string) => number,
  getAppointmentHeight: (duration: number) => number,
  onMove: (id: string, specialistId: string, startTime: string, duration: number) => Promise<void>
) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData("appointmentId", id);
    e.dataTransfer.effectAllowed = "move";
    const target = e.currentTarget as HTMLElement;
    setTimeout(() => { target.style.opacity = "0.3"; }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedId(null);
    (e.currentTarget as HTMLElement).style.opacity = "1";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleCellDragOver = useCallback(
    (e: React.DragEvent, targetSpecialistId: string, targetTime: string) => {
      e.preventDefault();
      if (!draggedId) return;

      const draggedApp = appointments.find((a) => a.id === draggedId);
      if (!draggedApp) return;

      const newStart = getAppointmentTop(targetTime);
      const newEnd = newStart + getAppointmentHeight(draggedApp.duration);

      const hasConflict = appointments.some((app) => {
        if (app.id === draggedId || app.specialistId !== targetSpecialistId) return false;
        const appStart = getAppointmentTop(app.startTime);
        const appEnd = appStart + getAppointmentHeight(app.duration);
        return newStart < appEnd && newEnd > appStart;
      });

      e.dataTransfer.dropEffect = hasConflict ? "none" : "move";
    },
    [draggedId, appointments, getAppointmentTop, getAppointmentHeight]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent, targetSpecialistId: string, targetTime: string) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("appointmentId");
      const draggedApp = appointments.find((a) => a.id === id);
      if (!draggedApp) return;

      
      const newStart = getAppointmentTop(targetTime);
      const newEnd = newStart + getAppointmentHeight(draggedApp.duration);

      const hasConflict = appointments.some((app) => {
        if (app.id === id || app.specialistId !== targetSpecialistId) return false;
        const appStart = getAppointmentTop(app.startTime);
        const appEnd = appStart + getAppointmentHeight(app.duration);
        return newStart < appEnd && newEnd > appStart;
      });

      if (hasConflict) return;

      
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, specialistId: targetSpecialistId, startTime: targetTime } : a
        )
      );

     
      await onMove(id, targetSpecialistId, targetTime, draggedApp.duration);
    },
    [appointments, setAppointments, getAppointmentTop, getAppointmentHeight, onMove]
  );

  return { handleDragStart, handleDragEnd, handleDragOver, handleCellDragOver, handleDrop, draggedId };
};
