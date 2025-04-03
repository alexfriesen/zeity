<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { t } = useI18n()
const route = useRoute()
const toast = useToast()

definePageMeta({
    validate: async (route) => {
        // Check if the id is made up of digits
        return typeof route.params.id === 'string'
    }
})

const organisationId = route.params.id as string;

const { status, data, refresh } = await useLazyAsyncData(`organisation/${organisationId}`, () => $fetch(`/api/organisation/${organisationId}`), { server: false })

const schema = z.object({
    name: z.string().min(3).max(150).default(''),
})
type Schema = z.output<typeof schema>
const state = ref({
    name: data.value?.name ?? '',
})

const saving = ref(false);
const editing = ref(false);
const deleteModalOpen = ref(false);

function switchEditing() {
    editing.value = !editing.value
    state.value = { name: data.value?.name ?? '' }
}

function changeName(event: FormSubmitEvent<Schema>) {
    saving.value = true
    $fetch(`/api/organisation/${organisationId}`, {
        method: 'PATCH',
        body: {
            name: event.data.name
        }
    }).then(() => {
        toast.add({
            color: 'success',
            title: t('organisations.updateSuccess'),
        })
        refresh()
        editing.value = false
    }).catch((error) => {
        console.error(error)
        toast.add({
            color: 'error',
            title: t('organisations.updateError'),
        })
    }).finally(() => {
        saving.value = false
    })
}

async function deleteOrganisation() {
    await $fetch(`/api/organisation/${organisationId}`, {
        method: 'DELETE',
    }).then(() => {
        toast.add({
            color: 'success',
            title: t('organisations.delete.success'),
        })
        return navigateTo('/organisations')
    }).catch((error) => {
        console.error(error)
        toast.add({
            color: 'error',
            title: t('organisations.delete.error'),
        })
    })
}
</script>

<template>
    <UContainer v-if="status === 'success'" class="my-4">
        <UBreadcrumb :items="[{ label: $t('organisations.title'), to: '/organisations' }]" />
        <div>
            <UForm v-if="editing" :schema="schema" :state="state"
                class="my-4 flex items-center justify-between gap-2 h-[44px]" @submit="changeName">
                <UInput v-model="state.name" name="name" size="lg" class="w-full" />
                <UButton :loading="saving" type="submit" size="lg" icon="i-lucide-check">
                    {{ $t('common.save') }}
                </UButton>
            </UForm>
            <div v-else class="my-4 flex items-center justify-between gap-2">
                <h2
                    class="mb-2 inline-block text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight dark:text-neutral-200">
                    {{ data?.name }}
                </h2>
                <UButton size="lg" icon="i-lucide-pencil" @click="switchEditing">
                    {{ $t('common.edit') }}
                </UButton>
            </div>
        </div>

        <USeparator class="my-4" />

        <OrganisationMembers :organisation-id="organisationId" :members="data?.members ?? []" @refresh="refresh" />

        <USeparator class="my-4" />

        <OrganisationInvites :organisation-id="organisationId" :invites="data?.invites" @refresh="refresh" />

        <USeparator class="my-4" />

        <section class="flex flex-wrap items-center justify-between gap-2">
            <h3
                class="mb-1 inline-block text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight dark:text-neutral-200">
                {{ $t('organisations.delete.title') }}
            </h3>

            <UModal v-model:open="deleteModalOpen" :title="$t('organisations.delete.title')"
                :description="$t('organisations.delete.description')">
                <UButton size="lg" variant="subtle" color="error" icon="i-lucide-trash" @click="deleteModalOpen = true">
                    {{ $t('common.delete') }}
                </UButton>

                <template #footer>
                    <div class="flex justify-between w-full">
                        <UButton type="button" variant="subtle" @click="deleteModalOpen = false">
                            {{ $t('common.cancel') }}
                        </UButton>

                        <UButton color="error" @click="deleteOrganisation">
                            {{ $t('common.delete') }}
                        </UButton>
                    </div>
                </template>

            </UModal>
        </section>

    </UContainer>
</template>