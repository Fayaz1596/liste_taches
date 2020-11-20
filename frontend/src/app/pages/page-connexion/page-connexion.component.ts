import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-page-connexion',
  templateUrl: './page-connexion.component.html',
  styleUrls: ['./page-connexion.component.scss']
})
export class PageConnexionComponent implements OnInit 
{
  erreur;
  message;

  constructor(private authService: AuthService, private router: Router, private elementRef: ElementRef) 
  {
  }

  ngOnInit(): void 
  {
  }

  connexionBoutonClic(email: string, motdepasse: string)
  {
    this.authService
      .connexion(email, motdepasse)
      .subscribe((res: HttpResponse<any>) => 
      {
        if(res.status === 200)
        {
          // On est connecté
          this.router.navigate(['/listes']);
        }
        //console.log(res);
      }
      );
    
    if(!email || !motdepasse)
    {
      if(email === "")
      {
        this.erreur = "L'email est requis !";
        this.message = this.elementRef.nativeElement.querySelector('.message');
        this.message.style.display = 'flex';
      }

      if(motdepasse === "")
      {
        this.erreur = "Le mot de passe est requis !";
        this.message = this.elementRef.nativeElement.querySelector('.message');
        this.message.style.display = 'flex';
      }

      if(email === "" && motdepasse === "")
      {
        this.erreur = "Tous les champs sont requis !";
        this.message = this.elementRef.nativeElement.querySelector('.message');
        this.message.style.display = 'flex';
      }
    }
    else
    {
      this.message.style.display = 'none';
    }
  }
}
