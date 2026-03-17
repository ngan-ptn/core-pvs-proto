import { describe, it, expect } from 'vitest'
import { formatDate, formatTime, formatNumber } from '../formatters'

describe('formatDate', () => {
  it('formats date as DD.MM.YYYY by default (German numeric)', () => {
    const date = new Date(2026, 3, 12) // April 12, 2026
    expect(formatDate(date)).toBe('12.04.2026')
  })

  it('formats date in short style (dd Mmm yyyy)', () => {
    const date = new Date(2024, 2, 26) // March 26, 2024
    const result = formatDate(date, 'short')
    // de-DE short: "26. März 2024" or "26. Mär. 2024" depending on runtime
    expect(result).toMatch(/26\.\s*Mär/)
    expect(result).toContain('2024')
  })

  it('accepts string date input', () => {
    expect(formatDate('2026-04-12')).toBe('12.04.2026')
  })

  it('accepts numeric timestamp input', () => {
    const ts = new Date(2026, 3, 12).getTime()
    expect(formatDate(ts)).toBe('12.04.2026')
  })
})

describe('formatTime', () => {
  it('formats time in 24h format (HH:MM)', () => {
    const date = new Date(2026, 0, 1, 14, 30)
    expect(formatTime(date)).toBe('14:30')
  })

  it('formats midnight correctly', () => {
    const date = new Date(2026, 0, 1, 0, 0)
    expect(formatTime(date)).toBe('00:00')
  })
})

describe('formatNumber', () => {
  it('formats numbers with German locale (dot as thousands separator)', () => {
    expect(formatNumber(1234567)).toBe('1.234.567')
  })

  it('formats decimal numbers with comma', () => {
    const result = formatNumber(1234.56, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    expect(result).toBe('1.234,56')
  })

  it('formats currency', () => {
    const result = formatNumber(42.5, {
      style: 'currency',
      currency: 'EUR',
    })
    expect(result).toContain('42,50')
    expect(result).toContain('€')
  })
})
