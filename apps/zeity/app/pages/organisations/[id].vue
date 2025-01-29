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

const { status, data, refresh } = useAsyncData(`organisation/${organisationId}`, () => $fetch(`/api/organisation/${organisationId}`), {
    lazy: true,
})

const schema = z.object({
    name: z.string().min(3).max(150).default(''),
})
type Schema = z.output<typeof schema>
const state = ref({
    name: data.value?.name ?? '',
})

const saving = ref(false);
const editing = ref(false);

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

    </UContainer>
</template>