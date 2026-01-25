export interface IncidentServiceDTO {
  id: string
  name: string
}

export interface IncidentAssigneeDTO {
  id: string
  displayName: string
}

export interface IncidentDTO {
  readonly id: string
  title: string
  description: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  status: 'Open' | 'InProgress' | 'Acknowledged' | 'Resolved'
  readonly service: IncidentServiceDTO
  readonly createdAt: string
  readonly updatedAt: string
  assignee: IncidentAssigneeDTO | null
}
