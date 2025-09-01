<script setup lang="ts">
const open = ref(false)
const { verticalMenu } = useNavigation();
</script>

<template>
    <div class="isolate">
        <AppHeader />

        <UContainer>
            <div class="grid md:flex md:gap-4 min-h-[calc(100vh-var(--ui-header-height))]">
                <aside
                    class="hidden md:block flex-shrink-0 sticky top-(--ui-header-height) max-h-[calc(100vh-var(--ui-header-height))] md:44 lg:w-52 xl:w-60 overflow-y-auto">
                    <AppAsideNavigation />
                </aside>

                <main class="flex-grow flex-shrink min-w-0 pb-14 md:pb-0">
                    <slot />
                </main>
            </div>

        </UContainer>
        <AppBottomNavigation class="md:hidden" />
    </div>
</template>

<style>
:root {
    --ui-header-height: calc(var(--spacing)* 16);
}
</style>
