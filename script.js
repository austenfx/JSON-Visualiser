let currentID = 0;

function SerialiseGenerator(){
    currentID++;
    return currentID.toString();
}


document.getElementById("nav-view").addEventListener("click", ConvertJSON);

function ConvertJSON(){
    let jsonText = document.getElementById("json-input").value;
    try {
        let jsonObject = JSON.parse(jsonText);
        GenerateViewer(jsonObject);
    } catch (error) {
        console.log(error)
    }
}

function Reset(viewer) {
    while (viewer.firstChild) {
        viewer.removeChild(viewer.lastChild);
    }

    let rootElement = document.createElement("div");
    let rootText = document.createTextNode("JSON");
    rootElement.appendChild(rootText);

    let serial_id = document.createAttribute("data-serial_id");
    serial_id.value = "0";
    let id = document.createAttribute("id");
    id.value = "json-root";

    rootElement.setAttributeNode(serial_id);
    rootElement.setAttributeNode(id);

    viewer.appendChild(rootElement);
    currentID = 0;
}


function GenerateViewer(jsonObject){
    
    let viewer = document.getElementById("viewer");
    Reset(viewer);
    
    let root = document.getElementById("json-root");
    CreateChildren(viewer, jsonObject, 1, root);

    let elements = viewer.children;

    root.addEventListener("click", () => {

        for (let i = 0; i < elements.length; i++) {
            if (elements[i].dataset.depth == 1) {
                elements[i].hidden = !elements[i].hidden;
            } 
            else if (elements[i].dataset.depth > 1){
                elements[i].hidden = true;
            }
        }

    });

    for (let i = 0; i < elements.length; i++) {
        console.log(elements[i]);
        let element = elements[i];
        element.style.left = (parseInt(element.dataset.depth) * 30).toString() + "px";
    }


}

function CreateChildren(viewer, jsonObject, depth, htmlElement){
    let type = "";

    if (!jsonObject){

    } else if (Array.isArray(jsonObject)) {
        /* 
        if array
        parent symbol []
        for i in array
        new child html element
        child name = i
        CreateChildren(array[i])

        issue with name = i
        if child is data then name must be changed to data
        perhaps
        */

        //htmlElement.firstChild.innerText += " []";
        htmlElement.innerText += " []";

        for (let i = 0; i < jsonObject.length; i++) {
            let name = i;
            if (!Array.isArray(jsonObject[i]) && typeof jsonObject[i] !== "object") {
                name = jsonObject[i];
            }
            const childDiv = CreateChildHTML(name, depth);
            viewer.appendChild(childDiv);

            CreateChildren(viewer, jsonObject[i], depth + 1, childDiv);
        }


    } else if (typeof jsonObject === 'object') {
        type = "object";

        // if object
        // parent symbol {}
        // keys = object.keys
        // for i in keys
        // child name = keys[i]
        // CreateChildren(parentObject[keys[i]])

        //htmlElement.firstChild.innerText += " {}";
        htmlElement.innerText += " {}";
        //console.log(htmlElement.firstChild.innerText);

        let keys = Object.keys(jsonObject);
        for (let i = 0; i < keys.length; i++) {
            let name = keys[i];
            const childDiv = CreateChildHTML(name, depth);
            viewer.appendChild(childDiv);

            CreateChildren(viewer, jsonObject[keys[i]], depth + 1, childDiv);
        }
    } else {
        type = "data";
        htmlElement.innerText += ":";

        let name = jsonObject.toString();
        const childDiv = CreateChildHTML(name, depth);
        viewer.appendChild(childDiv);
    }
        
    
}

function CreateChildHTML(name, depth) {
    const childDiv = document.createElement("div");
    const childName = document.createTextNode(name);
    childDiv.appendChild(childName);
    childDiv.hidden = true;
    childDiv.dataset.depth = depth;
    childDiv.dataset.serial_id = SerialiseGenerator();

    childDiv.addEventListener("click", () => {
        let elements = childDiv.parentElement.children;
        let startLooking = false;
        for (let i = 0; i < elements.length; i++) {
            if (startLooking) {
                if (elements[i].dataset.depth == depth + 1) {
                    elements[i].hidden = !elements[i].hidden;
                }
                else if (elements[i].dataset.depth > depth + 1) {
                    elements[i].hidden = true;
                }
                else if (elements[i].dataset.depth <= depth) {
                    break;
                }
            }

            if (elements[i].dataset.serial_id == childDiv.dataset.serial_id) {
                startLooking = true;
            } 
            
        }
    });

    return childDiv;
}