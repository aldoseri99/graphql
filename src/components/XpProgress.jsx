import { useMemo } from "react";
import './XpProgress.css'

export const XpProgress = ({ arr = [] }) => {

  const { points, startLabel, endLabel } = useMemo(() => {
    if (!arr.length) return { points: [], startLabel: "", endLabel: "" };

    const xp = arr
      .filter((t) => t.type === "xp" && t.createdAt)
      .slice()
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    let total = 0;

    const formatter = new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    const points = xp.map((t) => {
      total += t.amount;
      return {
        value: total,
        label: formatter.format(new Date(t.createdAt)),
      };
    });

    return {
      points,
      startLabel: points[0]?.label || "",
      endLabel: points.at(-1)?.label || "",
    };
  }, [arr]);

  if (!points.length) return <p>No XP data</p>;

  return (
    <section className="xpCard">
      <header className="xpHeader">
        <div className="xpKicker">XP Progress</div>
        <div className="xpMeta">
          {startLabel} <span className="xpArrow">→</span> {endLabel}
        </div>
      </header>

      <div className="xpChartWrap">
        <svg className="xpSvg" viewBox="0 0 520 180" role="img" aria-label="XP progress">
          <LineChart points={points} width={520} height={180} />
        </svg>
      </div>
    </section>
  );

};

function LineChart({ points, width, height, padding = 14 }) {
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const toX = (i) =>
    padding + (i * (width - padding * 2)) / (points.length - 1 || 1);

  const toY = (v) =>
    padding + ((max - v) * (height - padding * 2)) / range;

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(p.value)}`)
    .join(" ");

  return (
    <>
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="none"
        stroke="currentColor"
        opacity="0.1"
      />
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2" />
    </>
  );
}
