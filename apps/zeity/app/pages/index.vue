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
</script>

<template>
    <div />
</template>
