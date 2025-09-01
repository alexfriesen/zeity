<script setup lang="ts">
import type { Organisation } from '@zeity/database/organisation';

const props = defineProps({
    org: {
        type: Object as PropType<Organisation>,
        required: true
    }
})
</script>

<template>
    <UPageCard>
        <OrganisationTeamsList :organisation-id="org.id" />
    </UPageCard>
</template>