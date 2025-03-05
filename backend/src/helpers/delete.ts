import { prisma } from "..";
import { delete_img } from "./file_manager";

export async function delete_addon(id: number) {
  const data = await prisma.addon.delete({
    where: {
      id
    },
    include: {
      contents:true
    }
  });
  for(const content of data.contents) for(const img of content.imgs) delete_img(img);
  
}
