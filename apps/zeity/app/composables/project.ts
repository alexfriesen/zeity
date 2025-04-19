import type { Project } from '@zeity/types';
import { useProjectStore } from '~/stores/projectStore';

interface FetchProjectsOptions {
  offset?: number;
  limit?: number;
  sort?: 'name' | 'createdAt';
  search?: string;
  status?: string[];
}

function fetchProjects(options?: FetchProjectsOptions): Promise<Project[]> {
  return $fetch('/api/projects', {
    method: 'GET',
    params: options,
  });
}

function fetchProject(id: string): Promise<Project> {
  return $fetch(`/api/projects/${id}`, {
    method: 'GET',
  });
}

function postProject(data: Project): Promise<Project> {
  return $fetch('/api/projects', {
    method: 'POST',
    body: data,
  });
}

function patchProject(id: string, data: Partial<Project>): Promise<Project> {
  return $fetch(`/api/projects/${id}`, {
    method: 'PATCH',
    body: data,
  });
}

function deleteProject(id: string) {
  return $fetch(`/api/projects/${id}`, {
    method: 'DELETE',
  });
}

export function useProject() {
  const { loggedIn } = useUserSession();

  const store = useProjectStore();

  function isOnlineProject(id: string) {
    const project = store.findProjectById(id).value;
    return !!project?.userId;
  }

  async function loadProjects(options?: FetchProjectsOptions) {
    if (!loggedIn.value) return;
    const projects = await fetchProjects(options);
    store.upsertProjects(projects);
    return projects;
  }
  async function loadProject(id: string) {
    if (!loggedIn.value) return;
    const project = await fetchProject(id);
    store.upsertProjects([project]);
    return project;
  }

  async function createProject(data: Project) {
    try {
      if (loggedIn.value) {
        const project = await postProject(data);
        store.insertProject(project);
        return project;
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error creating project:', error);
      }
    }

    return store.insertProject(data);
  }
  async function updateProject(id: string, data: Partial<Project>) {
    try {
      if (loggedIn.value && isOnlineProject(id)) {
        const project = await patchProject(id, data);
        store.updateProject(id, project);
        return project;
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error creating project:', error);
      }
    }

    return store.updateProject(id, data);
  }
  async function removeProject(id: string) {
    try {
      if (loggedIn.value && isOnlineProject(id)) {
        await deleteProject(id);
        return store.removeProject(id);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error creating project:', error);
      }
    }

    return store.removeProject(id);
  }

  return {
    loadProjects,
    loadProject,

    createProject,
    updateProject,
    removeProject,
  };
}
