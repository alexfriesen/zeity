<script setup lang="ts">
import z from 'zod'
import type { FormSubmitEvent, TableColumn } from '@nuxt/ui'
import type { User } from '@zeity/database/user';

interface TeamMemberData {
    memberId: number;
    userId: string;
    role: string;
    user: User;
}

const { t } = useI18n()
const toast = useToast()
const { fetchOrganisationTeam } = useOrganisation()

const addMemberModalOpen = ref(false);
function toggleAddMemberModal() {
    addMemberModalOpen.value = !addMemberModalOpen.value;
}
function cleanupAddMemberModal() {
    addMemberState.value = {
        memberIds: [],
    };
}

const route = useRoute()
const organisationId = computed(() => route.params.orgId as string);
const teamId = computed(() => parseInt(route.params.teamId as string, 10));

const membersColumns: TableColumn<TeamMemberData>[] = [
    {
        id: 'name',
        accessorKey: 'user.name',
        header: 'Name',
    },
    {
        id: 'action',
    }
];

const team = await fetchOrganisationTeam(organisationId, teamId);
const members = await useFetch(`/api/organisation/${organisationId.value}/team/${teamId.value}/member`);

const addMemberSchema = z.object({
    memberIds: z.array(z.number()).min(1),
})
type AddMemberSchema = z.output<typeof addMemberSchema>
const addMemberState = ref<AddMemberSchema>({
    memberIds: [],
})

function createTeamMembers(event: FormSubmitEvent<AddMemberSchema>) {
    return $fetch(`/api/organisation/${organisationId.value}/team/${teamId.value}/member`, {
        method: 'POST',
        body: {
            memberIds: event.data.memberIds,
        }
    }).then(() => {
        toast.add({
            color: 'success',
            title: t('organisations.teams.members.addSuccess'),
        })
        toggleAddMemberModal();
        return members.refresh();
    }).catch((error) => {
        console.error(error)
        toast.add({
            color: 'error',
            title: t('organisations.teams.members.addError'),
        })
    })
}

function deleteMembers(memberIds: number[]) {
    return $fetch(`/api/organisation/${organisationId.value}/team/${teamId.value}/member`, {
        method: 'DELETE',
        body: {
            memberIds: memberIds,
        }
    }).then(() => {
        toast.add({
            color: 'success',
            title: t('organisations.teams.members.deleteSuccess'),
        })
        members.refresh();
    }).catch((error) => {
        console.error(error)
        toast.add({
            color: 'error',
            title: t('organisations.teams.members.deleteError'),
        })
    })
}
</script>

<template>
    <div class="my-4">
        <UBreadcrumb
            :items="[{ label: $t('organisations.title'), to: '/organisations' }, { label: $t('organisations.teams.title'), to: `/organisations/${organisationId}` }]" />
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight dark:text-neutral-200 mb-2">
                {{ team?.data?.value?.name }}
            </h2>
        </div>

        <p class="mb-4">{{ team?.data?.value?.description }}</p>

        <USeparator />

        <UTable :data="members?.data?.value || []" :columns="membersColumns">
            <template #action-header>
                <div class="text-right">
                    <UModal v-model:open="addMemberModalOpen" :title="$t('organisations.teams.members.add')"
                        @update:open="cleanupAddMemberModal()">
                        <UButton icon="i-lucide-plus" color="primary" variant="solid">
                            {{ $t('organisations.teams.members.add') }}
                        </UButton>

                        <template #body>
                            <UForm :schema="addMemberSchema" :state="addMemberState" @submit="createTeamMembers">
                                <UFormField :label="$t('organisations.teams.members.title')" name="memberIds" size="xl">
                                    <OrganisationMemberSelectField v-model="addMemberState.memberIds"
                                        :organisation-id="organisationId" :exclude-team="teamId" class="w-full" />
                                </UFormField>

                                <USeparator class="my-3" />

                                <div class="flex items-center justify-end gap-2">
                                    <UButton color="neutral" @click="toggleAddMemberModal()">
                                        {{ $t('common.cancel') }}
                                    </UButton>
                                    <UButton type="submit">
                                        {{ $t('common.save') }}
                                    </UButton>
                                </div>
                            </UForm>
                        </template>
                    </UModal>
                </div>
            </template>
            <template #action-cell="{ row }">
                <div class="text-right">
                    <UButton color="error" class="ml-auto" icon="i-lucide-trash"
                        :label="$t('organisations.teams.members.delete')"
                        @click="deleteMembers([row.original.memberId])" />
                </div>
            </template>

            <template #name-cell="{ row }">
                <div class="flex items-center gap-3">
                    <UAvatar :src="getUserImagePath(row.original.user)" :alt="`${row.original.user?.name}`" />
                    <p class="font-medium text-highlighted">
                        {{ row.original.user?.name }}
                    </p>
                </div>
            </template>
        </UTable>
    </div>
</template>