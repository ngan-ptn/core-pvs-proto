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
        <TableRow>
          <TableHead>{t('resources.columnLocation')}</TableHead>
          <TableHead>{t('resources.columnSpecialty')}</TableHead>
          <TableHead>{t('resources.columnTimeWindow')}</TableHead>
          <TableHead className="text-right">{t('resources.columnCount')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((slot, i) => (
          <TableRow key={i}>
            <TableCell>{locationNames[slot.location]}</TableCell>
            <TableCell>{slot.specialty}</TableCell>
            <TableCell>{slot.timeWindow}</TableCell>
            <TableCell className="text-right font-medium">{slot.count}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
