<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui';

defineProps({
    collapsed: {
        type: Boolean,
        default: false
    }
})

const { t } = useI18n();
const { user } = useUserSession();
const { isLoggedIn, logout } = useAuth();

const userItem = computed(() => ({
    label: user.value?.name,
    avatar: {
        src: getUserImagePath(user.value),
        alt: user.value?.name,
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
            label: t('auth.logout'),
            icon: 'i-lucide-arrow-left-from-line',
            onSelect: () => logout(),
        },
    ],
] satisfies DropdownMenuItem[]);
</script>

<template>
    <div>
        <UDropdownMenu v-if="isLoggedIn && user" :items="items" :content="{ align: 'center', collisionPadding: 12 }"
            :ui="{ content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)' }" size="lg">
            <template #profile>
                <UAvatar :src="getUserImagePath(user)" :alt="user?.name" size="xl" />
                <div class="flex flex-col">
                    <h3 class="text-base font-semibold">
                        {{ user.name }}
                    </h3>
                    <p class="text-xs text-muted">
                        {{ user.email }}
                    </p>
                </div>
            </template>

            <UButton v-bind="{
                ...userItem,
                label: collapsed ? undefined : userItem?.label,
                trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
            }" :ui="{ trailingIcon: 'text-dimmed' }" :square="collapsed" :class="[!collapsed && 'py-2']"
                color="neutral" variant="ghost" block class="data-[state=open]:bg-elevated" size="lg" />
        </UDropdownMenu>

        <UButton v-else :label="collapsed ? undefined : $t('navigation.login')" :square="collapsed"
            :class="[!collapsed && 'py-2']" class="data-[state=open]:bg-elevated w-full" color="neutral" variant="ghost"
            size="lg" icon="i-lucide-user" to="/auth" />
    </div>
</template>