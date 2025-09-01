<script setup lang="ts">
import { nowWithoutMillis } from '@zeity/utils/date';

const appConfig = useRuntimeConfig();
const timeDetail = useTimeDetail();
function timeNew() {
    const now = nowWithoutMillis().toISOString();
    timeDetail.open({ id: 'new', start: now, duration: 0, notes: '' });
}
</script>

<template>
    <header class="bg-(--ui-bg)/75 backdrop-blur border-b border-(--ui-border) h-(--ui-header-height) sticky top-0 z-50"
        :class="$attrs.class">
        <div
            class="w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 h-full">
            <div class="lg:flex-1 flex items-center gap-1.5 min-w-0">
                <UButton to="/" icon="i-zeity-logo" variant="ghost">
                    <span class="font-bold text-xl text-neutral-900 dark:text-white min-w-0">
                        {{ appConfig.public.appName }}
                    </span>
                </UButton>
            </div>
            <div class="flex items-center justify-end lg:flex-1 gap-1.5">
                <UButton v-if="$route.path === '/'" square class="rounded-full" icon="i-lucide-plus" variant="outline"
                    @click="timeNew">
                    <span class="sr-only">
                        {{ $t('common.add') }}
                    </span>
                </UButton>
            </div>
        </div>
    </header>
</template>