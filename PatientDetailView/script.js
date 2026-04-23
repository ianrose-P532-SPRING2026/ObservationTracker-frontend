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


//--------------------------------------------------V-LIST POPULATING-V-------------------------------------------------

function fillGenericList(list, content, builder) {
    //setting to default
    if(content.length == 0){
        list.innerHTML = `<li style="text-align: center; list-style-type: none;">(none)</li>`;
        return;
    }
    list.innerHTML = ""; //clear all before populating

    //populating
    content.forEach(item => {
        const li = document.createElement('li');
        builder(li, item);
        list.appendChild(li);                       
    });
}

//--------------------------------------------------^-LIST POPULATING-^-------------------------------------------------













//-------------------------------------------------V-BACKEND REQUESTS-V-------------------------------------------------

async function getPatient(id) {
    const response = await fetch(host + "/patients/" + id);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const patient = await response.json();

    return patient;
}



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



async function getPatientObservations(patient) {
    const response = await fetch(host + "/patients/"+ patient.patientId + "/observations");
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const observations = await response.json();
    return observations;
}


async function submitObservationRejection(observationId, rejectorIds, reason) {
    const RejectionRequest = {sender: sender, observationId: observationId, rejectorIds: rejectorIds, reason: reason};
    console.log("You entered: " + JSON.stringify(RejectionRequest));

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(RejectionRequest)
    };

    const response = await fetch(host + "/observations/rejection", request);
    const result = await response.text();
    return result;
}



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



async function getAllPhenomena() {
    const response = await fetch(host + "/catalogue/phenomena");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const phenomena = await response.json();
    
        return phenomena;
}



