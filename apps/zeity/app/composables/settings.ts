export function useSettings() {
  const settingsStore = useSettingsStore();

  return {
    settings: settingsStore.settings,
  };
}
