<script setup lang="ts">
import { downloadAs } from '~/utils/download-file';

const timeStore = useTimerStore();
const projectStore = useProjectStore();
const settingsStore = useSettingsStore();

const languageOptions = [
    {
        label: 'English',
        value: 'en',
    },
];

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
];

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
];

const filePrompt = useTemplateRef('fileprompt');

function handleExport() {
    const content = {
        times: timeStore.getAllTimes().value,
        projects: projectStore.getAllProjects().value,
        settings: settingsStore.settings,
    };
    const blob = new Blob([JSON.stringify(content)], { type: 'text/plain' });
    const dataUri = URL.createObjectURL(blob);

    downloadAs(dataUri, `zeity-${Date.now()}.json`);
}

async function handleImport(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    const file = files?.[0];
    if (!file) return;

    const fileContent = new TextDecoder().decode(await file.arrayBuffer());
    const json = JSON.parse(fileContent);

    // TODO: Add a pretty confirmation modal
    const result = window.confirm(`Would you like to import ${json?.projects?.length ?? 0} projects and ${json?.times?.length ?? 0} times?`);

    if (!result) return;

    if (json.times && Array.isArray(json.times)) {
        timeStore.upsertTimes(json.times);
    }

    if (json.projects && Array.isArray(json.projects)) {
        projectStore.upsertProjects(json.projects);
    }
}
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
                <USelect v-model="settingsStore.language" :items="languageOptions" class="min-w-60" />
            </label>
        </FieldSet>

        <FieldSet label="Theme">
            <label class="flex items-center justify-between">
                <span>Theme color:</span>
                <USelect v-model="settingsStore.themePrimary" :items="themePrimaryOptions" class="min-w-60">
                    <template #leading="{ modelValue, ui }">
                        <UChip v-if="modelValue" inset standalone :size="ui.itemLeadingChipSize()"
                            :class="ui.itemLeadingChip()" :style="`--ui-primary: var(--ui-color-${modelValue}-400);`" />
                    </template>
                </USelect>
            </label>

            <label class="flex items-center justify-between">
                <span>Theme Mode:</span>

                <ClientOnly>
                    <UButtonGroup v-model="settingsStore.themeMode" class="min-w-60">
                        <UButton v-for="mode in themeModes" :key="mode.label" :label="mode.label" :icon="mode.icon"
                            :color="settingsStore.themeMode === mode.value ? 'primary' : 'neutral'" variant="outline"
                            block class="w-full" @click="settingsStore.themeMode = mode.value" />
                    </UButtonGroup>
                </ClientOnly>
            </label>
        </FieldSet>

        <FieldSet label="Import & Export">

            <div class="flex gap-3">
                <input hidden ref="fileprompt" type="file" accept="application/json" @change="handleImport" />
                <UButton block color="neutral" variant="subtle" label="Import" icon="i-lucide-hard-drive-download"
                    @click="filePrompt?.click()" />

                <UButton block color="neutral" variant="subtle" label="Export" icon="i-lucide-hard-drive-upload"
                    @click="handleExport()" />
            </div>
        </FieldSet>
    </UContainer>
</template>