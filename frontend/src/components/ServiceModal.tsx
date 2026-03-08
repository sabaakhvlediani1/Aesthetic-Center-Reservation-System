import { useState } from "react";
import styles from "./ServiceModal.module.css";
import type { ApiService } from "../api/servicesApi";

const COLOR_PALETTE = [
  "#2196F3", "#4CAF50", "#9C27B0", "#FF9800",
  "#F44336", "#00BCD4", "#E91E63", "#3F51B5",
  "#FFC107", "#009688",
];

interface Props {
  mode: "add" | "edit";
  service?: ApiService | null;
  customFields?: string[];
  onClose: () => void;
  onSave: (data: any) => void;
}

const ServiceModal = ({ mode, service, customFields = [], onClose, onSave }: Props) => {
  const [name, setName] = useState(service?.name || "");
  const [price, setPrice] = useState<string>(service?.price?.toString() || "");
  const [color, setColor] = useState(service?.color || COLOR_PALETTE[0]);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(
    service?.customFields || {}
  );

  const handleSubmit = () => {
    if (!name.trim() || !price) return;
    onSave({
      ...(service ? { id: service.id } : {}),
      name: name.trim(),
      price: parseFloat(price),
      color,
      customFields: fieldValues,
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{mode === "edit" ? "Edit Service" : "Add Service"}</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.body}>
          <div className={styles.inputGroup}>
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Service name" />
          </div>

          <div className={styles.rowGroup}>
            <div className={styles.inputGroup}>
              <label>Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Color</label>
              <div className={styles.palette}>
                {COLOR_PALETTE.map((c) => (
                  <div
                    key={c}
                    className={styles.colorSwatch}
                    style={{
                      backgroundColor: c,
                      outline: color === c ? `2px solid #333` : "none",
                      outlineOffset: 2,
                    }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>

          {customFields.map((field) => (
            <div key={field} className={styles.inputGroup}>
              <label>{field}</label>
              <input
                value={fieldValues[field] || ""}
                onChange={(e) =>
                  setFieldValues((prev) => ({ ...prev, [field]: e.target.value }))
                }
              />
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <button className={styles.saveBtn} onClick={handleSubmit}>Save</button>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
