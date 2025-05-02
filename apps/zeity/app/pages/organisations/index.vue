<script setup lang="ts">
const organisationStore = useOrganisationStore()
const { currentOrganisationId } = storeToRefs(organisationStore);
const organisations = organisationStore.getAllOrganisations();

const isEmpty = computed(() => organisations.value.length === 0);

onMounted(() => {
    organisationStore.refreshOrganisations();
});
</script>

<template>

    <div class="page my-3">
        <h2
            class="inline-block text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight dark:text-neutral-200">
            {{ $t('organisations.title') }}
        </h2>

        <section class="flex flex-col my-3 space-y-4">
            <div class="flex items-center justify-between gap-4">
                <div />
                <UButton to="/organisations/create" icon="i-lucide-plus">{{ $t('common.add') }}</UButton>
            </div>

            <UCard v-for="organisation in organisations" :key="organisation.id">
                <template #header>
                    <div class="flex items-center gap-4 flex-shrink">
                        <UButton :color="currentOrganisationId === organisation.id ? 'primary' : 'neutral'"
                            icon="i-lucide-check" size="lg" square class="rounded-full"
                            @click="organisationStore.setCurrentOrganisationId(organisation.id)" />
                        <UButton :to="`/organisations/${encodeURIComponent(organisation.id)}`" variant="link" size="lg"
                            class="block -mx-3 truncate">
                            {{ organisation.name }}
                        </UButton>
                    </div>
                </template>

            </UCard>

            <UAlert v-if="isEmpty" variant="subtle" title="Hey there!"
                description="It looks like you don't have any organisation yet. Why not create one?"
                icon="i-lucide-info" :ui="{ icon: 'size-20' }" :actions="[
                    { label: $t('common.add'), icon: 'i-lucide-plus', to: '/organisations/create' }
                ]" />
        </section>
    </div>
</template>
