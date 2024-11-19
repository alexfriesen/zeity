import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import { useProjectStore } from '../../app/stores/projectStore';

describe("projectStore", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        setActivePinia(createPinia());
    });

    it('should be defined', () => {
        const store = useProjectStore();
        expect(store).toBeDefined();
    });

    describe('projects', () => {
        it('should load projects from localStorage', () => {
            vi.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify([{ id: '1' }]));

            const store = useProjectStore();
            expect(store.projects.getAll().value).toEqual([{ id: '1' }]);
        });

        it('should save projects to localStorage', async () => {
            const localstorageSpy = vi.spyOn(localStorage, 'setItem');
            const store = useProjectStore();
            store.projects.insert({ id: '1', name: 'test', status: 'active', notes: '' });

            await nextTick();

            expect(localstorageSpy).toHaveBeenCalledWith('projects', JSON.stringify([{ 'id': '1', 'name': 'test', status: 'active', 'notes': '' }]));
        });

        it('should be able to insert a project', () => {
            const store = useProjectStore();
            store.projects.insert({ id: '1', name: 'test', status: 'active', notes: '' });

            expect(store.projects.getAll().value).toEqual([{ id: '1', name: 'test', status: 'active', notes: '' }]);
        });

        it('should be able to update a project', () => {
            const store = useProjectStore();
            store.projects.insert({ id: '1', name: 'test', status: 'active', notes: '' });

            store.projects.update('1', { notes: 'test' });

            expect(store.projects.getAll().value).toEqual([{ id: '1', name: 'test', status: 'active', notes: 'test' }]);
        });

        it('should be able to remove a project', () => {
            const store = useProjectStore();
            store.projects.insert({ id: '1', name: 'test', status: 'active', notes: '' });

            store.projects.remove('1');

            expect(store.projects.getAll().value).toEqual([]);
        });

        it('should be able to get a project by id', () => {
            const store = useProjectStore();
            store.projects.insert({ id: '1', name: 'test', status: 'active', notes: '' });

            expect(store.projects.getById('1').value).toEqual({ id: '1', name: 'test', status: 'active', notes: '' });
        });

        it('should be able to find a project by predicate', () => {
            const store = useProjectStore();
            store.projects.insert({ id: '1', name: 'test', status: 'active', notes: '' });

            expect(store.projects.find((project) => project.id === '1').value).toEqual([{ id: '1', name: 'test', status: 'active', notes: '' }]);
        });

        it('should be able to get all projects', () => {
            const store = useProjectStore();
            store.projects.insert({ id: '1', name: 'test', status: 'active', notes: '' });

            expect(store.projects.getAll().value).toEqual([{ id: '1', name: 'test', status: 'active', notes: '' }]);
        });
    });
});

