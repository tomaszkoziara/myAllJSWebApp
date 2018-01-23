const messages = {
    "old_password_mismatch": "La vecchia password non corrisponde.",
    "password_updated": "Password aggiornata.",
    "user_inserted": "Utente inserito con successo.",
    "user_min_properties_not_set": "Non sono stati settati i parametri obbligatori per inserire l'utente.",

    "lot_inserted": "Distinta inserita con successo.",
    "version_inserted": "Versione inserita con successo."
};

export default function getMessage(key) {
    var message = messages[key];
    if (message === undefined) {
        message = "Error";
    }
    return message;
}