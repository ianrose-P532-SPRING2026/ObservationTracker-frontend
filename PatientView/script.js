import { host } from "../host.js"

let sender = 1; //TheGuy

const login = document.getElementById("login");

login.addEventListener("change", function(event) {
    sender = event.target.value;
});

async function getAllStaff() {
    const response = await fetch(host + "/staff");
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const staff = await response.json();
    return staff;
}

async function fillLoginOptions() {
    const staff = await getAllStaff();
    login.innerHTML = `<option value=-1>Login...</option>`;
    console.log(staff);
    staff.forEach(staffMember => {
        const option = document.createElement("option"); 
        option.value = staffMember.id; 
        option.textContent = staffMember.name;
        login.appendChild(option);
    });
}
fillLoginOptions();


const newPatientWindow = document.getElementById("newPatientWindow");
const newPatientButton = document.getElementById("newPatientButton");
const submitButton = document.getElementById("submitButton");

const patientlist = document.getElementById("patientlist");

newPatientButton.addEventListener('click', function() {
    newPatientWindow.showModal();
});

const closeButton = document.getElementById("closeButton");
closeButton.addEventListener('click', function() {
    newPatientWindow.close();
});

const form = document.getElementById("patientForm");
form.onsubmit = async function() {
    const dob = new Date(form.dob.value);
    const dobInstant = dob.toISOString();
    const result = await submitNewPatient(sender, -1, form.name.value, dobInstant, form.notes.value);
    alert(result);
    getAllPatients();
};


async function submitNewPatient(sender, patientId, name, dob, notes) {
    const PatientRequest = {sender: sender, patientId: patientId, name: name, dob: dob, notes: notes};
    console.log("You entered: " + JSON.stringify(PatientRequest));

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(PatientRequest)
    };

    const response = await fetch(host + "/patients", request);
    const result = await response.text();
    return result;
}


async function getAllPatients() {
    const response = await fetch(host + "/patients");
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const patients = await response.json();

    fillList(patientlist, patients)
}

function fillList(list, patients) {
    //setting to default
    if(patients.length == 0){
        list.innerHTML = `<li style="text-align: center; list-style-type: none;">(none)</li>`;
        return;
    }
    list.innerHTML = ""; //clear all before populating

    //populating
    patients.forEach(patient => {
        const li = document.createElement('li');
        li.classList.add("patient");
        buildPatientListEntry(li, patient);
        
        const detailsButton = document.createElement('button');
        detailsButton.addEventListener('click', function() {
            openPatientDetails(patient.patientId);
        });
        detailsButton.innerHTML = "Details";
        li.appendChild(detailsButton);

        list.appendChild(li);                       
    });
}


function buildPatientListEntry(li, patient){
    const patientText = document.createElement('span');
    patientText.innerHTML=`${patient.patientId}: ${patient.fullName}`;
    li.appendChild(patientText);
}


function openPatientDetails(id) {
    const win = window.open("../PatientDetailView/page.html?id="+id, "_blank");
} 

getAllPatients();