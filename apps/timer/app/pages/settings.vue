<script setup lang="ts">
const store = useSettingsStore();
const { language, themePrimary } = storeToRefs(store);

const themePrimaryOptions = [
    {
        label: 'Sky',
        value: 'sky'
    },
    {
        label: 'Amber',
        value: 'amber'
    },
    {
        label: 'Emerald',
        value: 'emerald'
    },
    {
        label: 'Indigo',
        value: 'indigo'
    },
    {
        label: 'Rose',
        value: 'rose'
    }
];

</script>

<template>
    <UContainer class="my-3">
        <h2>Settings</h2>

        <label class="flex justify-between">
            <span>Language:</span>
            <span>{{ language }}</span>
        </label>

        <label class="flex justify-between">
            <span>Theme:</span>
            <USelect v-model="themePrimary" :items="themePrimaryOptions" class="min-w-32 " />
        </label>
    </UContainer>
</template>