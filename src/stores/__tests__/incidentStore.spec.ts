import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useIncidentStore } from '../incidentStore'
import { incidentApi } from '@/api/incidentApi'
import { MOCK_INCIDENTS } from '@/api/mockData'

describe('Incident Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    // Use mock data instead of calling the API
    vi.spyOn(incidentApi, 'getAllIncidents').mockResolvedValue(MOCK_INCIDENTS)
  })

  it('initializes with empty incidents', () => {
    const store = useIncidentStore()
    expect(store.incidents).toEqual([])
    expect(store.loading).toBe(false)
  })

  it('fetches incidents and populates state', async () => {
    const store = useIncidentStore()
    await store.fetchIncidents()

    expect(incidentApi.getAllIncidents).toHaveBeenCalled()
    expect(store.incidents.length).toBeGreaterThan(0)
    expect(store.incidents[0]?.id).toBeDefined()
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('can count critical incidents', async () => {
    const store = useIncidentStore()
    await store.fetchIncidents()

    expect(store.criticalCount).toBe(2)
  })
})
