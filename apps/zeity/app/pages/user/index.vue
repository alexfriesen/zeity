<script setup lang="ts">
definePageMeta({
    middleware: 'auth'
})

const { t } = useI18n();
const toast = useToast();
const { user, loading, deleteUser } = useUser();
const { currentOrganisationId, getAllOrganisations } = useOrganisation();
const organisations = getAllOrganisations();

function logout() {
    useAuth().logout()
}

async function handleDeleteUser() {
    // TODO: add fancy modal
    const result = window.confirm('Are you sure you want to delete your account?');

    if (!result) {
        return
    }

    await deleteUser().then(async () => {
        toast.add({
            color: 'success',
            title: t('user.deleteSuccess'),
        })
        await navigateTo('/auth')
    }).catch((error) => {
        console.error(error)
        toast.add({
            color: 'error',
            title: t('user.deleteError'),
        })
    })
}
</script>

<template>
    <div class="my-3">
        <UCard class="max-w-md m-auto">
            <template #header>
                <h3 class="text-lg font-semibold leading-6">
                    {{ $t('user.title') }}
                </h3>
            </template>

            <div class="space-y-4">

                <UAlert v-if="organisations.length < 1" icon="i-lucide-circle-alert" color="primary" variant="subtle"
                    title="Create Organisation" description="Create an organisation to start using zeity." :actions="[
                        { label: $t('organisations.create'), icon: 'i-lucide-plus', to: '/organisations/create' },
                    ]" />

                <UserForm v-model="user" :loading="loading" />

                <USeparator />

                <UFormField :label="$t('user.organisation')" size="lg">
                    <URadioGroup v-model="currentOrganisationId" :items="organisations" value-key="id" label-key="name"
                        variant="card" />
                </UFormField>

                <USeparator />

                <div class="flex flex-col gap-2 justify-between">
                    <UButton color="neutral" block icon="i-lucide-arrow-left-from-line" @click="logout">
                        {{ $t('auth.logout') }}
                    </UButton>

                    <UButton color="error" block icon="i-lucide-triangle-alert" @click="handleDeleteUser">
                        {{ $t('user.delete') }}
                    </UButton>
                </div>
            </div>

        </UCard>

    </div>

</template>