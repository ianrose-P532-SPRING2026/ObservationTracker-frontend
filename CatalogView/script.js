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


//------------------------------------------------------PROTOCOL--------------------------------------------------------
const windowPROTOCOL = document.getElementById("windowPROTOCOL");
const buttonPROTOCOL = document.getElementById("buttonPROTOCOL");
const closeButtonPROTOCOL = document.getElementById("closeButtonPROTOCOL");
formPROTOCOL = document.getElementById("formPROTOCOL");

buttonPROTOCOL.addEventListener('click', function() {
    windowPROTOCOL.showModal();
});

closeButtonPROTOCOL.addEventListener('click', function() {
    windowPROTOCOL.close();
});

formPROTOCOL.onsubmit = async function() {
    const result = await submitCreateProtocol(sender, -1, formPROTOCOL.name.value, formPROTOCOL.desc.value, formPROTOCOL.accuracyRating.value);
    alert(result);
};

async function submitCreateProtocol(sender, id, name, description, accuracyRating) {
    const ProtocolRequest = {sender: sender, id: id, name: name, description: description, accuracyRating: accuracyRating};
    console.log("You entered: " + JSON.stringify(ProtocolRequest));

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(ProtocolRequest)
    };

    const response = await fetch(host + "/catalogue/protocols", request);
    const result = await response.text();
    return result;
}
//----------------------------------------------------------------------------------------------------------------------



//-------------------------------------------------------UNITS----------------------------------------------------------
const windowUNITS = document.getElementById("windowUNITS");

const buttonUNIT = document.getElementById("buttonUNIT");
buttonUNIT.addEventListener('click', function() {
    windowUNITS.showModal();
});

const closeButtonUNITS = document.getElementById("closeButtonUNITS");

closeButtonUNITS.addEventListener('click', function() {
    windowUNITS.close();
});


formUNITS = document.getElementById("formUNITS");
formUNITS.onsubmit = async function() {
    const result = await submitCreateUnit(sender, -1, formUNITS.symbol.value);
    alert(result);
};

async function submitCreateUnit(sender, id, symbol) {
    const UnitRequest = {sender: sender, id: id, symbol: symbol};
    console.log("You entered: " + JSON.stringify(UnitRequest));

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(UnitRequest)
    };

    const response = await fetch(host + "/catalogue/units", request);
    const result = await response.text();
    return result;
}

async function getAllUnits() {
    const response = await fetch(host + "/catalogue/units");
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const units = await response.json();

    return units;
}
//----------------------------------------------------------------------------------------------------------------------



//----------------------------------------------------QUALITATIVE-------------------------------------------------------
let loadedPhenomena = [];

const windowQUAL = document.getElementById("windowQUAL");

const typeButtonQUAL = document.getElementById("typeButtonQUAL");
typeButtonQUAL.addEventListener('click', function() {
    windowQUAL.showModal();
    loadedPhenomena = [];
});

const closeButtonQUAL = document.getElementById("closeButtonQUAL");

closeButtonQUAL.addEventListener('click', function() {
        windowQUAL.close();
        loadedPhenomena = [];
});

formQUAL = document.getElementById("formQUAL");
formQUAL.onsubmit = async function() {
    const result = await submitCreateQual(sender, -1, formQUAL.name.value, loadedPhenomena);
    alert(result);
    loadedPhenomena = [];
};



async function submitCreateQual(sender, id, name, phenomena) {
    const PhenomenonTypeRequest = {sender: sender, id: id, name: name, category: "QUALITATIVE", allowedUnitIds: null, phenomena: phenomena};
    console.log("You entered: " + JSON.stringify(PhenomenonTypeRequest));

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(PhenomenonTypeRequest)
    };

    const response = await fetch(host + "/catalogue/phenomenon-types", request);
    const result = await response.text();
    return result;
}

const loadedPhenomenaList = document.getElementById("loadedPhenomenaList");
const addPhenomButton = document.getElementById("addPhenomButton");
const phenomInput = document.getElementById("phenom");

const parentInput = document.getElementById("parentInput");

async function fillParentOptions() {
    const phenoms = loadedPhenomena;

    parentInput.innerHTML = `<option value=-1>(root)</option>`;

    phenoms.forEach(phenom => {
        const option = document.createElement("option"); 
        option.value = JSON.stringify(phenom);
        option.textContent = phenom.name;
        parentInput.appendChild(option);
    });

}

