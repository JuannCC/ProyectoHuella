import { ESTADO } from "../constants/animals";

export default function Badge({ estado }) {
  const s = ESTADO[estado] || {};

  return (
    <span className={`badge ${s.cls}`}>
      {s.emoji} {s.label}
    </span>
  );
}