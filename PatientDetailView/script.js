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
    form.dob.value = new Date(patient.dob).toISOString().split('T')[0];
    form.notes.value = patient.notes;
});

const closeButton = document.getElementById("closeButton");
closeButton.addEventListener('click', function() {
    updatePatientWindow.close();
});

form.onsubmit = async function() {
    const dob = new Date(form.dob.value);
    const dobInstant = dob.toISOString();
    const result = await submitUpdatePatient(sender, patient.patientId, form.name.value, dobInstant, form.notes.value);
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
    const dob = new Date(patient.dob);
    
    const bio = document.getElementById("bio");
    bio.innerHTML = `
ID: ${patient.patientId}
Name: ${patient.fullName}
DOB: ${formatter.format(dob)}
Notes:
${patient.notes}`

    if (patient.relatedObservations.length == 0) {
        const deletePatient = document.getElementById("deletePatient");
        deletePatient.addEventListener('click', async function() {
            if(confirm("Are you sure you want to delete this patient?")){
                const result = await submitDeletePatient(sender, patient.patientId, patient.fullName, patient.dob, patient.notes);
                alert(result);
                window.close();
            }
        });
    } else{
        const deletePatient = document.getElementById("deletePatient");
        deletePatient.innerHTML = "Archive";
        deletePatient.addEventListener('click', async function() {
            if(confirm("Are you sure you want to archive this patient?")){
                const result = await submitArchivePatient(sender, patient.patientId, patient.fullName, patient.dob, patient.notes);
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
    const response = await fetch(host + "/patients/"+ patient.patientId + "/observations");
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
    const patientText = document.createElement('pre');
    if (observation.quantOrQual == "QUANTITATIVE"){
        patientText.innerHTML=`Id: ${observation.observationId}.
Protocol: ${observation.protocol.name}
Type: ${observation.phenomenonType.name}
Time: ${observation.recordingTime}
endTime: ${observation.applicabilityTime}
Status: ${observation.status}
RejectorId: ${observation.rejectorId}

QUANT:
Unit: ${observation.unit.symbol}
Amount: ${observation.amount}`

    } else {
        patientText.innerHTML=`Id: ${observation.observationId}.
Protocol: ${observation.protocol.name}
Type: ${observation.phenomenonType.name}
Time: ${observation.recordingTime}
endTime: ${observation.applicabilityTime}
Status: ${observation.status}
RejectorId: ${observation.rejectorId}

QUAL:
Phenomenon: ${observation.phenomenon.name}
Presence: ${observation.presence}`;
    }
    
li.appendChild(patientText);
}

getPatientObservations();



async function getAllTypes() {
    const response = await fetch(host + "/catalogue/phenomenon-types");
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const types = await response.json();

    return types;
}

async function getAllProtocols() {
    const response = await fetch(host + "/catalogue/protocols");
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const protocols = await response.json();

    return protocols;
}



const typeDropdown = document.getElementById("typeDropdown");

async function fillTypeOptions() {
    const types = await getAllTypes();
    typeDropdown.innerHTML = ``;

    types.forEach(type => {
        if(type.category == "QUANTITATIVE"){
            const option = document.createElement("option"); 
            option.value = JSON.stringify(type); ; 
            option.textContent = type.name;
            typeDropdown.appendChild(option);
        }
    });
}

typeDropdown.addEventListener("change", function(event) {
    const selectedType = JSON.parse(event.target.value); 
    fillUnitOptions(selectedType.allowedUnits)
});

const unitDropdown = document.getElementById("unitDropdown");

async function fillUnitOptions(units) {
    unitDropdown.innerHTML = ``;

    units.forEach(unit => {
        const option = document.createElement("option"); 
        option.value = unit.id; 
        option.textContent = unit.symbol;
        unitDropdown.appendChild(option);
    });
}

const protocolDropdownMEAS = document.getElementById("protocolDropdownMEAS");
async function fillProtocolOptionsMEAS() {
    const protocols = await getAllProtocols();
    protocolDropdownMEAS.innerHTML = ``;

    protocols.forEach(protocol => {
        const option = document.createElement("option"); 
        option.value = protocol.id; 
        option.textContent = protocol.name;
        protocolDropdownMEAS.appendChild(option);
    });
}


const recordMeasurementWindow = document.getElementById("recordMeasurementWindow");

const recordMeasurement = document.getElementById("recordMeasurement");
recordMeasurement.addEventListener('click', function() {
    fillTypeOptions();
    fillProtocolOptionsMEAS();
    recordMeasurementWindow.showModal();
});

const closeButtonMEAS = document.getElementById("closeButtonMEAS");

closeButtonMEAS.addEventListener('click', function() {
        recordMeasurementWindow.close();
});

const measurementForm = document.getElementById("measurementForm");
measurementForm.onsubmit = async function() {
    let endTimeInstant;
    if (measurementForm.endTime.value === ""){
        endTimeInstant = null;
    } else {
        const endTime = new Date(measurementForm.endTime.value);
        endTimeInstant = endTime.toISOString();
    }
    
    const result = await submitCreateMeasurement(sender, patient.patientId, protocolDropdownMEAS.value, endTimeInstant, JSON.parse(typeDropdown.value).id, unitDropdown.value, measurementForm.amount.value);
    alert(result);
};



async function submitCreateMeasurement(sender, patientId, protocolId, applicabilityTimeEnd, typeId, unitId, amount) {
    const MeasurementRequest = {sender: sender, patientId: patientId, protocolId: protocolId, recordingTime: null, applicabilityTimeEnd: applicabilityTimeEnd, typeId: typeId, unitId: unitId, amount: amount};
    console.log("You entered: " + JSON.stringify(MeasurementRequest));

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(MeasurementRequest)
    };

    const response = await fetch(host + "/observations/measurement", request);
    const result = await response.text();
    return result;
}


















const protocolDropdownCATE = document.getElementById("protocolDropdownCATE");

const recordObservation = document.getElementById("recordObservation");
recordObservation.addEventListener('click', function() {
    fillPhenomOptions();
    fillProtocolOptionsCATE();
    recordObservationWindow.showModal();
});


const phenomDropdown = document.getElementById("phenomDropdown");

async function getAllPhenomena() {
    const response = await fetch(host + "/catalogue/phenomena");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const phenomena = await response.json();
    
        return phenomena;
}

async function fillPhenomOptions() {
    const types = await getAllPhenomena();
    phenomDropdown.innerHTML = ``;

    types.forEach(phenomenon => {
        const option = document.createElement("option"); 
        option.value = phenomenon.id; 
        option.textContent = phenomenon.name;
        phenomDropdown.appendChild(option);
    });
}

async function fillProtocolOptionsCATE() {
    const protocols = await getAllProtocols();
    protocolDropdownCATE.innerHTML = ``;

    protocols.forEach(protocol => {
        const option = document.createElement("option"); 
        option.value = protocol.id; 
        option.textContent = protocol.name;
        protocolDropdownCATE.appendChild(option);
    });
}

const recordObservationWindow = document.getElementById("recordObservationWindow");

const closeButtonCATE = document.getElementById("closeButtonCATE");
closeButtonMEAS.addEventListener('click', function() {
        recordObservationWindow.close();
});


const categoricalForm = document.getElementById("categoricalForm");
categoricalForm.onsubmit = async function() {
    let endTimeInstant;
    if (measurementForm.endTime.value === ""){
        endTimeInstant = null;
    } else {
        const endTime = new Date(measurementForm.endTime.value);
        endTimeInstant = endTime.toISOString();
    }
    
    const result = await submitCreateCategorical(sender, patient.patientId, protocolDropdownCATE.value, endTimeInstant, phenomDropdown.value, categoricalForm.presenceDropdown.value);
    alert(result);
};




async function submitCreateCategorical(sender, patientId, protocolId, applicabilityTimeEnd, phenomenonId, presence) {
    const CategoricalRequest = {sender: sender, patientId: patientId, protocolId: protocolId, recordingTime: null, applicabilityTimeEnd: applicabilityTimeEnd, phenomenonId: phenomenonId, presence: presence};
    console.log("You entered: " + JSON.stringify(CategoricalRequest));

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(CategoricalRequest)
    };

    const response = await fetch(host + "/observations/categorical", request);
    const result = await response.text();
    return result;
}



const EVAL = document.getElementById("EVAL");
EVAL.addEventListener('click', async function() {
        await evaluateThem();
});



async function evaluateThem() {
    const response = await fetch(host + "/patients/" + patient.patientId + "/evaluate");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const phenomena = await response.json();
    
        let out = `Evaluation results:\n`;
        
        phenomena.forEach(phenom => {
            out = out + `${phenom.typeName}, ${phenom.name}\n`;
        });
        alert(out);
}