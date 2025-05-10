export function useNavigation() {
  const { t } = useI18n();
  const { isLoggedIn, logout } = useAuth();

  const openMoreMenu = ref(false);

  const userMenu = computed(() =>
    isLoggedIn.value
      ? [
          {
            label: t('navigation.user'),
            icon: 'i-lucide-circle-user',
            children: [
              {
                label: t('navigation.profile'),
                icon: 'i-lucide-user',
                to: '/user',
              },
              {
                label: t('organisations.title'),
                icon: 'i-lucide-store',
                to: '/organisations',
              },
              {
                label: t('auth.logout'),
                icon: 'i-lucide-arrow-left-from-line',
                onSelect: () => logout(),
              },
            ],
          },
        ]
      : [
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
    ],
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
    },
  ]);

  return {
    openMoreMenu,
    verticalMenu,
    horizontalMenu,
  };
}
