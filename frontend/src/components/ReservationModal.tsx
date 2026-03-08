import { useState, useMemo, useEffect } from "react";
import styles from "./ReservationModal.module.css";
import { servicesApi, type ApiService } from "../api/servicesApi";

type Props = {
  staffName: string;
  date: string;
  startTime: string;
  appointment?: {
    id: string;
    duration: number;
    services: ApiService[];
  } | null;
  onClose: () => void;
  onSave: (data: { startTime: string; duration: number; serviceIds: string[] }) => void;
  onDelete?: () => void;
};

const ReservationModal = ({ staffName, date, startTime, appointment, onClose, onSave, onDelete }: Props) => {
  const [allServices, setAllServices] = useState<ApiService[]>([]);
  const [selectedServices, setSelectedServices] = useState<ApiService[]>(appointment?.services || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeValue, setTimeValue] = useState(startTime);
  const [durationValue, setDurationValue] = useState(appointment?.duration ?? 60);

  useEffect(() => {
    servicesApi.getAll().then(setAllServices).catch(console.error);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const filteredOptions = useMemo(
    () =>
      allServices.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !selectedServices.some((sel) => sel.id === s.id)
      ),
    [searchTerm, selectedServices, allServices]
  );

  const addService = (service: ApiService) => {
    setSelectedServices((prev) => [...prev, service]);
    setSearchTerm("");
  };

  const removeService = (id: string) => {
    setSelectedServices((prev) => prev.filter((s) => s.id !== id));
  };

  const total = useMemo(
    () => selectedServices.reduce((sum, s) => sum + Number(s.price), 0),
    [selectedServices]
  );

  const handleSave = () => {
    if (selectedServices.length === 0) return;
    onSave({
      startTime: timeValue,
      duration: durationValue,
      serviceIds: selectedServices.map((s) => s.id),
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{appointment ? "Edit Reservation" : "New Reservation"}</h3>
          <button className={styles.closeX} onClick={onClose}>✕</button>
        </div>

        <div className={styles.formGrid}>
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label>Name</label>
            <div className={styles.readOnlyInput}>{staffName}</div>
          </div>

          <div className={styles.field}>
            <label>Date</label>
            <div className={styles.readOnlyInput}>{date}</div>
          </div>

          <div className={styles.field}>
            <label>Appt Time</label>
            <input
              className={styles.input}
              type="time"
              value={timeValue}
              onChange={(e) => setTimeValue(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>Duration (min)</label>
            <input
              className={styles.input}
              type="number"
              min={15}
              step={15}
              value={durationValue}
              onChange={(e) => setDurationValue(Number(e.target.value))}
            />
          </div>
        </div>

        <div className={styles.searchContainer}>
          <input
            className={styles.search}
            placeholder="Search service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <div className={styles.dropdown}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((s) => (
                  <div key={s.id} onClick={() => addService(s)} className={styles.dropdownItem}>
                    <span
                      style={{
                        display: "inline-block",
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: s.color,
                        marginRight: 8,
                      }}
                    />
                    <span>{s.name}</span>
                    <b>${Number(s.price).toFixed(2)}</b>
                  </div>
                ))
              ) : (
                <div className={styles.dropdownItem}>No services found</div>
              )}
            </div>
          )}
        </div>

        <div className={styles.servicesList}>
          {selectedServices.length === 0 && (
            <div className={styles.placeholderText}>No services selected</div>
          )}
          {selectedServices.map((service) => (
            <div
              key={service.id}
              className={styles.serviceItem}
              style={{ background: `${service.color}25` }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    display: "inline-block",
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: service.color,
                  }}
                />
                <span>{service.name}</span>
              </div>
              <div className={styles.serviceActions}>
                <b>${Number(service.price).toFixed(2)}</b>
                <button onClick={() => removeService(service.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.totalRow}>
          Total: <span>${total.toFixed(2)}</span>
        </div>

        <div className={styles.actions}>
          {appointment && onDelete && (
            <button className={styles.delete} onClick={onDelete}>Delete</button>
          )}
          <button
            className={styles.save}
            disabled={selectedServices.length === 0}
            onClick={handleSave}
          >
            Save
          </button>
          <button className={styles.cancel} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
