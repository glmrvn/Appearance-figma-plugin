var day = "[day]";
var night = "[night]";
var allSelection;
var colorsArray = [];
var counter = 0;
var object = {};
var objectLocal = {};
var publicEffectStyles;
var allEffects;

setNamesToStorage()
async function setNamesToStorage() {
    var dayFromStorage = await figma.clientStorage.getAsync('dayFromStorage')
    var nightFromStorage = await figma.clientStorage.getAsync('nightFromStorage')

    if (typeof dayFromStorage === 'undefined') {
        await figma.clientStorage.setAsync('dayFromStorage', day)
    }
    if (typeof nightFromStorage === 'undefined') {
        await figma.clientStorage.setAsync('nightFromStorage', night)
    }
    // console.log(dayFromStorage)
}

// NAME SETTINGS UI
if (figma.command == 'name_settings_ui') {
    figma.showUI(__html__, { width: 240, height: 170 })

    sendToUI()
    async function sendToUI() {

        var dayFromStorage = await figma.clientStorage.getAsync('dayFromStorage')
        var nightFromStorage = await figma.clientStorage.getAsync('nightFromStorage')

        if (typeof dayFromStorage === 'undefined' || typeof nightFromStorage === 'undefined') {
            await figma.clientStorage.setAsync('dayFromStorage', day)
            await figma.clientStorage.setAsync('nightFromStorage', night)
        }
        // console.log(dayFromStorage)
        if (dayFromStorage.length > 0 || nightFromStorage.length > 0) {
            figma.ui.postMessage({ day: dayFromStorage, night: nightFromStorage })
        }
        // figma.ui.postMessage({ day: dayFromStorage, night: nightFromStorage })
    }
    

    // Recieving settings from UI
    figma.ui.onmessage = async (msg) => {
        if (msg.type === 'dayInput') {
            await figma.clientStorage.setAsync('dayFromStorage', msg.dayColor)
            figma.closePlugin('👌 Settings saved');
        }
        if (msg.type === 'nightInput') {
            await figma.clientStorage.setAsync('nightFromStorage', msg.nightColor)
        }
        if (msg.type === 'clearStorage') {
            await figma.clientStorage.setAsync('dayFromStorage', day)
            await figma.clientStorage.setAsync('nightFromStorage', night)
            // await figma.clientStorage.setAsync('dayFromStorage')
            // await figma.clientStorage.setAsync('nightFromStorage')
            // await figma.clientStorage.setAsync('allColors')
            // await figma.clientStorage.setAsync('allEffects')
            figma.closePlugin('😶 All settings were reset');
        }
    }
}

// GET LIBRARY COLORS
if (figma.command == 'get_colors') {

    if (figma.getLocalPaintStyles().length == 0){
        figma.closePlugin('😶 This document does not have styles');
    } else {
        setPaints()
        colorsNumber()

        async function setPaints() {
            await figma.clientStorage.setAsync('allColors', figma.getLocalPaintStyles().map(a => a.key))
            await figma.clientStorage.setAsync('allEffects', figma.getLocalEffectStyles().map(a => a.key))
        }
    
        async function colorsNumber() {
            var allColors = await figma.clientStorage.getAsync('allColors')
            // console.log(allColors.length)
    
            if (allColors.length > 0){
                figma.closePlugin(`👌 Styles saved`);
            } else {
                figma.closePlugin('😶 You don`t have saved styles');
            }
        }
    }
}

