import { Member, Profile, Server } from "@prisma/client";

export type ServerwithMembersWithProfile = Server & {
  members: (Member & { profile: Profile })[];
};
