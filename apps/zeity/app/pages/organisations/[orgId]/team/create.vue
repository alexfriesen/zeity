<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';

const { t } = useI18n();
const { orgId } = useRoute().params as { orgId: string };
const { loading, createOrganisationTeam } = useOrganisation();

const schema = z.object({
    name: z.string().min(3).default(''),
    description: z.string().optional().default(''),
    permissions: z.array(z.string()).default([]),
});
type Schema = z.output<typeof schema>
const state = ref<Partial<Schema>>({
    name: '',
    description: '',
    permissions: [],
});

function handleSubmit(event: FormSubmitEvent<Schema>) {
    return createOrganisationTeam(orgId, event.data).then(async (data) => {
        useToast().add({
            color: 'success',
            title: t('organisations.teams.createSuccess'),
        });
        await navigateTo(`/organisations/${orgId}/team/${data.id}`);
    }).catch((error) => {
        console.error(error);
        useToast().add({
            color: 'error',
            title: t('common.errorOccurred'),
        });
    });
}
</script>

<template>
    <div as="section" class="page my-3">
        <UBreadcrumb :items="[{ label: $t('organisations.title'), to: '/organisations' }]" />
        <h2
            class="inline-block text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight dark:text-neutral-200">
            {{ $t('organisations.teams.create') }}
        </h2>

        <UForm :schema="schema" :state="state" class="space-y-4" @submit="handleSubmit">
            <UFormField :label="$t('organisations.teams.form.name')" name="name">
                <UInput v-model="state.name" :placeholder="$t('organisations.teams.form.namePlaceholder')"
                    class="w-full" />
            </UFormField>

            <UFormField :label="$t('organisations.teams.form.description')" name="description">
                <UInput v-model="state.description" :placeholder="$t('organisations.teams.form.descriptionPlaceholder')"
                    class="w-full" />
            </UFormField>

            <UButton :loading="loading" block type="submit">
                {{ $t('common.save') }}
            </UButton>
        </UForm>
    </div>
</template>