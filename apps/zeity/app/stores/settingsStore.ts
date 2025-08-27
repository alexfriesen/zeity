import { defineStore } from 'pinia';
import type { Locale } from '~/types/lang';

interface SettingsState {
  locale: Locale;
  themeMode: string;
  themePrimary: string;
  openTimeDetailsOnStart: boolean;
  openTimeDetailsOnStop: boolean;
}

const defaultSettings: SettingsState = {
  locale: 'en',
  themeMode: 'system',
  themePrimary: 'sky',
  openTimeDetailsOnStart: true,
  openTimeDetailsOnStop: false,
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

  const openTimeDetailsOnStart = ref(defaultSettings.openTimeDetailsOnStart);
  const openTimeDetailsOnStop = ref(defaultSettings.openTimeDetailsOnStop);

  const settings = computed<SettingsState>(() => ({
    locale: locale.value,
    themeMode: themeMode.value,
    themePrimary: themePrimary.value,
    openTimeDetailsOnStart: openTimeDetailsOnStart.value,
    openTimeDetailsOnStop: openTimeDetailsOnStop.value,
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

    if (data.openTimeDetailsOnStart !== undefined) {
      openTimeDetailsOnStart.value = data.openTimeDetailsOnStart;
    }
    if (data.openTimeDetailsOnStop !== undefined) {
      openTimeDetailsOnStop.value = data.openTimeDetailsOnStop;
    }
  }

  function loadFromLocalStorage() {
    const settings = useLocalStorage().getItem<SettingsState>('settings');
    if (!settings) return;

    updateSettings(settings);
  }

  // load and save settings to localStorage needs to be done in the setup function, otherwise locale will be overwritten by the i18n module
  function init() {
    loadFromLocalStorage();

    watch(settings, (value) => {
      useLocalStorage().setItem('settings', value);
    });
  }

  onMounted(() => {
    init();
  });

  return {
    init,

    settings,
    updateSettings,

    locale,
    setLocale,

    themeMode,
    setThemeMode,

    themePrimary,
    setThemePrimary,

    openTimeDetailsOnStart,
    openTimeDetailsOnStop,

    loadFromLocalStorage,
  };
});
