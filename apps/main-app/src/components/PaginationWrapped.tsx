import { useTranslation } from 'react-i18next'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@tini/ui'

interface PaginationWrappedProps {
  hasNext?: boolean
  hasPrevious?: boolean
  onNext?: () => void
  onPrevious?: () => void
}

export function PaginationWrapped({
  hasNext = true,
  hasPrevious = true,
  onNext,
  onPrevious,
}: PaginationWrappedProps) {
  const { t } = useTranslation('common')

  return (
    <Pagination>
      <PaginationContent>
        {hasPrevious && (
          <PaginationItem>
            <PaginationPrevious onClick={onPrevious}>
              {t('pagination.previous')}
            </PaginationPrevious>
          </PaginationItem>
        )}
        {hasNext && (
          <PaginationItem>
            <PaginationNext onClick={onNext}>
              {t('pagination.next')}
            </PaginationNext>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
