import { prisma } from "../db.server";
export const getPushSubsByUserId = async (userId: string) => {
  return await prisma.pushSubscription.findMany({
    where: {
      userId: userId,
    },
  });
};
