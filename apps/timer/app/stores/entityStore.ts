import { defineStore } from 'pinia';

interface EntitiesMap<T> {
  [id: string]: T;
}

interface EntityStoreState<T> {
  entities: EntitiesMap<T>;
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
          const id = entity.id;
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
        const updatedState = {
          ids: state.value.ids.filter((i) => i !== id),
          entities: Object.values(state.value.entities).reduce<EntitiesMap<T>>(
            (acc, entity) => {
              if (entity.id !== id) {
                acc[entity.id] = entity;
              }
              return acc;
            },
            {}
          ),
        };

        state.value = updatedState;
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
