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
  function setDraft(data: DraftTime) {
    draft.value = data;
    return draft;
  }
  function updateDraft(data: Partial<DraftTime>) {
    if (!draft.value) {
      if (import.meta.env.DEV) {
        console.warn('Draft is not started');
      }
      return draft.value;
    };

    draft.value = {
      ...draft.value,
      ...data
    };

    return draft;
  }
  function startDraft(time?: Partial<DraftTime>): DraftTime {
    const newDraft = {
      start: new Date().toISOString(),
      notes: '',
      ...time,
    }
    setDraft(newDraft);

    return newDraft;
  }
  function stopDraft() {
    const draftValue = draft.value;
    if (!draftValue) return;

    const time = { id: nanoid(), end: new Date().toISOString(), ...draftValue };

    timesStore.insert(time);
    resetDraft();

    return time;
  }
  function toggleDraft(): DraftTime | Time | undefined {
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

    timesStore.upsertMany(times);
  }

  function loadDraftFromLocalStorage() {
    const value = useLocalStorage().getItem<DraftTime>('draft');
    if (!value) return;

    setDraft(value);
  }

  function loadFromLocalStorage() {
    loadTimesFromLocalStorage();
    loadDraftFromLocalStorage();
  }

  onMounted(() => {
    loadFromLocalStorage();
  });

  watch(draft, (value) => {
    useLocalStorage().setItem('draft', value);
  });
  watch(timesStore.getAll(), (value) => {
    useLocalStorage().setItem('times', value);
  });

  return {
    upsertTimes: timesStore.upsertMany,

    getAllTimes: timesStore.getAll,
    findTimeById: timesStore.findById,
    findTime: timesStore.find,

    insertTime: timesStore.insert,
    updateTime: timesStore.update,
    removeTime: timesStore.remove,

    draft,
    isStarted,
    updateDraft,
    startDraft,
    stopDraft,
    resetDraft,
    toggleDraft,

    loading,
    setLoading,

    loadFromLocalStorage,
  };
});