async function submitCreateCategorical(sender, patientId, protocolId, applicabilityTimeEnd, phenomenonId, presence, evidenceIds, details) {
    const CategoricalRequest = {sender: sender, patientId: patientId, protocolId: protocolId, recordingTime: null, applicabilityTimeEnd: applicabilityTimeEnd, phenomenonId: phenomenonId, presence: presence, evidenceIds: evidenceIds, details: details};
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

//-------------------------------------------------^-BACKEND REQUESTS-^-------------------------------------------------


















//---------------------------------------------------V-PATIENT INFO-V---------------------------------------------------

//-------------------GETTING FROM URL-------------------
const params = new URLSearchParams(window.location.search);
let globalPatient = await getPatient(params.get("id"));



//-------------------FILLING IN PAGE-------------------
async function populateBio() {
    globalPatient = await getPatient(params.get("id"));
    fillOutBio(globalPatient);
}

async function fillOutBio(patient) {
    //set tab name
    const title = document.getElementById("title");
    title.innerHTML = `ObsTrac-${patient.fullName}`

    //Patient name
    const patientNameText = document.getElementById("patientNameText");
    patientNameText.innerHTML = `Name: ${patient.fullName}`;

    //Patient DOB
    const dobText = document.getElementById("dobText");
    const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    const dob = new Date(patient.dob);
    const formattedDOB = formatter.format(dob);
    dobText.innerHTML = `Date of birth: ${formattedDOB}`;

    //Patient notes
    const patientNotesText = document.getElementById("patientNotesText");
    patientNotesText.value = patient.notes;
    
    //setting delete/archive button
    const delOrArcButton = document.getElementById("delOrArcButton");
    if (patient.relatedObservations.length == 0) {
        delOrArcButton.innerHTML = "DELETE";
        delOrArcButton.addEventListener('click', patientDeleteButtonFunc);
    } 
    else {
        delOrArcButton.innerHTML = "ARCHIVE";
        delOrArcButton.addEventListener('click', patientArchiveButtonFunc);
    }
}


//-------------------DEL/ARC BUTTON FUNCTIONS-------------------
async function patientDeleteButtonFunc() {
    if(confirm("Are you sure you want to delete this patient?")){
        const result = await submitDeletePatient(sender, globalPatient.patientId, globalPatient.fullName, globalPatient.dob, globalPatient.notes);
        alert(result);
        window.close();
    }
}
async function patientArchiveButtonFunc() {
    if(confirm("Are you sure you want to archive this patient?")){
        const result = await submitArchivePatient(sender, globalPatient.patientId, globalPatient.fullName, globalPatient.dob, globalPatient.notes);
        alert(result);
        window.close();
    }
}

//---------------------------------------------------^-PATIENT INFO-^---------------------------------------------------














//--------------------------------------------------V-UPDATE DIALOG-V---------------------------------------------------

const updatePatientWindow = document.getElementById("updatePatientWindow");
const updatePatientForm = document.getElementById("updatePatientForm");

//-------------------CLOSING-------------------
const closeUpdateButton = document.getElementById("closeUpdateButton");
closeUpdateButton.addEventListener('click', function() {
    updatePatientWindow.close();
});



//-------------------OPENING-------------------
const openPatientUpdateButton = document.getElementById("openPatientUpdateButton");
openPatientUpdateButton.addEventListener('click', patientUpdateButtonFunc);

async function patientUpdateButtonFunc() {
    updatePatientWindow.showModal();
    updatePatientForm.name.value = globalPatient.fullName;
    updatePatientForm.dob.value = new Date(globalPatient.dob).toISOString().split('T')[0];
    updatePatientForm.notes.value = globalPatient.notes;
}



//-------------------SUBMISSION-------------------
updatePatientForm.onsubmit = async function() {
    const dob = new Date(updatePatientForm.dob.value);
    const dobInstant = dob.toISOString();
    const result = await submitUpdatePatient(sender, globalPatient.patientId, updatePatientForm.name.value, dobInstant, updatePatientForm.notes.value);
    alert(result);
    await populateBio();
};

//--------------------------------------------------^-UPDATE DIALOG-^---------------------------------------------------

















//---------------------------------------------V-PATIENT OBSERVATION LIST-V---------------------------------------------

const observationlist = document.getElementById("observationlist");

async function populateObservationList() {
    const observations = await getPatientObservations(globalPatient);
    fillGenericList(observationlist, observations, buildObservationEntry);
}

//building each entry
function buildObservationEntry(li, observation){
    console.log(observation);
    li.classList.add("observation");
    
    li.appendChild(obsHeader(observation))
    li.appendChild(obsContent(observation));
    li.appendChild(obsProtocol(observation));
    li.appendChild(obsStatus(observation));
    li.appendChild(obsTime(observation));
    li.appendChild(obsButtons(observation));
}

function obsHeader(observation) {
    const div = document.createElement("div");
    div.classList.add("obs-header");
    
    const idSpan = document.createElement("span");
    idSpan.innerHTML = `ID: ${observation.observationId}`;

    const typeSpan = document.createElement("span");
    typeSpan.innerHTML = `Observation Type: ${observation.quantOrQual}`;

    div.appendChild(idSpan);
    div.appendChild(typeSpan);

    return div;
}

function obsContent(observation) {
    if (observation.quantOrQual == "QUANTITATIVE"){
        return measurementContent(observation);
    } else {
        return categoricalContent(observation);
    }
}


function measurementContent(observation) {
    const div = document.createElement("div");
    div.classList.add("obs-content");

    const typeStrong = document.createElement("strong");
    typeStrong.innerHTML = `${observation.phenomenonType.name}: `;

    const amountSpan = document.createElement("span");
    if (observation.anomaly == "") {
        amountSpan.innerHTML = `${observation.amount}${observation.unit.symbol}`;
    } else {
        amountSpan.innerHTML = `${observation.amount}${observation.unit.symbol}    <br/><strong>ANOMALY: ${observation.anomaly}<\strong>`;
    }
    div.appendChild(typeStrong);
    div.appendChild(amountSpan);

    return div;
}

function categoricalContent(observation) {
    const div = document.createElement("div");
    div.classList.add("obs-content");

    const typeStrong = document.createElement("strong");
    typeStrong.innerHTML = `${observation.phenomenonType.name}: `;

    const phenomSpan = document.createElement("span");
    phenomSpan.innerHTML = `${observation.presence} ${observation.phenomenon.name}`

    div.appendChild(typeStrong);
    div.appendChild(phenomSpan);

    return div;
}

function obsProtocol(observation) {
    const div = document.createElement("div");
    div.classList.add("obs-protocol");

    if (observation.protocol == null){
        const noneLabel = document.createElement("span");
        noneLabel.innerHTML = "Protocol: (None)";
        div.appendChild(noneLabel);
        return div;
    }

    const detail = document.createElement("details");

    const summary = document.createElement("summary");
    summary.innerHTML = `Protocol: ${observation.protocol.name}`;

    const inner = document.createElement("div");

    const desc = document.createElement("pre");
    desc.innerHTML = `${observation.protocol.description}`;

    const rating = document.createElement("span");
    rating.innerHTML = `Accuracy: ${observation.protocol.accuracyRating}`;

    inner.appendChild(desc);
    inner.appendChild(rating);

    detail.appendChild(summary);
    detail.appendChild(inner);

    div.appendChild(detail);

    return div;
}

function obsRejection(observation) {
    const div = document.createElement("div");
    div.classList.add("rejection");

    const detail = document.createElement("details");

    const summary = document.createElement("summary");
    summary.innerHTML = `<strong>Status: REJECTED</strong>`;

    const inner = document.createElement("div");

    const label = document.createElement("span");
    label.innerHTML = `Rejected by:`;

    const sublist = document.createElement("ul");
    for (const [id, summary] of Object.entries(observation.rejectors)) {
        const li = document.createElement('li');
        li.innerHTML = `${summary}`;
        sublist.appendChild(li);
    }

    const reasonLabel = document.createElement("p");
    reasonLabel.innerHTML = `Reason:`;

    const reason = document.createElement("pre");
    reason.innerHTML = `${observation.rejectionReason}`;

    inner.appendChild(label);
    inner.appendChild(sublist);
    inner.appendChild(reasonLabel);
    inner.appendChild(reason);

    detail.appendChild(summary);
    detail.appendChild(inner);

    div.appendChild(detail);

    return div;
}


function obsEvidence(observation) {
    const div = document.createElement("div");
    div.classList.add("evidence");

    const detail = document.createElement("details");

    const summary = document.createElement("summary");
    summary.innerHTML = `<strong>Status: ACTIVE</strong>`;

    const inner = document.createElement("div");

    const label = document.createElement("span");
    label.innerHTML = `Supported by:`;

    const sublist = document.createElement("ul");

    for (const [id, summary] of Object.entries(observation.supporters)) {
        const li = document.createElement('li');
        li.innerHTML = `${summary}`;
        sublist.appendChild(li);
    }

    const reasonLabel = document.createElement("p");
    reasonLabel.innerHTML = `Details:`;

    const reason = document.createElement("pre");
    reason.innerHTML = `${observation.evidenceDetails}`;

    inner.appendChild(label);
    inner.appendChild(sublist);
    inner.appendChild(reasonLabel);
    inner.appendChild(reason);

    detail.appendChild(summary);
    detail.appendChild(inner);

    div.appendChild(detail);

    return div;
}


function obsStatus(observation) {
    if (observation.status == "ACTIVE") {
        return obsEvidence(observation);
    } else {
        return obsRejection(observation);
    }
}

function obsTime(observation) {
    const div = document.createElement("div");
    div.classList.add("obs-time");

    //if (observation.applicabilityTime == observation.recordingTime)

    const recordSpan = document.createElement("span");
    const recordDate = new Date(observation.recordingTime);
    recordSpan.innerHTML = `${recordDate.toLocaleString('en-US')}`;

    const applicSpan = document.createElement("span");
    const applicDate = new Date(observation.applicabilityTime);
    applicSpan.innerHTML = `${applicDate.toLocaleString('en-US')}`;

    div.appendChild(recordSpan);
    div.appendChild(applicSpan);

    return div;
}

function obsButtons(observation) {
    const div = document.createElement("div");
    
    if (observation.status == "ACTIVE") {
        div.classList.add("obs-buttons");
        const rejectButton = document.createElement("button");
        rejectButton.innerHTML = "Reject";
        rejectButton.addEventListener('click', function() {
            rejectObservation(observation);
        });
        div.appendChild(rejectButton);
    }
    return div;
}


//---------------------------------------------^-PATIENT OBSERVATION LIST-^---------------------------------------------















//--------------------------------------------V-OBSERVATION SELECTOR DIALOG-V-------------------------------------------

const selectObservationWindow = document.getElementById("selectObservationWindow");
const observationSelectionList = document.getElementById("observationSelectionList");
const observationSelectedList = document.getElementById("observationSelectedList");

let unselectedObservations = [];
let selectedObservations = [];

//-------------------CLOSING-------------------



//-------------------OPENING-------------------
async function openSelector() {
    unselectedObservations = await getPatientObservations(globalPatient);
    selectedObservations = [];

    populateSelectionList();
    populateSelectedList();
    selectObservationWindow.showModal();
}

function populateSelectionList() {
    fillGenericList(observationSelectionList, unselectedObservations, buildObservationSelectEntry);
}
function populateSelectedList() {
    fillGenericList(observationSelectedList, selectedObservations, buildObservationSelectedEntry);
}


function buildObservationSelectEntry(li, observation) {
    li.classList.add("observation");
    
    li.appendChild(obsHeader(observation))
    li.appendChild(obsContent(observation));
    li.appendChild(obsProtocol(observation));
    li.appendChild(obsStatus(observation));
    li.appendChild(obsTime(observation));
    li.appendChild(obsSelectButtons(observation));
}

function buildObservationSelectedEntry(li, observation) {
    li.classList.add("observation");
    
    li.appendChild(obsHeader(observation))
    li.appendChild(obsContent(observation));
    li.appendChild(obsProtocol(observation));
    li.appendChild(obsStatus(observation));
    li.appendChild(obsTime(observation));
    li.appendChild(obsSelectedButtons(observation));
}


function obsSelectButtons(observation) {
    const div = document.createElement("div");

    div.classList.add("obs-buttons");
    const selectButton = document.createElement("button");
    selectButton.innerHTML = "+";
    selectButton.addEventListener('click', function() {
        selectObservation(observation);
    });
    div.appendChild(selectButton);
    return div;
    
}

function obsSelectedButtons(observation) {
    const div = document.createElement("div");
    div.classList.add("obs-buttons");

    if (observation.status == "ACTIVE") {
        const selectButton = document.createElement("button");
        selectButton.innerHTML = "-";
        selectButton.addEventListener('click', function() {
            deselectObservation(observation);
        });
        div.appendChild(selectButton);
        return div;
    }
}


function selectObservation(observation) {
    selectedObservations.push(observation);

    const index = unselectedObservations.indexOf(observation);
    unselectedObservations.splice(index, 1);

    populateSelectedList();
    populateSelectionList();
}

function deselectObservation(observation) {
    unselectedObservations.push(observation);

    const index = selectedObservations.indexOf(observation);
    selectedObservations.splice(index, 1);
    
    populateSelectedList();
    populateSelectionList();
}



//-------------------SUBMISSION-------------------


async function getSelection() {
    unselectedObservations = await getPatientObservations(globalPatient);
    return new Promise((resolve) => {
        const closeSelectorButton = document.getElementById("closeSelectorButton");
        
        selectedObservations = [];

        populateSelectionList();
        populateSelectedList();
        selectObservationWindow.showModal();

        const onConfirm = () => {
            selectObservationWindow.close();
            closeSelectorButton.removeEventListener("click", onConfirm);
            console.log("hi")
            resolve(selectedObservations);
        };

        
        closeSelectorButton.addEventListener('click', onConfirm);
    });
}

//--------------------------------------------^-OBSERVATION SELECTOR DIALOG-^-------------------------------------------









//------------------------------------------------V-MEASUREMENT DIALOG-V------------------------------------------------

const recordMeasurementWindow = document.getElementById("recordMeasurementWindow");


//-------------------CLOSING-------------------
const closeMeasurementButton = document.getElementById("closeMeasurementButton");
closeMeasurementButton.addEventListener('click', function() {
    recordMeasurementWindow.close();
});


//-------------------OPENING-------------------
const recordMeasurementButton = document.getElementById("recordMeasurementButton");
recordMeasurementButton.addEventListener('click', MeasurementButtonFunc);

async function MeasurementButtonFunc() {
    measurementForm.amount.value = null;
    measurementForm.endTime.value = "";
    fillTypeOptions();
    fillMeasurementProtocolDropdown();
    recordMeasurementWindow.showModal();
}


//-------------------TYPE DROPDOWN-------------------
const typeDropdown = document.getElementById("typeDropdown");

async function fillTypeOptions() {
    const types = await getAllTypes();
    typeDropdown.innerHTML = `<option value=null>Select...</option>`;

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
    if (event.target.value != "null") {
        const selectedType = JSON.parse(event.target.value); 
        fillUnitOptions(selectedType.allowedUnits)
    }
    else {
        unitDropdown.innerHTML = `<option value=null>Select a type.</option>`;
    }
});