// SELECTED DARK MODE
if (figma.command == 'dark') {

    async function getPaints() {
        var publicColorStyles = await figma.clientStorage.getAsync('allColors');
        var publicEffectStyles = await figma.clientStorage.getAsync('allEffects');

        if (typeof publicColorStyles === 'undefined') {
            await figma.clientStorage.setAsync('allColors', "")
            // console.log(publicColorStyles)
        }
        if (typeof publicEffectStyles === 'undefined') {
            await figma.clientStorage.setAsync('allEffects', "")
        } else {
            var publicStyles = [...publicColorStyles, ...publicEffectStyles]
            // console.log(publicColorStyles)
        }

        var localColorStyles = figma.getLocalPaintStyles();
        var localEffectStyles = figma.getLocalEffectStyles();
        var localStyles = [...localColorStyles, ...localEffectStyles]
        // console.log(localStyles)

        var importStyles = []
        var days = {}
        var nights = {}

        var dayFromStorage = await figma.clientStorage.getAsync('dayFromStorage')
        var nightFromStorage = await figma.clientStorage.getAsync('nightFromStorage')

        if (typeof dayFromStorage === 'undefined') {
            dayFromStorage = day;
            // console.log(dayFromStorage)
        }

        if (typeof publicStyles === 'undefined' && localStyles.length == 0) {
            figma.closePlugin('😶 This document does not have styles');

        } else {
            for (let styleKey of publicStyles) {
                try {
                    var singleImportedStyle = await figma.importStyleByKeyAsync(styleKey);
                    importStyles.push(singleImportedStyle);
                } catch(error) {}
            }

            var allStyles = [...localStyles, ...importStyles]
            // console.log(allStyles)

            //Creating style couples
            for (let paintStyle of allStyles) {
                const name = paintStyle.name
                const id = paintStyle.id
                if (name.includes(nightFromStorage)) {
                    const key = name.replace(nightFromStorage, '');
                    nights[key] = id;
                } else if (name.includes(dayFromStorage)) {
                    const key = name.replace(dayFromStorage, '');
                    days[key] = id;
                }
            }

            Object.entries(days).forEach(([name, id]) => {
                object[id] = nights[name];
                // object[nights[name]] = id;
            });
    
            Object.entries(days).forEach(([name, id]) => {
                objectLocal[id.slice(0,43)] = nights[name];
            });
        }
    }

// Changing colors
    function findSelectedFrames() {
        if (figma.currentPage.selection.length == 0) {
            figma.closePlugin("🤔 No object selected. Please select any object");

        } else {
            try {
                var allSelection = figma.currentPage.selection[0].findAll();
            } catch(error) {
                var allSelection = [];
            }
            allSelection.unshift(figma.currentPage.selection[0]);
        }

        for (let frame of allSelection) {
            if (frame.fillStyleId && object && object[frame.fillStyleId]) {
                frame.fillStyleId = object[frame.fillStyleId];
                counter++;
            }
            if (frame.effectStyleId && object && object[frame.effectStyleId]) {
                frame.effectStyleId = object[frame.effectStyleId];
                counter++;
            }
            if (frame.strokeStyleId && object && object[frame.strokeStyleId]) {
                frame.strokeStyleId = object[frame.strokeStyleId];
                counter++;
            }
            if (frame.fillStyleId && objectLocal && objectLocal[frame.fillStyleId]) {
                frame.fillStyleId = objectLocal[frame.fillStyleId];
                counter++;
            }
            if (frame.effectStyleId && objectLocal && objectLocal[frame.effectStyleId]) {
                frame.effectStyleId = objectLocal[frame.effectStyleId];
                counter++;
            }
            if (frame.strokeStyleId && objectLocal && objectLocal[frame.strokeStyleId]) {
                frame.strokeStyleId = objectLocal[frame.strokeStyleId];
                counter++;
            }
        }
    }
//Checking day colors
    function notDayObjects() {
        if (counter == 0) {
            figma.closePlugin(`😶 Selection does not have style pairs`);
        }
    }

    getPaints().then(() => {
        findSelectedFrames();
        return 1;
    }
    ).then(() => {
        notDayObjects();
    }
    ).then(() => figma.closePlugin(`🤘🌗 Dark theme created!`));

}

