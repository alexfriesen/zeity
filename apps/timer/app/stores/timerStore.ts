import { defineStore } from 'pinia';
import { nanoid } from 'nanoid';

import { useEntityStore } from './entityStore';
import type { DraftTime, Time } from '../types/time';
import useLocalStorage from '~/utils/localstorage';

export const useTimerStore = defineStore('timer', () => {
  const loading = ref(false);
  function setLoading(value: boolean) {
    loading.value = value;
  }

  // Times
  const timesStore = useEntityStore<Time>('times');

  // Draft
  const draft = ref<DraftTime | null>(null);
  const isStarted = computed(() => !!draft.value);
  function updateDraft(data: DraftTime) {
    draft.value = data;
    return draft;
  }
  function startDraft(time?: Partial<DraftTime>) {
    updateDraft({
      start: new Date().toISOString(),
      notes: '',
      ...time,
    });
  }
  function stopDraft() {
    const draftValue = draft.value;
    if (!draftValue) return;

    const time = { id: nanoid(), end: new Date().toISOString(), ...draftValue };

    timesStore().insert(time);
    resetDraft();

    return time;
  }
  function toggleDraft() {
    if (!draft.value) {
      return startDraft();
    }
    return stopDraft();
  }
  function resetDraft() {
    draft.value = null;
  }

  function loadTimesFromLocalStorage() {
    const times = useLocalStorage().getItem<Time[]>('times');
    if (!times) return;

    timesStore().upsertMany(times);
  }

  function loadDraftFromLocalStorage() {
    const value = useLocalStorage().getItem<DraftTime>('draft');
    if (!value) return;

    updateDraft(value);
  }

  loadTimesFromLocalStorage();
  loadDraftFromLocalStorage();

  watch(draft, (value) => {
    useLocalStorage().setItem('draft', value);
  });
  watch(timesStore().getAll(), (value) => {
    useLocalStorage().setItem('times', value);
  });

  return {
    times: timesStore(),

    draft,
    isStarted,
    updateDraft,
    startDraft,
    stopDraft,
    resetDraft,
    toggleDraft,

    loading,
    setLoading,
  };
});
