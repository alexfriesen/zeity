const STORAGE_KEY = 'zeity_redirect';

export function useAuthRedirect() {
  return {
    set(path: string) {
      useCookie(STORAGE_KEY).value = path;
    },
    apply() {
      const path = useCookie(STORAGE_KEY).value;
      if (path) {
        useCookie(STORAGE_KEY).value = null;
        return navigateTo(path);
      }
    },
  };
}
