import { describe, it, expect } from 'vitest'
import { mapToIncident } from '../IncidentMapper'
import type { IncidentDTO } from '@/types/IncidentDTO'
import { IncidentSeverity, IncidentStatus } from '@/models/Incident'

describe('IncidentMapper', () => {
  it('maps a full IncidentDTO to Incident model correctly', () => {
    const dto: IncidentDTO = {
      id: 'INC-123',
      title: 'Test Incident',
      description: 'Something bad happened',
      severity: 'High',
      status: 'Open',
      service: { id: 'svc-1', name: 'Auth Service' },
      createdAt: '2026-01-01T12:00:00Z',
      updatedAt: '2026-01-02T12:00:00Z',
      assignee: { id: 'usr-1', displayName: 'John Doe' },
    }

    const result = mapToIncident(dto)

    expect(result.id).toBe('INC-123')
    expect(result.title).toBe('Test Incident')
    expect(result.severity).toBe(IncidentSeverity.HIGH)
    expect(result.status).toBe(IncidentStatus.OPEN)
    expect(result.serviceId).toBe('svc-1')
    expect(result.serviceName).toBe('Auth Service')
    expect(result.createdAt).toBeInstanceOf(Date)
    expect(result.createdAt.toISOString()).toBe('2026-01-01T12:00:00.000Z')
    expect(result.assigneeId).toBe('usr-1')
    expect(result.assigneeName).toBe('John Doe')
  })

  it('handles null assignee correctly', () => {
    const dto: IncidentDTO = {
      id: 'INC-124',
      title: 'Unassigned',
      description: 'No one is here',
      severity: 'Low',
      status: 'Acknowledged',
      service: { id: 'svc-2', name: 'Database' },
      createdAt: '2026-01-01T10:00:00Z',
      updatedAt: '2026-01-01T10:00:00Z',
      assignee: null,
    }

    const result = mapToIncident(dto)

    expect(result.assigneeId).toBeNull()
    expect(result.assigneeName).toBeNull()
  })
})
