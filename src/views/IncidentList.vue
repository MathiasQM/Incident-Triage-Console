<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useIncidentStore } from '@/stores/incidentStore'
import { useContentStore } from '@/stores/contentStore'
import { IncidentSeverity, IncidentStatus, type Incident } from '@/models/Incident'

const router = useRouter()
const store = useIncidentStore()
const contentStore = useContentStore()

const search = ref('')
const statusFilter = ref<IncidentStatus | null>(null)
const severityFilter = ref<IncidentSeverity | null>(null)

const activeFilters = computed(
  () => !!search.value || !!statusFilter.value || !!severityFilter.value,
)

const clearFilters = () => {
  search.value = ''
  statusFilter.value = null
  severityFilter.value = null
}

const tableHeaders = [
  { title: 'Severity', key: 'severity' },
  { title: 'ID', key: 'id' },
  { title: 'Title', key: 'title' },
  { title: 'Service', key: 'serviceName' },
  { title: 'Assignee', key: 'assigneeName' },
  { title: 'Status', key: 'status' },
  { title: 'Created', key: 'createdAt' },
]

onMounted(() => {
  if (!store.incidents.length) {
    store.fetchIncidents()
  }
  contentStore.fetchContent()
})

const filteredIncidents = computed(() => {
  let items = store.sortedIncidents
  if (statusFilter.value) {
    items = items.filter((i) => i.status === statusFilter.value)
  }
  if (severityFilter.value) {
    items = items.filter((i) => i.severity === severityFilter.value)
  }
  return items
})

const handleRowClick = (_: Event, { item }: { item: Incident }) => {
  router.push(`/incidents/${item.id}`)
}

const getSeverityColor = (severity: IncidentSeverity) => {
  switch (severity) {
    case IncidentSeverity.CRITICAL:
      return 'error'
    case IncidentSeverity.HIGH:
      return 'orange'
    case IncidentSeverity.MEDIUM:
      return 'warning'
    case IncidentSeverity.LOW:
      return 'grey'
    default:
      return 'primary'
  }
}

const getStatusColor = (status: IncidentStatus) => {
  switch (status) {
    case IncidentStatus.OPEN:
      return 'info'
    case IncidentStatus.IN_PROGRESS:
      return 'primary'
    case IncidentStatus.RESOLVED:
      return 'success'
    case IncidentStatus.ACKNOWLEDGED:
      return 'grey'
    default:
      return 'grey'
  }
}
</script>

<template>
  <v-container>
    <v-alert
      v-if="contentStore.content['global.maintenance_banner']"
      type="warning"
      variant="tonal"
      class="mb-4"
    >
      {{ contentStore.getContent('global.maintenance_banner', 'Maintenance Warning') }}
    </v-alert>

    <v-row class="mb-4" align="center">
      <v-col>
        <h1 class="text-h4 font-weight-bold text-primaryBlue">
          {{ contentStore.getContent('incident_list.header', 'Incident inbox') }}
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis mt-1">
          {{
            contentStore.getContent(
              'incident_list.welcome_message',
              'Manage your incidents effectively.',
            )
          }}
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search incidents..."
          hide-details
          density="comfortable"
          variant="outlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="statusFilter"
          :items="Object.values(IncidentStatus)"
          label="Filter by status"
          clearable
          hide-details
          density="comfortable"
          variant="outlined"
        ></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="severityFilter"
          :items="Object.values(IncidentSeverity)"
          label="Filter by severity"
          clearable
          hide-details
          density="comfortable"
          variant="outlined"
        ></v-select>
      </v-col>
    </v-row>

    <v-row v-if="activeFilters" class="mb-2">
      <v-col>
        <v-btn
          color="secondary"
          variant="text"
          prepend-icon="mdi-filter-off"
          @click="clearFilters"
          size="small"
        >
          Clear Filters
        </v-btn>
      </v-col>
    </v-row>

    <v-card class="mt-4" flat border>
      <v-data-table
        :headers="tableHeaders"
        :items="filteredIncidents"
        :search="search"
        :loading="store.loading"
        hover
        @click:row="handleRowClick"
      >
        <template v-slot:item.severity="{ item }">
          <v-chip
            :color="getSeverityColor(item.severity)"
            size="small"
            class="font-weight-bold"
            variant="flat"
          >
            {{ item.severity.toUpperCase() }}
          </v-chip>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
            class="text-uppercase"
            variant="tonal"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.createdAt="{ item }">
          {{ item.createdAt.toLocaleString() }}
        </template>

        <template v-slot:item.assigneeName="{ item }">
          <span v-if="item.assigneeName" class="d-flex align-center">
            <v-avatar size="24" color="primary-fade" class="mr-2 text-primary">
              <span class="text-caption">{{ item.assigneeName.charAt(0) }}</span>
            </v-avatar>
            {{ item.assigneeName }}
          </span>
          <span v-else class="text-medium-emphasis font-italic">Unassigned</span>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<style scoped>
:deep(.v-data-table__tr:hover) {
  cursor: pointer;
  background-color: rgb(var(--v-theme-primary-fade)) !important;
}
</style>
