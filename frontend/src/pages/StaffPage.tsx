import { useState, useMemo, useCallback, useEffect } from "react";
import styles from "./StaffPage.module.css";
import AddStaffModal from "../components/AddStaffModal";
import { staffApi, getPhotoUrl, type ApiStaff } from "../api/staffApi";

const StaffRow = ({
  person,
  onEdit,
  onDelete,
}: {
  person: ApiStaff;
  onEdit: (staff: ApiStaff) => void;
  onDelete: (id: string) => void;
}) => (
  <div className={styles.row}>
    <div className={styles.info}>
      <img
        src={getPhotoUrl(person.photo)}
        alt={`${person.firstName} ${person.lastName}`}
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            `https://ui-avatars.com/api/?name=${person.firstName}+${person.lastName}&background=e0e0e0&color=555&size=40`;
        }}
      />
      <span>
        {person.firstName} {person.lastName}
      </span>
    </div>
    <div className={styles.actions}>
      <button className={styles.edit} onClick={() => onEdit(person)}>Edit</button>
      <button className={styles.delete} onClick={() => onDelete(person.id)}>Delete</button>
    </div>
  </div>
);

const StaffPage = () => {
  const [staff, setStaff] = useState<ApiStaff[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<ApiStaff | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStaff = useCallback(async (search?: string) => {
    try {
      const data = await staffApi.getAll(search);
      setStaff(data);
    } catch (err) {
      console.error("Failed to load staff", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearchTerm(val);
      fetchStaff(val || undefined);
    },
    [fetchStaff]
  );

  const openAddModal = useCallback(() => {
    setEditingStaff(null);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setEditingStaff(null);
    setModalOpen(false);
  }, []);

  const handleEdit = (staffMember: ApiStaff) => {
    setEditingStaff(staffMember);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;
    try {
      await staffApi.delete(id);
      setStaff((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete staff", err);
    }
  };

  const handleSave = async (data: { firstName: string; lastName: string; photo?: File }) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    if (data.photo) formData.append("photo", data.photo);

    try {
      if (editingStaff) {
        const updated = await staffApi.update(editingStaff.id, formData);
        setStaff((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      } else {
        const created = await staffApi.create(formData);
        setStaff((prev) => [...prev, created]);
      }
    } catch (err) {
      console.error("Failed to save staff", err);
    }
  };

  const filteredStaff = useMemo(
    () =>
      staff.filter(
        (s) =>
          s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm, staff]
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Staff</h1>
        <button className={styles.addBtn} onClick={openAddModal}>+ Add New</button>
      </div>

      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search by name or surname..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className={styles.list}>
        {loading ? (
          <div className={styles.empty}>Loading...</div>
        ) : filteredStaff.length > 0 ? (
          filteredStaff.map((person) => (
            <StaffRow key={person.id} person={person} onEdit={handleEdit} onDelete={handleDelete} />
          ))
        ) : (
          <div className={styles.empty}>No staff found</div>
        )}
      </div>

      {modalOpen && (
        <AddStaffModal staff={editingStaff} onSave={handleSave} onClose={closeModal} />
      )}
    </div>
  );
};

export default StaffPage;
