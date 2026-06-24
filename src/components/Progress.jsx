import { useEffect, useState } from "react";
import './Progress.css'
import { useNavigate } from "react-router-dom";

export const Progress = ({ progress }) => {

  const navigate = useNavigate()

  const allProjects = () => {
    navigate('/projects')
  }
  
 const filterEvent = (arr = []) =>
  arr
    .filter((proj) => proj.isDone && proj.eventId === 763)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

return (
  <>
    {progress?.length === 0 && <p className="empty">Nothing here</p>}

    <div className="summaryRow">
      

      <section className="card tableCard" onClick={allProjects}>
        <h3 className="cardTitle">Latest Projects Done</h3>

        <table className="auditTable">
          <thead>
            <tr>
              <th className="nameCol">Project Name</th>
              <th className="statusCol">Status</th>
            </tr>
          </thead>

          <tbody>
            {filterEvent(progress).slice(0, 2).map((item) => {
              const isFail = Number(item.grade) < 1.2;

              return (
                <tr key={item.id}>
                  <td className="projName">{item.object?.name}</td>
                  <td className="statusCell">
                    <span className={`statusPill ${isFail ? "fail" : "pass"}`}>
                      {isFail ? "Fail" : "Pass"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
      <section className="card donutCard">
        <h3 className="cardTitle">Overview</h3>
        <PassFailDonut progress={filterEvent(progress)} />
      </section>
    </div>
  </>
);

};

function PassFailDonut({ progress, size = 140, stroke = 18 }) {
  const total = progress?.length || 0;

  const fail = (progress || []).filter((p) => Number(p.grade) <= 1).length;
  const pass = total - fail;

  const passPct = total ? pass / total : 0;
  const failPct = total ? fail / total : 0;

  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  const passLen = c * passPct;

  const center = size / 2;

  const PASS = "var(--pass)";
const FAIL = "var(--fail)";
const TRACK = "rgba(255,255,255,0.12)";

return (
  <div className="donutWrap">
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke={TRACK}
        strokeWidth={stroke}
      />

      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke={FAIL}
        opacity="0.6"
        strokeWidth={stroke}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
        strokeDasharray={`${c} ${c}`}
      />

      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke={PASS}
        strokeWidth={stroke}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
        strokeDasharray={`${passLen} ${c - passLen}`}
      />

      <circle cx={center} cy={center} r={r - stroke / 2} fill="transparent" />

      <text
        x={center}
        y={center}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="14"
        fill="var(--text)"
      >
        {total ? `${Math.round(passPct * 100)}%` : "—"}
      </text>

      <text
        x={center}
        y={center + 18}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="11"
        fill="var(--muted)"
      >
        pass
      </text>
    </svg>

    <div className="donutMeta">
      Pass: <span className="passText">{pass}</span> • Fail:{" "}
      <span className="failText">{fail}</span> • Total: {total}
    </div>
  </div>
);

}
