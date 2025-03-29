<script setup lang="ts">
definePageMeta({
    middleware: 'guest'
})

const toast = useToast()
const { fetch, user } = useUserSession()
const { refreshOrganisations } = useOrganisationStore()

async function auth() {
    await fetch()
        .then(handleRedirect)
        .catch((error) => {
            toast.add({
                title: error.data?.message || error.message,
                description: error.data?.data?.issues[0]?.message || error.data?.data,
                color: 'error'
            })
        })
}

async function handleRedirect() {
    if (!user.value?.verified) {
        return;
    }

    if (useAuthRedirect().has()) {
        return useAuthRedirect().redirect();
    }

    const orgs = await refreshOrganisations();
    if ((orgs?.length ?? 0) < 1) {
        console.log('No organisations found, redirecting to create organisation');
        return navigateTo('/organisations/create');
    }

    return navigateTo('/user');
}
</script>

<template>
    <UContainer class="my-3 space-y-6">
        <UCard v-if="!user" class="max-w-md m-auto">
            <template #header>
                <h3 class="text-lg font-semibold leading-6">
                    {{ $t('auth.title') }}
                </h3>
            </template>

            <div class="flex flex-col gap-2 justify-between">
                <AuthRegister @submit="auth" />

                <USeparator orientation="horizontal" label="or" />

                <AuthLogin @submit="auth" />
            </div>
        </UCard>

        <UCard v-if="user && !user?.verified" class="max-w-md m-auto">
            <template #header>
                <h3 class="text-lg font-semibold leading-6">
                    {{ $t('auth.verify') }}
                </h3>
            </template>

            <div class="flex flex-col gap-2 justify-between">
                <AuthVerify @submit="auth" />
            </div>
        </UCard>
    </UContainer>
</template>