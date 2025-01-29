<script setup lang="ts">
definePageMeta({
    middleware: 'auth'
})

const { t } = useI18n()
const route = useRoute()

const inviteId = route.query.inviteId as string
const { loggedIn } = useUserSession()
const { refreshOrganisations } = useOrganisationStore()

function acceptInvite() {
    return useFetch(`/api/organisation/invite/${inviteId}/accept`)
        .then(() => {
            useToast().add({
                title: 'Success',
                description: t('organisations.joinSuccess'),
                color: 'success'
            })
            refreshOrganisations()
        })
        .catch((error) => {
            console.error(error)
            useToast().add({
                title: 'Error',
                description: t('organisations.joinError'),
                color: 'error'
            })
        })
}
</script>

<template>

    <UContainer class="my-4">
        <h2 class="text-2xl font-bold mb-4">{{ $t('join.title') }}</h2>

        <div v-if="loggedIn">
            <UButton @click="acceptInvite">
                {{ $t('organisations.join') }}
            </UButton>
        </div>
        <div v-else>
            <p>{{ $t('join.auth.description') }}</p>
            <UButton to="/auth">
                {{ $t('navigation.login') }}
            </UButton>
        </div>
    </UContainer>

</template>