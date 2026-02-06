import client from './client'
import type { IncidentDTO } from '@/types/IncidentDTO'

export const incidentService = {
  async getAllIncidents(): Promise<IncidentDTO[]> {
    const response = await client.get<{ incidents: IncidentDTO[] }>('')
    return response.data.incidents
  },

  async updateIncident(id: string, payload: Partial<IncidentDTO>): Promise<IncidentDTO> {
    const response = await client.put<IncidentDTO>(`/${id}`, payload)
    return response.data
  },

  async getIncidentById(id: string): Promise<IncidentDTO> {
    const response = await client.get<IncidentDTO>(`/${id}`)
    return response.data
  },
}
