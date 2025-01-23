<script setup lang="ts">

definePageMeta({
    middleware: 'auth'
})

const { t } = useI18n()
const toast = useToast()
const userStore = useUserStore()
const { clear } = useUserSession()

const { user, loading } = storeToRefs(userStore);

function logout() {
    clear().finally(async () => navigateTo('/auth'))
}

async function deleteUser() {
    // TODO: add fancy modal
    const result = window.confirm('Are you sure you want to delete your account?');

    if (!result) {
        return
    }

    await $fetch('/api/user/current', {
        method: 'delete',
    }).then(async () => {
        toast.add({
            color: 'success',
            title: t('user.deleteSuccess'),
        })
        await clear()
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
    <UContainer class="my-3 space-y-6">
        <UCard class="max-w-md m-auto">
            <template #header>
                <h3 class="text-lg font-semibold leading-6">
                    {{ $t('user.title') }}
                </h3>
            </template>

            
            <UserForm v-model="user" :loading="loading" />

            <USeparator class="my-4" />

            <div class="flex flex-col gap-2 justify-between">
                <UButton color="warning" block @click="logout">
                    {{ $t('auth.logout') }}
                </UButton>

                <UButton color="warning" block @click="deleteUser">
                    {{ $t('user.delete') }}
                </UButton>
            </div>
        </UCard>


    </UContainer>

</template>