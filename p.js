document.getElementById("heureIni").value = "18:30";
document.getElementById("heureFin").value = "06:00";

const dateDebutInput = document.getElementById("dateIni");
const dateFinInput = document.getElementById("dateFin");

dateDebutInput.addEventListener('change', () => {
    // Convertir la valeur de la date de début en objet Date
    const dateDebut = new Date(dateDebutInput.value);
    
    // Ajouter un jour à la date de début
    dateDebut.setDate(dateDebut.getDate() + 1);
    
    // Mettre à jour la valeur de la date de fin
    const mois = ('0' + (dateDebut.getMonth() + 1)).slice(-2);
    const jour = ('0' + dateDebut.getDate()).slice(-2);
    const annee = dateDebut.getFullYear();
    
    dateFinInput.value = `${annee}-${mois}-${jour}`;
});
