const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const { mongoose } = require('./bdd/mongoose');

// Charger dans les modèles "mongoose"
const { Liste, Tache, Utilisateur } = require('./bdd/modeles');

const jwt = require('jsonwebtoken');

// Charger le "middleware"
app.use(bodyParser.json());

// "Cors" en-tête "middleware"
app.use(function(req, res, suivant) 
{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-acces-token, x-actualisation-token, _id");
    res.header(
        'Access-Control-Expose-Headers',
        'x-acces-token, x-actualisation-token'
    );
    suivant();
});

// Vérifier qu'il s'agit de la requête qui a un token d'accès JWT valide
let authentifier = (req, res, suivant) =>
{
    let token = req.header('x-acces-token');

    // Vérifier le JWT
    jwt.verify(token, Utilisateur.obtenirJWTSecret(), (err, decode) =>
    {
        if(err)
        {
            // JWT est invalide : ne pas s'authentifier
            res
                .status(401)
                .send(err);
        }
        else
        {
            // JWT est valide
            req.utilisateur_id = decode._id;
            suivant();
        }
    }
    )
} 


// Vérifie les tokens actualisés "middleware" (qui vérifiera la session)
let verifierSession = (req, res, suivant) => 
{
    // Saisir le token actualisé depuis la requête "header"
    let actualisationToken = req.header('x-actualisation-token');

    // Saisir l'ID depuis la requête "header"
    let _id = req.header('_id');

    Utilisateur
        .trouverParIdEtToken(_id, actualisationToken)
        .then((utilisateur) =>
        {   
            if(!utilisateur)
            {
                // Utilisateur ne peut pas être trouvé
                return Promise.reject(
                {
                    'erreur': 'Utilisateur non trouvé : vérifier que l\'ID et le token actualisé sont correctes'
                }
                );
            }

            // Si le code atteint ici : l'utilisateur a été trouvé
            // Le token actualisé existe dans la base de données, mais il faut vérifier si c'est expiré ou non
            req.utilisateur_id = utilisateur._id;
            req.actualisationToken = actualisationToken;
            req.utilisateurObjet = utilisateur;

            let estSessionValide = false;

            utilisateur.sessions.forEach((session) =>
            {
                if(session.token === actualisationToken)
                {
                    // Vérifier si la session a expiré
                    if(Utilisateur.aActualisationTokenExpire(session.expireA) === false)
                    {
                        // Token actualisé n'a pas expiré
                        estSessionValide = true;
                    }
                }
            }
            );

            if(estSessionValide)
            {
                // La session est valide, appel "next()" pour continuer le processus de cette requête web
                suivant();
            }
            else
            {
                return Promise.reject(
                {
                    'erreur': 'Token actualisé a été expiré ou session est invalide'
                }
                );
            }
        }
        )
        .catch((e) => 
        {
            res.status(401).send(e);
        }
        );
};


/* Liste de routes */

/**
 * GET : /listes
 * Objectif : Obtenir toutes les listes
 */
app.get('/listes', authentifier, (req, res) => 
{
    // On veut retourner un tableau de toutes les listes dans la base de données qui appartiennent à l'utilisateur authentifié
    Liste
        .find(
        {
            _utilisateurId: req.utilisateur_id
        }
        )
        .then((listes) => 
        {
            res.send(listes);
        }
        )
        .catch((e) => 
        {
            res.send(e);
        }
        );
}
);

/**
 * POST : /listes
 * Objectif : Créer une liste
 */
app.post('/listes', authentifier, (req, res) => 
{
    // On veut créer une nouvelle liste et retourner cette liste de document vers l'utilisateur (qui inclut l'ID)
    // Les informations de la liste (champs) seront passées dans la requête JSON du "body"
    let titre = req.body.titre;
    let sousTitre = req.body.sousTitre;

    let nouvelleListe = new Liste(
    {
        titre,
        sousTitre,
        _utilisateurId: req.utilisateur_id
    }
    );
    nouvelleListe
        .save()
        .then((listeDocument) => 
        {
            // La liste complète du document est retournée (l'ID inclus)
            if(titre)
            {
                res.send(listeDocument);
            }
        }
        );
}
);

/**
 * PATH : /listes/id
 * Objectif : Mettre à jour une liste spécifiée
 */
app.patch('/listes/:id', authentifier, (req, res) => 
{
    // On veut mettre à jour la liste spécifiée (liste de document avec l'ID dans l'URL) avec les nouvelles valeurs spécifiées dans le corps du JSON de la requête
    let titre = req.body.titre;

    if(titre !== "")
    {
        Liste
            .findOneAndUpdate(
            {
                _id: req.params.id,
                _utilisateurId: req.utilisateur_id
            }, 
            { 
                $set: req.body
            }
            )
            .then(() => 
            {
                res.send({ 'message': 'Mise à jour avec succès' });
            }
            );
    }
}
);

