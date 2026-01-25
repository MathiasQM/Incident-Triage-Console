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
  readonly id: string
  title: string
  description: string
  severity: IncidentSeverity
  status: IncidentStatus
  readonly serviceId: string
  readonly serviceName: string
  readonly createdAt: Date
  readonly updatedAt: Date
  assigneeId: string | null
  assigneeName: string | null
}
