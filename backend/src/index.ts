
import { create_addon, edit, } from "./helpers/post.js";
import { Addon, PrismaClient } from "@prisma/client";
import { get_addons, get_contentsof } from "./helpers/get.js";
import { delete_addon } from "./helpers/delete.js";
import { createClient } from "@supabase/supabase-js";
import fastify from "fastify";
import cors from "fastify-cors";


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
  const app = fastify().register(cors, {
    origin: "*"
  })
    .get('/addons/:amount', async (req, res) => void res.send(await get_addons(Number((req.params as any).amount))))
    .post('/edit/:id', async (req, res) => void res.send(await edit(Number((req.params as any).id), req.body as Addon)))
    .delete("delete/:id", async (req, res) => void res.send(await delete_addon(Number((req.params as any).id))))
    .get("content/:id", async (req, res) => void res.send(await get_contentsof(Number((req.params as any).id))))
    .post("/create", async (req, res) => void res.send(await create_addon(req.body as Addon)))
  return app;
}
const app = await (main());
export default async function(req, res) {
  await (app.ready());
  app.server.emit('request', req, res)
};
