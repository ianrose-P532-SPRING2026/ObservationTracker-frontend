import { host } from "../host.js"

let sender = 1; //TheGuy

const params = new URLSearchParams(window.location.search);
let patient = await getPatient(params.get("id"));

const form = document.getElementById("patientForm");


populateBio();

const updatePatientWindow = document.getElementById("updatePatientWindow");
const updatePatient = document.getElementById("updatePatient");
updatePatient.addEventListener('click', function() {
    updatePatientWindow.showModal();
    form.name.value = patient.fullName;
    form.dob.value = new Date(patient.dateOfBirth).toISOString().split('T')[0];
    form.notes.value = patient.note;
});

const closeButton = document.getElementById("closeButton");
closeButton.addEventListener('click', function() {
    updatePatientWindow.close();
});

form.onsubmit = async function() {
    const dob = new Date(form.dob.value);
    const dobInstant = dob.toISOString();
    const result = await submitUpdatePatient(sender, patient.id, form.name.value, dobInstant, form.notes.value);
    alert(result);
    await populateBio();
};


async function submitDeletePatient(sender, patientId, name, dob, notes) {
    const PatientRequest = {sender: sender, patientId: patientId, name: name, dob: dob, notes: notes};
    console.log("You entered: " + JSON.stringify(PatientRequest));

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(PatientRequest)
    };

    const response = await fetch(host + "/patients/" + patientId + "/delete", request);
    const result = await response.text();
    return result;
}

async function submitUpdatePatient(sender, patientId, name, dob, notes) {
    const PatientRequest = {sender: sender, patientId: patientId, name: name, dob: dob, notes: notes};
    console.log("You entered: " + JSON.stringify(PatientRequest));

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(PatientRequest)
    };

    const response = await fetch(host + "/patients/" + patientId + "/update", request);
    const result = await response.text();
    return result;
}

async function getPatient(id) {
    const response = await fetch(host + "/patients/" + id);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const patient = await response.json();

    return patient;
}

async function populateBio() {
    patient = await getPatient(params.get("id"));

    const title = document.getElementById("title");
    title.innerHTML = `ObsTrac-${patient.fullName}`
    const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    const dob = new Date(patient.dateOfBirth);
    
    const bio = document.getElementById("bio");
    bio.innerHTML = `
ID: ${patient.id}
Name: ${patient.fullName}
DOB: ${formatter.format(dob)}
Notes:
${patient.note}`

    if (patient.relatedObservations.length == 0) {
        const deletePatient = document.getElementById("deletePatient");
        deletePatient.addEventListener('click', async function() {
            if(confirm("Are you sure you want to delete this patient?")){
                const result = await submitDeletePatient(sender, patient.id, patient.fullName, patient.dateOfBirth, patient.note);
                alert(result);
                window.close();
            }
        });
    } else{
        const deletePatient = document.getElementById("deletePatient");
        deletePatient.innerHTML = "Archive";
        deletePatient.addEventListener('click', async function() {
            if(confirm("Are you sure you want to archive this patient?")){
                const result = await submitArchivePatient(sender, patient.id, patient.fullName, patient.dateOfBirth, patient.note);
                alert(result);
                window.close();
            }
        });
    }
}


async function submitArchivePatient(sender, patientId, name, dob, notes) {
    const PatientRequest = {sender: sender, patientId: patientId, name: name, dob: dob, notes: notes};
    console.log("You entered: " + JSON.stringify(PatientRequest));

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(PatientRequest)
    };

    const response = await fetch(host + "/patients/" + patientId + "/archive", request);
    const result = await response.text();
    return result;
}

const observationlist = document.getElementById("observationlist");

async function getPatientObservations() {
    const response = await fetch(host + "/patients/"+ patient.id + "/observations");
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const observations = await response.json();

    fillList(observationlist, observations)
}

async function rejectObservation(observation) {
    console.log(observation);
}

function fillList(list, observations) {
    //setting to default
    if(observations.length == 0){
        list.innerHTML = `<li style="text-align: center; list-style-type: none;">(none)</li>`;
        return;
    }
    list.innerHTML = ""; //clear all before populating

    //populating
    observations.forEach(observation => {
        const li = document.createElement('li');
        li.classList.add("observation");
        buildObservation(li, observation);
        
        const rejectButton = document.createElement('button');
        rejectButton.addEventListener('click', async function() {
            rejectObservation(observation);
        });
        rejectButton.innerHTML = "Reject";
        li.appendChild(rejectButton);

        list.appendChild(li);                       
    });
}


function buildObservation(li, observation){
    const patientText = document.createElement('span');
    patientText.innerHTML=`${observation}`;
    li.appendChild(patientText);
}


getPatientObservations();


