<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';
import type { User } from '@zeity/types/user';

const props = defineProps({
    loading: {
        type: Boolean,
        default: false,
    },
});
const user = defineModel<User | null>()

const toast = useToast()
const { t } = useI18n()

const saveLoading = ref(false);
const isLoading = computed(() => props.loading || saveLoading.value);

const userSchema = z.object({
    name: z.string().min(1).trim(),
});
type UserSchema = z.output<typeof userSchema>
const userState = ref<Partial<UserSchema>>({
    name: user.value?.name ?? '',
});

watch(user, (value) => {
    userState.value = {
        name: value?.name ?? '',
    }
});

function updateUser(event: FormSubmitEvent<UserSchema>) {
    $fetch('/api/user/current', {
        method: 'PATCH',
        body: event.data,
    }).then((data) => {
        user.value = data.user!
        toast.add({
            color: 'success',
            title: t('user.saveSuccess'),
        })
    }).catch((error) => {
        console.error(error)
        toast.add({
            color: 'error',
            title: t('user.saveError'),
        })
    })
}
</script>

<template>
    <div>
        <div v-if="loading" class="flex flex-col gap-2">
            <USkeleton class="h-4 w-full" />
            <USkeleton class="h-8 w-full" />
            <USkeleton class="h-8 w-full" />
        </div>
        <UForm v-else class="flex flex-col gap-2" :schema="userSchema" :state="userState" @submit.prevent="updateUser">
            <UFormField :label="$t('user.email')" required loading>
                <UInput :value="user?.email" disabled readonly class="w-full" />
            </UFormField>
            <UFormField :label="$t('user.name')" required>
                <UInput v-model="userState.name" name="name" class="w-full" />
            </UFormField>

            <UButton :disabled="isLoading" :label="$t('common.save')" block type="submit" icon="i-lucide-save" />
        </UForm>
    </div>
</template>