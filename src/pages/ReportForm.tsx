import { useState } from "react";
import {
  AnimalType,
  ReportStatus,
  type ReportDraft,
  type AnimalReport,
} from "../types/report";
import { uploadImage } from "../api/imgbb";
import { getReports, saveReports } from "../api/jsonbin";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

function isValidContact(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const phoneRegex = /^[+]?[\d\s\-()]{7,}$/;

  return emailRegex.test(value) || phoneRegex.test(value);
}

async function hashPassword(password: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function LocationPicker({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

export function ReportForm() {
  const [contactError, setContactError] = useState("");
  const [form, setForm] = useState<ReportDraft>({
    name: "",
    type: AnimalType.Dog,
    description: "",
    contact: "",
    imageFile: null,
    location: null,
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [addressPreview, setAddressPreview] = useState("");
  const [selectedPos, setSelectedPos] = useState<[number, number] | null>(null);

  // REVERSE GEOCODING
  const fetchAddress = async (lat: number, lng: number) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    );

    const data = await res.json();
    return data.display_name || "Unknown location";
  };

  // SUBMIT HANDLER
  const handleSubmit = async () => {
    if (!isValidContact(form.contact)) {
      setContactError("Enter a valid email or phone number");
      return;
    } else {
      setContactError("");
    }
    try {
      setLoading(true);

      // 1. Upload image
      let imageUrl = "";
      if (form.imageFile) {
        imageUrl = await uploadImage(form.imageFile);
      }

      // 2. Hash password (SHA-256)
      const passwordHash = await hashPassword(form.password);

      // 3. Ensure location exists
      if (!form.location) {
        alert("Please select a location on the map");
        return;
      }

      // 4. Create report
      const newReport: AnimalReport = {
        id: crypto.randomUUID(),
        name: form.name,
        type: form.type,
        description: form.description,
        contact: form.contact,
        imageUrl,
        location: form.location,
        status: ReportStatus.lost,
        passwordHash,
        createdAt: new Date().toISOString(),
      };

      // 5. Save to JSONBin
      const reports = await getReports();
      await saveReports([...reports, newReport]);

      alert("Report submitted!");

      // 6. Reset form
      setForm({
        name: "",
        type: AnimalType.Dog,
        description: "",
        contact: "",
        imageFile: null,
        location: null,
        password: "",
      });

      setAddressPreview("");
    } catch (err) {
      console.error(err);
      alert("Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form">
      <h2>Report Lost Pet</h2>

      {/* NAME */}
      <div className="form-group">
        <label>Pet Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      {/* TYPE */}
      <div className="form-group">
        <label>Animal Type</label>
        <select
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value as AnimalType })
          }
        >
          {Object.values(AnimalType).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* DESCRIPTION */}
      <div className="form-group">
        <label>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      {/* CONTACT */}
      <div className="form-group">
        <label>Contact</label>

        <input
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
        />

        {contactError && (
          <p style={{ color: "var(--danger)", fontSize: 12 }}>{contactError}</p>
        )}
      </div>

      {/* IMAGE */}
      <div className="form-group">
        <label>Photo</label>
        <input
          type="file"
          onChange={(e) =>
            setForm({
              ...form,
              imageFile: e.target.files?.[0] || null,
            })
          }
        />
      </div>

      {/* PASSWORD */}
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </div>

      {/* MAP */}
      <div className="form-group">
        <label>Last Seen Location</label>

        <div style={{ height: 300 }}>
          <MapContainer
            center={[49.28, -123.12]}
            zoom={10}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <LocationPicker
              onPick={async (lat, lng) => {
                const addr = await fetchAddress(lat, lng);

                setForm({
                  ...form,
                  location: { lat, lng, address: addr },
                });

                setSelectedPos([lat, lng]);
                setAddressPreview(addr);
              }}
            />

            {selectedPos && <Marker position={selectedPos} />}
          </MapContainer>
        </div>

        {addressPreview && <p style={{ marginTop: 8 }}>📍 {addressPreview}</p>}
      </div>

      {/* SUBMIT */}
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Submit Report"}
      </button>
    </div>
  );
}
