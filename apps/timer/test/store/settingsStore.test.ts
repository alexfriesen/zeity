import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useSettingsStore } from '../../app/stores/settingsStore';

const { useColorMode } = vi.hoisted(() => ({
    useColorMode: () => ({
        value: 'dark',
        preference: 'system',
    }),
}));
mockNuxtImport('useColorMode', () => useColorMode);

describe("useSettingsStore", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        setActivePinia(createPinia());
    });

    it('should have a default state', () => {
        const store = useSettingsStore();
        expect(store.settings).toStrictEqual({ language: 'en', themeMode: 'dark', themePrimary: 'sky' });
    });

    describe('localStorage', () => {
        it('should load settings from localStorage', () => {
            vi.spyOn(localStorage, 'getItem').mockReturnValue((JSON.stringify({ language: 'fr', themeMode: 'dark', themePrimary: 'red' })));

            const store = useSettingsStore();
            store.loadFromLocalStorage();

            expect(store.settings).toEqual({ language: 'fr', themeMode: 'dark', themePrimary: 'red' });
        });

        it('should save settings to localStorage', async () => {
            const spy = vi.spyOn(localStorage, 'setItem');
            const store = useSettingsStore();
            store.updateSettings({ language: 'fr' });

            await nextTick();

            expect(spy).toHaveBeenCalledWith('settings', JSON.stringify({ language: 'fr', themeMode: 'dark', themePrimary: 'sky' }));
        });
    });

    describe('updateSettings', () => {
        it('should update settings', () => {
            const store = useSettingsStore();
            store.updateSettings({ language: 'fr' });

            expect(store.settings).toStrictEqual({ language: 'fr', themeMode: 'dark', themePrimary: 'sky' });
        });
    });

    describe('setLanguage', () => {
        it('should set the language', () => {
            const store = useSettingsStore();
            store.setLanguage('fr');

            expect(store.settings.language).toStrictEqual('fr');
        });
    });
});