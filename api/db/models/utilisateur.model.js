const mongoose = require("mongoose");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

// Secret JWT
const secretjwt = "51778657246321226641fsdklafjasdkljfsklfjd7148924065";

const UtilisateurSchema = new mongoose.Schema(
{
    nom:
    {
        type: String,
        minlength: 2,
        trim: true
    },
    email:
    {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true
    },
    motdepasse:
    {
        type: String,
        required: true,
        minlength: 8
    },
    sessions: [
    {
        token: 
        {
            type: String,
            required: true
        },
        expireA:
        {
            type: Number,
            required: true
        }
    }
    ]
}
);


// Instances de méthodes

UtilisateurSchema.methods.toJSON = function()
{
    const utilisateur = this;
    const utilisateurObjet = utilisateur.toObject();

    // Retourne le document sauf le mot de passe et les sessions (ceux-ci ne devrait pas être disponibles)
    return _.omit(utilisateurObjet, ['motdepasse', 'sessions']);
}

UtilisateurSchema.methods.genererAccesAuthToken = function()
{
    const utilisateur = this;
    return new Promise((resolve, reject) =>
    {
        // Créer le token web JSON et retourner ceci
        jwt.sign({ _id: utilisateur._id.toHexString() }, secretjwt, { expiresIn: "15m" }, (err, token) => 
        {
            if(!err)
            {
                resolve(token);
            }
            else
            {
                reject();
            }
        }
        );
    }
    );
}

UtilisateurSchema.methods.genererActualisationAuthToken = function()
{
    // Cette méthode génère une chaîne hexadécimale de 64 bits : elle ne sauvegarde pas dans la base de données et "sauvegardeSessiondansBaseDonnees()" fait cela
    return new Promise((resolve, reject) => 
    {
        crypto.randomBytes(64, (err, buf) => 
        {
            if(!err)
            {
                let token = buf.toString('hex');

                return resolve(token);
            }
        }
        );
    }
    );
}

UtilisateurSchema.methods.creerSession = function()
{
    let utilisateur = this;
    
    return utilisateur
        .genererActualisationAuthToken()
        .then((actualisationToken) => 
        {
            return sauvegardeSessiondansBaseDonnees(utilisateur, actualisationToken);
        }
        )
        .then((actualisationToken) => 
        {
            // Sauvegardé dans la base de données
            // Maintenant retourner le token actualisé
            return actualisationToken;
        }
        )
        .catch((e) =>
        {
            return Promise.reject('Échec de sauvegarde de la session dans la base de données.\n' + e);
        }
        );
}


// Méthodes de modèle (méthodes statiques)

UtilisateurSchema.statics.obtenirJWTSecret = () =>
{
    return secretjwt;
}

UtilisateurSchema.statics.trouverParIdEtToken = function(_id, token)
{
    // Trouve l'utilisateur par l'ID et le token
    // Utilisé pour l'authentification "middleware" (verifierSession)

    const Utilisateur = this;

    return Utilisateur.findOne(
    {
        _id,
        'sessions.token': token
    }
    );
}

UtilisateurSchema.statics.trouverParIdentifiant = function(email, motdepasse)
{
    let Utilisateur = this;

    return Utilisateur
        .findOne({ email })
        .then((utilisateur) => 
        {
            if(!utilisateur)
            {
                return Promise.reject();
            }

            return new Promise((resolve, reject) => 
            {
                bcrypt.compare(motdepasse, utilisateur.motdepasse, 
                (err, res) =>
                {
                    if(res)
                    {
                        resolve(utilisateur);
                    }
                    else
                    {
                        reject();
                    }
                }
                );
            }
            );
        }
        );
}

UtilisateurSchema.statics.aActualisationTokenExpire = (expireA) =>
{
    let secondesDepuisEpoch = Date.now() / 1000;
    if(expireA > secondesDepuisEpoch)
    {
        // N'a pas expiré
        return false;
    }
    else
    {
        return true;
    }
};


// Middleware
// Avant qu'un document utilisateur est sauvegardé, ce code exécute
UtilisateurSchema.pre('save', function(next)
{
    let utilisateur = this;
    let coutFacteur = 10;

    if(utilisateur.isModified('motdepasse'))
    {
        // Si le champ du mot de passe a été modifié alors ce code est exécuté  
        // Génère un mot de passe "salé" et "haché"
        bcrypt.genSalt(coutFacteur, (err, salt) => 
        {
            bcrypt.hash(utilisateur.motdepasse, salt, (err, hash) => 
            {
                utilisateur.motdepasse = hash;
                next();
            }
            );
        }
        );
    }
    else
    {
        next();
    }
}
);


// Méthodes d'assistance
 
let sauvegardeSessiondansBaseDonnees = (utilisateur, actualisationToken) =>
{
    // Sauvegarde de la session dans la base de données
    return new Promise((resolve, reject) => 
    {
        let expireA = genererTokenActualiseTempsExpire();

        utilisateur.sessions.push({ 'token': actualisationToken, expireA });

        utilisateur
            .save()
            .then(() => 
            {
                return resolve(actualisationToken);
            })
            .catch((e) =>
            {
                reject(e);
            }
            );
    }
    );
}

let genererTokenActualiseTempsExpire = () =>
{
    let joursAvantExpiration = "10";
    let secondesAvantExpiration = ((joursAvantExpiration * 24) * 60) * 60;
    return ((Date.now() / 1000) + secondesAvantExpiration);
}

const Utilisateur = mongoose.model('Utilisateur', UtilisateurSchema);

module.exports = { Utilisateur };