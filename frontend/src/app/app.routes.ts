import { Routes } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { HomeComponent } from './home/home.component';
import { AddonDataComponent } from './addon-data/addon-data.component';
import { AboutusComponent } from './aboutus/aboutus.component';

export const routes: Routes = [{
  path: "", redirectTo: "/home", pathMatch: "full"
}, {
  path: "edit",
  component: EditorComponent
}, {
  path: "home",
  component: HomeComponent,
},{
  path: "addon/:title", 
  component: AddonDataComponent
},{
  path: "about",
  component: AboutusComponent
},{
  path: "**",
  redirectTo: "/home"
}];
