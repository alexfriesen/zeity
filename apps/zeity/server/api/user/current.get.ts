import { eq } from '@zeity/database';
import { users } from '@zeity/database/user';
import { organisations } from '@zeity/database/organisation';
import { organisationMembers } from '@zeity/database/organisation-member';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const db = useDrizzle();
  const user = await db
    .select({
      id: users.id,
      name: users.name,
      image: users.image,
      email: users.email,
      emailVerified: users.emailVerified,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)
    .then((rows) => rows[0])
    .then((user) => ({
      ...user,
      emailVerified: Boolean(user?.emailVerified),
    }));

  const orgs = await db
    .select({
      id: organisations.id,
      name: organisations.name,
      image: organisations.image,
      role: organisationMembers.role,
    })
    .from(organisations)
    .leftJoin(
      organisationMembers,
      eq(organisationMembers.organisationId, organisations.id)
    )
    .where(eq(organisationMembers.userId, user.id))
    .orderBy(asc(organisations.name));

  return {
    user,
    organisations: orgs,
  };
});
