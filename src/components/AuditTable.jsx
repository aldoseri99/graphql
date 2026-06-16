import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import "./AuditTable.css";

export const AuditTable = ({ audit = [] }) => {
  const [expanded, setExpanded] = useState(false);

  const sortByDateDesc = (arr = []) =>
    arr.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const formatDateTime = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);

    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();

    let h = d.getHours();
    const min = String(d.getMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12; // 0 -> 12

    return `${dd}/${mm}/${yyyy} - ${h}:${min} ${ampm}`;
  };

  const sorted = useMemo(() => sortByDateDesc(audit), [audit]);

  const visible = expanded ? sorted : sorted.slice(0, 3);
  const canToggle = sorted.length > 3;

  return (
    <div className="auditTableWrap">
      <div className="auditTableHeader">
        <h3 className="auditTitle">Recent Audits</h3>

        {canToggle && (
          <button
            type="button"
            className="auditToggle"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      <table className="auditTable">
        <thead>
          <tr>
            <th>Project</th>
            <th className="right">Audit Points</th>
            <th className="right">Date</th>
          </tr>
        </thead>

        <tbody>
          {visible.map((a, i) => {
            const isUp = a.type === "up";

            return (
              <tr key={a.id || i}>
                <td className="projName">{a.object?.name || "—"}</td>

                <td className="amount right">
                  {Number(a.amount || 0).toLocaleString()}
                  <span className={`gain center ${isUp ? "up" : "down"}`}>
                    <FontAwesomeIcon icon={isUp ? faArrowUp : faArrowDown} />
                  </span>
                </td>

                <td className="date right">{formatDateTime(a.createdAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {!audit.length && <p className="auditEmpty">Nothing here</p>}
    </div>
  );
};
