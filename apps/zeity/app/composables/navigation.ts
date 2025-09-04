export function useNavigation() {
  const { t } = useI18n();

  const openMoreMenu = ref(false);
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
