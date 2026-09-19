import { useEffect, useState } from "react";
import { getReports } from "../api/jsonbin";
import { ReportStatus, type AnimalReport } from "../types/report";
import { AnimalType } from "../types/report";
import { useNavigate } from "react-router-dom";

export function Browse() {
  const [typeFilter, setTypeFilter] = useState<AnimalType | "all">("all");
  const [reports, setReports] = useState<AnimalReport[]>([]);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");
  const navigate = useNavigate();

  useEffect(() => {
    getReports().then(setReports).catch(console.error);
  }, []);

  const filtered = reports.filter((r) => {
    const statusMatch = statusFilter === "all" || r.status === statusFilter;
    const typeMatch = typeFilter === "all" || r.type === typeFilter;

    return statusMatch && typeMatch;
  });

  return (
    <div style={{ padding: 20 }}>
      <h1>Browse Reports</h1>

      {/* FILTERS */}
      <div className="filters">
        <button
          className={statusFilter === "all" ? "active" : ""}
          onClick={() => setStatusFilter("all")}
        >
          All
        </button>

        <button
          className={statusFilter === ReportStatus.lost ? "active" : ""}
          onClick={() => setStatusFilter(ReportStatus.lost)}
        >
          Lost
        </button>

        <button
          className={statusFilter === ReportStatus.found ? "active" : ""}
          onClick={() => setStatusFilter(ReportStatus.found)}
        >
          Found
        </button>
      </div>

      <div className="filters">
        <button
          className={typeFilter === "all" ? "active" : ""}
          onClick={() => setTypeFilter("all")}
        >
          All Types
        </button>

        {Object.values(AnimalType).map((type) => (
          <button
            key={type}
            className={typeFilter === type ? "active" : ""}
            onClick={() => setTypeFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div style={{ display: "grid", gap: 10 }}>
        {filtered.map((r) => (
          <div
            className="card"
            key={r.id}
            onClick={() => navigate(`/report/${r.id}`)}
          >
            <h3>
              {r.name} ({r.type})
            </h3>

            <p>{r.description}</p>
            <p>📍 {r.location.address}</p>

            {r.imageUrl && (
              <img src={r.imageUrl} alt={r.name} style={{ width: 300 }} />
            )}

            <div className={`status ${r.status}`}>{r.status.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
