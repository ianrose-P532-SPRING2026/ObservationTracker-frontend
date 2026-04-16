import { host } from "../host.js"
let sender = 1; //TheGuy


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
addPhenomButton.addEventListener('click', function() {
    loadedPhenomena.push(phenomInput.value)
    fillList(loadedPhenomenaList, loadedPhenomena);
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
    text.innerHTML=`${phenom}`;

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
    const PhenomenonTypeRequest = {sender: sender, id: id, name: name, category: "QUANTITATIVE", allowedUnitIds: ids, phenomena: null};
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
});


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
    const ids = loadedArgs.map(arg => arg.id); 
    const productId = JSON.parse(productDropdown.value).id;    
    const RuleRequest = {sender: sender, id: id, name: name, argumentIds: ids, productId: productId};
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
    console.log(unitDropdown.value)
    loadedArgs.push(JSON.parse(argDropdown.value));
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
    loadedArgs.forEach(phenomenon => {
        const li = document.createElement('li');
        buildLoadedArg(li, phenomenon);
        
        list.appendChild(li);                       
    });
}


function buildLoadedArg(li, phenomenon){    
    const text = document.createElement('span');
    text.innerHTML=`${phenomenon.typeName}, ${phenomenon.name}`;

    const removeButton = document.createElement('button');
    removeButton.addEventListener('click', function() {
        removeArg(phenomenon);
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
            subli.innerHTML = `${unit.symbol} = ${ratio}*${target}`;
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
    li.appendChild(deleteUnitButton);
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
    li.appendChild(deleteButton);
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
        label.innerHTML = "Allowed Units: ";
        
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
                subli.innerHTML = `${phenomenon.name}`;
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
    li.appendChild(deleteButton);
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
    product.innerHTML=`Diagnosis: ${rule.productConcept.typeName}, ${rule.productConcept.name}`;

    const label = document.createElement("span");
    label.innerHTML = "Criteria: ";

    const sublist = document.createElement('ul');

        
    if (rule.argumentConcepts.length == 0){
        sublist.innerHTML = `<li style="list-style-type: none;">(none)</li>`;
    } else {
        rule.argumentConcepts.forEach(phenomenon => {
            const subli = document.createElement('li');
            subli.innerHTML = `${phenomenon.typeName}, ${phenomenon.name}`;
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
    li.appendChild(deleteButton);
}

populateRuleList();