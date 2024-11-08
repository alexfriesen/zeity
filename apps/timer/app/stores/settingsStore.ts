import { defineStore } from 'pinia';

interface SettingsState {
  language: string;
}

export const useSettingsStore = defineStore('settings', () => {
  const language = ref('en');
  function setLanguage(value: string) {
    language.value = value;
  }

  const settings = computed<SettingsState>(() => ({
    language: language.value,
  }));
  function updateSettings(data: Partial<SettingsState>) {
    if (data.language !== undefined) {
      setLanguage(data.language);
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
  };
});
