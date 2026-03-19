import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { Status } from '../data/types'

interface BarDatum {
  name: string
  value: number
  status?: Status
}

interface HorizontalBarChartProps {
  data: BarDatum[]
  referenceLine?: { value: number; label: string }
  height?: number
  colorFn?: (datum: BarDatum) => string
  tooltipFormatter?: (datum: BarDatum) => string
  unit?: string
}

const defaultColor = 'var(--chart-1)'

const statusColorMap: Record<Status, string> = {
  critical: 'var(--status-critical)',
  warning: 'var(--status-warning)',
  normal: 'var(--status-normal)',
  neutral: 'var(--status-neutral)',
}

export function HorizontalBarChart({
  data,
  referenceLine,
  height = 300,
  colorFn,
  tooltipFormatter,
  unit = '',
}: HorizontalBarChartProps) {
  const getColor = (d: BarDatum) => {
    if (colorFn) return colorFn(d)
    if (d.status) return statusColorMap[d.status]
    return defaultColor
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 40, bottom: 8, left: 120 }}>
        <XAxis type="number" tick={{ fontSize: 12 }} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={110} />
        <RechartsTooltip
          formatter={(_val, _name, props) => {
            const d = props.payload as BarDatum
            if (tooltipFormatter) return [tooltipFormatter(d), '']
            return [`${d.value}${unit}`, d.name]
          }}
        />
        {referenceLine && (
          <ReferenceLine
            x={referenceLine.value}
            stroke="var(--muted-foreground)"
            strokeDasharray="4 4"
            label={{
              value: referenceLine.label,
              position: 'top',
              fontSize: 11,
              fill: 'var(--muted-foreground)',
            }}
          />
        )}
        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
          {data.map((d, i) => (
            <Cell key={i} fill={getColor(d)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
