<script setup lang="ts">
definePageMeta({
    middleware: 'auth'
})

const route = useRoute();
const { loggedIn } = useUserSession();
const { status } = await useLazyAsyncData(
    () => $fetch('/api/user/verify', { method: 'POST', query: { token: route.query.token } }),
    { server: false }
);
</script>

<template>
    <UContainer v-if="loggedIn" class="my-3 space-y-6">

        <UAlert v-if="status === 'success'" color="info" title="Success"
            description="Your account has been verified successfully." />

        <UAlert v-else-if="status === 'error'" color="error" title="Error"
            description="An error occurred while verifying your account. Please try again later." />

        <USkeleton v-else class="h-19" />

    </UContainer>
</template>