import { useEffect, useState, useMemo } from 'react'
import './Level.css'

export const LevelStats = ({ transaction = [] }) => {
  const [skills, setSkills] = useState({})

  useEffect(() => {
    const filtered = transaction.filter(
      (t) => t.eventId === 763 && t.type.startsWith('skill_')
    )

    const skillTotals = {}
    filtered.forEach((e) => {
      const skill = e.type.replace('skill_', '')
      skillTotals[skill] = (skillTotals[skill] || 0) + e.amount
    })

    setSkills(skillTotals)
  }, [transaction])

  return (
    <section className="levelCard">
      <header className="levelHeader">
        <div>
          <h3 className="levelTitle">Performance Metrics</h3>
          <p className="levelSub">Top 6 skills • graded A–E</p>
        </div>

        <span className="levelPill">Optics and Design</span>
      </header>

      <div className="levelBody">
        <div className="levelChartWrap">
          <SkillsStandChart skills={skills} />
        </div>

        <LevelPanel transaction={transaction} />
      </div>
    </section>
  )
}

export const LevelPanel = ({ transaction = [] }) => {
  transaction = transaction.filter(t => t.eventId === 763)
  const getTotalXP = (arr = []) => {
    return arr.reduce((total, t) => {
      return t.type === 'xp' ? total + Number(t.amount || 0) : total
    }, 0)
  }
  const formatXP = (xp) => {
    if (xp >= 1_000_000) return `${(xp / 1_000_000).toFixed(1)} MB`
    if (xp >= 1_000) return `${Math.round(xp / 1000)} KB`
    return xp.toString()
  }
  const getLevel = (arr = []) => {
    const levels = arr.filter((t) => t.type === 'level')
    if (!levels.length) return '—'

    // pick the last level entry (as you asked)
    const last = levels.at(-1)

    // fallback: if last is weird, take the max amount
    const max = Math.max(...levels.map((t) => Number(t.amount || 0)))

    return String(Number(last?.amount ?? max))
  }
  const getLastProj = (arr = []) => {
    const last = arr
      .filter((t) => t.type === 'xp' && t.createdAt)
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]

    if (!last) return { name: '—', amount: 0 }

    // Try best project name source
    const name = last.object?.name

    return {
      name,
      amount: Number(last.amount || 0)
    }
  }
  let lastProj = getLastProj(transaction)
  let totalXP = getTotalXP(transaction)
  let displayXP = formatXP(totalXP)
  let level = getLevel(transaction)

  return (
    <aside className="levelPanel">
      <div className="levelPanelTitle">Refinement Summary</div>

      <div className="levelGrid">
        <div className="levelStat">
          <span>Level</span>
          <b>{level}</b>
        </div>

        <div className="levelStat">
          <span>Total XP</span>
          <b>{displayXP}</b>
        </div>

        <div className="levelStat levelWide">
          <span>Last Project</span>
          <b>{lastProj.name}</b>
        </div>

        <div className="levelStat levelWide">
          <span>XP Gained</span>
          <b>{lastProj.amount}</b>
        </div>
      </div>

      <p className="levelNote">“Please enjoy each metric equally.”</p>
    </aside>
  )
}

export function SkillsStandChart({ skills, cap = 300 }) {
  const size = 420
  const cx = size / 2
  const cy = size / 2

  const outerR = 185
  const innerR = 90

  const labels = ['Prog', 'Go', 'Front-End', 'Js', 'Html', 'Back-End']

  const keyMap = {
    Prog: 'prog',
    Go: 'go',
    'Front-End': 'front-end',
    Js: 'js',
    Html: 'html',
    'Back-End': 'back-end'
  }

  const gradeRatio = { A: 1, B: 0.8, C: 0.6, D: 0.4, E: 0.2 }

  const { items, polygon } = useMemo(() => {
    // convert skills object → array
    const sorted = Object.entries(skills)
      .sort((a, b) => b[1] - a[1]) // highest first
      .slice(0, 6) // top 6

    const N = sorted.length

    const items = sorted.map(([skill, value], i) => {
      const raw = Number(value || 0)

      const norm = Math.max(0, Math.min(1, raw / cap))
      const grade = toGrade(norm)
      const ratio = gradeRatio[grade]

      const angle = (2 * Math.PI * i) / N - Math.PI / 2
      const r = ratio * innerR

      return {
        label: skill,
        raw,
        grade,
        angle,
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle)
      }
    })

    return {
      items,
      polygon: items.map((p) => `${p.x},${p.y}`).join(' ')
    }
  }, [skills, cap])

  return (
    <svg
      className="levelSvg"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      {/* Outer ring */}
      <circle
        cx={cx}
        cy={cy}
        r={outerR}
        fill="white"
        stroke="black"
        strokeWidth="6"
      />
      <circle
        cx={cx}
        cy={cy}
        r={outerR - 16}
        fill="white"
        stroke="black"
        strokeWidth="2"
      />

      {/* Inner circle */}
      <circle
        cx={cx}
        cy={cy}
        r={innerR + 10}
        fill="none"
        stroke="black"
        strokeWidth="2"
      />

      {/* Axes */}
      {items.map((p) => {
        const x2 = cx + (innerR + 10) * Math.cos(p.angle)
        const y2 = cy + (innerR + 10) * Math.sin(p.angle)
        return (
          <line
            key={p.label}
            x1={cx}
            y1={cy}
            x2={x2}
            y2={y2}
            stroke="black"
            strokeWidth="2"
          />
        )
      })}

      {/* Polygon */}
      <polygon
        points={polygon}
        fill="#6ea8ff"
        opacity="0.3"
        stroke="black"
        strokeWidth="2"
      />

      {/* Big grade letters */}
      {items.map((p) => {
        const r = outerR - 55
        const x = cx + r * Math.cos(p.angle)
        const y = cy + r * Math.sin(p.angle)
        return (
          <text
            key={p.label + '_grade'}
            x={x}
            y={y}
            fontSize="42"
            fontWeight="900"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {p.grade}
          </text>
        )
      })}

      {items.map((p) => {
        const r = outerR - 30
        const x = cx + r * Math.cos(p.angle)
        const y = cy + r * Math.sin(p.angle)

        const deg = (p.angle * 180) / Math.PI

        // if label is in bottom half → flip
        const isBottom = Math.sin(p.angle) > 0

        const rotation = isBottom ? deg + 270 : deg + 90

        return (
          <text
            key={p.label + '_label'}
            x={x}
            y={y}
            fontSize="16"
            fontWeight="800"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${rotation} ${x} ${y})`}
          >
            {p.label.toUpperCase()}
          </text>
        )
      })}
      {items.map((p) => {
        const r = outerR - 30
        const x = cx + r * Math.cos(p.angle)
        const y = cy + r * Math.sin(p.angle)

        const deg = (p.angle * 180) / Math.PI

        // if label is in bottom half → flip
        const isBottom = Math.sin(p.angle) > 0

        const rotation = isBottom ? deg + 270 : deg + 90

        return (
          <text
            key={p.label + '_label'}
            x={x}
            y={y}
            fontSize="16"
            fontWeight="800"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${rotation} ${x} ${y})`}
          >
            {p.label.toUpperCase()}
          </text>
        )
      })}
    </svg>
  )
}

function toGrade(norm) {
  if (norm >= 0.8) return 'A'
  if (norm >= 0.6) return 'B'
  if (norm >= 0.4) return 'C'
  if (norm >= 0.2) return 'D'
  return 'E'
}
