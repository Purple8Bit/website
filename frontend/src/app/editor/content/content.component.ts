import { NgIf } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { environment } from '../../../environments/environment';

export type Content = {
  content: string;
  editable: boolean;
  img: File;
  img_content: string;
}

@Component({
  selector: 'app-content',
  imports: [FormsModule, NgIf],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContentComponent {
  current_content: string = "";
  contents: Array<Content> = [];
  set_contents(contents: Array<{ content: string, imgs: string[] }>) {

    let content;
    let i = 0;
    let img;
    while (content = contents[i++]) {
      this.contents.push({
        content: content.content,
        img_content: content.imgs.shift()!,
        img: null as any as File,
        editable: false,
      });
      while (img = content.imgs.shift()) {
        this.contents.push({
          content: "",
          img_content: img,
          img: null as any as File,
          editable: false,
        })
      }
      setTimeout(() => {
        this.contents.push({} as any);
        this.contents.pop();
      }, 100);
    }
  }
  async req_content(id: number) {
    const contents = await fetch(environment.server_url + "content/" + id);
    const json = (await contents.json()).contents as Content[];
    json.forEach(c => {
      c.content = (c as any).text;
      delete (c as any).text;
    });
    return json;
  }
  req_img() {
    const rquester = document.getElementById("img_requester") as HTMLInputElement;
    if (rquester.files) {
      const img_content = new FileReader();
      img_content.onload = () => {
        this.contents.push({
          content: this.current_content,
          img_content: img_content.result as string,
          img: rquester.files![0],
          editable: true,
        });
        setTimeout(() => {
          this.current_content = "";
          this.contents.push({} as any);
          this.contents.pop();
        }, 100);
      };
      img_content.readAsDataURL(rquester.files[0]);
      (document.getElementById("editor") as HTMLTextAreaElement).value = "";
    }
  }
  get_mescled() {
    const files: { content?: string, imgs?: File[] }[] = [];
    const len = this.contents.length;
    if (len != 0) for (let i = 0; i < len; i++) {
      const imgs = [this.contents[i].img];
      const editor = document.getElementById(`editor${i}`)?.textContent;
      while (++i < len && !document.getElementById(`editor${i}`)) imgs.push(this.contents[i].img);
      i--;
      files.push({
        content: editor as string | undefined,
        imgs
      });
    }
    const editor_content = document.getElementById("editor")?.textContent;
    if (editor_content) files.push({
      content: editor_content,
      imgs: undefined
    });
    return files;
  }
}
