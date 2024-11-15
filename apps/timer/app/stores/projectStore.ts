import { defineStore } from 'pinia';

import { useEntityStore } from './entityStore';
import type { Project } from '../types/project';
import useLocalStorage from '~/utils/localstorage';

export const useProjectStore = defineStore('project', () => {
  const loading = ref(false);
  function setLoading(value: boolean) {
    loading.value = value;
  }

  // Projects
  const projectsStore = useEntityStore<Project>('projects');

  function loadProjectsFromLocalStorage() {
    const projects = useLocalStorage().getItem<Project[]>('projects');
    if (!projects) return;

    projectsStore().upsertMany(projects);
  }

  loadProjectsFromLocalStorage();

  watch(projectsStore().getAll(), (value) => {
    useLocalStorage().setItem('projects', value);
  });

  return {
    projects: projectsStore(),

    loading,
    setLoading,
  };
});