/**
 * PATH : /listes/id
 * Objectif : Supprimer une liste spécifiée
 */
app.delete('/listes/:id', authentifier, (req, res) => 
{
    // On veut supprimer une liste spécifiée (liste de document avec l'ID dans l'URL)
    Liste
        .findOneAndRemove(
        { 
            _id: req.params.id,
            _utilisateurId: req.utilisateur_id
        }
        )
        .then((supprimeeListeDocument) => 
        {
            res.send(supprimeeListeDocument);
            
            // Supprimer toutes les tâches qu'il y a dans la liste effacée
            supprimerTachesPourListe(supprimeeListeDocument._id);
        }
        );
}
);

/**
 * GET : /listes/:listeId/taches
 * Objectif : Obtenir toutes les tâches d'une liste spécifiée
 */
app.get('/listes/:listeId/taches', authentifier, (req, res) =>
{
    // On veut retourner toutes les tâches qui appartiennent à la liste spécifique (spécifié par l'ID de la liste)
    Tache
        .find(
        { 
            _listeId: req.params.listeId 
        }
        )
        .then((taches) =>
        {
            res.send(taches);
        }
        );
}
);

/**
 * POST : /listes/:listeId/taches
 * Objectif : Créer une nouvelle tâche d'une liste spécifiée
 */
app.post('/listes/:listeId/taches', authentifier, (req, res) =>
{
    let titre = req.body.titre;

    // On veut créer une tâche dans une liste spécifiée par l'ID de la liste
    Liste
        .findOne(
        {
            _id: req.params.listeId,
            _utilisateurId: req.utilisateur_id
        }
        )
        .then((liste) => 
        {
            if(liste)
            {
                // Liste d'objet a été trouvée avec les conditions spécifiées
                // Actuellement l'utilisateur authentifié peut créer des nouvelles tâches
                return true;
            }

            return false;
        }
        )
        .then((peutCreerTache) => 
        {
            if(peutCreerTache)
            {
                let nouvelleTache = new Tache(
                {
                    titre: req.body.titre,
                    _listeId: req.params.listeId
                }
                );
                nouvelleTache
                    .save()
                    .then((nouvelleTacheDocument) => 
                    {
                        if(titre)
                        {
                            res.send(nouvelleTacheDocument);
                        }
                    }
                    );
            }
            else
            {
                res.sendStatus(404);
            }
        }
        );
}
);

/**
 * PATCH : /listes/:listeId/taches/:tacheId
 * Objectif : Mettre à jour une tâche existante
 */
app.patch('/listes/:listeId/taches/:tacheId', authentifier, (req, res) => 
{
    let titre = req.body.titre;

    Liste
        .findOne(
        {
            _id: req.params.listeId,
            _utilisateurId: req.utilisateur_id
        }
        )
        .then((liste) => 
        {
            if(liste)
            {
                // Liste d'objet a été trouvée avec les conditions spécifiées
                // Actuellement l'utilisateur authentifié peut modifier des tâches de cette liste
                return true;
            }

            return false;
        }
        )
        .then((peutModifierTaches) => 
        {
            if(peutModifierTaches)
            {
                if(titre !== "")
                {
                    // Actuellement l'utilisateur authentifié peut modifier les tâches
                    Tache
                        .findOneAndUpdate(
                        {
                            _id: req.params.tacheId,
                            _listeId: req.params.listeId
                        },
                        {
                            $set: req.body
                        }
                        )
                        .then(() => 
                        {
                            res.send({ message: 'Mise à jour avec succès.' });
                        }
                        );
                }
            }
            else
            {
                res.sendStatus(404);
            }
        }
        );
}
);

/**
 * DELETE : /listes/:listeId/taches/:tacheId
 * Objectif : Supprimer une tâche
 */
app.delete('/listes/:listeId/taches/:tacheId', authentifier, (req, res) => 
{
    Liste
        .findOne(
        {
            _id: req.params.listeId,
            _utilisateurId: req.utilisateur_id
        }
        )
        .then((liste) => 
        {
            if(liste)
            {
                // Liste d'objet a été trouvée avec les conditions spécifiées
                // Actuellement l'utilisateur authentifié peut supprimer des tâches de cette liste
                return true;
            }

            return false;
        }
        )
        .then((peutSupprimerTaches) => 
        {
            if(peutSupprimerTaches)
            {
                Tache
                    .findOneAndRemove(
                    {  
                        _id: req.params.tacheId,
                        _listeId: req.params.listeId
                    }
                    )
                    .then((supprimeeTacheDocument) => 
                    {
                        res.send(supprimeeTacheDocument);
                    }
                    );
            }
            else
            {
                res.sendStatus(404);
            }
        }
        );

}
);


