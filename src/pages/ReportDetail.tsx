import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ReportStatus, type AnimalReport } from "../types/report";
import { saveReports } from "../api/jsonbin";

async function hashPassword(password: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function ReportDetail({
  reports,
  setReports,
}: {
  reports: AnimalReport[];
  setReports: (r: AnimalReport[]) => void;
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const report = reports.find((r) => r.id === id);

  const [password, setPassword] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);

  if (!report) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Report not found</h2>
        <Link to="/">Back</Link>
      </div>
    );
  }

  const markAsFound = async () => {
    const hashed = await hashPassword(password);
    if (hashed !== report.passwordHash) {
      alert("Incorrect password");
      return;
    }

    const updated: AnimalReport = {
      ...report,
      status: ReportStatus.found,
    };

    const updatedReports = reports.map((r) =>
      r.id === report.id ? updated : r,
    );

    await saveReports(updatedReports);
    setReports(updatedReports);

    alert("Marked as found!");

    navigate("/");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>{report.name}</h1>

      <p>Type: {report.type}</p>
      <p>Description: {report.description}</p>
      <p>Contact: {report.contact}</p>
      <p>Address: {report.location.address}</p>
      <p>Date: {new Date(report.createdAt).toLocaleString()}</p>

      {report.imageUrl && <img src={report.imageUrl} style={{ width: 250 }} />}

      <p>Status: {report.status}</p>

      {/* MARK AS FOUND */}
      {report.status === "lost" && (
        <div style={{ marginTop: 20 }}>
          {!showPrompt ? (
            <button onClick={() => setShowPrompt(true)}>Mark as Found</button>
          ) : (
            <div>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button onClick={markAsFound}>Confirm</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
