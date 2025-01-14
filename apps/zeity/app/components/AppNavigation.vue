<template>
    <div :class="$attrs.class">
        <UNavigationMenu orientation="vertical" :items="verticalMenu" class="hidden md:block m-4 min-w-44" />
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

const route = useRoute();
watch(() => route.path, () => {
    openMoreMenu.value = false;
});

const { t } = useI18n();
const { loggedIn } = useUserSession();
const verticalMenu = computed(() => [
    [
        {
            label: t('navigation.timer'),
            to: '/',
            icon: 'i-lucide-clock',
        },
        {
            label: t('navigation.projects'),
            to: '/projects',
            icon: 'i-lucide-list-todo',
        },
        // {
        //     label: 'Tags',
        //     to: '/tags',
        //     icon: 'i-lucide-tag',
        // },
        {
            label: t('navigation.reports'),
            to: '/reports',
            icon: 'i-lucide-chart-pie',
        },
        {
            label: t('navigation.settings'),
            to: '/settings',
            icon: 'i-lucide-settings',
        },
    ],
    [
        loggedIn.value ?
            {
                label: t('navigation.user'),
                to: '/user',
                icon: 'i-lucide-user',
            } :
            {
                label: t('navigation.login'),
                to: '/auth',
                icon: 'i-lucide-user',
            },
        {
            label: t('navigation.about'),
            to: '/about',
            icon: 'i-lucide-info',
        },
    ]

]);
const horizontalMenu = computed(() => [
    {
        label: t('navigation.timer'),
        to: '/',
        icon: 'i-lucide-clock',
    },
    {
        label: t('navigation.projects'),
        to: '/projects',
        icon: 'i-lucide-list-todo',
    },
    {
        label: t('navigation.more'),
        icon: 'i-lucide-more-horizontal',
        onSelect: () => {
            openMoreMenu.value = true;
        },
    }
]);

</script>