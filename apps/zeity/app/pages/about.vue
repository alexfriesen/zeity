<script setup lang="ts">
const config = useRuntimeConfig();
</script>

<template>
    <UContainer class="my-3 space-y-6">

        <div>
            <div class="text-center">
                <AppLogo size="lg" />
            </div>

            <p class="text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ui-primary)]">
                {{ $t('about.title') }}
            </p>
            <p class="text-center text-pretty">
                {{ $t('about.description') }}
            </p>
        </div>

        <div class="flex justify-between">
            <span>
                Version
            </span>
            <span class="text-[var(--ui-text-muted)]">
                {{ config.public.version }}
            </span>
        </div>

        <USeparator />

        <div>
            <UButton to="https://github.com/alexfriesen/zeity" target="_blank" variant="soft" color="neutral" size="xl"
                icon="i-lucide-github" label="Github" class="w-full" />
        </div>


    </UContainer>
</template>