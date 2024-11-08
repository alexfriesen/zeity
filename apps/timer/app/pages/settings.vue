<script setup lang="ts">
import { useSettingsStore } from '~/stores/settingsStore';

const store = storeToRefs(useSettingsStore());
</script>

<template>
    <UContainer class="my-3">
        <h2>Settings</h2>

        <div class="flex justify-between">
            <span>Language:</span>
            <span>{{ store.language }}</span>
        </div>
    </UContainer>
</template>