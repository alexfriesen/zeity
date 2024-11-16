import { defineStore } from 'pinia';

interface SettingsState {
  language: string;
  themePrimary: string;
}

const defaultSettings: SettingsState = {
  language: 'en',
  themePrimary: 'sky',
};

export const useSettingsStore = defineStore('settings', () => {
  const language = ref(defaultSettings.language);
  function setLanguage(value: string) {
    language.value = value;
  }

  const themePrimary = ref(defaultSettings.themePrimary);
  function setThemePrimary(value: string) {
    themePrimary.value = value;
  }

  const settings = computed<SettingsState>(() => ({
    language: language.value,
    themePrimary: themePrimary.value,
  }));
  function updateSettings(data: Partial<SettingsState>) {
    if (data.language !== undefined) {
      setLanguage(data.language);
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

    themePrimary,
    setThemePrimary,
  };
});
