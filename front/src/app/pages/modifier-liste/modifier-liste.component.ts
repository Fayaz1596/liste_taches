import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Liste } from 'src/app/modeles/liste.modele';
import { TacheService } from 'src/app/services/tache.service';

@Component({
  selector: 'app-modifier-liste',
  templateUrl: './modifier-liste.component.html',
  styleUrls: ['./modifier-liste.component.scss']
})
export class ModifierListeComponent implements OnInit 
{
  erreur;

  constructor(private route: ActivatedRoute, private tacheService: TacheService, private router: Router, private elementRef: ElementRef) 
  { 
  }

  listeId: string;
  listes: Liste[];
  listeTitre: string;
  listeSousTitre: string;

  ngOnInit(): void 
  {
    this.route.params
      .subscribe((params: Params) =>
      {
        this.listeId = params.listeId;
        this.tacheService
          .obtenirListes()
          .subscribe((listes: Liste[]) =>
          {
            for(let i = 0; i < listes.length; i++)
            {
              if(listes[i]._id === this.listeId)
              {
                this.listeTitre = listes[i].titre;
                this.listeSousTitre = listes[i].sousTitre;
              }
            }
          }
          );
      }
      );
  }

  miseJourListe(titre: string, sousTitre: string)
  {
    this.tacheService
      .miseJourListe(titre, sousTitre, this.listeId)
      .subscribe(() => 
      {
        if(titre || sousTitre)
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
