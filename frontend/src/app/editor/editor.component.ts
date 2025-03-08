import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { environment } from '../../environments/environment';
import { AddonInfo } from '../../types';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Content, ContentComponent } from './content/content.component';

@Component({
  selector: 'app-editor',
  imports: [FormsModule, ContentComponent],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EditorComponent implements OnInit {
  addons: Array<AddonInfo> = [];
  img: Blob | undefined;
  description = "";
  img_src = "";
  editing = false;
  editing_id = 0;
  err_msg: string = "";
  contentsof = new Map<string, Array<Content>>();
  @ViewChild(ContentComponent, { static: false }) private contents?: ContentComponent;
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {

      if (!('password' in params) || params['password'] != "dreneas56") //Foi o ramcor quem escolheu
        this.router.navigate(["/"]);
    })
  }
  ngOnInit(): void {
    this.http.get(environment.server_url + "addons/0").subscribe(data => {
      this.addons.push(...data as Array<AddonInfo>);
    });
  }
  get has_img() {
    return this.img_src != "";
  }
  public assert_description() {
    if (this.description.length) return true;
    else {
      this.ferr("You must give a description");
      return false;
    }
  }
  public assert_image() {
    if (this.has_img) return true;
    else {
      this.ferr("You must give an image");
      return false;
    }
  } public assert_title() {
    const title = document.getElementById("title") as HTMLInputElement;
    if (title.value.length) return title.value;
    else {
      this.ferr("You must give a title");
      return false;
    }
  }
  public ferr(msg: string) {
    this.err_msg = msg;
    setTimeout(() => {
      const err = document.getElementById("err") as HTMLDivElement;
      err.classList.add("active");
      setTimeout(() => {
        err.classList.remove("active");
        this.err_msg = "";
      }, 5000);
    }, 10);
  }
  public create() {
    const title = document.getElementById("title") as HTMLInputElement;
    const preview = document.getElementById("preview") as HTMLImageElement;
    title.value = "";
    this.editing = false;
    this.img_src = preview.src = "";
    this.description = "";
    (document.getElementById("creation") as HTMLDialogElement).show();
  }
  public close() {
    (document.getElementById("creation") as HTMLDialogElement).close()
  }
  public set_img(f: File) {
    const freader = new FileReader();
    this.img = f;
    freader.onload = (e) => this.img_src = (document.getElementById("preview") as HTMLImageElement).src = e.target?.result as string;
    freader.readAsDataURL(f);
  }
  public handle_image() {
    const paper = document.getElementById("wallpaper")! as HTMLInputElement;
    if (paper.files?.[0]) this.set_img(paper.files[0]);
    paper.files = null;
    paper.value = null as any as string;
  }
  public confirm() {
    const title = this.assert_title();
    if (title && this.assert_image() && this.assert_description()) {
      const form = new FormData();
      form.append("title", title);
      form.append("description", this.description);
      form.append("wallpaper", this.img as Blob);
      let idx = 0;
      for (const content of (this.contents?.get_mescled() ?? [])) {
        if (content.content) form.append("content" + idx, content.content);
        const name = "img" + idx;
        for (const img of content.imgs ?? []) {
          form.append(name, img);
        }
        idx++;
      }
      fetch(environment.server_url + 'create', {
        method: "POST",
        body: form
      }).then(() => {
        console.log("Successfully created");
        this.close()
      }).catch(e => console.log(e));
    }
  }
  public delete() {
    this.http.delete(environment.server_url + `delete/${this.editing_id}`).subscribe(o => {
      this.close();
    })
  }
  public open(addon: AddonInfo) {
    const title = document.getElementById("title") as HTMLInputElement;
    const preview = document.getElementById("preview") as HTMLImageElement;
    this.create();
    this.editing = true;
    this.editing_id = addon.id;
    this.img_src = preview.src = addon.wallpaper as any as string;
    title.value = addon.title;
    this.description = addon.description;
    {
      this.contents?.req_content(addon.id).then((val) => {
        this.contentsof.set(addon.id.toString(), val);
        this.contents?.set_contents(val as any);
      })
    }
  }
}
