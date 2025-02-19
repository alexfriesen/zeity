import { useDrizzleMigration } from '../utils/drizzle';

export default defineNitroPlugin(async () => {
  await useDrizzleMigration().run();
});
