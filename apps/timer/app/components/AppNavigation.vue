<template>
    <div :class="$attrs.class">
        <UNavigationMenu orientation="vertical" :items="verticalMenu" class="hidden md:block m-4" />
        <UNavigationMenu orientation="horizontal" :items="horizontalMenu" class="md:hidden justify-evenly"
            :ui="{ linkLeadingIcon: 'size-8' }" />

        <USlideover v-model:open="openMoreMenu" title="Menu" side="right">
            <template #body>
                <div class="flex flex-col justify-center h-full">
                    <UNavigationMenu orientation="vertical" :items="verticalMenu" class="full-w" />
                </div>
            </template>
        </USlideover>
    </div>
</template>

<script setup lang="ts">
const openMoreMenu = ref(false);

const verticalMenu = [
    {
        label: 'Timer',
        to: '/',
        icon: 'i-lucide-clock',
    },
    {
        label: 'Projects',
        to: '/projects',
        icon: 'i-lucide-list-todo',
    },
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
        label: 'Projects',
        to: '/projects',
        icon: 'i-lucide-list-todo',
    },
    {
        label: 'More',
        icon: 'i-lucide-more-horizontal',
        onSelect: () => {
            openMoreMenu.value = true;
        },
    }
];

</script>