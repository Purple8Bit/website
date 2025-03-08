import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environment/environment';


interface AddonContent {
  title: string;
  description: string;
  wallpaper: string;
  contents: {
    imgs: string[],
    text: string,
  }[]
}

@Component({
  selector: 'app-addon-data',
  imports: [],
  templateUrl: './addon-data.component.html',
  styleUrl: './addon-data.component.css'
})
export class AddonDataComponent implements OnInit {
  title = "";

  contents?: AddonContent;
  constructor(private route: ActivatedRoute) { }
  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(params => this.title = params.get("title")!);
    const contents = await fetch(environment.server_url + "content/" + this.title);
    const json = await contents.json();
    delete json.id;
    json.contents.forEach((content: any) => {
      delete content.addonId;
      delete content.id;
    });
    this.contents = json;
  }
  wallpaper(value = this.contents?.wallpaper) {
    return environment.server_url + value;
  }
}
