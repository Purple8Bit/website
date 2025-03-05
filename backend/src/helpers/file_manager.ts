import Bun from "bun";

let outdir = "public/";
export function set_dir(dir: string) {
  outdir = dir;
}

export async function save_file(name: string, buffer: Uint8Array) {
  const dir = outdir + name;
  await Bun.write(dir, buffer);
  return dir;
}

export async function save_blob(name: string, file: Blob) {
  const dir = outdir + name;
  await Bun.write(dir, file);
  return dir;
}

export async function delete_img(name: string) {
  try {
    await Bun.file(outdir + name).delete();
  } catch { };
}
