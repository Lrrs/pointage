
var filteredData = [];
var jsonArray = null; // Initialisez jsonArray à null.
var jsonBruite =null;
var jsonClnFltr =null;
let PersonneBruite =[];
let Personne =[];


const colonnesAInclure = ['sJobNo','sName', 'Date', 'Time'];
let init_date ='2023-10-04';
let fin_date ='2023-10-05';
let titre ="Pointage"

// Heures au format "HH:mm"
let heure1 = "18:00";
let heure2 = "06:00";
let valNull =0;

let Joyce="2024-11-16";
let dateActuel =  new Date().toJSON().slice(0, 10);


let objetsActifs1 = []; // Déclaration du tableau pour stocker les objets filtrés
let objetsActifs2 = []; // Déclaration du tableau pour stocker les objets filtrés
let objetsActifs = []; // Déclaration du tableau pour stocker les objets filtrés
let objetsActifsMatin = []; // Déclaration du tableau pour stocker les objets filtrés


function heureEnMinutes(heure) {
    const [heures, minutes] = heure.split(":").map(Number);
    return heures * 60 + minutes;
}


function SuppQuot(tab){
    tab.forEach(function(element, index, array) {
        // Utilisez la fonction replace pour supprimer les guillemets simples
        array[index] = element.replace(/'/g, '');
    });
    return tab;
}

document.getElementById("importerCSV").addEventListener("click", function() {
const fichierCSV = document.getElementById("fichierCSV").files[0];
init_date = document.getElementById("dateIni").value;
heure1 = document.getElementById("heureIni").value;

// console.log("Date Initiale:", init_date);
// console.log("Heure Initiale:", heure1);


if (Joyce >= dateActuel) {
        if (fichierCSV) {
            const reader = new FileReader();reader.onload = function(e) {const contenuCSV = e.target.result; jsonBruite = convertirCSVenJSON(contenuCSV); }; reader.readAsText(fichierCSV);
        } else { alert("Veuillez sélectionner un fichier CSV."); }   
    } else { alert("votre periode d'essay sont expirée . Veuillez acheter cette produit");  }
});


function convertirCSVenJSON(contenuCSV) {
    const lignes = contenuCSV.trim().split('\n');
    const enTetes = lignes[0].split(',');

    const resultats = [];

    for (let i = 1; i < lignes.length; i++) {
            const ligne = lignes[i].split(',');
            const objetJSON = {};

            for (let j = 0; j < enTetes.length; j++) {
                const cle = enTetes[j].trim();
                let valeur = ligne[j].trim();
                // Supprimez les guillemets simples autour des valeurs
                valeur = valeur.replace(/^'(.*)'$/, '$1');
                // Remplacez les chaînes de caractères "undefined" par null
                if (valeur === 'undefined') { valeur = null;}
                objetJSON[cle] = valeur;
            }
            resultats.push(objetJSON);
    }
            
    jsonArray = filtrerJSON(resultats, colonnesAInclure);
    return resultats;
}

function filtrerJSON(jsonData, colonnesAInclure) {
    // Vérifie si le JSON est un tableau d'objets
    if (!Array.isArray(jsonData) || jsonData.length === 0) {return [];}
    // Filtrer les colonnes à inclure
    const resultatFiltre = jsonData.map((element) => {
    const nouvelElement = {};
    colonnesAInclure.forEach((colonne) => {if (element.hasOwnProperty(colonne)) {nouvelElement[colonne] = element[colonne]; }});
    return nouvelElement;
});



jsonClnFltr=resultatFiltre;
// Convertir init_date et fin_date en objets Date si ce ne sont pas déjà des objets Date
init_date = new Date(init_date);
fin_date = new Date(fin_date);


for (let i = 0; i < jsonClnFltr.length; i++) {
    const objet = jsonClnFltr[i];
    const dateObjet = new Date(objet.Date);
    const timeObjet = objet.Time; // Supposons que Time est une chaîne de caractères au format "HH:mm"

    if (dateObjet >= init_date && dateObjet <= init_date ){
        if( heureEnMinutes(timeObjet) >= heureEnMinutes(heure1)) {
            objetsActifs1.push(objet);
        }
    }
    if (dateObjet >= fin_date && dateObjet <= fin_date ){
        if( heureEnMinutes(timeObjet) <= heureEnMinutes(heure2)) {
            objetsActifs2.push(objet);
        }
    }
    if (dateObjet >= init_date && dateObjet <= init_date ){

        if( heureEnMinutes(timeObjet) >= heureEnMinutes(heure1)-60 &&( heureEnMinutes(timeObjet) <= heureEnMinutes(heure1)+120)) {
            objetsActifsMatin.push(objet);
        } }

        PersonneBruite.push(objet.sName)
        
}
//SuppQuot(objetsActifs1);


let cleanedPersonne = PersonneBruite.map(item => { return {sName: item.startsWith("'") ? item.slice(1) : item}; });
Personne =suppDoublon(cleanedPersonne)
console.log(Personne);

if(valNull ==1){objetsActifs = objetsActifs.concat(objetsActifs1, objetsActifs2);}
if(valNull ==0){objetsActifs =objetsActifsMatin;}
// console.log(objetsActifs)
// Le tableau "filteredData" contient maintenant les éléments sans sName égal à NULL
var filteredDataF=suppLigne(objetsActifs);
return affdata(filteredDataF);
}

function suppLigne(data){
    let dataP=data.forEach(element =>{     
        return element.sName;
    })
    var Data=data;
    // Parcourir chaque élément du JSON d'origine
    for (var i = 0; i < Data.length; i++) {
        // Vérifier si la propriété sName n'est pas égale à NULL
        if (Data[i].sName !== "'NULL") {
            // Si elle n'est pas égale à NULL, ajouter l'élément au nouveau tableau
            filteredData.push(Data[i]);
        }
    }
    // console.log(filteredData);
    return filteredData;
}

function dataRecu() {
    jsonBruite = convertirCSVenJSON(contenuCSV); // Mettez le résultat dans jsonArray
}


function affdata(data2) {

        viderTableau();


    const ddd=document.querySelector("#popUp")
    ddd.style.display = 'none';

            let perPresent=0;
            let perRetard=0;
            let perAbsent=0
            let newData=[];
            let dataFiltered =data2
            let cleanedData = dataFiltered.map(item => { return { sJobNo: item.sJobNo.startsWith("'") ? item.sJobNo.slice(1) : item.sJobNo,sName: item.sName.startsWith("'") ? item.sName.slice(1) : item.sName,Date: item.Date,Time: item.Time }; });

            Personne.forEach(E1=>{         
                const E2 = cleanedData.map(element => element.sName);
                const existe = E2.includes(E1);
                console.log(  cleanedData);
                    if (existe ==false && E1!='NULL'){ 
                        newData.push({'id':E1.id,'nom':E1,'pdp':E1.nom,'poste':E1.poste,'Date': '--/--/----','Time': '--:--:--','status':'Absent'})  
                        perAbsent= perAbsent+1
                    }
                    else if(existe ==true && E1!='NULL'){
                        let achille = cleanedData.find(er=>{ return er.sName === E1; });
                        let st =''; st=(compareT(achille.Time,heure1)) ; newData.push({'id':achille.sJobNo ,'nom':achille.sName,'pdp':E1.nom,'poste':E1.poste,"Date": achille.Date,"Time":achille.Time,'status':st});
                        perPresent =perPresent +1
                    }
            })


            // ************************************************************************

        // Obtenez une référence à la table et au tbody
        const tableau = document.getElementById("tabmodel");
        const tbody = tableau.querySelector("tbody");

        newData.forEach(function (i) {           
            const ligne = document.createElement("tr"); // Créez une nouvelle ligne
            // Créez et ajoutez la cellule pour la personne
            const personneCellule = document.createElement("td");
            personneCellule.className = "people";
            const img = document.createElement("img");
            let imgs = 'images/'+i.nom +'.jpg';
            img.src = imgs|| 'images/default.jpg' // Utilisez une image par défaut si aucune image n'est fourni

            

            console.log('images'+imgs);
            img.alt = "";
            const divPeopleDe = document.createElement("div");
            divPeopleDe.className = "people-de";
            const h5Name = document.createElement("h5");
            h5Name.textContent = i.nom;
            const pEmail = document.createElement("p");
            pEmail.textContent = '';
            divPeopleDe.appendChild(h5Name);
            divPeopleDe.appendChild(pEmail);
            personneCellule.appendChild(img);
            personneCellule.appendChild(divPeopleDe);
            ligne.appendChild(personneCellule);

            // // Créez et ajoutez la cellule pour la description
            // const descriptionCellule = document.createElement("td");
            // descriptionCellule.className = "people-des";
            // const h5Title = document.createElement("h5");
            // h5Title.textContent = i.poste;
            // const pDesc = document.createElement("p");
            // pDesc.textContent = '';
            // descriptionCellule.appendChild(h5Title);
            // descriptionCellule.appendChild(pDesc);
            // ligne.appendChild(descriptionCellule);

            // Créez et ajoutez la cellule pour le statut

            // const statusCellule = document.createElement("td");
            // statusCellule.className = "active";
            // const pStatus = document.createElement("p");
            // pStatus.textContent = i.status;
            // statusCellule.appendChild(pStatus);
            // ligne.appendChild(statusCellule);




            // Créez et ajoutez la cellule pour le rôle
            const roleCellule = document.createElement("td");
            roleCellule.className = "role";
            const pRole = document.createElement("p");
            pRole.textContent = i.Date;
            roleCellule.appendChild(pRole);
            ligne.appendChild(roleCellule);

            // Créez et ajoutez la cellule pour l'édition
            const editCellule = document.createElement("td");
            editCellule.className = "edit";
            const aEdit = document.createElement("a");
            aEdit.href = "#";
            aEdit.textContent = i.Time;
            editCellule.appendChild(aEdit);
            ligne.appendChild(editCellule);

            if(i.status=='Retard'){
                ligne.style.backgroundColor='#ffbf0050';
                perRetard =perRetard+1;
            };
            
            if(i.status=='Absent'){
                ligne.style.backgroundColor='#e45d9a5b';
            }


            // Ajoutez la ligne au tbody
            tbody.appendChild(ligne);

        });



        const perEff = document.querySelector('#perEff');
        perEff.textContent = Personne.length -1;

        const perPre = document.querySelector('#perPre');
        perPre.textContent = perPresent;

        const perRet =document.querySelector('#perRet')
        perRet.textContent = perRetard;

        const perAbs =document.querySelector('#perAbs')
        perAbs.textContent = perAbsent;
                    if(i.status=='Retard'){
                personneCellule.style.backgroundColor='#ffbf006b';
                perRetard =perRetard+1;

            };

        
}

let btnStat=0

// fonctiond impression
function menuL(){ 

    if(btnStat==0){
        menu.style.left="0px";
        menu.style.top="0px"

        btnStat=1;

    }else{
        menu.style.left="-400px";
        menu.style.top="0px";

        btnStat=0;
    }

}
const a=document.querySelector(".val-box");
const b=document.querySelector("#nav2-btn")
const c=document.querySelector("#dateIni")
const d=document.querySelector("#heureIni")
 
 function imprimerFormulaire() {
    
     b.style.display='none'; menu.style.display='none'; none.style.display='none'; window.print();menu.style.display='block'; none.style.display='block'; b.style.display='block';
 }
 

// fonction pour supprimer les doublons
function suppDoublon(source){
    let Per=[];
    let nomP=source.map(element=>{ return element.sName });console.log(nomP);
    nomP.forEach(element => {let a=Per.includes(element); if(a===false){ Per.push(element) } });
    return Per;
}

// fonction pour comparée le temps
function compareT(time1, time2) {
    // Ajouter les secondes manquantes si nécessaire
    if (time1.split(':').length === 2) {    time1 += ':59'; console.log('apres la concatenation'+time1); }
    // Créer des objets Date en utilisant une date fictive
    const date1 = new Date(`1970-01-01T${time1}Z`);const date2 = new Date(`1970-01-01T${time2}Z`);
    // Comparer les deux dates
    if (date1 > date2) { return 'Retard'; } else if (date1 < date2) {  return 'Normal';}
}



const dd=document.querySelector("#popUp")


function Tele(){
    dd.style.display = 'flex';

};
function Cancel(){
    dd.style.display = 'none';

};

function viderTableau() {
    const tableau = document.getElementById("tabmodel").getElementsByTagName("tbody")[0];
    tableau.innerHTML = ""; // Vide le contenu du <tbody>
}

