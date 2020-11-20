import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TacheService } from 'src/app/tache.service';
import { Liste } from 'src/app/modeles/liste.modele';

@Component({
  selector: 'app-nouvelle-liste',
  templateUrl: './nouvelle-liste.component.html',
  styleUrls: ['./nouvelle-liste.component.scss']
})
export class NouvelleListeComponent implements OnInit 
{
  erreur;  

  constructor(private tacheService: TacheService, private router: Router, private elementRef: ElementRef) 
  { 
  }

  ngOnInit(): void 
  {
  }

  creerListe(titre: string, sousTitre: string)
  {
    this.tacheService
      .creerListe(titre, sousTitre)
      .subscribe((liste: Liste) =>
      {
        //console.log(liste);
        // On veut naviguer dans "/listes/res._id"
        if(titre)
        {
          this.router.navigate(['/listes', liste._id]);
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
