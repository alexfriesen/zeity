import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import { useTimerStore } from '../../app/stores/timerStore';

describe("timerStore", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        setActivePinia(createPinia());
    });

    it('should be defined', () => {
        const store = useTimerStore();
        expect(store).toBeDefined();
    });

    describe('draft', () => {
        it('should have a default state', () => {
            const store = useTimerStore();
            expect(store.draft).toStrictEqual(null);
        });

        it('should load draft from localStorage', () => {
            mockDraftLocalstorage({ start: '2021-08-01T00:00:00.000Z', notes: 'test' });

            const store = useTimerStore();
            expect(store.draft).toEqual({ start: expect.any(String), notes: 'test' });
        });

        it('should be able to start a draft', () => {
            const store = useTimerStore();
            expect(store.isStarted).toStrictEqual(false);

            store.startDraft();

            expect(store.isStarted).toStrictEqual(true);
        });

        it('should be able to stop a draft', () => {
            const store = useTimerStore();
            store.startDraft();
            expect(store.isStarted).toStrictEqual(true);

            store.stopDraft();
            expect(store.isStarted).toStrictEqual(false);
        });

        it('should be able to toggle a draft', () => {
            const store = useTimerStore();
            expect(store.isStarted).toStrictEqual(false);

            store.toggleDraft();
            expect(store.isStarted).toStrictEqual(true);

            store.toggleDraft();
            expect(store.isStarted).toStrictEqual(false);
        });

        it('should be able to reset a draft', () => {
            const store = useTimerStore();
            store.startDraft();
            expect(store.draft).toEqual({ start: expect.any(String), notes: '' });

            store.resetDraft();
            expect(store.draft).toStrictEqual(null);
        });

        it('should be able to update a draft', () => {
            const store = useTimerStore();
            store.startDraft();
            expect(store.draft).toEqual({ start: expect.any(String), notes: '' });

            store.updateDraft({ notes: 'test' });
            expect(store.draft).toEqual({ start: expect.any(String), notes: 'test' });
        });
    });

    describe('isStarted', () => {
        it('should be false by default', () => {
            const store = useTimerStore();
            expect(store.isStarted).toStrictEqual(false);
        });

        it('should be true when a draft is started', () => {
            const store = useTimerStore();
            store.startDraft();

            expect(store.isStarted).toStrictEqual(true);
        });

        it('should be false when a draft is stopped', () => {
            const store = useTimerStore();
            store.startDraft();
            store.stopDraft();

            expect(store.isStarted).toStrictEqual(false);
        });
    });

    describe('times', () => {
        it('should load times from localStorage', () => {
            mockTimesLocalstorage([{ id: '1' }]);

            const store = useTimerStore();
            expect(store.times.getAll().value).toEqual([{ id: '1' }]);
        });

        it('should save times to localStorage', async () => {
            const localstorageSpy = vi.spyOn(localStorage, 'setItem');
            const store = useTimerStore();
            store.times.insert({ id: '1', start: '2021-08-01T00:00:00.000Z', end: '2021-08-01T00:00:00.000Z', notes: '' });

            await nextTick();

            expect(localstorageSpy).toHaveBeenCalledWith('times', JSON.stringify([{ 'id': '1', 'start': '2021-08-01T00:00:00.000Z', 'end': '2021-08-01T00:00:00.000Z', 'notes': '' }]));
        });

        it('should be able to insert a time', () => {
            const store = useTimerStore();
            store.times.insert({ id: '1', start: '2021-08-01T00:00:00.000Z', end: '2021-08-01T00:00:00.000Z', notes: '' });

            expect(store.times.getAll().value).toEqual([{ id: '1', start: '2021-08-01T00:00:00.000Z', end: '2021-08-01T00:00:00.000Z', notes: '' }]);
        });

        it('should be able to update a time', () => {
            const store = useTimerStore();
            store.times.insert({ id: '1', start: '2021-08-01T00:00:00.000Z', end: '2021-08-01T00:00:00.000Z', notes: '' });

            store.times.update('1', { notes: 'test' });

            expect(store.times.getAll().value).toEqual([{ id: '1', start: '2021-08-01T00:00:00.000Z', end: '2021-08-01T00:00:00.000Z', notes: 'test' }]);
        });

        it('should be able to remove a time', () => {
            const store = useTimerStore();
            store.times.insert({ id: '1', start: '2021-08-01T00:00:00.000Z', end: '2021-08-01T00:00:00.000Z', notes: '' });

            store.times.remove('1');

            expect(store.times.getAll().value).toEqual([]);
        });

        it('should be able to get a time by id', () => {
            const store = useTimerStore();
            store.times.insert({ id: '1', start: '2021-08-01T00:00:00.000Z', end: '2021-08-01T00:00:00.000Z', notes: '' });

            expect(store.times.getById('1').value).toEqual({ id: '1', start: '2021-08-01T00:00:00.000Z', end: '2021-08-01T00:00:00.000Z', notes: '' });
        });

        it('should be able to find a time by predicate', () => {
            const store = useTimerStore();
            store.times.insert({ id: '1', start: '2021-08-01T00:00:00.000Z', end: '2021-08-01T00:00:00.000Z', notes: '' });

            expect(store.times.find((time) => time.id === '1').value).toEqual([{ id: '1', start: '2021-08-01T00:00:00.000Z', end: '2021-08-01T00:00:00.000Z', notes: '' }]);
        });

        it('should be able to get all times', () => {
            const store = useTimerStore();
            store.times.insert({ id: '1', start: '2021-08-01T00:00:00.000Z', end: '2021-08-01T00:00:00.000Z', notes: '' });

            expect(store.times.getAll().value).toEqual([{ id: '1', start: '2021-08-01T00:00:00.000Z', end: '2021-08-01T00:00:00.000Z', notes: '' }]);
        });
    });
});

function mockDraftLocalstorage(data: unknown) {
    vi.spyOn(localStorage, 'getItem').mockImplementation((key) => key === 'draft' ? JSON.stringify(data) : null);
}

function mockTimesLocalstorage(data: unknown) {
    vi.spyOn(localStorage, 'getItem').mockImplementation((key) => key === 'times' ? JSON.stringify(data) : null);
}