addPhenomButton.addEventListener('click', function() {
    console.log(parentInput.value);
    let phenomRequest;

    if(parentInput.value != "") {
        console.log(JSON.parse(parentInput.value));
        phenomRequest = {name: phenomInput.value, parentName: JSON.parse(parentInput.value).name};
    } else {
        phenomRequest = {name: phenomInput.value, parentName: null};
    }
     
    loadedPhenomena.push(phenomRequest)
    fillList(loadedPhenomenaList, loadedPhenomena);
    fillParentOptions();
});


function removePhenom(phenom) {
    const index = loadedPhenomena.indexOf(phenom);
    loadedPhenomena.splice(index, 1); 
    fillList(loadedPhenomenaList, loadedPhenomena);
}

function fillList(list, loadedPhenomena) {
    //setting to default
    if(loadedPhenomena.length == 0){
        list.innerHTML = `<li style="text-align: center; list-style-type: none;">(none)</li>`;
        return;
    }
    list.innerHTML = ""; //clear all before populating

    //populating
    loadedPhenomena.forEach(phenom => {
        const li = document.createElement('li');
        buildLoadedPhenom(li, phenom);
        
        

        list.appendChild(li);                       
    });
}


function buildLoadedPhenom(li, phenom){    
    const text = document.createElement('span');
    let parentName;
    if (phenom.parentName == null) {
        parentName = "(root)"
    } else {
        parentName = phenom.parentName;
    }
    text.innerHTML=`${phenom.name} -> ${parentName}`;

    const removeButton = document.createElement('button');
    removeButton.addEventListener('click', function() {
        removePhenom(phenom);
    });
    removeButton.innerHTML = "-";
    
    li.appendChild(text);
    li.appendChild(removeButton);
}
//----------------------------------------------------------------------------------------------------------------------



//---------------------------------------------------QUANTITATIVE-------------------------------------------------------
let loadedUnits = [];

const windowQUANT = document.getElementById("windowQUANT");

const typeButtonQUANT = document.getElementById("typeButtonQUANT");
typeButtonQUANT.addEventListener('click', function() {
    fillRangeUnitOptions();
    fillUnitOptions();
    windowQUANT.showModal();
    loadedUnits = [];
    fillUnitList(loadedUnitList, loadedUnits);
});

const closeButtonQUANT = document.getElementById("closeButtonQUANT");

closeButtonQUANT.addEventListener('click', function() {
        windowQUANT.close();
        loadedUnits = [];
});

formQUANT = document.getElementById("formQUANT");
formQUANT.onsubmit = async function() {
    const result = await submitCreateQuant(sender, -1, formQUANT.name.value, loadedUnits);
    alert(result);
    loadedUnits = [];
};

async function submitCreateQuant(sender, id, name, loadedUnits) {
    const ids = loadedUnits.map(unit => unit.id); 
    const lowerBound = document.getElementById("lowBound").value;
    const upperBound = document.getElementById("highBound").value;
    const rangeUnitId = JSON.parse(document.getElementById("rangeUnitDropdown").value).id;

    const lowerAnomaly = document.getElementById("lowAnom").value;
    const upperAnomaly = document.getElementById("highAnom").value;

    const PhenomenonTypeRequest = {sender: sender, id: id, name: name, category: "QUANTITATIVE", allowedUnitIds: ids, phenomena: null, lowerBound: lowerBound, upperBound: upperBound, rangeUnitId: rangeUnitId, lowerAnomaly: lowerAnomaly, upperAnomaly: upperAnomaly};
    console.log("You entered: " + JSON.stringify(PhenomenonTypeRequest));

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(PhenomenonTypeRequest)
    };

    const response = await fetch(host + "/catalogue/phenomenon-types", request);
    const result = await response.text();
    return result;
}

const loadedUnitList = document.getElementById("loadedUnitList");
const addUnitButton = document.getElementById("addUnitButton");
const unitDropdown = document.getElementById("unitDropdown");

addUnitButton.addEventListener('click', function() {
    loadedUnits.push(JSON.parse(unitDropdown.value));
    fillUnitList(loadedUnitList, loadedUnits);
    fillRangeUnitOptions();
});



const rangeUnitDropdown = document.getElementById("rangeUnitDropdown");


