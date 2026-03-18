import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@tini/ui'
import type { AvailableSlot } from '../data/types'
import { locationNames } from '../data/fixtures'
import { useTranslation } from '../i18n/useTranslation'

interface SlotsTableProps {
  data: AvailableSlot[]
}

export function SlotsTable({ data }: SlotsTableProps) {
  const { t } = useTranslation()

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-[var(--color-surface-muted)]">
          <TableHead className="text-xs font-semibold uppercase tracking-figma text-[var(--color-text-placeholder)]">{t('resources.columnLocation')}</TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-figma text-[var(--color-text-placeholder)]">{t('resources.columnSpecialty')}</TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-figma text-[var(--color-text-placeholder)]">{t('resources.columnTimeWindow')}</TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-figma text-[var(--color-text-placeholder)] text-right">{t('resources.columnCount')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((slot, i) => (
          <TableRow key={i} className={i % 2 === 0 ? '' : 'bg-[var(--color-surface-stripe)]'}>
            <TableCell className="text-sm tracking-figma text-[var(--color-text-primary)] py-2 px-4">{locationNames[slot.location]}</TableCell>
            <TableCell className="text-sm tracking-figma text-[var(--color-text-primary)] py-2 px-4">{slot.specialty}</TableCell>
            <TableCell className="text-sm tracking-figma text-[var(--color-text-primary)] py-2 px-4">{slot.timeWindow}</TableCell>
            <TableCell className="text-sm tracking-figma text-[var(--color-text-primary)] font-semibold text-right py-2 px-4">{slot.count}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
