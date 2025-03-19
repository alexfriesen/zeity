import type { DraftTime, Time } from '@zeity/types/time';

export function useTimeDetail() {
  const currentTime = useState<Time | DraftTime | null>(
    'timeDetail',
    () => null
  );
  const isOpen = computed(() => currentTime.value !== null);

  function open(time: Time | DraftTime) {
    currentTime.value = time;
  }

  function close() {
    currentTime.value = null;
  }

  return {
    currentTime,
    isOpen,
    open,
    close,
  };
}
