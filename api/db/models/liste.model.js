const mongoose = require("mongoose");

const ListeSchema = new mongoose.Schema(
{
    titre:
    {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    sousTitre:
    {
        type: String,
        required: false,
        trim: true
    },
    // Avec authentification
    _utilisateurId:
    {
        type: mongoose.Types.ObjectId,
        required: true
    }
}
);

const Liste = mongoose.model('Liste', ListeSchema);

module.exports = { Liste };