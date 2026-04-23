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


async function getCmdLogs() {
    const response = await fetch(host + "/logging/commands");
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const logs = await response.json();
    return logs;
}




const cmdLogList = document.getElementById("cmdLogList");


async function populateCmdLogs() {
    const logs = await getCmdLogs();
    fillGenericList(cmdLogList, logs, buildCmdLog);
}

async function undoCommand(log) {
    const UndoRequest = sender;

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(UndoRequest)
    };

    const response = await fetch(host + "/logging/commands/" + log.id + "/undo", request);
    const result = await response.text();

    alert(result);
    await populateCmdLogs();
}

function buildCmdLog(li, log) {
    const details = document.createElement("details");

    const summary = document.createElement("summary");

    const inner = document.createElement("div");

    const timestamp = new Date(log.timestamp);
    summary.innerHTML = `${log.id}. ${log.command}, ${log.actorName} @ ${timestamp.toLocaleString('en-US')}`;
    
    const undoButton = document.createElement("button");
    undoButton.innerHTML = "Undo";
    undoButton.addEventListener('click', async function() {
        await undoCommand(log);
    });
    if (log.undone == true) {
        undoButton.disabled = true;
        summary.innerHTML = `<del>${log.id}. ${log.command}, ${log.actorName} @ ${timestamp.toLocaleString('en-US')}<\del>`;
    }

    const payload = document.createElement("pre");
    payload.innerHTML = log.payload;

    inner.appendChild(document.createElement('br'));
    inner.appendChild(undoButton);
    inner.appendChild(payload);

    details.appendChild(summary);
    details.appendChild(inner);

    li.appendChild(details);
}

const cmdLogWindow = document.getElementById("cmdLogWindow");

const cmdButton = document.getElementById("cmdButton");
cmdButton.addEventListener('click', cmdLogFunc);

async function cmdLogFunc() {
    await populateCmdLogs();
    cmdLogWindow.showModal();
}

const closeCmdLogButton = document.getElementById("closeCmdLogButton");
closeCmdLogButton.addEventListener('click', closeCmdLog);



function closeCmdLog() {
    cmdLogWindow.close();
}