async function fillRangeUnitOptions() {
    const units = loadedUnits;

    rangeUnitDropdown.innerHTML = `<option value=-1>Add a unit...</option>`;

    units.forEach(unit => {
        const option = document.createElement("option"); 
        option.value = JSON.stringify(unit);
        option.textContent = unit.symbol;
        rangeUnitDropdown.appendChild(option);
    });

}

async function fillUnitOptions() {
    const units = await getAllUnits();

    unitDropdown.innerHTML = ``;

    units.forEach(unit => {
        const option = document.createElement("option"); 
        option.value = JSON.stringify(unit); ; 
        option.textContent = unit.symbol;
        unitDropdown.appendChild(option);
    });

}


function removeUnit(unit) {
    const index = loadedUnits.indexOf(unit);
    loadedUnits.splice(index, 1); 
    fillUnitList(loadedUnitList, loadedUnits);
}

function fillUnitList(list, loadedUnits) {
    //setting to default
    if(loadedUnits.length == 0){
        list.innerHTML = `<li style="text-align: center; list-style-type: none;">(none)</li>`;
        return;
    }
    list.innerHTML = ""; //clear all before populating

    //populating
    loadedUnits.forEach(unit => {
        const li = document.createElement('li');
        buildLoadedUnit(li, unit);
        
        list.appendChild(li);                       
    });
}


function buildLoadedUnit(li, unit){    
    const text = document.createElement('span');
    text.innerHTML=`${unit.id}. ${unit.symbol}`;

    const removeButton = document.createElement('button');
    removeButton.addEventListener('click', function() {
        removeUnit(unit);
    });
    removeButton.innerHTML = "-";
    
    li.appendChild(text);
    li.appendChild(removeButton);
}
//----------------------------------------------------------------------------------------------------------------------





//---------------------------------------------------RULES-------------------------------------------------------
let loadedArgs = [];

const windowRULE = document.getElementById("windowRULE");

const rulesButton = document.getElementById("rulesButton");
rulesButton.addEventListener('click', function() {
    fillArgOptions();
    windowRULE.showModal();
    loadedArgs = [];
    fillArgList(loadedUnitList, loadedArgs);
});

const closeButtonRULE = document.getElementById("closeButtonRULE");

closeButtonRULE.addEventListener('click', function() {
        windowRULE.close();
        loadedArgs = [];
});

formRULE = document.getElementById("formRULE");
formRULE.onsubmit = async function() {
    const result = await submitCreateRule(sender, -1, formRULE.name.value, loadedArgs);
    alert(result);
    loadedArgs = [];
};

async function submitCreateRule(sender, id, name, loadedArgs) {
    const args = loadedArgs.map(arg => arg.request); 
    const productId = JSON.parse(productDropdown.value).id;    
    const presence = document.getElementById("productPresenceDropDown").value;
    const type = document.getElementById("ruleTypeDropdown").value;
    const threshold = document.getElementById("threshold").value;
    const RuleRequest = {sender: sender, id: id, name: name, arguments: args, productId: productId, productPresence: presence, type: type, threshold: threshold};
    console.log("You entered: " + JSON.stringify(RuleRequest));

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(RuleRequest)
    };

    const response = await fetch(host + "/catalogue/rules", request);
    const result = await response.text();
    return result;
}

const loadedArgList = document.getElementById("loadedArgList");
const addArgButton = document.getElementById("addArgButton");
const argDropdown = document.getElementById("argDropdown");

const productDropdown = document.getElementById("productDropdown");

addArgButton.addEventListener('click', function() {
    const weight = document.getElementById("weightThing").value;
    const presence = document.getElementById("argPresenceDropDown").value;
    const phenom = JSON.parse(argDropdown.value);

    const criteriaRequest = {argId: phenom.id, presence: presence, weight: weight};
    const criteria = {name: phenom.name, typeName: phenom.typeName, request: criteriaRequest};
    loadedArgs.push(criteria);
    
    console.log(criteria);
    fillArgList(loadedArgList, loadedArgs);
});


async function getAllPhenomena() {
    const response = await fetch(host + "/catalogue/phenomena");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const phenomena = await response.json();
    
        return phenomena;
}