/* Routes d'utilisateur */


/**
 * GET : /utilisateurs
 * Objectif : Obtenir tous les utilisateurs
 */
app.get('/utilisateurs', (req, res) => 
{
    Utilisateur
        .find(
        {
            _utilisateurId: req.utilisateur_id
        }
        )
        .then((utilisateurs) => 
        {
            res.send(utilisateurs);
        }
        )
        .catch((e) => 
        {
            res.send(e);
        }
        );
}
);

/**
 * POST : /utilisateurs
 * Objectif : Inscription
 */
app.post('/utilisateurs', (req, res) =>
{
    // L'utilisateur s'inscrit
    let body = req.body;
    let nouvelUtilisateur = new Utilisateur(body);

    nouvelUtilisateur
        .save()
        .then(() =>
        {
            return nouvelUtilisateur.creerSession();
        })
        .then((actualisationToken) =>
        {
            // La session a été créée : "actualisationToken" retourné
            // Maintenant on va générer un accès au token authentifié pour l'utilisateur
            return nouvelUtilisateur
                .genererAccesAuthToken()
                .then((accesToken) =>
                {
                    // Accès au token authentifié genéré et on retourne un objet contenant les tokens authentifiés 
                    return { accesToken, actualisationToken };
                }
                )
                .then((authToken) =>
                {
                    // On construit et on envoie la réponse à l'utilisateur avec ses tokens authentifiés dans l'en-tête et l'objet d'utilisateur dans le corps
                    res
                        .header('x-actualisation-token', authToken.actualisationToken)
                        .header('x-acces-token', authToken.accesToken)
                        .send(nouvelUtilisateur);
                }
                )
                .catch((e) => 
                {
                    res.status(400).send(e);
                }   
                );
        }
        );
}
);

/**
 * DELETE : /utilisateurs/:utilisateurId
 * Objectif : Supprimer un utilisateur
 */
app.delete('/utilisateurs/:id', (req, res) => 
{
    Utilisateur
        .findOneAndRemove(
        {
            _id: req.params.id
        }
        )
        .then((utilisateurSupprime) => 
        {
            res.send(utilisateurSupprime);
        }
        );
}
);

/**
 * POST : /utilisateurs/connexion
 * Objectif : Connexion
 */
app.post('/utilisateurs/connexion', (req, res) =>
{
    let email = req.body.email;
    let motdepasse = req.body.motdepasse;

    Utilisateur
        .trouverParIdentifiant(email, motdepasse)
        .then((utilisateur) => 
        {
            return utilisateur
                .creerSession()
                .then((actualisationToken) => 
                {
                    // La session a été créée : "actualisationToken" retourné
                    // Maintenant on va générer un accès au token authentifié pour l'utilisateur
                    return utilisateur
                        .genererAccesAuthToken()
                        .then((accesToken) => 
                        {
                            // Accès au token authentifié genéré et on retourne un objet contenant les tokens authentifiés 
                            return { accesToken, actualisationToken };
                        }
                        );
                }
                )
                .then((authToken) => 
                {
                    res
                        .header('x-actualisation-token', authToken.actualisationToken)
                        .header('x-acces-token', authToken.accesToken)
                        .send(utilisateur);
                }
                );
        }
        )
        .catch((e) => 
        {
            res.status(400).send(e);
        }
        );
}
);

/**
 * GET : /utilisateurs/moi/acces.token
 * Objectif : génère et retourne un token d'accès
 */
app.get('/utilisateurs/moi/acces_token', verifierSession, (req, res) => 
{
    // On sait que l'utilisateur est authentifié et on a l'ID de l'utilisateur et l'utilisateur d'objet disponible
    req.utilisateurObjet
        .genererAccesAuthToken()
        .then((accesToken) => 
        {
            res
                .header('x-acces-token', accesToken)
                .send({ accesToken });
        }
        )
        .catch((e) => 
        {
            res.status(400).send(e);
        }
        );
}
);


/* Méthodes d'assistance */
let supprimerTachesPourListe = (_listeId) =>
{
    Tache
        .deleteMany(
        {
            _listeId
        }
        // )
        // .then(() => 
        // {
        //     console.log(`Tâches pour ${_listeId} sont supprimées !`);
        // }
        );
}


app.listen(3000, () => 
{
    console.log("Le serveur est en écoute sur le port 3000.");
}
);