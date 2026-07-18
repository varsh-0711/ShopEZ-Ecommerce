export default function Rating({ value, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ background: "#388e3c", color: "#fff", borderRadius: 3, padding: "2px 7px", fontSize: 12, fontWeight: 700 }}>
        {value} ★
      </span>
      {count && <span style={{ fontSize: 11, color: "#878787" }}>({Number(count).toLocaleString("en-IN")})</span>}
    </div>
  );
}
