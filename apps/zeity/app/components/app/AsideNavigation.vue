<script setup lang="ts">
const { loggedIn } = useUserSession();
const { verticalMenu } = useNavigation();
</script>

<template>
    <div class="flex flex-col gap-3 h-full py-4">
        <OrganisationMenu v-if="loggedIn" />

        <UNavigationMenu :items="verticalMenu" orientation="vertical" class="flex justify-between w-full" />

        <UserMenu v-if="loggedIn" class="mt-auto" />
    </div>
</template>
