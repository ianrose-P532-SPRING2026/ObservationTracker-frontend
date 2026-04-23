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

async function submitNewUser(sender, name) {
    console.log("WTF????");
    const UserRequest = {sender: sender, name: name};
    console.log("You entered: " + JSON.stringify(UserRequest));

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(UserRequest)
    };

    const response = await fetch(host + "/staff", request);
    const result = await response.text();
    return result;
}


const createNewUserButton = document.getElementById("createNewUserButton");
createNewUserButton.addEventListener('click', createUserFunc);

const userName = document.getElementById("userName");

async function createUserFunc() {
    console.log("WTF");
    const result = await submitNewUser(sender, userName.value)
    alert(result);
    fillLoginOptions();
}