//-------------------UNIT DROPDOWN-------------------
const unitDropdown = document.getElementById("unitDropdown");

async function fillUnitOptions(units) {
    unitDropdown.innerHTML = `<option value=null>Select...</option>`;

    units.forEach(unit => {
        const option = document.createElement("option"); 
        option.value = unit.id; 
        option.textContent = unit.symbol;
        unitDropdown.appendChild(option);
    });
}


//-------------------PROTOCOL DROPDOWN-------------------
const measurementProtocolDropdown = document.getElementById("measurementProtocolDropdown");

async function fillMeasurementProtocolDropdown() {
    const protocols = await getAllProtocols();
    measurementProtocolDropdown.innerHTML = `<option value=-1>(None)</option>`;

    protocols.forEach(protocol => {
        const option = document.createElement("option"); 
        option.value = protocol.id; 
        option.textContent = protocol.name;
        measurementProtocolDropdown.appendChild(option);
    });
}


//-------------------SUBMISSION-------------------
const measurementForm = document.getElementById("measurementForm");
measurementForm.onsubmit = async function() {
    let endTimeInstant;
    if (measurementForm.endTime.value === ""){
        endTimeInstant = null;
    } else {
        const endTime = new Date(measurementForm.endTime.value);
        endTimeInstant = endTime.toISOString();
    }

    const result = await submitCreateMeasurement(sender, globalPatient.patientId, measurementProtocolDropdown.value, endTimeInstant, JSON.parse(typeDropdown.value).id, unitDropdown.value, measurementForm.amount.value);
    alert(result);
    onObservationChange();
};

