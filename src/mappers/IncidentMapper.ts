import type { IncidentDTO } from '@/types/IncidentDTO'
import { type Incident, IncidentSeverity, IncidentStatus } from '@/models/Incident'

export function mapToIncident(dto: IncidentDTO): Incident {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    severity: dto.severity as IncidentSeverity,
    status: dto.status as IncidentStatus,
    serviceId: dto.service.id,
    serviceName: dto.service.name,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    assigneeId: dto.assignee ? dto.assignee.id : null,
    assigneeName: dto.assignee ? dto.assignee.displayName : null,
  }
}

export function mapToIncidentDTO(model: Incident): IncidentDTO {
  return {
    id: model.id,
    title: model.title,
    description: model.description,
    severity: model.severity,
    status: model.status,
    service: {
      id: model.serviceId,
      name: model.serviceName,
    },
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
    assignee:
      model.assigneeId && model.assigneeName
        ? {
            id: model.assigneeId,
            displayName: model.assigneeName,
          }
        : null,
  }
}

export function mapPartialToIncidentDTO(updates: Partial<Incident>): Partial<IncidentDTO> {
  const dtoUpdates: Partial<IncidentDTO> = {}

  if (updates.title !== undefined) dtoUpdates.title = updates.title
  if (updates.description !== undefined) dtoUpdates.description = updates.description
  if (updates.severity !== undefined) dtoUpdates.severity = updates.severity
  if (updates.status !== undefined) dtoUpdates.status = updates.status

  if (updates.assigneeId !== undefined || updates.assigneeName !== undefined) {
    if (updates.assigneeId === null) {
      dtoUpdates.assignee = null
    } else if (updates.assigneeId && updates.assigneeName) {
      dtoUpdates.assignee = {
        id: updates.assigneeId,
        displayName: updates.assigneeName,
      }
    }
  }

  return dtoUpdates
}
