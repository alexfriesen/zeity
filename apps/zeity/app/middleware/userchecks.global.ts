const VERIFY_PATH = '/user/verify';
const CREATE_ORG_PATH = '/organisations/create';

export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, user } = useUserSession();

  if (!loggedIn.value) {
    return;
  }

  if (to.path === VERIFY_PATH) {
    return;
  }
  if (to.path === CREATE_ORG_PATH) {
    return;
  }

  if (user.value && !user.value.verified) {
    console.info('User not verified, redirecting to verify page');
    return navigateTo(VERIFY_PATH);
  }

  const { data: orgs } = await useFetch('/api/organisation');
  if ((orgs.value?.length ?? 0) < 1) {
    console.info('No organisations found, redirecting to create organisation');
    return navigateTo(CREATE_ORG_PATH);
  }
});