//------------------------------------------------^-MEASUREMENT DIALOG-^------------------------------------------------















//------------------------------------------------V-CATEGORICAL DIALOG-V------------------------------------------------

const recordObservationWindow = document.getElementById("recordObservationWindow");
const categoricalForm = document.getElementById("categoricalForm");
const categoricalEvidenceList = document.getElementById("categoricalEvidenceList");

let selectedEvidence = [];

async function selectEvidence() {
    selectedEvidence = await getSelection();
    showEvidence();
}

function showEvidence(){
    fillGenericList(categoricalEvidenceList, selectedEvidence, buildRejecteeEntry);
}

const selectEvidenceButton = document.getElementById("selectEvidenceButton");
selectEvidenceButton.addEventListener('click', selectEvidence);



//-------------------CLOSING-------------------
const closeCategoricalButton = document.getElementById("closeCategoricalButton");
closeCategoricalButton.addEventListener('click', function() {
    recordObservationWindow.close();
});



//-------------------OPENING-------------------
const recordObservationButton = document.getElementById("recordObservationButton");
recordObservationButton.addEventListener('click', observationButtonFunc);

async function observationButtonFunc() {
    selectedEvidence = [];
    fillPhenomOptions();
    fillCategoricalProtocolDropdown();
    showEvidence();
    recordObservationWindow.showModal();
}