async function fillArgOptions() {
    const phenomena = await getAllPhenomena();

    argDropdown.innerHTML = ``;

    phenomena.forEach(phenomenon => {
        const option = document.createElement("option"); 
        option.value = JSON.stringify(phenomenon); ; 
        option.textContent = `${phenomenon.typeName}, ${phenomenon.name}`;
        argDropdown.appendChild(option);
    });

    phenomena.forEach(phenomenon => {
        const option = document.createElement("option"); 
        option.value = JSON.stringify(phenomenon); ; 
        option.textContent = `${phenomenon.typeName}, ${phenomenon.name}`;
        productDropdown.appendChild(option);
    });

}


function removeArg(phenomenon) {
    const index = loadedArgs.indexOf(phenomenon);
    loadedArgs.splice(index, 1); 
    fillArgList(loadedArgList, loadedArgs);
}

function fillArgList(list, loadedArgs) {
    //setting to default
    if(loadedArgs.length == 0){
        list.innerHTML = `<li style="text-align: center; list-style-type: none;">(none)</li>`;
        return;
    }
    list.innerHTML = ""; //clear all before populating

    //populating
    loadedArgs.forEach(arg => {
        const li = document.createElement('li');
        buildLoadedArg(li, arg);
        
        list.appendChild(li);                       
    });
}


function buildLoadedArg(li, arg){    
    const text = document.createElement('span');
    text.innerHTML=`${arg.typeName}: ${arg.name} ${arg.request.presence} --- ${arg.request.weight}`;

    const removeButton = document.createElement('button');
    removeButton.addEventListener('click', function() {
        removeArg(arg);
    });
    removeButton.innerHTML = "-";
    
    li.appendChild(text);
    li.appendChild(removeButton);
}
//----------------------------------------------------------------------------------------------------------------------














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


function buildUnitListing(li, unit) {
    li.classList.add("unit")

    const title = document.createElement('strong');
    title.innerHTML=`${unit.id}. ${unit.symbol}`;

    const text = document.createElement('span');
    text.innerHTML="Conversion Ratios:";

    const sublist = document.createElement('ul');
    if (Object.keys(unit.toRatios).length == 0){
        sublist.innerHTML = `<li style="list-style-type: none;">(none)</li>`;
    } else {
        Object.entries(unit.toRatios).forEach(([target, ratio]) => {
            const subli = document.createElement('li');
            subli.innerHTML = `1${unit.symbol} = ${ratio}${target}`;
            sublist.appendChild(subli);                       
        });
    }

    const deleteUnitButton = document.createElement('button');
    deleteUnitButton.addEventListener('click', function() {
        deleteUnit(unit);
    });
    deleteUnitButton.innerHTML = "Delete";
    
    li.appendChild(title);
    li.appendChild(document.createElement('br'));
    li.appendChild(text);
    li.appendChild(sublist);
    //li.appendChild(deleteUnitButton);
}


const unitList = document.getElementById("unitList");

async function populateUnitList() {
    const units = await getAllUnits();
    fillGenericList(unitList, units, buildUnitListing);
}

function deleteUnit(unit){
    alert("uh oh i havent implemented this yet");
}

populateUnitList();







async function getAllProtocols() {
    const response = await fetch(host + "/catalogue/protocols");
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const protocols = await response.json();

    return protocols;
}

const protocolList = document.getElementById("protocolList");

async function populateProtocolList() {
    const protocols = await getAllProtocols();
    fillGenericList(protocolList, protocols, buildProtocolListing);
}

function buildProtocolListing(li, protocol) {
    li.classList.add("protocol")

    const title = document.createElement('strong');
    title.innerHTML=`${protocol.id}. ${protocol.name}`;

    const desc = document.createElement('pre');
    desc.innerHTML=`Description:
    ${protocol.description}`;

    const acc = document.createElement('span');
    acc.innerHTML=`Accuracy: ${protocol.accuracyRating}`;

    const deleteButton = document.createElement('button');
    deleteButton.addEventListener('click', function() {
        alert("uh oh i havent implemented this yet");
    });
    deleteButton.innerHTML = "Delete";
    
    li.appendChild(title);
    li.appendChild(desc);
    li.appendChild(acc);
    li.appendChild(document.createElement('br'));
    //li.appendChild(deleteButton);
}

populateProtocolList();






async function getAllTypes() {
    const response = await fetch(host + "/catalogue/phenomenon-types");
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const types = await response.json();

    return types;
}

const typeList = document.getElementById("typeList");

async function populateTypeList() {
    const types = await getAllTypes();
    fillGenericList(typeList, types, buildTypeListing);
}

