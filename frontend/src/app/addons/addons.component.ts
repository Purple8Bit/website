import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AddonInfo } from '../../types';
import { AddonComponent } from '../addon/addon.component';
@Component({
  selector: 'app-addons',
  imports: [AddonComponent],
  templateUrl: './addons.component.html',
  styleUrl: './addons.component.css'
})
export class AddonsComponent implements OnInit {
  addons: Array<AddonInfo> = [];
  constructor(private http: HttpClient) {
  }
  async ngOnInit(): Promise<void> {
    this.http.get(environment.server_url + "addons/0").subscribe(data => {
      const addons = (data as Array<AddonInfo>).map(v => ({
        description: v.description,
        wallpaper: environment.server_url + v.wallpaper,
        title: v.title,
        id: v.id,
      }));
      this.addons.push(...addons);
    });
  }
}
