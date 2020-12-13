import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Tache } from 'src/app/modeles/tache.modele';
import { TacheService } from 'src/app/services/tache.service';

@Component({
  selector: 'app-modifier-tache',
  templateUrl: './modifier-tache.component.html',
  styleUrls: ['./modifier-tache.component.scss']
})
export class ModifierTacheComponent implements OnInit {

  constructor(private route: ActivatedRoute, private tacheService: TacheService, private router: Router, private elementRef: ElementRef) 
  { 
  }

  listeId: string;
  tacheId: string;
  tache: string;
  erreur;

  ngOnInit(): void 
  {
    this.route.params
      .subscribe((params: Params) =>
      {
        this.listeId = params.listeId;
        this.tacheId = params.tacheId;

        this.tacheService
          .obtenirTaches(this.listeId)
          .subscribe((taches: Tache[]) => 
          {
            for(let i = 0; i < taches.length; i++)
            {
              if(taches[i]._id === this.tacheId)
              {
                this.tache = taches[i].titre;
              }
            }
          }
          )
      }
      );
  }

  miseJourTache(titre: string)
  {
    this.tacheService
      .miseJourTache(this.listeId, titre, this.tacheId)
      .subscribe(() => 
      {
        if(titre)
        {
          this.router.navigate(['/listes', this.listeId]);
        }
      }
      );
      
    if(titre === "")
    {
      this.erreur = this.elementRef.nativeElement.querySelector('.message');
      this.erreur.style.display = 'flex';
    }
    else
    {
      this.erreur.style.display = 'none';
    }
  }

}
