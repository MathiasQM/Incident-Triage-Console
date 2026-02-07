<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useIncidentStore } from '@/stores/incidentStore'
import { IncidentSeverity, IncidentStatus } from '@/models/Incident'

const route = useRoute()
const router = useRouter()
const store = useIncidentStore()

const incidentId = route.params.id as string

const statusOptions = Object.values(IncidentStatus)

// Mock users from "API", to enable filtering by user
const mockUsers = ['Alice Jensen', 'Brian Thomsen', 'Clara Madsen', 'David Holm']

const localStatus = ref<IncidentStatus>(IncidentStatus.OPEN)
const localAssignee = ref<string | null>(null)

const incident = computed(() => store.getIncidentById(incidentId))

const isSaving = ref(false)

onMounted(async () => {
  if (!store.incidents.length) {
    await store.fetchIncidents()
  }

  if (incident.value) {
    localStatus.value = incident.value.status
    localAssignee.value = incident.value.assigneeName
  }
})

const cancel = () => {
  router.back()
}

const save = () => {
  if (!incident.value) return

  store
    .updateIncident(incidentId, {
      status: localStatus.value,
      assigneeName: localAssignee.value,
      assigneeId: localAssignee.value ? `usr-mock-${localAssignee.value}` : null,
    })
    .catch((e) => console.error('Background save failed', e))

  router.back()
}

const getSeverityColor = (severity: IncidentSeverity | undefined) => {
  if (!severity) return 'grey'
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
</script>

<template>
  <v-container>
    <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-4" @click="router.back()">
      Back to Inbox
    </v-btn>

    <div v-if="store.loading && !incident" class="d-flex justify-center mt-10">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <v-card v-else-if="incident" class="mx-auto" max-width="800" elevation="2">
      <v-card-item>
        <div class="d-flex justify-space-between align-start">
          <div>
            <div class="text-overline text-medium-emphasis mb-1">
              {{ incident.id }} • {{ incident.createdAt.toLocaleString() }}
            </div>
            <div class="text-h5 font-weight-bold text-primaryBlue mb-2">
              {{ incident.title }}
            </div>
            <v-chip
              :color="getSeverityColor(incident.severity)"
              size="small"
              variant="flat"
              class="font-weight-bold"
            >
              {{ incident.severity }}
            </v-chip>
          </div>
          <div class="text-right">
            <div class="text-caption text-medium-emphasis">Service</div>
            <div class="font-weight-medium">{{ incident.serviceName }}</div>
            <div class="text-caption text-medium-emphasis mt-1">{{ incident.serviceId }}</div>

            <div class="text-caption text-medium-emphasis mt-2">Updated</div>
            <div class="font-weight-regular text-body-2">
              {{ incident.updatedAt.toLocaleString() }}
            </div>
          </div>
        </div>
      </v-card-item>

      <v-divider></v-divider>

      <v-card-text class="py-6">
        <h3 class="text-subtitle-1 font-weight-bold mb-2">Description</h3>
        <p class="text-body-1 mb-6 text-pre-wrap">{{ incident.description }}</p>

        <v-row>
          <v-col cols="12" md="6">
            <h3 class="text-subtitle-1 font-weight-bold mb-2">Triage Status</h3>
            <v-select
              v-model="localStatus"
              :items="statusOptions"
              label="Status"
              variant="outlined"
              color="primary"
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <h3 class="text-subtitle-1 font-weight-bold mb-2">Assignee</h3>
            <v-combobox
              v-model="localAssignee"
              :items="mockUsers"
              label="Assign To"
              variant="outlined"
              color="primary"
              clearable
            ></v-combobox>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="cancel">Cancel</v-btn>
        <v-btn color="primary" variant="flat" :loading="isSaving" @click="save">
          Save Changes
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-alert v-else type="error" class="mt-4"> Incident not found </v-alert>
  </v-container>
</template>

<style scoped>
.text-pre-wrap {
  white-space: pre-wrap;
}
</style>
