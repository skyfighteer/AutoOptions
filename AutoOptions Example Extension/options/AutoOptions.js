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
        if (Object.keys(storedConfiguration).length > 0) { // if there is a stored configuration
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

function createListeners(element) {
    element.addEventListener('change', function() {
        input.forEach(updateConfig);
        saveConfig();
    })
}

function updateConfig(element) {
    if (isChecked(element)) {
        configuration[element.id] = element.checked;
    } else {
        configuration[element.id] = element.value;
    };
};

function setUI(element) {
    if (isChecked(element)) {
        element.checked = configuration[element.id];
    } else {
        element.value = configuration[element.id];
    };
};

function resetElement(element) {
    if (isChecked(element)) {
        if (element.hasAttribute('checked')){
            element.checked = true;
        } else {
            element.checked = false;
        };
    }
    else {
        if (element.hasAttribute('value')) {
            element.value = element.getAttribute('value');
        } else {
            element.value = '';
        };
    };
};

// ---------------- Helper ----------------

function hasId(el) {
    return el.hasAttribute('id');
};

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

function isChecked(element) {
    const checked = [
        'checkbox',
        'radio'
    ];
    return checked.includes(element.type);
}

function isSaved(element) {
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
    return !notSaved.includes(element.type);
}
