<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';

const emits = defineEmits(['submit']);

const toast = useToast()
const { authenticate } = useWebAuthn()

const schema = z.object({
    email: z.string().email().min(1).toLowerCase().trim(),
});
type Schema = z.output<typeof schema>
const state = ref<Partial<Schema>>({
    email: '',
});

async function signIn(event: FormSubmitEvent<Schema>) {
    await authenticate(event.data.email)
        .then(() => emits('submit'))
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
    <UForm class="flex flex-col gap-2" :schema="schema" :state="state" @submit.prevent="signIn">
        <UFormField :label="$t('user.email')" required>
            <UInput v-model="state.email" type="email" name="email" autocomplete="username webauthn" class="w-full" />
        </UFormField>

        <UButton block type="submit" :label="$t('auth.login')" />
    </UForm>
</template>