// SELECTED LIGHT MODE
if (figma.command == 'light') {
    async function getPaints() {
        var publicColorStyles = await figma.clientStorage.getAsync('allColors');
        var publicEffectStyles = await figma.clientStorage.getAsync('allEffects');

        if (typeof publicColorStyles === 'undefined') {
            await figma.clientStorage.setAsync('allColors', "")
        }
        if (typeof publicEffectStyles === 'undefined') {
            await figma.clientStorage.setAsync('allEffects', "")
        } else {
            var publicStyles = [...publicColorStyles, ...publicEffectStyles]
            // console.log(publicStyles)
        }

        var localColorStyles = figma.getLocalPaintStyles();
        var localEffectStyles = figma.getLocalEffectStyles();
        var localStyles = [...localColorStyles, ...localEffectStyles]
        // console.log(localStyles)

        var importStyles = []
        var days = {}
        var nights = {}
        var daysLocal = {}
        var nightsLocal = {}

        var dayFromStorage = await figma.clientStorage.getAsync('dayFromStorage')
        var nightFromStorage = await figma.clientStorage.getAsync('nightFromStorage')

        if (typeof publicStyles === 'undefined' && localStyles.length == 0) {
            figma.closePlugin('😶 This document does not have styles');
        } else {
            for (let styleKey of publicStyles) {
                try {
                    var singleImportedStyle = await figma.importStyleByKeyAsync(styleKey);
                    importStyles.push(singleImportedStyle);
                } catch(error) {}
            }

            var allStyles = [...localStyles, ...importStyles]
            // console.log(allStyles)

            //Creating style couples
            for (let paintStyle of allStyles) {
                const name = paintStyle.name
                const id = paintStyle.id
                if (name.includes(nightFromStorage)) {
                    const key = name.replace(nightFromStorage, '');
                    nights[key] = id;
                    nightsLocal[key] = id.slice(0,43);
                } else if (name.includes(dayFromStorage)) {
                    const key = name.replace(dayFromStorage, '');
                    days[key] = id;
                    daysLocal[key] = id.slice(0,43);
                }
            }

            Object.entries(days).forEach(([name, id]) => {
                // object[id] = nights[name];
                object[nights[name]] = id;
            });

            Object.entries(daysLocal).forEach(([name, id]) => {
                objectLocal[nightsLocal[name]] = id;
            });
        }
    }

// Changing colors
    function findSelectedFrames() {
        if (figma.currentPage.selection.length == 0) {
            figma.closePlugin("🤔 No object selected. Please select any object");

        } else {
            try {
                var allSelection = figma.currentPage.selection[0].findAll();
            } catch(error) {
                var allSelection = [];
            }
            allSelection.unshift(figma.currentPage.selection[0]);
        }

        for (let frame of allSelection) {
            if (frame.fillStyleId && object && object[frame.fillStyleId]) {
                frame.fillStyleId = object[frame.fillStyleId];
                counter++
            }
            if (frame.effectStyleId && object && object[frame.effectStyleId]) {
                frame.effectStyleId = object[frame.effectStyleId];
                counter++;
            }
            if (frame.strokeStyleId && object && object[frame.strokeStyleId]) {
                frame.strokeStyleId = object[frame.strokeStyleId];
                counter++
            }
            if (frame.fillStyleId && objectLocal && objectLocal[frame.fillStyleId]) {
                frame.fillStyleId = objectLocal[frame.fillStyleId];
                counter++
            }
            if (frame.effectStyleId && objectLocal && objectLocal[frame.effectStyleId]) {
                frame.effectStyleId = objectLocal[frame.effectStyleId];
                counter++;
            }
            if (frame.strokeStyleId && objectLocal && objectLocal[frame.strokeStyleId]) {
                frame.strokeStyleId = objectLocal[frame.strokeStyleId];
                counter++
            }
        }
    }

//Checking night colors
    function notNightObjects() {
        if (counter == 0) {
            figma.closePlugin(`😶 Selection does not have style pairs`);
        }
    }

    getPaints().then(() => {
        findSelectedFrames();
        return 1;
    }
    ).then(() => {
        notNightObjects();
    }
    ).then(() => figma.closePlugin(`🤘🌖 Light theme created!`));
}