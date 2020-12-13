import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Liste } from 'src/app/modeles/liste.modele';
import { Tache } from 'src/app/modeles/tache.modele';
import { TacheService } from 'src/app/services/tache.service';

@Component({
  selector: 'app-taches-vue',
  templateUrl: './taches-vue.component.html',
  styleUrls: ['./taches-vue.component.scss']
})
export class TachesVueComponent implements OnInit 
{
  listes: Liste[];
  taches: Tache[];
  selectionneListeId: string;
  email: string;
  nom: string;

  constructor(private tacheService: TacheService, private route: ActivatedRoute, private router: Router, private authService: AuthService) 
  { 
  }

  ngOnInit(): void 
  {
    this.route.params
      .subscribe((params: Params) =>
      {
        if(params.listeId)
        {
          //console.log(params);
          this.selectionneListeId = params.listeId;
          this.tacheService
            .obtenirTaches(params.listeId)
            .subscribe((taches: Tache[]) =>
            {
              this.taches = taches;
            }
            );
        }
        else
        {
          this.taches = undefined;
        }
      }
      );
    
    this.tacheService
      .obtenirListes()
      .subscribe((listes: Liste[]) =>
      {
        this.listes = listes;
      });

    this.email = this.authService.obtenirEmail();
    this.nom = this.authService.obtenirNom();
  }

  clicTache(tache: Tache)
  {
    // On veut mettre la tâche à compléter
    this.tacheService
      .termine(tache)
      .subscribe(() =>
      {
        // La tâche a été mise à "terminée" avec succès
        //console.log("Tâche complétée !");
        tache.termine = !tache.termine;
      }
      );
  }

  supprimerClicListe()
  {
    this.tacheService
      .supprimerListe(this.selectionneListeId)
      .subscribe((res: any) => 
      {
        this.router.navigate(['/listes']);
        //console.log(res);
      }
      );
  }

  supprimerClicTache(id: string)
  {
    this.tacheService
      .supprimerTache(this.selectionneListeId, id)
      .subscribe((res: any) => 
      {
        this.taches = this.taches.filter((valeur) => valeur._id !== id);
        //console.log(res);
      }
      );
  }

  survolElement(event: any, element: string)
  {
    if(element === "liste")
    {
      event.srcElement.classList.add("scroll");
    }

    if(element === "tache")
    {
      event.srcElement.classList.add("scroll");
    }
  }

  nonSurvolElement(event: any, element: string)
  {
    if(element === "liste")
    {
      event.srcElement.classList.remove("scroll");
    }

    if(element === "tache")
    {
      event.srcElement.classList.remove("scroll");
    }
  }

  obtenirEmail(email: string)
  {
    this.email = email;
  }

  obtenirNom(nom: string)
  {
    this.nom = nom;
  }

  deconnexion()
  {
    this.authService.deconnexion();
  }
}
