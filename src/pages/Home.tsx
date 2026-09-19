import { useEffect, useState } from "react";
import { type AnimalReport, ReportStatus } from "../types/report";
import { getReports } from "../api/jsonbin";
import { MapView } from "../components/MapViewer";

export default function Home() {
  const [reports, setReports] = useState<AnimalReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        const data = await getReports();
        setReports(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  if (loading) return <div>Loading map...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ height: "100vh" }}>
      <MapView
        reports={reports.filter((r) => r.status === ReportStatus.lost)}
      />
    </div>
  );
}
