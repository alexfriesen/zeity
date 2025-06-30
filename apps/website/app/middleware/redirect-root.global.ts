export default defineNuxtRouteMiddleware((to) => {
	const { $i18n } = useNuxtApp();

	// Redirect to default locale
	if (to.path === '/') {
		const defaultLocale = $i18n.defaultLocale || $i18n.fallbackLocale || 'en';
		return navigateTo(`/${defaultLocale}`);
	}
});
