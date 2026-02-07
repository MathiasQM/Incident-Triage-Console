import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { incidentService } from '@/api/incidentService'
import { mapToIncident, mapPartialToIncidentDTO } from '@/mappers/IncidentMapper'
import type { Incident } from '@/models/Incident'
import { IncidentSeverity } from '@/models/Incident'

export const useIncidentStore = defineStore('incident', () => {
  const incidents = ref<Incident[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getIncidentById = computed(() => {
    return (id: string) => incidents.value.find((i) => i.id === id)
  })

  // Sort by Date (newest first) by default
  const sortedIncidents = computed(() => {
    return [...incidents.value].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  })

  const criticalCount = computed(() => {
    return incidents.value.filter((i) => i.severity === IncidentSeverity.CRITICAL).length
  })

  async function fetchIncidents() {
    loading.value = true
    error.value = null
    try {
      const dtos = await incidentService.getAllIncidents()
      incidents.value = dtos.map(mapToIncident)
    } catch (err: unknown) {
      console.error('Failed to fetch incidents:', err)
      const message = err instanceof Error ? err.message : 'Unknown error occurred'
      error.value = message
    } finally {
      loading.value = false
    }
  }

  async function updateIncident(id: string, updates: Partial<Incident>) {
    const index = incidents.value.findIndex((i) => i.id === id)
    if (index === -1) return

    const previousState = { ...incidents.value[index] } as Incident

    incidents.value[index] = {
      ...previousState,
      ...updates,
      updatedAt: new Date(),
    }

    try {
      const dtoUpdates = mapPartialToIncidentDTO(updates)
      await incidentService.updateIncident(id, dtoUpdates)
    } catch (err: unknown) {
      console.error('Optimistic update failed, but persisting local change:', err)
      const message = err instanceof Error ? err.message : 'Unknown error occurred'
      error.value = message
      throw err
    }
  }

  return {
    incidents,
    loading,
    error,
    sortedIncidents,
    getIncidentById,
    criticalCount,
    fetchIncidents,
    updateIncident,
  }
})
