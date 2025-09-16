import type { DraftTime, Time } from '@zeity/types';
import { nowWithoutMillis, timeDiff } from '@zeity/utils/date';
import { nanoid } from 'nanoid';
import { useTimerStore } from '~/stores/timerStore';

interface FetchTimesOptions {
  offset?: number;
  limit?: number;

  userId?: string | string[];
  projectId?: string | string[];
  rangeStart?: string;
  rangeEnd?: string;
}

function fetchTimes(options?: FetchTimesOptions): Promise<Time[]> {
  return $fetch('/api/times', {
    method: 'GET',
    params: options,
  });
}

function fetchTime(id: string): Promise<Time> {
  return $fetch(`/api/times/${id}`, {
    method: 'GET',
  });
}

function postTime(data: Time): Promise<Time> {
  return $fetch('/api/times', {
    method: 'POST',
    body: data,
  });
}

function patchTime(id: string, data: Partial<Time>): Promise<Time> {
  return $fetch(`/api/times/${id}`, {
    method: 'PATCH',
    body: data,
  });
}

function deleteTime(id: string) {
  return $fetch(`/api/times/${id}`, {
    method: 'DELETE',
  });
}

export function useTime() {
  const { loggedIn } = useUserSession();
  const { currentOrganisationId } = useOrganisation();
  const settings = toRef(useSettings().settings);

  const store = useTimerStore();

  async function loadTimes(options?: FetchTimesOptions) {
    if (!loggedIn.value) return;
    const times = await fetchTimes(options);
    store.upsertTimes(times);
    return times;
  }
  async function loadTime(id: string) {
    if (!loggedIn.value) return;
    const time = await fetchTime(id);
    store.upsertTimes([time]);
    return time;
  }

  function getOrganisationTimes() {
    const ref = store.findTimes(
      (time) =>
        !time.userId || time.organisationId === currentOrganisationId.value
    );

    return computed(() => ref.value);
  }

  function getOfflineTimes() {
    const ref = store.findTimes((time) => !time.userId);
    return computed(() => ref.value);
  }

  async function createTime(data: Time) {
    try {
      if (loggedIn.value) {
        const time = await postTime(data);
        store.insertTime(time);
        return time;
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error creating time:', error);
      }
    }

    return store.insertTime(data);
  }
  async function updateTime(id: string, data: Partial<Time>) {
    try {
      if (loggedIn.value && isOnlineTime(id)) {
        const time = await patchTime(id, data);
        store.updateTime(id, time);
        return time;
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error creating time:', error);
      }
    }

    return store.updateTime(id, data);
  }

  async function removeTime(id: string) {
    try {
      if (loggedIn.value && isOnlineTime(id)) {
        await deleteTime(id);
        return store.removeTime(id);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error creating time:', error);
      }
    }

    return store.removeTime(id);
  }

  async function toggleDraft(): Promise<DraftTime | Time | undefined> {
    if (!toRef(store.draft).value) {
      return startDraft();
    }
    return stopDraft();
  }
  function startDraft(time?: Partial<DraftTime>): DraftTime {
    const newDraft = {
      start: nowWithoutMillis().toISOString(),
      notes: '',
      ...time,
    };
    store.setDraft(newDraft);

    if (settings.value.openTimeDetailsOnStart) {
      useTimeDetail().open(newDraft);
    }

    return newDraft;
  }
  async function stopDraft() {
    const draftValue = toRef(store.draft).value;
    if (!draftValue) return;

    const start = draftValue.start;
    const end = nowWithoutMillis();
    const duration = timeDiff(end, start);

    const temp = {
      id: nanoid(),
      ...draftValue,
      duration,
    };

    const time = await createTime(temp);
    store.resetDraft();

    if (settings.value.openTimeDetailsOnStop && time) {
      useTimeDetail().open(time);
    }

    return time;
  }

  function isOnlineTime(idOrTime: string | Time) {
    const time =
      typeof idOrTime === 'object'
        ? idOrTime
        : store.findTimeById(idOrTime).value;
    return !!time?.userId;
  }

  return {
    loadTimes,
    loadTime,

    getOrganisationTimes,
    getOfflineTimes,

    createTime,
    updateTime,
    removeTime,

    isOnlineTime,

    toggleDraft,
    startDraft,
    stopDraft,
  };
}
