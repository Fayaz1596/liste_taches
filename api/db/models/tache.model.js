const mongoose = require("mongoose");

const TacheSchema = new mongoose.Schema(
{
    titre:
    {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    _listeId:
    {
        type: mongoose.Types.ObjectId,
        required: true
    },
    termine:
    {
        type: Boolean,
        default: false
    } 
}
);

const Tache = mongoose.model('Tache', TacheSchema);

module.exports = { Tache };