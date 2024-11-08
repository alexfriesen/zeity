<template>
    <div :class="$attrs.class">
        <UVerticalNavigation :links="verticalMenu" class="hidden md:block m-4" />
        <UHorizontalNavigation :links="horizontalMenu" class="md:hidden justify-evenly"
            :ui="{ icon: { base: 'h-8 w-8' } }" />
    </div>
</template>

<script setup lang="ts">

const verticalMenu = [
    {
        label: 'Timer',
        to: '/',
        icon: 'i-heroicons-clock',
    },
    // {
    //     label: 'Projects',
    //     to: '/projects',
    //     icon: 'i-heroicons-inbox-stack',
    // },
    // {
    //     label: 'Tags',
    //     to: '/tags',
    //     icon: 'i-heroicons-tag',
    // },
    // {
    //     label: 'Reports',
    //     to: '/reports',
    //     icon: 'i-heroicons-chart-pie',
    // },
    {
        label: 'Settings',
        to: '/settings',
        icon: 'i-heroicons-cog-8-tooth',
    },

];
const horizontalMenu = [
    {
        label: 'Timer',
        to: '/',
        icon: 'i-heroicons-clock',
    },
    {
        label: 'Settings',
        to: '/settings',
        icon: 'i-heroicons-cog-8-tooth',
    },
];

</script>