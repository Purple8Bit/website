import { Addon } from "@prisma/client";
import { prisma } from "../index.js";
import { delete_img, save_blob } from "./file_manager.js";
import { v4 as uuidv4 } from "uuid";
interface ContentData {
  text?: string;
  imgs: string[]
};

export async function save_img(img: File, name?: string) {
  if (name) return await save_blob(name, img);

  const extension = img.name.split(".").pop();
  const path = uuidv4() + "." + extension;
  return await save_blob(path, img);
}

export async function save_imgs(imgs: File | File[], target: ContentData) {
  let r;
  out: {
    if (Array.isArray(imgs)) {
      for (const img of imgs) if (r = await save_img(img)) target.imgs.push(r);
      break out;
    }
    if (r = await save_img(imgs)) target.imgs.push(r);
  }
}
interface Object {
  keys<T>(o: T): keyof T;
}
async function get_prisma_contents(input: Addon) {
  const contents = [];
  const prisma_input = {} as Addon;
  let idx = 0;
  let content_idx = 0;
  let key: keyof Addon = "id";
  const keys = Object.keys(input) as (keyof Addon)[];
  while (key = keys[idx++]) {
    if (key.startsWith("content")) {
      const elements: ContentData = {
        text: input[key] as any as string,
        imgs: [],
      };
      contents.push(elements);
      idx++;
      await save_imgs(input[("img" + content_idx++) as keyof Addon] as any as File | File[], elements);
    } else if (key.startsWith("img")) {
      content_idx++;
      const elements: ContentData = {
        text: "",
        imgs: []
      };
      await save_imgs(input[key] as any as File | File[], elements);
      contents.push(elements);
    }
    else if (key == "wallpaper" && input.wallpaper != void (0)) {
      prisma_input.wallpaper = await save_img(input.wallpaper as any as File) as any as string;
    }
    else if (key != "wallpaper") (prisma_input[key as keyof typeof prisma_input] as any) = input[key] as any as string;
  }
  (prisma_input as any).contents = {
    create: contents
  };
  return prisma_input;
}

export async function create_addon(input: Addon) {
  const contents = await get_prisma_contents(input);
  try {
    await prisma.addon.create({
      data: contents
    });
    return "Ok";
  } catch (e) {
    console.log(e);
    return "Err";
  }
}
export async function edit(id: number, input: Addon) {
  const addon = (await prisma.addon.findUnique({
    where: { id },
    include: { contents: true }
  }));
  if (!addon) return "Ok";
  try {
    if (input.wallpaper && input.wallpaper != "undefined") {
      await delete_img(addon.wallpaper);
    } else {
      delete (input as any).wallpaper;
    }
    for (const content of addon.contents) {
      for (const img of content.imgs) {
        await Bun.file(img).delete();
      }
      await prisma.content.delete({
        where: {
          id: content.id
        }
      });
    }
  } catch (e) {
    console.log(e);
    return "Err";
  }
  const prisma_content = await get_prisma_contents(input);
  await prisma.addon.update({
    where: { id },
    data: prisma_content
  });
  return "Ok";
}
