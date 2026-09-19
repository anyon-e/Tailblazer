import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { AnimalReport } from "../types/report";

export function MapView({ reports }: { reports: AnimalReport[] }) {
  const lostReports = reports.filter((r) => r.status === "lost");

  return (
    <MapContainer
      center={[49.28, -123.12]}
      zoom={12}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {lostReports.map((r) => (
        <Marker key={r.id} position={[r.location.lat, r.location.lng]}>
          <Popup>
            <div style={{ width: 180 }}>
              <h3>{r.name}</h3>
              <p>{r.type}</p>

              {r.imageUrl && (
                <img
                  src={r.imageUrl}
                  alt={r.name}
                  style={{ width: "100%", borderRadius: 6 }}
                />
              )}

              <a href={`/report/${r.id}`}>View details</a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
