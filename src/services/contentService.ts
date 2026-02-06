export const contentService = {
  async fetchContent(): Promise<Record<string, string>> {
    // Latency sim
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      'incident_list.header': 'Incident Inbox',
      'incident_list.welcome_message': 'Manage and track system anomalies across all services.',
      'global.maintenance_banner':
        '⚠️ Scheduled Maintenance: The API gateway will be restarted tonight at 02:00 UTC.',
    }
  },
}
