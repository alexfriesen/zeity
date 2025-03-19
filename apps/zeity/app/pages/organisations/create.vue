<script setup lang="ts">
import type { NewOrganisation, Organisation } from '@zeity/types/organisation';

const { t } = useI18n();
const toast = useToast();

const store = useOrganisationStore();

const loading = ref(false);
const data = ref<NewOrganisation>({
    name: '',
});

async function handleSubmit(data: Organisation | NewOrganisation) {
    loading.value = true;
    const organisation = await $fetch('/api/organisation', {
        method: 'POST',
        body: data,
    }).then((data) => {
        toast.add({
            color: 'success',
            title: t('organisations.createSuccess'),
        });
        if (data?.id) {
            store.setCurrentOrganisationId(data.id);
        }
        return data;
    }).catch((error) => {
        console.error(error);
        toast.add({
            color: 'error',
            title: t('organisations.createError'),
        });
    }).finally(() => {
        loading.value = false;
    });

    if (organisation) {
        store.insertOrganisation(organisation);
        await navigateTo('/organisations/' + organisation.id);
    }
}
</script>

<template>
    <UContainer as="section" class="page my-3">
        <UBreadcrumb :items="[{ label: $t('organisations.title'), to: '/organisations' }]" />
        <h2
            class="inline-block text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight dark:text-neutral-200">
            {{ $t('organisations.create') }}
        </h2>

        <OrganisationForm :loading="loading" :data="data" class="mt-4" @submit="handleSubmit" />
    </UContainer>
</template>