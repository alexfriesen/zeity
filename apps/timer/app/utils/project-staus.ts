import { PROJECT_STATUS_ACTIVE, PROJECT_STATUS_CLOSED, type ProjectStatus } from '~/types/project';

const projectStatusColorMap = {
    [PROJECT_STATUS_ACTIVE]: 'success',
    [PROJECT_STATUS_CLOSED]: 'error',
} as const;
export function getProjectStatusColor(status: ProjectStatus) {
    return projectStatusColorMap[status];
}

export const projectStatusFormItems = [
    { value: PROJECT_STATUS_ACTIVE, label: 'Active', chip: { color: getProjectStatusColor(PROJECT_STATUS_ACTIVE) } },
    { value: PROJECT_STATUS_CLOSED, label: 'Closed', chip: { color: getProjectStatusColor(PROJECT_STATUS_CLOSED) } },
];