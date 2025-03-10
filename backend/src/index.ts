import * as dotenv from 'dotenv';

dotenv.config();
import { Elysia, t } from "elysia";
import { create_addon, edit, } from "./helpers/post";
import cors from "@elysiajs/cors";
import { Addon, PrismaClient } from "@prisma/client";
import { get_addons, get_contentsof } from "./helpers/get";
import staticPlugin from "@elysiajs/static";
import { delete_addon } from "./helpers/delete";
import { createClient } from "@supabase/supabase-js";

export const prisma = new PrismaClient();
export const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

async function init() {
  const { error } = await supabase.storage.getBucket("imgs");
  {
    if (error) {
      console.error(error);
      const bucket = await supabase.storage.createBucket("imgs");
      if (bucket.error) throw error;
      else console.log(bucket.data);
    }
  }
}

async function main() {
  await init();
  const app =
    new Elysia()
      .use(cors({
        origin: "*",
      }))
      .use(staticPlugin())
      .get("/addons/:amount", async ({ params: { amount } }) => await get_addons(amount), {
        params: t.Object({
          amount: t.Number()
        })
      })
      .post("/edit/:id", async ({ params: { id }, body }) => await edit(id, body as any), {
        params: t.Object({
          id: t.Number()
        })
      })
      .delete("delete/:id", async ({ params: { id } }) => await delete_addon(id), {
        params: t.Object({
          id: t.Number()
        })
      })
      .get("content/:id", async ({ params: { id } }) => await get_contentsof(id), {
        params: t.Object({
          id: t.Number()
        })
      })
      .post("/create", async ({ body }) => {
        return await create_addon(body as Addon)
      })
      .get("/", (ctx) => {
        ctx.body = "Já era";
      })
      .listen(3000);
  return app;
}
export default main();
