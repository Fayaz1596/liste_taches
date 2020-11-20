import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-page-inscription',
  templateUrl: './page-inscription.component.html',
  styleUrls: ['./page-inscription.component.scss']
})
export class PageInscriptionComponent implements OnInit 
{
  erreur;
  message;

  constructor(private authService: AuthService, private elementRef: ElementRef, private router: Router) 
  { 
  }

  ngOnInit(): void 
  {
  }

  inscriptionBoutonClic(nom: string, email: string, motdepasse: string)
  {
    this.authService
      .inscription(nom, email, motdepasse)
      .subscribe((res: HttpResponse<any>) => 
      {
        // console.log(res);
        this.router.navigate(['/listes']);
      }
      );
    
    if(nom === "" && email === "" && motdepasse === "")
    {
      this.erreur = "Tous les champs sont requis !";
      this.message = this.elementRef.nativeElement.querySelector('.message');
      this.message.style.display = 'flex';
    }
    else
    {
      this.message.style.display = 'none';
    }
  }

}
