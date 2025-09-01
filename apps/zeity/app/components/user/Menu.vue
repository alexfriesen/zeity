<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui';

defineProps({
    collapsed: {
        type: Boolean,
        default: false
    }
})

const { t } = useI18n();
const { logout } = useAuth();
const { fetchUser } = useUser();

const { data } = await fetchUser();

const userItem = computed(() => ({
    label: data.value?.user.name,
    avatar: {
        src: getUserImagePath(data.value?.user),
        alt: data.value?.user.name,
    },
}));

const items = computed(() => [
    [

        {
            label: t('navigation.profile'),
            icon: 'i-lucide-user',
            to: '/user',
            slot: 'profile',
        },
    ],
    [
        {
            label: t('organisations.title'),
            to: '/organisations',
            icon: 'i-lucide-store',
        },
    ],
    [
        {
            label: t('auth.logout'),
            icon: 'i-lucide-arrow-left-from-line',
            onSelect: () => logout(),
        },
    ],
] satisfies DropdownMenuItem[]);
</script>

<template>
    <UDropdownMenu :items="items" :content="{ align: 'center', collisionPadding: 12 }"
        :ui="{ content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)' }">
        <template #profile>
            <UAvatar :src="getUserImagePath(data?.user)" :alt="data?.user.name" size="xl" />
            <div class="flex flex-col">
                <h3 class="text-base font-semibold">
                    {{ data?.user.name }}
                </h3>
                <p class="text-xs text-muted">
                    {{ data?.user.email }}
                </p>
            </div>
        </template>
        <template #selectedOrg-trailing>
            <UIcon name="i-lucide-circle-check" class="shrink-0 size-5 text-primary" />
        </template>

        <UButton v-bind="{
            ...userItem,
            label: collapsed ? undefined : userItem?.label,
            trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
        }" :ui="{ trailingIcon: 'text-dimmed' }" :square="collapsed" :class="[!collapsed && 'py-2']" color="neutral"
            variant="ghost" block class="data-[state=open]:bg-elevated" />
    </UDropdownMenu>
</template>