<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';

const emits = defineEmits(['submit']);

const toast = useToast()
const { register } = useWebAuthn()

const schema = z.object({
    email: z.string().email().min(1).toLowerCase().trim(),
    name: z.string().min(1).trim(),
});
type Schema = z.output<typeof schema>
const state = ref<Partial<Schema>>({
    name: '',
    email: ''
});

async function signUp(event: FormSubmitEvent<Schema>) {
    await register({
        userName: event.data.email,
        displayName: event.data.name,
    })
        .then(() => emits('submit'))
        .catch((error) => {
            toast.add({
                title: error.data?.message || error.message,
                description: error.data?.data?.issues[0]?.message || error.data?.data,
                color: 'error'
            })
        })
}
</script>

<template>
    <UForm class="flex flex-col gap-2" :schema="schema" :state="state" @submit.prevent="signUp">
        <UFormField :label="$t('user.email')" required>
            <UInput v-model="state.email" type="email" name="email" autocomplete="username webauthn" class="w-full" />
        </UFormField>

        <UFormField :label="$t('user.name')" required>
            <UInput v-model="state.name" name="name" class="w-full" />
        </UFormField>


        <UButton block type="submit" :label="$t('auth.register')" />
    </UForm>
</template>