import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const raptorTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#7B144B',
    'primary-fade': '#F1E7EC',
    primaryBlue: '#17233E',
    error: '#C80046',
    info: '#4285F4',
    success: '#4CAF50',
    warning: '#FEBE11',
    background: '#F9F9F9',
    surface: '#FFFFFF',
    'on-background': '#17233E',
    'on-surface': '#17233E',
    'border-color': '#D1D1D1',
  },
  variables: {
    'border-color': '#D1D1D1',
    'border-opacity': 1,
    'high-emphasis-opacity': 1,
    'medium-emphasis-opacity': 0.7,
  },
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'raptorTheme',
    themes: {
      raptorTheme,
    },
  },
  defaults: {
    VCard: {
      flat: true,
      border: true,
      rounded: 'lg',
    },
    VBtn: {
      rounded: 'md',
      flat: true,
      fontWeight: '600',
      letterSpacing: '0.02em',
    },
    VChip: {
      rounded: 'sm',
      variant: 'flat',
    },
    VTable: {
      density: 'comfortable',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
  },
})
