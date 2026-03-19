import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts'
import type { Practitioner } from '../data/types'
import { useTranslation } from '../i18n/useTranslation'

interface DotPlotProps {
  data: Practitioner[]
  benchmark: number
}

export function DotPlot({ data, benchmark }: DotPlotProps) {
  const { t } = useTranslation()

  const plotData = data.map((p, i) => ({
    name: p.id,
    x: p.avg,
    y: i,
    delta: p.delta,
  }))

  const minX = Math.min(...data.map(p => p.avg), benchmark) - 5
  const maxX = Math.max(...data.map(p => p.avg), benchmark) + 5

  return (
    <ResponsiveContainer width="100%" height={data.length * 50 + 60}>
      <ScatterChart margin={{ top: 20, right: 60, bottom: 30, left: 100 }}>
        <XAxis
          type="number"
          dataKey="x"
          domain={[minX, maxX]}
          tick={{ fontSize: 12 }}
          label={{ value: 'min', position: 'insideBottomRight', fontSize: 11, offset: -5 }}
        />
        <YAxis
          type="number"
          dataKey="y"
          tick={{ fontSize: 12 }}
          tickFormatter={(val: number) => plotData[val]?.name ?? ''}
          domain={[-0.5, data.length - 0.5]}
          reversed
        />
        <ReferenceLine
          x={benchmark}
          stroke="var(--muted-foreground)"
          strokeDasharray="4 4"
          label={{
            value: `${t('treatment.benchmark')} ${benchmark} min`,
            position: 'top',
            fontSize: 11,
            fill: 'var(--muted-foreground)',
          }}
        />
        <RechartsTooltip
          formatter={(_v, _n, props) => {
            const p = props.payload as { name: string; x: number; delta: number }
            const sign = p.delta > 0 ? '+' : ''
            return [`${p.x} min (${sign}${p.delta})`, p.name]
          }}
        />
        <Scatter
          data={plotData}
          fill="var(--chart-2)"
          r={6}
        />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
