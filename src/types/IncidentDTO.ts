export interface IncidentServiceDTO {
  id: string
  name: string
}

export interface IncidentAssigneeDTO {
  id: string
  displayName: string
}

export interface IncidentDTO {
  id: string
  title: string
  description: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  status: 'Open' | 'InProgress' | 'Acknowledged' | 'Resolved'
  service: IncidentServiceDTO
  createdAt: string
  updatedAt: string
  assignee: IncidentAssigneeDTO | null
}