//-------------------PROTOCOL DROPDOWN-------------------
const categoricalProtocolDropdown = document.getElementById("categoricalProtocolDropdown");

async function fillCategoricalProtocolDropdown() {
    const protocols = await getAllProtocols();
    categoricalProtocolDropdown.innerHTML = `<option value=-1>(None)</option>`;

    protocols.forEach(protocol => {
        const option = document.createElement("option"); 
        option.value = protocol.id; 
        option.textContent = protocol.name;
        categoricalProtocolDropdown.appendChild(option);
    });
}

//-------------------PHENOMENON DROPDOWN-------------------
const phenomDropdown = document.getElementById("phenomDropdown");

async function fillPhenomOptions() {
    const types = await getAllPhenomena();
    phenomDropdown.innerHTML = ``;

    types.forEach(phenomenon => {
        const option = document.createElement("option"); 
        option.value = phenomenon.id; 
        option.textContent = `${phenomenon.typeName}: ${phenomenon.name}`;
        phenomDropdown.appendChild(option);
    });
}


const evidenceDetails = document.getElementById("evidenceDetails");

//-------------------SUBMISSION-------------------
categoricalForm.onsubmit = async function() {
    console.log("WHAT");
    let endTimeInstant;
    if (categoricalForm.endTime.value === ""){
        endTimeInstant = null;
    } else {
        const endTime = new Date(categoricalForm.endTime.value);
        endTimeInstant = endTime.toISOString();
    }
    
    const evidenceIds = selectedEvidence.map(evident => evident.observationId);

    const result = await submitCreateCategorical(sender, globalPatient.patientId, categoricalProtocolDropdown.value, endTimeInstant, phenomDropdown.value, categoricalForm.presenceDropdown.value, evidenceIds, evidenceDetails.value);
    alert(result);
    onObservationChange();
};

