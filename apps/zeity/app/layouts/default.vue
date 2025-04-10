<template>
    <div class="isolate">
        <AppHeader />

        <UContainer>
            <div class="grid md:flex md:gap-4 min-h-[calc(100vh-var(--ui-header-height))]">
                <AppAsideNavigation class="hidden md:block" />

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
