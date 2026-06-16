import { useEffect, useState } from "react";
import "./Projects.css";
import { Link } from "react-router-dom";
import { SplashScreen } from "../components/SplashScreen";

export const Projects = ({ token }) => {
  const [transaction, setTransaction] = useState([]);
  const [progress, setProgress] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    fetchInfo(token);
  }, [token]);

  const fetchInfo = async (jwt) => {
    setError("");

    const query = `
  query ProjectsData {
    progress(where: { eventId: { _eq: 763 }}) {
      id
      grade
      objectId
      eventId
      createdAt
      object { name }
    }

    transaction(where: { eventId: { _eq: 763 }, type: { _eq: "xp" } }) {
      id
      amount
      type
      objectId
      eventId
      createdAt
      object { name }
    }
  }
`;

    try {
      const res = await fetch(
        "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({ query }),
        },
      );

      const json = await res.json();

      if (!res.ok || json.errors) {
        const msg =
          json.errors?.[0]?.message || `Request failed (${res.status})`;
        setError(msg);
        setTransaction([]);
        setProgress([]);
        return;
      }

      setTransaction(json.data.transaction || []);
      setProgress(json.data.progress || []);
    } catch (e) {
      setError("Network error");
      setTransaction([]);
      setProgress([]);
    }
  };

  // Example: merge progress + xp transaction by objectId (optional)
  const merged = progress
    .filter((p) => p?.objectId && p.objectId != 100236) // optional: ignore broken rows
    .map((p) => {
      // pick the most recent matching transaction for that objectId
      const t = transaction
        .filter((x) => x.objectId === p.objectId)
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      return {
        name: p.object?.name || "Unknown",
        grade: Number(p.grade ?? 0),
        amount: t ? Number(t.amount ?? 0) : 0,
        eventId: p.eventId,
        started: p.createdAt || null,
        finished: t?.createdAt || null, // ✅ safe
        hasTransaction: !!t,
      };
    })
    .sort((a, b) => {
      const aTime = new Date(a.finished || a.started || 0).getTime();
      const bTime = new Date(b.finished || b.started || 0).getTime();
      return bTime - aTime;
    });
  // const merged = progress
  //   .map((p) => {
  //     const t = transaction.find((x) => x.objectId === p.objectId);
  //     return {
  //       name: p.object?.name || "Unknown",
  //       grade: p.grade,
  //       amount: t?.amount ?? 0,
  //       eventId: p.eventId,
  //       started: p.createdAt,
  //       finished: t.createdAt,
  //     };
  //   })
  //   .sort((a, b) => new Date(b.finished) - new Date(a.finished));

  sessionStorage.setItem("postLoginSplash", "1");
  sessionStorage.setItem("profilSplash", "1");
  const [projectSplash, setProjectSplash] = useState(false);

  useEffect(() => {
    const flag = sessionStorage.getItem("projectSplash");
    if (flag === "1") {
      setProjectSplash(true);

      const timer = setTimeout(() => {
        setProjectSplash(false);
        sessionStorage.removeItem("projectSplash");
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, []);
  const formatDateTime = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);

    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();

    let h = d.getHours();
    const min = String(d.getMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;

    return `${dd}/${mm}/${yyyy}`;
  };

  return (
    <div className="projectsPage">
      {projectSplash && (
        <SplashScreen splashText="Opening Cold Harbor archive…" />
      )}
      <header className="projectsHeader">
        <div className="headerRow">
          <div>
            <h2 className="projectsTitle">Projects</h2>
            <p className="projectsSub">
              Macrodata Refinement performance summary
            </p>
          </div>
        </div>
      </header>

      <section className="card projectsCard">
        <table className="projectsTable">
          <thead>
            <tr>
              <th>Project</th>
              <th className="dateCol">Started</th>
              <th className="dateCol">Finished</th>
              <th className="xpCol">XP</th>
              <th className="resultCol">Result</th>
            </tr>
          </thead>

          <tbody>
            {merged.map((item, index) => {
              const isNull = item.grade === 0 || item.grade === undefined;
              const isFail = !isNull && Number(item.grade) < 1;
              const isPass = !isNull && Number(item.grade) > 1;

              return (
                <tr key={index}>
                  <td className="projName">{item.name}</td>

                  <td className="dateCell">{formatDateTime(item.started)}</td>

                  <td className="dateCell">{formatDateTime(item.finished)}</td>

                  <td className="xpCell">{item.amount}</td>

                  <td className="resultCell">
                    {isNull ? (
                      <span className="statusPill pending">Pending</span>
                    ) : isFail ? (
                      <span className="statusPill fail">Fail</span>
                    ) : (
                      <span className="statusPill pass">Pass</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
};
