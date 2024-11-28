import { defineStore } from 'pinia';
import type { Locale } from '~/types/lang';

interface SettingsState {
  locale: Locale;
  themeMode: string;
  themePrimary: string;
}

const defaultSettings: SettingsState = {
  locale: 'en',
  themeMode: 'system',
  themePrimary: 'sky',
};

export const useSettingsStore = defineStore('settings', () => {
  const { locale, setLocale } = useI18n();

  const themeMode = computed({
    get() {
      return useColorMode().value || defaultSettings.themeMode;
    },
    set(option) {
      useColorMode().preference = option
    }
  });
  function setThemeMode(value: string) {
    themeMode.value = value;
  }

  const themePrimary = ref(defaultSettings.themePrimary);
  function setThemePrimary(value: string) {
    themePrimary.value = value;
  }

  const settings = computed<SettingsState>(() => ({
    locale: locale.value,
    themeMode: themeMode.value,
    themePrimary: themePrimary.value,
  }));
  function updateSettings(data: Partial<SettingsState>) {
    if (data.locale !== undefined) {
      setLocale(data.locale);
    }

    if (data.themeMode !== undefined) {
      setThemeMode(data.themeMode);
    }
    if (data.themePrimary !== undefined) {
      setThemePrimary(data.themePrimary);
    }
  }

  function loadFromLocalStorage() {
    const settings = useLocalStorage().getItem<SettingsState>('settings');
    if (!settings) return;

    updateSettings(settings);
  }

  onMounted(() => {
    loadFromLocalStorage();
  });

  watch(settings, (value) => {
    useLocalStorage().setItem('settings', value);
  });

  return {
    settings,
    updateSettings,

    locale,
    setLocale,

    themeMode,
    setThemeMode,

    themePrimary,
    setThemePrimary,

    loadFromLocalStorage,
  };
});
