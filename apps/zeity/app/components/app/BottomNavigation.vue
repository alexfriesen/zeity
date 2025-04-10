<template>
    <div class="fixed bottom-0 inset-x-0 flex justify-center pointer-events-none" :class="$attrs.class">
        <div class="pointer-events-auto rounded-t-xl bg-(--ui-bg) border border-(--ui-border) shadow-md">
            <UNavigationMenu :items="horizontalMenu" orientation="horizontal" class="justify-evenly mx-2"
                :ui="{ linkLeadingIcon: 'size-8' }" />
        </div>

        <USlideover v-model:open="openMoreMenu" title="Menu" side="right">
            <template #body>
                <div class="flex flex-col justify-center h-full">
                    <UNavigationMenu :items="verticalMenu" orientation="vertical" class="full-w" />
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
const { isLoggedIn, logout } = useAuth();
const store = useOrganisationStore();
const { currentOrganisationId } = storeToRefs(store);
const organisations = store.getAllOrganisations();

const userMenu = computed(() => isLoggedIn.value ?
    [
        {
            // TODO: Add user profile picture
            label: t('navigation.user'),
            icon: 'i-lucide-circle-user',
            children: [
                {
                    label: t('navigation.profile'),
                    icon: 'i-lucide-user',
                    to: '/user',
                },
                {
                    label: t('auth.logout'),
                    icon: 'i-lucide-arrow-left-from-line',
                    onSelect: () => logout(),
                },
            ]
        },
        {
            label: t('organisations.title'),
            icon: 'i-lucide-store',
            children: [
                ...organisations.value.map((organisation) => ({
                    label: organisation.name,
                    icon: currentOrganisationId.value === organisation.id ? 'i-lucide-circle-check-big' : 'i-lucide-circle',
                    active: currentOrganisationId.value === organisation.id,
                    onSelect: () => store.setCurrentOrganisationId(organisation.id),
                })),
                {
                    label: t('organisations.title'),
                    to: '/organisations',
                    icon: 'i-lucide-list',
                },
                {
                    label: t('organisations.create'),
                    to: '/organisations/create',
                    icon: 'i-lucide-plus',
                },
            ]
        },
    ] :
    [
        {
            label: t('navigation.login'),
            to: '/auth',
            icon: 'i-lucide-user',
        },
    ]
);

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
        ...userMenu.value,
    ],
    [
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