<script setup lang="ts">
import type { Organisation } from '@zeity/database/organisation';
import type { OrganisationMember } from '@zeity/database/organisation-member';

defineProps({
    org: {
        type: Object as PropType<Organisation & { members: OrganisationMember[] }>,
        required: true
    }
})
const emit = defineEmits(['refresh'])
</script>

<template>
    <UPageCard>
        <OrganisationMembers :organisation-id="org.id" :members="org.members || []" @refresh="emit('refresh')" />
    </UPageCard>
</template>