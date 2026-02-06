import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { contentService } from '@/services/contentService'

export const useContentStore = defineStore('content', () => {
  const content = ref<Record<string, string>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getContent = computed(() => {
    return (key: string, defaultValue: string = '') => {
      return content.value[key] || defaultValue || key
    }
  })

  async function fetchContent() {
    if (Object.keys(content.value).length > 0) return // Cache hit

    loading.value = true
    error.value = null
    try {
      content.value = await contentService.fetchContent()
    } catch (err) {
      console.error('Failed to fetch content:', err)
      error.value = 'Failed to load content'
    } finally {
      loading.value = false
    }
  }

  return {
    content,
    loading,
    error,
    getContent,
    fetchContent,
  }
})
