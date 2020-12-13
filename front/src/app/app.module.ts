import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TachesVueComponent } from './pages/taches-vue/taches-vue.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NouvelleListeComponent } from './pages/nouvelle-liste/nouvelle-liste.component';
import { NouvelleTacheComponent } from './pages/nouvelle-tache/nouvelle-tache.component';
import { PageConnexionComponent } from './pages/page-connexion/page-connexion.component';
import { WebRequeteIntercepteur } from './services/web-requete-intercepteur.service';
import { PageInscriptionComponent } from './pages/page-inscription/page-inscription.component';
import { ModifierListeComponent } from './pages/modifier-liste/modifier-liste.component';
import { ModifierTacheComponent } from './pages/modifier-tache/modifier-tache.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TachesVueComponent,
    NouvelleListeComponent,
    NouvelleTacheComponent,
    PageConnexionComponent,
    PageInscriptionComponent,
    ModifierListeComponent,
    ModifierTacheComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
  { provide:  HTTP_INTERCEPTORS, useClass: WebRequeteIntercepteur, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
