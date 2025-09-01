<script setup lang="ts">
import type { Organisation } from '@zeity/database/organisation';
import type { OrganisationInvite } from '@zeity/database/organisation-invite';

defineProps({
    org: {
        type: Object as PropType<Organisation & { invites: OrganisationInvite[] }>,
        required: true
    }
})
const emit = defineEmits(['refresh'])
</script>

<template>
    <UPageCard>
        <OrganisationInvites :organisation-id="org.id" :invites="org?.invites || []" @refresh="emit('refresh')" />
    </UPageCard>
</template>