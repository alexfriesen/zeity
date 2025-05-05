<template>
    <aside :class="$attrs.class"
        class="sticky top-(--ui-header-height) max-h-[calc(100vh-var(--ui-header-height))] overflow-y-auto">
        <UNavigationMenu :items="verticalMenu" orientation="vertical"
            class="flex justify-between py-4 w-44 xl:w-60 h-full" />
    </aside>
</template>

<script setup lang="ts">
const { verticalMenu } = useNavigation();
</script>