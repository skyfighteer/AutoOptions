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
            saveConfig().then(() => window.close());
        };
    });
};

function getInput() {
    input = Array.from(document.querySelectorAll('input')).filter(isSaved); // note: filtering empty arrays is possible
    // validate
    if (input.length === 0) throw new Error('AutoOptions Error: No supported inputs were found in the document.');
    else {
        if (!input.every(hasId)) throw new Error('AutoOptions Error: There are supported inputs without an ID.');
    };
}

function saveConfig() {
    sendToAllTab(); // does not have to finish on first load, already opened pages don't have listeners set up
    return chrome.storage.sync.set({'configuration': configuration});
}

function sendToAllTab(){
    chrome.tabs.query({}).then((tabs) => {
        tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id,{"configuration": configuration}).catch(() => {
                // error handling for unreachable websites
            });
        })
    });
};

function sendToCurrentTab(){
    chrome.tabs.query({active: true, lastFocusedWindow: true}).then((tabs) => {
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
    })
}

function updateConfig(el) {
    if (isBoolean(el)) { // checkbox / radio
        if (hasName(el)) { // radio
            if (isChecked(el)) { // find the one that is checked
                configuration[el.name] = el.id;
            };
        } else { // checkbox
            configuration[el.id] = el.checked; // true / false
        };
    } else { // all other supported inputs
        configuration[el.id] = el.value; // '' / value
    };
};

function setUI(el) {
    if (isBoolean(el)) { // checkbox / radio
        if (hasName(el)) { // radio
            if (configuration[el.name] === el.id) {
                el.checked = true;
            };
        } else {
            el.checked = configuration[el.id];
        }
    } else {
        el.value = configuration[el.id];
    };
};

function resetElement(el) {
    if (isBoolean(el)) {
        if (isCheckedByDefault(el)){
            el.checked = true;
        } else {
            el.checked = false;
        };
    }
    else {
        if (hasValueByDefault(el)) {
            el.value = el.getAttribute('value');
        } else {
            el.value = '';
        };
    };
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
}

function isCheckedByDefault(el) {
    return el.hasAttribute('checked');
}

function isChecked(el) {
    return el.checked === true;
}

function addChangeListener() {
    input.forEach(createListeners);
}

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
}

function isBoolean(el) {
    const checked = [
        'checkbox',
        'radio'
    ];
    return checked.includes(el.type);
}

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
}
