import { prisma } from "..";

export async function get_addons(n: number) {
  let val;
  if (n == 0) val = prisma.addon.findMany();
  else val = prisma.addon.findMany({
    take: n
  });
  return val;
}

export async function get_contentsof(id: number) {
  return await prisma.addon.findUnique({
    where: {
      id
    },
    include: {
      contents: true
    }
  }) ?? { id: -1 };
}