//------------------------------------------------^-CATEGORICAL DIALOG-^------------------------------------------------






//-------------------------------------------------V-REJECTION DIALOG-V-------------------------------------------------

const rejectionWindow = document.getElementById("rejectionWindow");
const rejecteeList = document.getElementById("rejecteeList");
const rejectorList = document.getElementById("rejectorList");

const rejectSelectorButton = document.getElementById("rejectSelectorButton");
rejectSelectorButton.addEventListener('click', selectRejectors);

async function selectRejectors() {
    rejectors = await getSelection();
    showRejectors();
}


let rejectors = [];
let rejectee;

//-------------------CLOSING-------------------
const closeRejectionButton = document.getElementById("closeRejectionButton");
closeRejectionButton.addEventListener('click', function() {
    rejectionWindow.close();
});


//-------------------OPENING-------------------
async function rejectObservation(observation) {
    rejectors = [];
    rejectee = observation;

    showRejectee(observation)
    showRejectors();

    rejectionWindow.showModal();
}

function showRejectee(observation) {
    rejecteeList.innerHTML = "";
    const li = document.createElement("li");
    buildRejecteeEntry(li, observation)
    rejecteeList.appendChild(li);
}

function showRejectors() {
    fillGenericList(rejectorList, rejectors, buildRejecteeEntry);
}

function buildRejecteeEntry(li, observation) {
    li.classList.add("observation");
    
    li.appendChild(obsHeader(observation))
    li.appendChild(obsContent(observation));
    li.appendChild(obsProtocol(observation));
    li.appendChild(obsStatus(observation));
    li.appendChild(obsTime(observation));
}


const rejectionReasonBox = document.getElementById("rejectionReasonBox");

const submitRejectionButton = document.getElementById("submitRejectionButton");

submitRejectionButton.addEventListener('click', async function() {
    const reason = rejectionReasonBox.value;
    const rejectorIds = rejectors.map(rejector => rejector.observationId);
    const observationId = rejectee.observationId;
    const result = await submitObservationRejection(observationId, rejectorIds, reason);
    alert(result);
    rejectionWindow.close();
});


//-------------------------------------------------^-REJECTION DIALOG-^-------------------------------------------------




//------------------------------------------------V-EVALUATION DIALOG-V------------------------------------------------

