import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { empty, Observable, Subject, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebRequeteIntercepteur implements HttpInterceptor
{
  constructor(private authService: AuthService) 
  { 
  }

  actualiserTokenAcces: boolean;
  accesTokenActualise: Subject<any> = new Subject();

  intercept(requete: HttpRequest<any>, suivant: HttpHandler): Observable<any>
  {
    // Manipuler la requête
    requete = this.ajoutAuthEnTete(requete);

    // Appeler "suivant()" et manipuler la réponse
    return suivant
      .handle(requete)
      .pipe(
        catchError((erreur: HttpErrorResponse) => 
        {
          console.log(erreur);

          if(erreur.status === 401)
          {
            // Erreur 401 alors on n'est pas autorisé
            // Actualiser le token d'accès
            return this.actualisationTokenAcces()
              .pipe(
                switchMap(() => 
                {
                  requete = this.ajoutAuthEnTete(requete);
                  return suivant.handle(requete);
                }
                ),
                catchError((err: any) => 
                {
                  console.log(err);
                  this.authService.deconnexion();
                  return empty();
                }
                )
              );
          }

          return throwError(erreur);
        }
        )
      );
  }

  actualisationTokenAcces()
  {
    if(this.actualiserTokenAcces)
    {
      return new Observable((observer) => 
      {
        this.accesTokenActualise
          .subscribe(() => 
          {
            // Ce code pourra s'exécuter quand le token d'accès a été actualisé
            observer.next();
            observer.complete();
          }
          )
      }
      )
    }
    else
    {
      this.actualiserTokenAcces = true;
      // On veut appeler une méthode dans l'authentification de service pour envoyer une requête et actualiser le token d'accès
      return this.authService
        .obtenirNouveauTokenAcces()
        .pipe(
          tap(() => 
          {
            console.log("Token d'accès actualisé !");
            this.actualiserTokenAcces = false;
            this.accesTokenActualise.next();
          }
          )
        );  
    }
  }

  ajoutAuthEnTete(requete: HttpRequest<any>)
  {
    // Obtenir le token d'accès
    const token = this.authService.obtenirAccesToken();

    if(token)
    {
      // Ajouter le token d'accès à la requête de l'en-tête
      return requete.clone(
      {
        setHeaders:
        {
          'x-acces-token': token
        }
      }
      );
    }
    return requete;
  }
}
