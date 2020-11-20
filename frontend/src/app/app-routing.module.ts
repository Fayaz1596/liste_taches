import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModifierListeComponent } from './pages/modifier-liste/modifier-liste.component';
import { ModifierTacheComponent } from './pages/modifier-tache/modifier-tache.component';
import { NouvelleListeComponent } from './pages/nouvelle-liste/nouvelle-liste.component';
import { NouvelleTacheComponent } from './pages/nouvelle-tache/nouvelle-tache.component';
import { PageConnexionComponent } from './pages/page-connexion/page-connexion.component';
import { PageInscriptionComponent } from './pages/page-inscription/page-inscription.component';
import { TachesVueComponent } from './pages/taches-vue/taches-vue.component';

const routes: Routes = [
  { path: '', redirectTo: '/listes', pathMatch: 'full' },
  { path: 'nouvelle_liste', component: NouvelleListeComponent },
  { path: 'modifier_liste/:listeId', component: ModifierListeComponent },
  { path: 'inscription', component: PageInscriptionComponent },
  { path: 'connexion', component: PageConnexionComponent },
  { path: 'listes', component: TachesVueComponent },
  { path: 'listes/:listeId', component: TachesVueComponent },
  { path: 'listes/:listeId/nouvelle_tache', component: NouvelleTacheComponent },
  { path: 'listes/:listeId/modifier_tache/:tacheId', component: ModifierTacheComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
