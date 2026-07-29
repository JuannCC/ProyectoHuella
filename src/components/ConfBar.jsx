import { CONF_LABELS } from "../constants/animals";

export default function ConfBar({ value }) {
  return (
    <div className="conf-visual">
      {[0,1,2,3,4,5].map(i => (
        <div
          key={i}
          className={`conf-pip ${i <= value ? "on" : ""}`}
        />
      ))}
      <span className="conf-text">
        {CONF_LABELS[value]}
      </span>
    </div>
  );
}