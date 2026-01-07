<script setup lang="ts">
// definePageMeta({
//     middleware: 'page-root',
// })
onMounted(() => {
    const path = useRoute().path
    if (path === '/') {
        navigateTo('/home')
    } else {
        navigateTo(path)
    }
})
</script>

<template>
    <div />
</template>
