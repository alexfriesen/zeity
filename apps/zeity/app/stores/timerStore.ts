import { defineStore } from 'pinia';
import { nanoid } from 'nanoid';

import { timeDiff } from '@zeity/utils/date';
import { useEntityStore } from './entityStore';
import type { DraftTime, Time } from '@zeity/types/time';
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
    }

    draft.value = {
      ...draft.value,
      ...data,
    };

    return draft;
  }
  function startDraft(time?: Partial<DraftTime>): DraftTime {
    const newDraft = {
      start: new Date().toISOString(),
      notes: '',
      ...time,
    };
    setDraft(newDraft);

    return newDraft;
  }
  function stopDraft() {
    const draftValue = draft.value;
    if (!draftValue) return;

    const start = draftValue.start;
    const end = new Date();
    const duration = timeDiff(end, start);

    const time = {
      id: nanoid(),
      ...draftValue,
      duration,
    };

    insertTime(time);
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

  function upsertTimes(times: Time[]) {
    return timesStore.upsertMany(times);
  }

  function insertTime(time: Time) {
    return timesStore.insert(time);
  }

  function updateTime(id: string, time: Partial<Time>) {
    return timesStore.update(id, time);
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
    getAllTimes: timesStore.getAll,
    findTimeById: timesStore.findById,
    findTime: timesStore.find,

    upsertTimes,
    insertTime,
    updateTime,
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
