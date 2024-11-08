import { defineStore } from 'pinia';

interface EntityStoreState<T> {
  entities: Record<string, T>;
  ids: string[];
}

export function useEntityStore<T extends { id: string }>(name: string) {
  return defineStore(name, () => {
    const state = ref<EntityStoreState<T>>({
      entities: {},
      ids: [],
    });

    return {
      upsertMany(entities: T[]) {
        for (const entity of entities) {
          const id = (entity as any).id;
          if (!id) {
            console.warn('entity must have an id', entity);
            continue;
          }
          state.value.entities[id] = entity;
          if (!state.value.ids.includes(id)) {
            state.value.ids.push(id);
          }
        }
      },

      addEntity(entity: T) {
        if (!entity?.['id']) {
          console.warn('entity must have an id', entity);
          return;
        }
        const id = entity.id;
        state.value.entities[id] = entity;
        state.value.ids.push(id);
      },

      update(id: string, data: Partial<T>) {
        const current = state.value.entities[id];
        if (current) {
          state.value.entities[id] = { ...current, ...data };
        }
      },

      remove(id: string) {
        delete state.value.entities[id];
        state.value.ids = state.value.ids.filter((i) => i !== id);
      },

      getById(id: string) {
        return computed(() => state.value.entities[id]);
      },
      getAll() {
        return computed(() =>
          state.value.ids.map((id) => state.value.entities[id]!)
        );
      },
    };
  });
}
