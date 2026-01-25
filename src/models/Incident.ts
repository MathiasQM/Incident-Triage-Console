export enum IncidentSeverity {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export enum IncidentStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'InProgress',
  ACKNOWLEDGED = 'Acknowledged',
  RESOLVED = 'Resolved',
}

export interface Incident {
  id: string
  title: string
  description: string
  severity: IncidentSeverity
  status: IncidentStatus
  serviceId: string
  serviceName: string
  createdAt: Date
  updatedAt: Date
  assigneeId: string | null
  assigneeName: string | null
}
