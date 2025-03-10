import { supabase } from "../index.js";

export async function save_blob(name: string, buffer: Blob) {
  try {
    const bucket = supabase.storage.from("imgs");
    const { data, error } = await bucket.upload(name, buffer);
    console.log(data);
    if (error) throw error;
    const url = bucket.getPublicUrl(name).data.publicUrl;
    return url;
  } catch (e) {
    console.log(e);
  }
}


export async function delete_img(name: string) {
  const id = name.split("/").pop()!;
  try {
    const { data, error } = await supabase.storage.from("imgs").remove([id]);
    console.log("trying to remove", id);
    if (error) throw error;
    console.log(data);
  } catch (e) {
    console.log(e);
  };
}
