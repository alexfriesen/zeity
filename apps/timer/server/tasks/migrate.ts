import { useDrizzleMigration } from '../utils/drizzle';

export default defineTask({
  meta: {
    name: 'db:migrate',
    description: 'Run database migrations',
  },
  async run() {
    await useDrizzleMigration().run();

    return {
      result: 'done',
    };
  },
});
