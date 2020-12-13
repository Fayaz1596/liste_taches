import { Injectable } from '@angular/core';
import { Tache } from '../modeles/tache.modele';
import { RequeteWebService } from './requete-web.service';

@Injectable({
  providedIn: 'root'
})
export class TacheService 
{
  constructor(private requeteWebService: RequeteWebService) 
  {
  }

  creerListe(titre: string, sousTitre: string)
  {
    // On veut envoyer une requête web pour créer une liste
    return this.requeteWebService.post('listes', { titre, sousTitre });
  }

  creerTache(titre: string, listeId: string)
  {
    // On veut envoyer une requête web pour créer une tâche
    return this.requeteWebService.post(`listes/${listeId}/taches`, { titre });
  }

  miseJourListe(titre: string, sousTitre: string, id: string)
  {
    // On veut envoyer une requête web pour mettre à jour une liste
    return this.requeteWebService.patch(`listes/${id}`, { titre, sousTitre });
  }

  miseJourTache(listeId: string, titre: string, id: string)
  {
    // On veut envoyer une requête web pour mettre à jour une tâche
    return this.requeteWebService.patch(`listes/${listeId}/taches/${id}`, { titre });
  }

  supprimerListe(id: string)
  {
    return this.requeteWebService.delete(`listes/${id}`);
  }

  supprimerTache(listeId: string, tacheId: string)
  {
    return this.requeteWebService.delete(`listes/${listeId}/taches/${tacheId}`);
  }

  obtenirListes()
  {
    return this.requeteWebService.get('listes');
  }

  obtenirTaches(listeId: string)
  {
    return this.requeteWebService.get(`listes/${listeId}/taches`);
  }

  termine(tache: Tache)
  {
    return this.requeteWebService.patch(`listes/${tache._listeId}/taches/${tache._id}`, { termine: !tache.termine });
  }
}
