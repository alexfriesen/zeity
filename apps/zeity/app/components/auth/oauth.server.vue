<script setup lang="ts">
const { oauth } = useRuntimeConfig();
</script>

<template>
    <div class="flex flex-col gap-2 justify-between">
        <UButton v-if="oauth?.google?.clientId" variant="outline" size="lg" external to="/auth/google"
            icon="i-simple-icons-google">
            <span class="flex-grow text-center">
                {{ $t('auth.loginWithGoogle') }}
            </span>
        </UButton>

        <UButton v-if="oauth?.apple?.clientId" variant="outline" size="lg" external to="/auth/apple"
            icon="i-simple-icons-apple">
            <span class="flex-grow text-center">
                {{ $t('auth.loginWithApple') }}
            </span>
        </UButton>

        <UButton v-if="oauth?.microsoft?.clientId" variant="outline" size="lg" external to="/auth/microsoft"
            icon="i-simple-icons-microsoft">
            <span class="flex-grow text-center">
                {{ $t('auth.loginWithMicrosoft') }}
            </span>
        </UButton>
    </div>
</template>