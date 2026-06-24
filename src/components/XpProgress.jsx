import { useMemo } from 'react'
import './XpProgress.css'

export const XpProgress = ({ arr = [], user }) => {
  const { points, startLabel, endLabel } = useMemo(() => {
    if (!arr.length) return { points: [], startLabel: '', endLabel: '' }

    const xp = arr
      .filter((t) => t.type === 'xp' && t.createdAt)
      .slice()
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

    let total = 0

    const formatter = new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    })

    const points = [
      {
        value: 0,
        label: formatter.format(new Date(user.createdAt))
      },
      ...xp.map((t) => {
        total += Number(t.amount || 0)

        return {
          value: total,
          label: formatter.format(new Date(t.createdAt))
        }
      })
    ]

    return {
      points,
      startLabel: points[0]?.label || '',
      endLabel: points.at(-1)?.label || ''
    }
  }, [arr, user])

  if (!points.length) return <p>No XP data</p>

  return (
    <section className="xpCard">
      <header className="xpHeader">
        <div className="xpKicker">XP Progress</div>
        <div className="xpMeta">
          {startLabel} <span className="xpArrow">→</span> {endLabel}
        </div>
      </header>

      <div className="xpChartWrap">
        <svg
          className="xpSvg"
          viewBox="0 0 520 180"
          role="img"
          aria-label="XP progress"
        >
          <LineChart
            points={points}
            width={520}
            height={180}
            date={{ startLabel, endLabel }}
          />
        </svg>
      </div>
    </section>
  )
}

function LineChart({ points, width, height, padding = 30, date }) {
  if (!points?.length) return null

  const values = points.map((p) => p.value)

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const chartHeight = height - 25

  const toX = (i) =>
    padding + (i * (width - padding * 2)) / (points.length - 1 || 1)

  const toY = (v) => padding + ((max - v) * (chartHeight - padding * 2)) / range

  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(p.value)}`)
    .join(' ')

  const formatDate = (dateString) => {
    const d = new Date(dateString)

    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short'
    })
  }
  const formatXP = (xp) => {
    if (xp >= 1_000_000) return `${(xp / 1_000_000).toFixed(1)} MB`
    if (xp >= 1_000) return `${Math.round(xp / 1000)} KB`
    return xp.toString()
  }

  return (
    <>
      {/* Frame */}
      <rect
        x="0"
        y="0"
        width={width}
        height={chartHeight}
        fill="none"
        stroke="currentColor"
        opacity="0.1"
      />

      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const y = padding + t * (chartHeight - padding * 2)
        const value = Math.round(max - t * range)

        return (
          <g key={i}>
            <line
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.08"
            />

            <text
              x={padding-20}
              y={y + 4}
              // textAnchor="center"
              fontSize="10"
              fill="currentColor"
              opacity="0.6"
            >
              {formatXP(value)}
            </text>
          </g>
        )
      })}

      <path d={path} fill="none" stroke="currentColor" strokeWidth="3" />

      {points.map((p, i) => (
        <g key={i}>
          <circle cx={toX(i)} cy={toY(p.value)} r="2" fill="currentColor" />

          {i === points.length - 1 && (
            <text
              x={toX(i)}
              y={toY(p.value) - 10}
              textAnchor="middle"
              fontSize="11"
              fill="currentColor"
              opacity="0.85"
            >
              {formatXP(p.value)}
            </text>
          )}
        </g>
      ))}

      <text
        x={padding}
        y={height - 5}
        textAnchor="start"
        fontSize="10"
        fill="currentColor"
        opacity="0.65"
      >
        {date.startLabel}
      </text>

      <text
        x={width - padding}
        y={height - 5}
        textAnchor="end"
        fontSize="10"
        fill="currentColor"
        opacity="0.65"
      >
        {date.endLabel}
      </text>
    </>
  )
}
