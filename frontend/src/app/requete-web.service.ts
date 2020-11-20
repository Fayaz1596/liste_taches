import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class RequeteWebService 
{
  readonly ROOT_URL;

  constructor(private http: HttpClient) 
  {
    this.ROOT_URL = 'http://localhost:3000';
  }

  get(lien: string)
  {
    return this.http.get(`${this.ROOT_URL}/${lien}`);
  }

  post(lien: string, donnee: Object)
  {
    return this.http.post(`${this.ROOT_URL}/${lien}`, donnee);
  }

  patch(lien: string, donnee: Object)
  {
    return this.http.patch(`${this.ROOT_URL}/${lien}`, donnee);
  }

  delete(lien: string)
  {
    return this.http.delete(`${this.ROOT_URL}/${lien}`);
  }

  connexion(email: string, motdepasse: string)
  {
    return this.http.post(`${this.ROOT_URL}/utilisateurs/connexion`, 
    {
      email,
      motdepasse
    },
    {
      observe: 'response'
    }
    )
  }

  inscription(nom: string, email: string, motdepasse: string)
  {
    return this.http.post(`${this.ROOT_URL}/utilisateurs`, 
    {
      nom,
      email,
      motdepasse
    },
    {
      observe: 'response'
    }
    )
  }
}
