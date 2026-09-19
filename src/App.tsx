import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { getReports } from "./api/jsonbin";
import type { AnimalReport } from "./types/report";

import { MapView } from "./components/MapViewer";
import { Browse } from "./pages/Browse";
import { ReportDetail } from "./pages/ReportDetail";
import { ReportForm } from "./pages/ReportForm";
import "./app.css";

export default function App() {
  const [reports, setReports] = useState<AnimalReport[]>([]);

  useEffect(() => {
    getReports().then(setReports).catch(console.error);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<MapView reports={reports} />} />

      <Route path="/browse" element={<Browse />} />

      <Route
        path="/report/:id"
        element={<ReportDetail reports={reports} setReports={setReports} />}
      />

      <Route path="/report/new" element={<ReportForm />} />
    </Routes>
  );
}
