import axios from 'axios'

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || 'https://mocki.io/v1/c1729179-e0e6-4446-8440-d59424fe56f4',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config
    config._retryCount = config._retryCount || 0

    if (config._retryCount < 3 && (!error.response || error.response.status >= 500)) {
      config._retryCount += 1
      const backoff = Math.pow(2, config._retryCount) * 1000
      await new Promise((resolve) => setTimeout(resolve, backoff))
      return apiClient(config)
    }
    return Promise.reject(error)
  },
)

export default apiClient
