import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useIncidentStore } from '../incidentStore'
import { incidentService } from '@/api/incidentService'
import { MOCK_INCIDENTS } from '@/api/mockData'
import { IncidentSeverity, IncidentStatus } from '@/models/Incident'

describe('Incident Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    // Use mock data instead of calling the API
    vi.spyOn(incidentService, 'getAllIncidents').mockResolvedValue(MOCK_INCIDENTS)
  })

  it('initializes with default state', () => {
    const store = useIncidentStore()
    expect(store.incidents).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('fetches incidents and populates state', async () => {
    const store = useIncidentStore()
    expect(store.loading).toBe(false)

    const promise = store.fetchIncidents()
    expect(store.loading).toBe(true)
    await promise

    expect(incidentService.getAllIncidents).toHaveBeenCalled()
    expect(store.incidents.length).toBe(MOCK_INCIDENTS.length)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('handles fetch errors gracefully', async () => {
    const store = useIncidentStore()
    const errorMsg = 'Network Error'
    vi.spyOn(incidentService, 'getAllIncidents').mockRejectedValue(new Error(errorMsg))

    await store.fetchIncidents()

    expect(store.incidents).toEqual([])
    expect(store.error).toBe(errorMsg)
    expect(store.loading).toBe(false)
  })

  it('computes sorted incidents (newest first)', async () => {
    const store = useIncidentStore()
    await store.fetchIncidents()

    const sorted = store.sortedIncidents
    expect(sorted.length).toBeGreaterThan(1)

    for (let i = 0; i < sorted.length - 1; i++) {
      const current = new Date(sorted[i]!.createdAt).getTime()
      const next = new Date(sorted[i + 1]!.createdAt).getTime()
      expect(current).toBeGreaterThanOrEqual(next)
    }
  })

  it('computes critical incident count', async () => {
    const store = useIncidentStore()
    await store.fetchIncidents()

    const expectedCount = MOCK_INCIDENTS.filter((i) => i.severity === 'Critical').length
    expect(store.criticalCount).toBe(expectedCount)
  })

  it('gets incident by ID', async () => {
    const store = useIncidentStore()
    await store.fetchIncidents()

    const targetId = MOCK_INCIDENTS[0]!.id
    const incident = store.getIncidentById(targetId)

    expect(incident).toBeDefined()
    expect(incident?.id).toBe(targetId)
  })

  it('updates an incident successfully', async () => {
    const store = useIncidentStore()
    await store.fetchIncidents()

    const targetIncident = store.incidents[0]
    if (!targetIncident) throw new Error('No incidents found in store')

    const updates = {
      status: IncidentStatus.RESOLVED,
      severity: IncidentSeverity.LOW,
    }

    vi.spyOn(incidentService, 'updateIncident').mockResolvedValue({
      ...MOCK_INCIDENTS[0]!,
      ...updates,
    })

    await store.updateIncident(targetIncident.id, updates)

    const updated = store.getIncidentById(targetIncident.id)
    expect(updated?.status).toBe(IncidentStatus.RESOLVED)
    expect(updated?.severity).toBe(IncidentSeverity.LOW)
    if (!updated) throw new Error('Updated incident not found')
    expect(updated.updatedAt.getTime()).toBeGreaterThan(targetIncident.updatedAt.getTime())
  })

  it('updates assignee correctly', async () => {
    const store = useIncidentStore()
    await store.fetchIncidents()

    const targetIncident = store.incidents.find((i) => i.id === 'INC-1001')
    if (!targetIncident) throw new Error('INC-1001 not found')

    const updates = {
      assigneeName: 'Test User',
      assigneeId: 'test-user-id',
    }

    vi.spyOn(incidentService, 'updateIncident').mockResolvedValue({
      ...MOCK_INCIDENTS.find((i) => i.id === 'INC-1001')!,
      assignee: { id: 'test-user-id', displayName: 'Test User' },
    })

    await store.updateIncident(targetIncident.id, updates)

    const updated = store.getIncidentById(targetIncident.id)
    expect(updated?.assigneeName).toBe('Test User')
    expect(updated?.assigneeId).toBe('test-user-id')
  })
})
