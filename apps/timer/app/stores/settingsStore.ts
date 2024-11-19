import { defineStore } from 'pinia';

interface SettingsState {
  language: string;
  themeMode: string;
  themePrimary: string;
}

const defaultSettings: SettingsState = {
  language: 'en',
  themeMode: 'system',
  themePrimary: 'sky',
};

export const useSettingsStore = defineStore('settings', () => {
  const language = ref(defaultSettings.language);
  function setLanguage(value: string) {
    language.value = value;
  }

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
    language: language.value,
    themeMode: themeMode.value,
    themePrimary: themePrimary.value,
  }));
  function updateSettings(data: Partial<SettingsState>) {
    if (data.language !== undefined) {
      setLanguage(data.language);
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

  loadFromLocalStorage();

  watch(settings, (value) => {
    useLocalStorage().setItem('settings', value);
  });

  return {
    settings,
    updateSettings,

    language,
    setLanguage,

    themeMode,
    setThemeMode,

    themePrimary,
    setThemePrimary,
  };
});
