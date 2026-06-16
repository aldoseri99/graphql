import { useEffect, useMemo, useState } from 'react'
import './Audit.css'

export const Audit = ({ audit }) => {
  const { ratio, up, down } = useMemo(() => {
    let upSum = 0
    let downSum = 0

    let value = 0

    ;(audit || []).forEach((v) => {
      if (v.type.toLowerCase() == 'up') {
        upSum += v.amount
        value += v.amount
      } else if (v.type.toLowerCase() === 'down') {
        downSum += v.amount
        const downPerCent = v.amount * 0.9
        value -= v.amount - downPerCent
      }
    })

    const ratio = downSum === 0 ? '∞' : (upSum / downSum).toFixed(1)

    return { ratio, up: upSum, down: downSum }
  }, [audit])

  return (
    <div className="auditCard auditSingle">
      <div className="auditHeader">
        <div className="auditKicker">Audit Score</div>
        <div className="auditBig">{ratio}</div>
      </div>

      <div className="auditBlock">
        <div className="auditBlockTitle">Given vs Received</div>
        <div className="auditViz">
          <UpDownBar up={up} down={down} width={320} height={90} />
        </div>
      </div>
    </div>
  )
}

export function UpDownBar({ up = 0, down = 0, width = 320, height = 90 }) {
  const formatAudit = (num) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)} MB`
    if (num >= 1_000) return `${Math.round(num / 1000)} KB`
    return num.toString()
  }

  const padding = 14
  const gap = 18
  const barHeight = 14

  const max = Math.max(up, down, 1)
  const innerW = width - padding * 2

  const upWidth = (up / max) * innerW
  const downWidth = (down / max) * innerW

  const upY = padding + 14 // leave space for label
  const downY = upY + barHeight + gap + 14

  const displayUp = formatAudit(up)
  const displayDown = formatAudit(down)

  return (
    <svg
      className="upDownSvg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Up ${up}, Down ${down}`}
    >
      {/* UP row */}
      <text x={padding} y={padding} fontSize="12" className="upDownLabel">
        GIVEN
      </text>
      <text
        x={width - padding}
        y={padding}
        fontSize="12"
        textAnchor="end"
        className="upDownValue upText"
      >
        {displayUp}
      </text>

      {/* track */}
      <rect
        x={padding}
        y={upY}
        width={innerW}
        height={barHeight}
        rx="8"
        className="upDownTrack"
      />
      {/* bar */}
      <rect
        x={padding}
        y={upY}
        width={upWidth}
        height={barHeight}
        rx="8"
        className="upBar"
      />

      {/* DOWN row */}
      <text
        x={padding}
        y={upY + barHeight + gap}
        fontSize="12"
        className="upDownLabel"
      >
        RECEIVED
      </text>
      <text
        x={width - padding}
        y={upY + barHeight + gap}
        fontSize="12"
        textAnchor="end"
        className="upDownValue downText"
      >
        {displayDown}
      </text>

      {/* track */}
      <rect
        x={padding}
        y={downY}
        width={innerW}
        height={barHeight}
        rx="8"
        className="upDownTrack"
      />
      {/* bar */}
      <rect
        x={padding}
        y={downY}
        width={downWidth}
        height={barHeight}
        rx="8"
        className="downBar"
      />
    </svg>
  )
}
