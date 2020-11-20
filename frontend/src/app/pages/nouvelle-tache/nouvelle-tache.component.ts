import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Tache } from 'src/app/modeles/tache.modele';
import { TacheService } from 'src/app/tache.service';

@Component({
  selector: 'app-nouvelle-tache',
  templateUrl: './nouvelle-tache.component.html',
  styleUrls: ['./nouvelle-tache.component.scss']
})
export class NouvelleTacheComponent implements OnInit 
{
  listeId: string;
  erreur;

  constructor(private tacheService: TacheService, private route: ActivatedRoute, private router: Router, private elementRef: ElementRef) 
  { 
  }

  ngOnInit(): void 
  {
    this.route.params
      .subscribe((params: Params) =>
      {
        this.listeId = params['listeId'];
        //console.log(this.listeId);
      }
      );
  }

  creerTache(titre: string)
  {
    this.tacheService
      .creerTache(titre, this.listeId)
      .subscribe((nouvelleTache: Tache) =>
      {
        //console.log(nouvelleTache);
        if(titre)
        {
          this.router.navigate(['../'], { relativeTo: this.route });
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
