<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';

definePageMeta({
    middleware: 'auth'
})

const toast = useToast()
const { clear } = useUserSession()
const { data } = await useFetch('/api/user/current')

const userSchema = z.object({
    displayName: z.string().min(1).trim(),
});
type UserSchema = z.output<typeof userSchema>
const userState = ref<Partial<UserSchema>>({
    displayName: data.value?.user?.displayName ?? '',
});

function updateUser(event: FormSubmitEvent<UserSchema>) {
    $fetch('/api/user/current', {
        method: 'PATCH',
        body: event.data,
    }).then(() => {
        toast.add({
            color: 'success',
            title: 'User updated successfully',
        })
    }).catch((error) => {
        console.error(error)
        toast.add({
            color: 'error',
            title: 'Failed to update user',
        })
    })
}

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
            title: 'User deleted successfully',
        })
        await clear()
        await navigateTo('/auth')
    }).catch((error) => {
        console.error(error)
        toast.add({
            color: 'error',
            title: 'Failed to delete user',
        })
    })
}
</script>

<template>
    <UContainer class="my-3 space-y-6">
        <UCard class="max-w-md m-auto">
            <template #header>
                <h3 class="text-lg font-semibold leading-6">
                    User
                </h3>
            </template>

            <UForm class="flex flex-col gap-2" :schema="userSchema" :state="userState" @submit.prevent="updateUser">
                <UFormField label="Full Name" required>
                    <UInput v-model="userState.displayName" name="displayName" class="w-full" />
                </UFormField>

                <UButton block type="submit" label="Save" />
            </UForm>

            <USeparator class="my-4" />

            <div class="flex flex-col gap-2 justify-between">
                <UButton color="warning" block @click="logout">
                    Logout
                </UButton>

                <UButton color="warning" block @click="deleteUser">
                    Delete Account
                </UButton>
            </div>
        </UCard>


    </UContainer>

</template>