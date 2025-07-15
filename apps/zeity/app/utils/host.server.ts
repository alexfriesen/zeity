import { getRequestURL } from 'h3';

export function getHost() {
  const event = useNuxtApp().ssrContext?.event;
  if (event) {
    return getRequestURL(event).origin;
  }
  return document.location.origin;
}
