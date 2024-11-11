<template>
    <div :class="$attrs.class">
        <UNavigationMenu orientation="vertical" :items="verticalMenu" class="hidden md:block m-4" />
        <UNavigationMenu orientation="horizontal" :items="horizontalMenu" class="md:hidden justify-evenly"
            :ui="{ linkLeadingIcon: 'size-8' }" />
    </div>
</template>

<script setup lang="ts">

const verticalMenu = [
    {
        label: 'Timer',
        to: '/',
        icon: 'i-lucide-clock',
    },
    // {
    //     label: 'Projects',
    //     to: '/projects',
    //     icon: 'i-lucide-list-todo',
    // },
    // {
    //     label: 'Tags',
    //     to: '/tags',
    //     icon: 'i-lucide-tag',
    // },
    // {
    //     label: 'Reports',
    //     to: '/reports',
    //     icon: 'i-lucide-chart-pie',
    // },
    {
        label: 'Settings',
        to: '/settings',
        icon: 'i-lucide-settings',
    },

];
const horizontalMenu = [
    {
        label: 'Timer',
        to: '/',
        icon: 'i-lucide-clock',
    },
    {
        label: 'Settings',
        to: '/settings',
        icon: 'i-lucide-settings',
    },
];

</script>