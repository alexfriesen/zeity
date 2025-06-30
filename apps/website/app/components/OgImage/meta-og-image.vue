<script setup lang="ts">
const props = withDefaults(defineProps<{
    title?: string
    description?: string
    image?: string,
    imageRound?: boolean,
    siteName?: string
}>(), {
    title: 'title',
})

const siteConfig = useSiteConfig()
const siteName = computed(() => {
    return props.siteName || siteConfig.name
})
</script>

<template>
    <div class="w-full h-full flex justify-between relative p-[60px] bg-zinc-900 text-sky-200">
        <div :style="{
            width: '1200px',
            height: '600px',
            // backgroundImage: `radial-gradient(circle at 80% 160%, #024a71 0%, #18181c 100%)`
        }" class="flex absolute top-0 left-0" />
        <div class="h-full w-full justify-between relative">
            <div class="flex flex-row justify-between items-start">
                <div class="flex flex-col w-full max-w-[65%] text-balance">
                    <h1 class="m-0 font-bold mb-[30px] text-[75px]">
                        {{ title }}
                    </h1>
                    <p v-if="description" class="text-[35px] text-sky-100">
                        {{ description }}
                    </p>
                </div>
                <div v-if="Boolean(image)" style="width: 30%;" class="flex items-center justify-end">
                    <NuxtImg :src="image" width="300" height="300" class="overflow-hidden" alt="preview" />
                </div>
            </div>
            <div class="flex flex-row justify-center items-center text-left w-full">
                <p v-if="siteName" style="font-size: 25px;" class="font-bold text-sky-400">
                    {{ siteName }}
                </p>
            </div>
        </div>
    </div>
</template>
