import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import styles from "./SchedulePage.module.css";
import ReservationModal from "../components/ReservationModal";
import StaffPage from "./StaffPage";
import ServicesPage from "./ServicesPage";
import { hours } from "../data";
import {
  getAppointmentHeight,
  getAppointmentTop,
  addMinutes,
  normalizeTime,
} from "../utils/timeHelpers";
import { useScheduleDrag } from "../hooks/useScheduleDrag";
import { staffApi, getPhotoUrl, type ApiStaff } from "../api/staffApi";
import { reservationsApi, type ApiReservation } from "../api/reservationsApi";
import type { ApiService } from "../api/servicesApi";

type Page = "schedule" | "staff" | "services";

type Appointment = ApiReservation & {
  startTime: string; 
};

type ModalData = {
  staffId: string;
  staffName: string;
  startTime: string;
  appointment?: Appointment;
};

const getInitials = (firstName: string, lastName: string) =>
  `${firstName[0]}${lastName[0]}`.toUpperCase();

const getTitle = (services: ApiService[]) =>
  services.length > 0 ? services[0].name : "Reservation";

const getColor = (services: ApiService[]) =>
  services.length > 0 ? services[0].color : "#90CAF9";

const Scheduler = () => {
  const [staffList, setStaffList] = useState<ApiStaff[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [page, setPage] = useState<Page>("schedule");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const dateLabel = format(selectedDate, "MMMM d, yyyy");


  useEffect(() => {
    staffApi
      .getAll()
      .then(setStaffList)
      .catch(console.error);
  }, []);


  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await reservationsApi.getByDate(dateStr);
      setAppointments(
        data.map((r) => ({ ...r, startTime: normalizeTime(r.startTime) }))
      );
    } catch (err) {
      console.error("Failed to load reservations", err);
    } finally {
      setLoading(false);
    }
  }, [dateStr]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // --- Drag & Drop ---
  const onMove = useCallback(
    async (id: string, specialistId: string, startTime: string, duration: number) => {
      try {
        await reservationsApi.update(id, {
          specialistId,
          date: dateStr,
          startTime,
          duration,
        });
      } catch (err) {
        console.error("Failed to save drag & drop", err);
        fetchReservations(); 
      }
    },
    [dateStr, fetchReservations]
  );

  const { handleDragStart, handleDragEnd, handleCellDragOver, handleDrop } =
    useScheduleDrag(appointments, setAppointments, getAppointmentTop, getAppointmentHeight, onMove);

  // --- Reservation Actions ---
  const handleSaveAppointment = async (data: {
    startTime: string;
    duration: number;
    serviceIds: string[];
  }) => {
    if (!modalData) return;
    try {
      if (modalData.appointment) {
        await reservationsApi.update(modalData.appointment.id, {
          specialistId: modalData.staffId,
          date: dateStr,
          startTime: data.startTime,
          duration: data.duration,
          serviceIds: data.serviceIds,
        });
      } else {
        await reservationsApi.create({
          specialistId: modalData.staffId,
          date: dateStr,
          startTime: data.startTime,
          duration: data.duration,
          serviceIds: data.serviceIds,
        });
      }
      setModalData(null);
      fetchReservations();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to save reservation");
    }
  };

  const handleDeleteAppointment = async () => {
    if (!modalData?.appointment) return;
    if (!confirm("Are you sure you want to delete this reservation?")) return;
    try {
      await reservationsApi.delete(modalData.appointment.id);
      setModalData(null);
      fetchReservations();
    } catch (err) {
      console.error("Failed to delete reservation", err);
    }
  };

  // --- Render ---
  const gridCols = `80px repeat(${staffList.length}, 1fr)`;

  const renderSchedule = () => (
    <div className={styles.gridContainer}>
      <div className={styles.stickyHeader} style={{ gridTemplateColumns: gridCols }}>
        <div className={styles.timeLabel} />
        {staffList.map((person) => (
          <div key={person.id} className={styles.staffMember}>
            <img
              src={getPhotoUrl(person.photo)}
              alt={`${person.firstName} ${person.lastName}`}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://ui-avatars.com/api/?name=${person.firstName}+${person.lastName}&background=e0e0e0&color=555&size=40`;
              }}
            />
            <span>{person.firstName} {person.lastName}</span>
          </div>
        ))}
      </div>

      <div className={styles.body}>
        <div className={styles.timeColumn}>
          {hours.map((hour) => (
            <div key={hour} className={styles.hourCell}>
              {hour.endsWith(":00") ? hour : ""}
            </div>
          ))}
        </div>

        <div className={styles.columnsWrapper} style={{ gridTemplateColumns: `repeat(${staffList.length}, 1fr)` }}>
          {staffList.map((person) => (
            <div key={person.id} className={styles.column}>
              {hours.map((hour) => (
                <div
                  key={hour}
                  className={styles.cell}
                  onDragOver={(e) => handleCellDragOver(e, person.id, hour)}
                  onDrop={(e) => handleDrop(e, person.id, hour)}
                  onClick={() => setModalData({ staffId: person.id, staffName: `${person.firstName} ${person.lastName}`, startTime: hour })}
                />
              ))}

              {appointments
                .filter((a) => a.specialistId === person.id)
                .map((app) => {
                  const color = getColor(app.services);
                  const title = getTitle(app.services);
                  return (
                    <div
                      key={app.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app.id)}
                      onDragEnd={handleDragEnd}
                      className={styles.appointment}
                      style={{
                        top: `${getAppointmentTop(app.startTime)}px`,
                        height: `${getAppointmentHeight(app.duration)}px`,
                        backgroundColor: `${color}25`,
                        borderLeft: `4px solid ${color}`,
                        cursor: "grab",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalData({
                          staffId: person.id,
                          staffName: `${person.firstName} ${person.lastName}`,
                          startTime: app.startTime,
                          appointment: app,
                        });
                      }}
                    >
                      <div className={styles.appTitle}>{title}</div>

                      {app.services.length > 1 && (
                        <ul className={styles.appSubList}>
                          {app.services.slice(1).map((s) => (
                            <li key={s.id}>{s.name}</li>
                          ))}
                        </ul>
                      )}

                      <div className={styles.appTime}>
                        {normalizeTime(app.startTime)} – {addMinutes(app.startTime, app.duration)}
                      </div>

                      <div
                        className={styles.appBadge}
                        style={{ backgroundColor: color }}
                      >
                        {getInitials(person.firstName, person.lastName)}
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerSpacer} />

        <nav className={styles.nav}>
          {(["schedule", "staff", "services"] as Page[]).map((p) => (
            <span
              key={p}
              className={page === p ? styles.activeLink : ""}
              onClick={() => setPage(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </span>
          ))}
        </nav>

        <div className={styles.dateSelector}>
          <button
            className={styles.dateBtn}
            onClick={() =>
              setSelectedDate((prev) => {
                const d = new Date(prev);
                d.setDate(d.getDate() - 1);
                return d;
              })
            }
          >
            &lt;
          </button>
          <span className={styles.dateText}>{dateLabel}</span>
          <button
            className={styles.dateBtn}
            onClick={() =>
              setSelectedDate((prev) => {
                const d = new Date(prev);
                d.setDate(d.getDate() + 1);
                return d;
              })
            }
          >
            &gt;
          </button>
        </div>
      </header>

      {page === "schedule" && (loading && appointments.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>Loading...</div>
      ) : renderSchedule())}
      {page === "staff" && <StaffPage />}
      {page === "services" && <ServicesPage />}

      {modalData && page === "schedule" && (
        <ReservationModal
          staffName={modalData.staffName}
          date={dateLabel}
          startTime={modalData.startTime}
          appointment={modalData.appointment ?? null}
          onClose={() => setModalData(null)}
          onSave={handleSaveAppointment}
          onDelete={modalData.appointment ? handleDeleteAppointment : undefined}
        />
      )}
    </div>
  );
};

export default Scheduler;
