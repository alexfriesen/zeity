<script setup lang="ts">
const timeDetail = useTimeDetail();
function timeNew() {
    const now = new Date().toISOString();
    timeDetail.open({ id: 'new', start: now, end: now, notes: '' });
}
</script>

<template>
    <header :class="$attrs.class">
        <nav
            class="bg-background/75 backdrop-blur border-b -mb-px sticky top-0 z-50 border-neutral-200 dark:border-neutral-800 min-h-12">
            <div class="mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 h-16">
                <div class="lg:flex-1 flex items-center gap-1.5 min-w-0">
                    <UButton to="/" icon="i-zeity-logo" variant="ghost">
                        <span class="font-bold text-xl text-neutral-900 dark:text-white min-w-0">
                            {{ $t('about.title') }}
                        </span>
                    </UButton>
                </div>
                <div class="flex items-center justify-end lg:flex-1 gap-1.5">
                    <UButton v-if="$route.path === '/'" square class="rounded-full" icon="i-lucide-plus"
                        variant="outline" @click="timeNew">
                        <span class="sr-only">
                            {{ $t('common.add') }}
                        </span>
                    </UButton>
                </div>
            </div>
        </nav>
    </header>
</template>