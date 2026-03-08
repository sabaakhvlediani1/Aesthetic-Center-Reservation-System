export const SLOT_HEIGHT = 100;
export const FIRST_HOUR = 8;


export const normalizeTime = (t: string): string => t.substring(0, 5);


const parseTimeToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};


export const getAppointmentTop = (time: string): number => {
  const minutesFromStart = parseTimeToMinutes(time) - (FIRST_HOUR * 60);
  return (minutesFromStart / 60) * SLOT_HEIGHT;
};

export const getAppointmentHeight = (durationMinutes: number): number => {
  return (durationMinutes / 60) * SLOT_HEIGHT;
};


export const addMinutes = (time: string, mins: number): string => {
  const totalMins = parseTimeToMinutes(time) + mins;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

