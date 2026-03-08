import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import styles from "./ServicesPage.module.css";
import AddColumnModal from "../components/AddColumnModal";
import ServiceModal from "../components/ServiceModal";
import { servicesApi, type ApiService, type ApiServiceColumn } from "../api/servicesApi";

const ServicesPage = () => {
  const [services, setServices] = useState<ApiService[]>([]);
  const [columns, setColumns] = useState<ApiServiceColumn[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [selectedService, setSelectedService] = useState<ApiService | null>(null);

  // Drag state for column reordering
  const dragColId = useRef<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [svcData, colData] = await Promise.all([
        servicesApi.getAll(),
        servicesApi.getColumns(),
      ]);
      setServices(svcData);
      setColumns(colData);
    } catch (err) {
      console.error("Failed to load services/columns", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleAddColumn = async (name: string) => {
    try {
      const col = await servicesApi.addColumn(name);
      setColumns((prev) => [...prev, col]);
    } catch (err) {
      console.error("Failed to add column", err);
    }
  };

  const handleAddService = async (data: any) => {
    try {
      const created = await servicesApi.create(data);
      setServices((prev) => [...prev, created]);
    } catch (err) {
      console.error("Failed to create service", err);
    }
  };

  const handleEditService = async (data: any) => {
    try {
      const updated = await servicesApi.update(data.id, data);
      setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } catch (err) {
      console.error("Failed to update service", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try {
      await servicesApi.delete(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete service", err);
    }
  };

  // Column drag & drop reordering
  const handleColDragStart = (id: string) => {
    dragColId.current = id;
  };

  const handleColDrop = async (targetId: string) => {
    if (!dragColId.current || dragColId.current === targetId) return;
    const from = columns.find((c) => c.id === dragColId.current);
    const to = columns.find((c) => c.id === targetId);
    if (!from || !to) return;

    const reordered = columns.map((c) => {
      if (c.id === from.id) return { ...c, order: to.order };
      if (c.id === to.id) return { ...c, order: from.order };
      return c;
    }).sort((a, b) => a.order - b.order);

    setColumns(reordered);
    dragColId.current = null;

    try {
      await servicesApi.reorderColumns(reordered.map((c) => ({ id: c.id, order: c.order })));
    } catch (err) {
      console.error("Failed to reorder columns", err);
      fetchAll();
    }
  };

  const filtered = useMemo(
    () =>
      services.filter((s) => {
        const lower = searchTerm.toLowerCase();
        if (s.name.toLowerCase().includes(lower)) return true;
        return Object.values(s.customFields || {}).some((v) =>
          String(v).toLowerCase().includes(lower)
        );
      }),
    [services, searchTerm]
  );

  const columnNames = columns.map((c) => c.name);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Services</h1>
        <button className={styles.addBtn} onClick={() => { setSelectedService(null); setModalMode("add"); }}>
          + Add New
        </button>
      </div>

      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.list}>
        <div className={styles.tableHeader}>
          <div className={styles.colService}>Service</div>
          <div className={styles.colPrice}>Price</div>

          {columns.map((c) => (
            <div
              key={c.id}
              className={styles.dynamicCol}
              draggable
              onDragStart={() => handleColDragStart(c.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleColDrop(c.id)}
              style={{ cursor: "grab" }}
            >
              {c.name}
            </div>
          ))}

          <div className={styles.plusBox} onClick={() => setIsAddColumnOpen(true)}>+</div>
        </div>

        {loading ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>Loading...</div>
        ) : (
          filtered.map((s) => (
            <div key={s.id} className={styles.row}>
              <div className={styles.colService}>
                <span className={styles.colorDot} style={{ backgroundColor: s.color }} />
                {s.name}
              </div>
              <div className={styles.colPrice}>${Number(s.price).toFixed(2)}</div>

              {columns.map((c) => (
                <div key={c.id} className={styles.dynamicCol}>
                  {s.customFields?.[c.name] || "-"}
                </div>
              ))}

              <div className={styles.actions}>
                <button onClick={() => { setSelectedService(s); setModalMode("edit"); }}>Edit</button>
                <button onClick={() => handleDelete(s.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {isAddColumnOpen && (
        <AddColumnModal
          onClose={() => setIsAddColumnOpen(false)}
          onSave={handleAddColumn}
        />
      )}

      {modalMode && (
        <ServiceModal
          mode={modalMode}
          service={selectedService}
          customFields={columnNames}
          onClose={() => setModalMode(null)}
          onSave={(data) => {
            modalMode === "add" ? handleAddService(data) : handleEditService(data);
            setModalMode(null);
          }}
        />
      )}
    </div>
  );
};

export default ServicesPage;