const evaluationWindow = document.getElementById("evaluationWindow");

//-------------------CLOSING-------------------
const closeDiagnosisButton = document.getElementById("closeDiagnosisButton");
closeDiagnosisButton.addEventListener('click', function() {
    evaluationWindow.close();
});



//-------------------OPENING-------------------
const evaluateDiagnosisButton = document.getElementById("evaluateDiagnosisButton");
evaluateDiagnosisButton.addEventListener('click', evaluateButtonFunc);

async function evaluateButtonFunc() {
    await evaluateRules();
    evaluationWindow.showModal();
}


const diagnosisList = document.getElementById("diagnosisList");

async function evaluateRules() {
    const diagnoses = await getPatientEvaluation();
    fillGenericList(diagnosisList, diagnoses, buildDiagnosis);
}

function buildDiagnosis(li, diagnosis) {
    li.classList.add("diagnosis");

    const detail = document.createElement("details");

    const summary = document.createElement("summary");
    summary.innerHTML = `<strong>${diagnosis.typeName}: ${diagnosis.name} ${diagnosis.presence}<\strong>`;

    const inner = document.createElement("div");

    const ruleInfo = document.createElement("span");
    ruleInfo.innerHTML = `Rule: ${diagnosis.rule.name}, ${diagnosis.rule.type}`;



    const contribLabel = document.createElement("span");
    contribLabel.innerHTML = `Due to: `;

    const sublist = document.createElement("ul");
    if (diagnosis.rule.type == "WEIGHTED") {
        fillGenericList(sublist, diagnosis.contributors, buildWeightedContributor);
    } else {
        fillGenericList(sublist, diagnosis.contributors, buildOtherContributor);
    }
    inner.appendChild(ruleInfo);
    inner.appendChild(document.createElement("br"));
    inner.appendChild(document.createElement("br"));
    inner.appendChild(contribLabel);
    inner.appendChild(document.createElement("br"));
    inner.appendChild(sublist);

    const scoreInfo = document.createElement("span");
    if (diagnosis.rule.type == "WEIGHTED"){
            scoreInfo.innerHTML = `Score: ${diagnosis.total}/${diagnosis.threshold}`
            inner.appendChild(scoreInfo);
            inner.appendChild(document.createElement("br"));
            inner.appendChild(document.createElement("br"));
    } 

    detail.appendChild(summary);
    detail.appendChild(inner);

    li.appendChild(detail);
}



function buildOtherContributor(li, contributor) {
    li.classList.add("contributor");

    const detail = document.createElement("details");

    const summary = document.createElement("summary");
    summary.innerHTML = `${contributor.criteria.typeName}: ${contributor.criteria.name} ${contributor.criteria.presence}`;

    const inner = document.createElement("div");
    const observationEntry = document.createElement("li");
    buildRejecteeEntry(observationEntry, contributor.observation);

    inner.appendChild(observationEntry);

    detail.appendChild(summary);
    detail.appendChild(inner);

    li.appendChild(detail);
}

function buildWeightedContributor(li, contributor) {
    li.classList.add("contributor");

    const detail = document.createElement("details");

    const summary = document.createElement("summary");
    summary.innerHTML = `[+${contributor.criteria.weight}] ${contributor.criteria.typeName}: ${contributor.criteria.name} ${contributor.criteria.presence}`;

    const inner = document.createElement("div");
    const observationEntry = document.createElement("li");
    buildRejecteeEntry(observationEntry, contributor.observation);

    inner.appendChild(observationEntry);

    detail.appendChild(summary);
    detail.appendChild(inner);

    li.appendChild(detail);
}

async function getPatientEvaluation() {
    const response = await fetch(host + "/patients/" + globalPatient.patientId + "/evaluate");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const diagnoses = await response.json();
    
        return diagnoses;
}



//------------------------------------------------^-EVALUATION DIALOG-^------------------------------------------------


//update functions
populateBio();
populateObservationList();


async function onObservationChange() {
    populateObservationList();
}



//console.log(await getSelection());