function buildTypeListing(li, type) {
    li.classList.add("type")

    const title = document.createElement('strong');
    title.innerHTML=`${type.id}. ${type.name}`;

    const category = document.createElement('span');
    category.innerHTML=`Type: ${type.category}`;

    const label = document.createElement("span");

    const sublist = document.createElement('ul');

    if(type.category == "QUANTITATIVE"){
        label.innerHTML = `RANGE: ${type.lowerBound} - ${type.upperBound}${type.rangeUnit.symbol} <br/> ${type.lowerAnom}, ${type.upperAnom} <br/> Allowed Units: `;
        
        if (type.allowedUnits.length == 0){
            sublist.innerHTML = `<li style="list-style-type: none;">(none)</li>`;
        } else {
            type.allowedUnits.forEach(unit => {
                const subli = document.createElement('li');
                subli.innerHTML = `${unit.symbol}`;
                sublist.appendChild(subli);                       
            });
        }
    } else {
        label.innerHTML = "Phenomena: ";

        if (Object.keys(type.phenomena).length == 0){
            sublist.innerHTML = `<li style="list-style-type: none;">(none)</li>`;
        } else {
            type.phenomena.forEach(phenomenon => {
                const subli = document.createElement('li');
                subli.innerHTML = `<strong>${phenomenon.name}</strong> -> ${phenomenon.treeString} ${phenomenon.typeName}`;
                sublist.appendChild(subli);                       
            });
        }
    }


    const deleteButton = document.createElement('button');
    deleteButton.addEventListener('click', function() {
        alert("uh oh i havent implemented this yet");
    });
    deleteButton.innerHTML = "Delete";
    
    li.appendChild(title);
    li.appendChild(document.createElement('br'));
    li.appendChild(category);
    li.appendChild(document.createElement('br'));
    li.appendChild(label);
    li.appendChild(sublist);
    //li.appendChild(deleteButton);
}

populateTypeList();

















async function getAllRules() {
    const response = await fetch(host + "/catalogue/rules");
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const rules = await response.json();

    return rules;
}

const rulesList = document.getElementById("rulesList");

async function populateRuleList() {
    const rules = await getAllRules();
    fillGenericList(rulesList, rules, buildRuleListing);
}

function buildRuleListing(li, rule) {
    li.classList.add("rule");

    const title = document.createElement('strong');
    title.innerHTML=`${rule.id}. ${rule.name}`;

    const product = document.createElement('span');
    product.innerHTML=`Diagnosis: ${rule.productConcept.typeName}, ${rule.productConcept.name} ${rule.productPresence}`;

    const label = document.createElement("span");
    if (rule.type == "WEIGHTED"){
        label.innerHTML = `Threshold: ${rule.threshold} <br/><br/> Criteria: `;
    } else {
        label.innerHTML = `Criteria: `;
    }
    const sublist = document.createElement('ul');

        
    if (rule.argumentConcepts.length == 0){
        sublist.innerHTML = `<li style="list-style-type: none;">(none)</li>`;
    } else {
        rule.argumentConcepts.forEach(phenomenon => {
            const subli = document.createElement('li');
            if (rule.type == "WEIGHTED") {
                subli.innerHTML = `${phenomenon.typeName}, ${phenomenon.name} ${phenomenon.presence}  [+${phenomenon.weight}]`;
            } else {
                subli.innerHTML = `${phenomenon.typeName}, ${phenomenon.name} ${phenomenon.presence}`;
            }
            
            sublist.appendChild(subli);                       
        });
    }

    const deleteButton = document.createElement('button');
    deleteButton.addEventListener('click', function() {
        alert("uh oh i havent implemented this yet");
    });
    deleteButton.innerHTML = "Delete";
    
    li.appendChild(title);
    li.appendChild(document.createElement('br'));
    li.appendChild(product);
    li.appendChild(document.createElement('br'));
    li.appendChild(label);
    li.appendChild(sublist);
    //li.appendChild(deleteButton);
}

populateRuleList();





const PREPOPBUTTON = document.getElementById("PREPOPBUTTON");

PREPOPBUTTON.addEventListener('click', async function() {
    if (confirm("Are you sure? (if you do this when the database isnt empty i honestly have no idea whatll happen)")){
        const response = await fetch(host + "/prepop");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        alert("ok try refreshing the page");
    }
});
