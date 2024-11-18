<script setup lang="ts">
const store = useSettingsStore();
const { language, themeMode, themePrimary } = storeToRefs(store);

const languageOptions = [
    {
        label: 'English',
        value: 'en',
    },
]

const themeModes = [
    {
        label: 'Light',
        value: 'light',
        icon: 'i-lucide-sun'
    },
    {
        label: 'Dark',
        value: 'dark',
        icon: 'i-lucide-moon'
    },
]

const themePrimaryOptions = [
    {
        label: 'Sky',
        value: 'sky',
        chip: {
            ui: {
                base: 'bg-[var(--color-sky-500)]',
            }
        }
    },
    {
        label: 'Amber',
        value: 'amber',
        chip: {
            ui: {
                base: 'bg-[var(--color-amber-500)]',
            }
        }
    },
    {
        label: 'Emerald',
        value: 'emerald',
        chip: {
            ui: {
                base: 'bg-[var(--color-emerald-500)]',
            }
        }
    },
    {
        label: 'Indigo',
        value: 'indigo',
        chip: {
            ui: {
                base: 'bg-[var(--color-indigo-500)]',
            }
        }
    },
    {
        label: 'Rose',
        value: 'rose',
        chip: {
            ui: {
                base: 'bg-[var(--color-rose-500)]',
            }
        }
    }
]
</script>

<template>
    <UContainer class="my-3 space-y-4">
        <h2
            class="inline-block text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight dark:text-neutral-200">
            Settings
        </h2>

        <FieldSet label="General">
            <label class="flex items-center justify-between">
                <span>Language:</span>
                <USelect v-model="language" :items="languageOptions" class="min-w-60" />
            </label>
        </FieldSet>

        <FieldSet label="Theme">
            <label class="flex items-center justify-between">
                <span>Theme color:</span>
                <USelect v-model="themePrimary" :items="themePrimaryOptions" class="min-w-60">
                    <template #leading="{ modelValue, ui }">
                        <UChip v-if="modelValue" inset standalone :size="ui.itemLeadingChipSize()"
                            :class="ui.itemLeadingChip()" :style="`--ui-primary: var(--ui-color-${modelValue}-400);`" />
                    </template>
                </USelect>
            </label>

            <label class="flex items-center justify-between">
                <span>Theme Mode:</span>

                <UButtonGroup v-model="themeMode" class="min-w-60">
                    <UButton v-for="mode in themeModes" :key="mode.label" :label="mode.label" :icon="mode.icon"
                        :color="themeMode === mode.value ? 'primary' : 'neutral'" variant="outline" block class="w-full"
                        @click="themeMode = mode.value" />
                </UButtonGroup>
            </label>
        </FieldSet>
    </UContainer>
</template>