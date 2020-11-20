// Ce fichier manipulera la connexion à la base de données MongoDB

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose
    .connect('mongodb://localhost:27017/listeTaches', { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => 
    {
        console.log("Connecté avec succès à la base de données MongoDB !");
    }
    )
    .catch((e) => 
    {
        console.log("Erreur lors de la tentative de connexion à MongoDB !");
        console.log(e);
    }
    );

// Pour prévenir des avertissements dépréciés (du pilote natif MongoDB)
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

module.exports = 
{
    mongoose
}