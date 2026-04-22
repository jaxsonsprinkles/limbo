interface CountdownRingProps {
  secondsRemaining: number
  totalSeconds: number
  size?: number
}

export function CountdownRing({ secondsRemaining, totalSeconds, size = 44 }: CountdownRingProps) {
  const radius = (size - 4) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.max(0, Math.min(1, secondsRemaining / totalSeconds))
  const dashoffset = circumference * (1 - progress)

  const color =
    progress > 0.5 ? '#6C5CE7' :
    progress > 0.2 ? '#F59E0B' :
    '#FF6B6B'

  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#E5E5E5"
        strokeWidth={3}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashoffset}
        style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.8s ease' }}
      />
    </svg>
  )
}
