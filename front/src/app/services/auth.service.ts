import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RequeteWebService } from './requete-web.service';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService 
{
  constructor(private webService: RequeteWebService, private router: Router, private http: HttpClient) 
  {
  }

  inscription(nom: string, email: string, motdepasse: string)
  {
    return this.webService
      .inscription(nom, email, motdepasse)
      .pipe(
        shareReplay(),
        tap((res: HttpResponse<any>) => 
        {
          // L'authentification des tokens sera dans l'en-tête de cette réponse
          this.mettreSession(res.body._id, res.headers.get('x-acces-token'), res.headers.get('x-actualisation-token'), res.body.email, res.body.nom);
          console.log("Inscrit et désormais connecté !");
        }
        )
      );
  }

  connexion(email: string, motdepasse: string)
  {
    return this.webService
      .connexion(email, motdepasse)
      .pipe(
        shareReplay(),
        tap((res: HttpResponse<any>) => 
        {
          // L'authentification des tokens sera dans l'en-tête de cette réponse
          this.mettreSession(res.body._id, res.headers.get('x-acces-token'), res.headers.get('x-actualisation-token'), res.body.email, res.body.nom);
          console.log("Connecté !");
        }
        )
      );
  }

  deconnexion()
  {
    this.supprimerSession();
    this.router.navigate(['/connexion']);
  }

  obtenirAccesToken()
  {
    return localStorage.getItem('x-acces-token');
  }

  obtenirActualisationToken()
  {
    return localStorage.getItem('x-actualisation-token');
  }

  obtenirUtilisateurID()
  {
    return localStorage.getItem('utilisateur-id');
  }

  obtenirEmail()
  {
    return localStorage.getItem('email');
  }

  obtenirNom()
  {
    return localStorage.getItem('nom');
  }

  mettreAccesToken(accesToken: string)
  {
    localStorage.setItem('x-acces-token', accesToken);
  }

  private mettreSession(utilisateurId: string, accesToken: string, actualisationToken: string, email: string, nom: string)
  {
    localStorage.setItem('utilisateur-id', utilisateurId);   
    localStorage.setItem('x-acces-token', accesToken);   
    localStorage.setItem('x-actualisation-token', actualisationToken);   
    localStorage.setItem('email', email);   
    localStorage.setItem('nom', nom);   
  }

  private supprimerSession()
  {
    localStorage.removeItem('utilisateur-id');   
    localStorage.removeItem('x-acces-token');   
    localStorage.removeItem('x-actualisation-token');
    localStorage.removeItem('email');
  }

  obtenirNouveauTokenAcces()
  {
    return this.http
      .get(`${this.webService.ROOT_URL}/utilisateurs/moi/acces_token`, 
      {
        headers: 
        {
          'x-actualisation-token': this.obtenirActualisationToken(),
          '_id': this.obtenirUtilisateurID()
        },
        observe: 'response'
      })
      .pipe(
        tap((res: HttpResponse<any>) => 
        {
          this.mettreAccesToken(res.headers.get('x-acces-token'));
        }
        )
      );
  }
}


