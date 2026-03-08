import { useState, useEffect, useRef } from "react";
import styles from "./AddStaffModal.module.css";
import type { ApiStaff } from "../api/staffApi";
import { getPhotoUrl } from "../api/staffApi";

interface Props {
  staff?: ApiStaff | null;
  onSave: (data: { firstName: string; lastName: string; photo?: File }) => void;
  onClose: () => void;
}

const AddStaffModal = ({ staff, onSave, onClose }: Props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photoFile, setPhotoFile] = useState<File | undefined>(undefined);
  const [preview, setPreview] = useState<string>("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (staff) {
      setFirstName(staff.firstName);
      setLastName(staff.lastName);
      setPreview(staff.photo ? getPhotoUrl(staff.photo) : "");
      setPhotoFile(undefined);
      setFileName("");
    } else {
      setFirstName("");
      setLastName("");
      setPreview("");
      setPhotoFile(undefined);
      setFileName("");
    }
  }, [staff]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setFileName(file.name);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    if (!firstName.trim() || !lastName.trim()) return;
    onSave({ firstName: firstName.trim(), lastName: lastName.trim(), photo: photoFile });
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>{staff ? "Edit Staff Member" : "Add New Staff Member"}</h3>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.inputSection}>
            <div className={styles.inputGroup}>
              <label>Name</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ana" />
            </div>
            <div className={styles.inputGroup}>
              <label>Lastname</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Akhvlediani" />
            </div>
          </div>

          <div className={styles.photoSection}>
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", marginBottom: 8, cursor: "pointer" }}
                onClick={() => fileInputRef.current?.click()}
              />
            ) : (
              <div className={styles.uploadBox} onClick={() => fileInputRef.current?.click()}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2196f3" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span>Add Photo</span>
              </div>
            )}
            {fileName && <div className={styles.fileLink}>{fileName}</div>}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.saveBtn} onClick={handleSave}>Save</button>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;
