import { defineStore } from 'pinia';

import { useEntityStore } from './entityStore';
import type { Project } from '@zeity/types/project';
import useLocalStorage from '~/utils/localstorage';

export const useProjectStore = defineStore('project', () => {
  const loading = ref(false);
  function setLoading(value: boolean) {
    loading.value = value;
  }

  // Projects
  const projectsStore = useEntityStore<Project>('projects');

  function loadFromLocalStorage() {
    const projects = useLocalStorage().getItem<Project[]>('projects');
    if (!projects) return;

    projectsStore.upsertMany(projects);
  }

  onMounted(() => {
    loadFromLocalStorage();
  });

  watch(projectsStore.getAll(), (value) => {
    useLocalStorage().setItem('projects', value);
  });

  return {
    upsertProjects: projectsStore.upsertMany,

    getAllProjects: projectsStore.getAll,
    findProjectById: projectsStore.findById,
    findProject: projectsStore.find,

    insertProject: projectsStore.insert,
    updateProject: projectsStore.update,
    removeProject: projectsStore.remove,

    loading,
    setLoading,

    loadFromLocalStorage,
  };
});
