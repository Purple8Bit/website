
import { create_addon, edit, } from "./helpers/post.js";
import { Addon, PrismaClient } from "@prisma/client";
import { get_addons, get_contentsof } from "./helpers/get.js";
import { delete_addon } from "./helpers/delete.js";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import express from "express";
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
  const app = express();
  app
    .use(cors())
    .use(express.json())
    .get('/addons/:amount', async (req, res) => void res.json(await get_addons(Number(req.params.amount))))
    .post('/edit/:id', async (req, res) => void res.json(await edit(Number(req.params.id), req.body)))
    .delete("delete/:id", async (req, res) => void res.json(await delete_addon(Number(req.params.id))))
    .get("content/:id", async (req, res) => void res.json(await get_contentsof(Number(req.params.id))))
    .post("/create", async (req, res) => void res.json(await create_addon(req.body as Addon)))
  return app;
}
export default async function(req, res) {
  const app = await (main());
  app(req, res)
};
