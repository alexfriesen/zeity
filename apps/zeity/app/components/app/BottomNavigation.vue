<script setup lang="ts">
const { openMoreMenu, horizontalMenu } = useNavigation();

const route = useRoute();
watch(() => route.path, () => {
    openMoreMenu.value = false;
});
</script>

<template>
    <div class="fixed bottom-0 inset-x-0 flex justify-center pointer-events-none" :class="$attrs.class">
        <div class="pointer-events-auto rounded-t-xl bg-(--ui-bg) border border-(--ui-border) shadow-md">
            <UNavigationMenu :items="horizontalMenu" orientation="horizontal" class="justify-evenly mx-2"
                :ui="{ linkLeadingIcon: 'size-8' }" />
        </div>

        <USlideover v-model:open="openMoreMenu" title="Menu" side="right">
            <template #body>
                <AppAsideNavigation />
            </template>
        </USlideover>
    </div>
</template>
