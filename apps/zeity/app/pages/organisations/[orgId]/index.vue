<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Organisation } from '@zeity/database/organisation';

const { t } = useI18n()
const toast = useToast()

const { uploadOrganisationImage, refreshOrganisations, isOrganisationAdmin } = useOrganisation();
const organisationId = useRoute().params.orgId as string;

const props = defineProps({
    org: {
        type: Object as PropType<Organisation>,
        required: true
    }
})
const emit = defineEmits(['refresh'])

const schema = z.object({
    name: z.string().min(2).max(150).default(''),
})
type Schema = z.output<typeof schema>
const state = ref({
    name: props.org?.name ?? '',
})

const saving = ref(false);
const editing = ref(false);
const deleteModalOpen = ref(false);

function switchEditing() {
    editing.value = !editing.value
    state.value = { name: props.org?.name ?? '' }
}

function changeName(event: FormSubmitEvent<Schema>) {
    saving.value = true
    return $fetch(`/api/organisation/${organisationId}`, {
        method: 'PATCH',
        body: {
            name: event.data.name
        }
    }).then(async () => {
        toast.add({
            color: 'success',
            title: t('organisations.updateSuccess'),
        })
        await emit('refresh')
        editing.value = false
    }).catch((error) => {
        console.error(error)
        toast.add({
            color: 'error',
            title: t('organisations.updateError'),
        })
    }).finally(() => {
        saving.value = false
    })
}

function changeImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        saving.value = true;
        await uploadOrganisationImage(organisationId, file)
            .then(async () => {
                toast.add({
                    color: 'success',
                    title: t('user.saveSuccess'),
                });
                await emit('refresh');
                reloadNuxtApp();
            })
            .catch((error) => {
                console.error(error)
                toast.add({
                    color: 'error',
                    title: t('user.saveError'),
                })
            })
            .finally(() => {
                saving.value = false;
            });
    };
}

function deleteOrganisation() {
    return $fetch(`/api/organisation/${organisationId}`, {
        method: 'DELETE',
    })
        .then(async () => {
            toast.add({
                color: 'success',
                title: t('organisations.delete.success'),
            })
            await refreshOrganisations();
            await navigateTo('/organisations')
        }).catch((error) => {
            console.error(error)
            toast.add({
                color: 'error',
                title: t('organisations.delete.error'),
            })
        })
}
</script>

<template>
    <div class="space-y-6">
        <UPageCard>
            <div class="flex flex-col items-center justify-center">
                <UAvatar :src="getOrganisationImagePath(org)" :alt="org?.name" size="3xl" />
                <UButton v-if="isOrganisationAdmin(org.id)" :loading="saving" icon="i-lucide-camera" variant="subtle"
                    class="mt-4" @click="changeImage">
                    {{ $t('common.upload') }}
                </UButton>
            </div>
            <UForm v-if="editing" :schema="schema" :state="state"
                class="flex items-center justify-between gap-2 h-[44px]" @submit="changeName">
                <UInput v-model="state.name" name="name" size="lg" class="w-full" />
                <UButton :loading="saving" type="submit" size="lg" icon="i-lucide-check">
                    {{ $t('common.save') }}
                </UButton>
            </UForm>
            <div v-else class="flex flex-wrap items-center justify-between gap-2">
                <h2
                    class="mb-2 inline-block text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight dark:text-neutral-200">
                    {{ org?.name }}
                </h2>
                <UButton v-if="isOrganisationAdmin(org.id)" size="lg" icon="i-lucide-pencil" @click="switchEditing">
                    {{ $t('common.edit') }}
                </UButton>
            </div>
        </UPageCard>

        <UPageCard v-if="isOrganisationAdmin(org.id)" :title="$t('organisations.delete.title')"
            class="bg-gradient-to-tl from-error/10 from-5% to-default">

            <UModal v-model:open="deleteModalOpen" :title="$t('organisations.delete.title')"
                :description="$t('organisations.delete.description')">
                <UButton size="lg" variant="subtle" color="error" icon="i-lucide-trash" @click="deleteModalOpen = true">
                    {{ $t('common.delete') }}
                </UButton>

                <template #footer>
                    <div class="flex justify-between w-full">
                        <UButton type="button" variant="subtle" color="neutral" @click="deleteModalOpen = false">
                            {{ $t('common.cancel') }}
                        </UButton>

                        <UButton color="error" @click="deleteOrganisation">
                            {{ $t('common.delete') }}
                        </UButton>
                    </div>
                </template>


            </UModal>
        </UPageCard>
    </div>
</template>