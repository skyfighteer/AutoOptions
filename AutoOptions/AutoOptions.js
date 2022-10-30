let input;
let configuration = {};
window.addEventListener('load', ()=> {
    getInput();
    loadConfig();
    addChangeListener();
    addResetFunction();
});

function loadConfig() {
    chrome.storage.sync.get(['configuration']).then((storedConfiguration) => {
        if ('configuration' in storedConfiguration) { // if there is a stored configuration
            configuration = storedConfiguration.configuration;
            input.forEach(setUI);
        } else {
            input.forEach(updateConfig); // create the default object for the first time
            saveConfig().then(() => window.close()); // close tab after saving the config
        };
    });
};

function getInput() {
    input = Array.from(document.querySelectorAll('input')).filter(isSaved); // note: filtering empty arrays is possible
    // validate
    if (input.length === 0) throw new Error('AutoOptions Error: No supported inputs were found in the document.');
    else if (!input.every(hasId)) throw new Error('AutoOptions Error: There are supported inputs without an ID.');
};

async function saveConfig() {
    await sendToAllTab(); // optional
    await chrome.storage.sync.set({'configuration': configuration});
};

function sendToAllTab(){
    return chrome.tabs.query({}).then((tabs) => {
        tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id,{"configuration": configuration}).catch(() => {
                // error handling for unreachable websites
            });
        });
    });
};

function sendToCurrentTab(){
    return chrome.tabs.query({active: true, lastFocusedWindow: true}).then((tabs) => {
        chrome.tabs.sendMessage(tabs[0].id,{"configuration": configuration}).catch(() => {
            // error handling for unreachable websites
        });
    });
};

// ---------------- For Each ----------------

function createListeners(el) {
    el.addEventListener('change', function() {
        input.forEach(updateConfig);
        saveConfig();
    });;
};

function updateConfig(el) {
    if (isBoolean(el)) { // checkbox / radio
        if (hasName(el) && isChecked(el)) configuration[el.name] = el.id; // find checked radios
        else configuration[el.id] = el.checked; // checkbox
    } else configuration[el.id] = el.value; // all other supported inputs
};

function setUI(el) {
    if (isBoolean(el)) { // checkbox / radio
        if (hasName(el) && (configuration[el.name] === el.id)) el.checked = true; // find radios that should be checked
        else el.checked = configuration[el.id]; // checkbox
    } else el.value = configuration[el.id]; // all other supported inputs
};

function resetElement(el) {
    if (isBoolean(el)) isCheckedByDefault(el) ? el.checked = true : el.checked = false;
    else hasValueByDefault(el) ? el.value = el.getAttribute('value') : el.value = '';
};

// ---------------- Helper ----------------

function hasId(el) {
    return el.hasAttribute('id');
};

function hasName(el) {
    return el.hasAttribute('name');
};

function hasValueByDefault(el) {
    return el.hasAttribute('value');
};

function isCheckedByDefault(el) {
    return el.hasAttribute('checked');
};

function isChecked(el) {
    return el.checked === true;
};

function addChangeListener() {
    input.forEach(createListeners);
};

function addResetFunction() {
    const resetButton = document.getElementById('reset');
    if (resetButton) {
        resetButton.addEventListener('click', ()=> {
            reset();
        });
    };
};

function reset() {
    input.forEach(resetElement);
    input.forEach(updateConfig);
    saveConfig();
};

function isBoolean(el) {
    const checked = [
        'checkbox',
        'radio'
    ];
    return checked.includes(el.type);
};;

function isSaved(el) {
    const notSaved = [
        'button',
        'file',
        'hidden',
        'image',
        'reset',
        'password',
        'search',
        'submit'
    ];
    return !notSaved.includes(el.type);
};
