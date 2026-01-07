<script setup lang="ts">
// definePageMeta({
//     middleware: 'page-root',
// })
onMounted(() => {
    console.log('route', useRoute())
    const path = useRoute().path
    if (path === '/') {
        navigateTo('/timer')
    } else {
        navigateTo(path)
    }
})
useNuxtApp().hook('app:suspense:resolve', async () => {
    console.log('route', useRoute())
})

</script>

<template>
    <div />
</template>
