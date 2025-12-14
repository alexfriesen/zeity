<script setup lang="ts">
const config = useSystemStore();
</script>

<template>
    <div class="my-3 space-y-6">

        <div>
            <div class="text-center">
                <AppLogo size="lg" />
            </div>

            <p class="text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ui-primary)]">
                {{ config.appName }}
            </p>
            <p class="text-center text-pretty">
                {{ $t('about.description') }}
            </p>
        </div>

        <div class="flex justify-between items-center">
            <span>
                Version
            </span>
            <div class="flex items-center gap-2">
                <UBadge v-if="config.stage !== 'production'" color="warning">
                    {{ config.stage }}
                </UBadge>
                <span class="text-[var(--ui-text-muted)]">
                    {{ config.version }}
                </span>
            </div>
        </div>

        <ClientOnly>
            <div v-if="$pwa?.isPWAInstalled || $pwa?.showInstallPrompt" class="flex justify-between items-center">
                <span>
                    Web App:
                </span>
                <div class="flex items-center gap-2">
                    <UBadge v-if="$pwa?.offlineReady" color="neutral">
                        Offline Ready
                    </UBadge>
                    <UBadge v-if="$pwa?.isPWAInstalled" color="success">
                        Installed
                    </UBadge>
                    <UButton v-if="$pwa?.needRefresh" variant="soft" color="primary" icon="i-lucide-refresh-cw"
                        label="Update" @click="$pwa.updateServiceWorker()" />

                    <UButton v-if="$pwa?.showInstallPrompt && !$pwa?.needRefresh" variant="soft" color="primary"
                        icon="i-lucide-package-plus" label="Install" class="w-full" @click="$pwa.install()" />
                </div>
            </div>
        </ClientOnly>

        <USeparator />

        <div>
            <UButton to="https://github.com/alexfriesen/zeity" target="_blank" variant="soft" color="neutral" size="xl"
                icon="i-lucide-github" label="Github" class="w-full" />
        </div>


    </div>
</template>