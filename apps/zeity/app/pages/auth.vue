<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';

definePageMeta({
    middleware: 'guest'
})

const toast = useToast()
const { fetch } = useUserSession()
const { register, authenticate } = useWebAuthn({
    registerEndpoint: '/api/auth/webauthn/register',
    authenticateEndpoint: '/api/auth/webauthn/authenticate',
})

const registerSchema = z.object({
    userName: z.string().min(1).toLowerCase().trim(),
    displayName: z.string().min(1).trim(),
    email: z.string().email().min(1).toLowerCase().trim(),
});
type RegisterSchema = z.output<typeof registerSchema>
const registerState = ref<Partial<RegisterSchema>>({
    userName: '',
    displayName: '',
    email: ''
});

const authSchema = z.object({
    userName: z.string().min(1).trim(),
});
type AuthSchema = z.output<typeof authSchema>
const authState = ref<Partial<AuthSchema>>({
    userName: '',
});

async function signUp(event: FormSubmitEvent<RegisterSchema>) {
    await register(event.data)
        .then(fetch)
        .then(async () => await navigateTo('/user'))
        .catch((error) => {
            toast.add({
                title: error.data?.message || error.message,
                description: error.data?.data?.issues[0]?.message || error.data?.data,
                color: 'error'
            })
        })
}

async function signIn(event: FormSubmitEvent<AuthSchema>) {
    await authenticate(event.data.userName)
        .then(fetch)
        .then(async () => await navigateTo('/user'))
        .catch((error) => {
            toast.add({
                title: error.data?.message || error.message,
                description: error.data?.data,
                color: 'error'
            })
        })
}
</script>

<template>
    <UContainer class="my-3 space-y-6">
        <UCard class="max-w-md m-auto">
            <template #header>
                <h3 class="text-lg font-semibold leading-6">
                    Auth
                </h3>
            </template>

            <div class="flex flex-col gap-2 justify-between">
                <UForm class="flex flex-col gap-2" :schema="registerSchema" :state="registerState"
                    @submit.prevent="signUp">
                    <UFormField label="Username" required>
                        <UInput v-model="registerState.userName" name="userName" class="w-full" />
                    </UFormField>

                    <UFormField label="Full Name" required>
                        <UInput v-model="registerState.displayName" name="displayName" class="w-full" />
                    </UFormField>

                    <UFormField label="Email" required>
                        <UInput v-model="registerState.email" name="email" class="w-full" />
                    </UFormField>

                    <UButton block type="submit" label="Sign up" />
                </UForm>

                <USeparator orientation="vertical" label="or" />

                <UForm class="flex flex-col gap-2" :schema="authSchema" :state="authState" @submit.prevent="signIn">
                    <UFormField label="Username" required>
                        <UInput v-model="authState.userName" name="userName" class="w-full" />
                    </UFormField>

                    <UButton block type="submit" label="Sign in" />
                </UForm>
            </div>
        </UCard>
    </UContainer>

</template>