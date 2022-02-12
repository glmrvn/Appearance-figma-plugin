var day = "[day]";
var night = "[night]";
var allSelection;
var colorsArray = [];
var counter = 0;
var object = {};
var objectLocal = {};
var publicEffectStyles;
var allEffects;

const storageKeys = {
    ALL_COLORS: 'allColors',
    ALL_EFFECTS: 'allEffects',
    DAY: 'dayFromStorage',
    NIGHT: 'nightFromStorage',
}

const sliceId = (id) => id.slice(0, id.lastIndexOf(',') + 1)

setNamesToStorage()
async function setNamesToStorage() {
    var dayFromStorage = await figma.clientStorage.getAsync(storageKeys.DAY)
    var nightFromStorage = await figma.clientStorage.getAsync(storageKeys.NIGHT)

    if (typeof dayFromStorage === 'undefined') {
        await figma.clientStorage.setAsync(storageKeys.DAY, day)
    }
    if (typeof nightFromStorage === 'undefined') {
        await figma.clientStorage.setAsync(storageKeys.NIGHT, night)
    }
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
            var allColors = await figma.clientStorage.getAsync('allColors') || []
    
            if (allColors.length > 0){
                figma.closePlugin(`👌 Styles saved`)
            } else {
                figma.closePlugin('😶 You don`t have saved styles')
            }
        }
    }
}

async function getPaintsNew() {
    const publicColorStyles = await figma.clientStorage.getAsync(storageKeys.ALL_COLORS) || []
    const publicEffectStyles = await figma.clientStorage.getAsync(storageKeys.ALL_EFFECTS) || []
    
    const publicStyles = [...publicColorStyles, ...publicEffectStyles]

    const localColorStyles = figma.getLocalPaintStyles()
    const localEffectStyles = figma.getLocalEffectStyles()
    const localStyles = [...localColorStyles, ...localEffectStyles]

    const days = {}
    const nights = {}

    // getting identificator words
    const dayFromStorage = await figma.clientStorage.getAsync(storageKeys.DAY) || day
    const nightFromStorage = await figma.clientStorage.getAsync(storageKeys.NIGHT) || night

    if (typeof publicStyles.length == 0 && localStyles.length == 0) {
        figma.closePlugin('😶 This document does not have styles')
    } else {
        let importStyles = await Promise.all(
            publicStyles.map((styleKey) =>
                figma.importStyleByKeyAsync(styleKey)
                    .catch(() => {})
            )
        )
        if (importStyles[0] == undefined) importStyles = []

        const allStyles = [...localStyles, ...importStyles]

        //Creating style couples
        for (let paintStyle of allStyles) {
            let { name, id } = paintStyle
            
            if (name.includes(nightFromStorage)) {
                const key = name.replace(nightFromStorage, '')
                nights[key] = id
            } else if (name.includes(dayFromStorage)) {
                const key = name.replace(dayFromStorage, '')
                days[key] = id
            }
        }

        Object.entries(days).forEach(([name, id]) => {
            object[sliceId(id)] = nights[name]
        })

        Object.entries(days).forEach(([name, id]) => {
            objectLocal[sliceId(id)] = nights[name]
        })
        console.log(objectLocal)
    }
}

// SELECTED DARK MODE
if (figma.command == 'dark') {
    // Changing colors
    function findSelectedFrames() {
        if (figma.currentPage.selection.length == 0) {
            figma.closePlugin("🤔 No object selected. Please select any object")
        } else {
            let allSelection
            try {
                allSelection = figma.currentPage.selection[0].findAll()
            } catch(error) {
                allSelection = []
            }

            allSelection.unshift(figma.currentPage.selection[0])

            for (let frame of allSelection) {
                if (frame.fillStyleId !== figma.mixed && frame.fillStyleId && object && object[sliceId(frame.fillStyleId)]) {
                    frame.fillStyleId = object[sliceId(frame.fillStyleId)]
                    counter++
                }
                if (frame.effectStyleId !== figma.mixed && frame.effectStyleId && object && object[sliceId(frame.effectStyleId)]) {
                    frame.effectStyleId = object[sliceId(frame.effectStyleId)]
                    counter++
                }
                if (frame.strokeStyleId !== figma.mixed && frame.strokeStyleId && object && object[sliceId(frame.strokeStyleId)]) {
                    frame.strokeStyleId = object[sliceId(frame.strokeStyleId)]
                    counter++
                }
                if (frame.fillStyleId !== figma.mixed && frame.fillStyleId && objectLocal && objectLocal[frame.fillStyleId]) {
                    frame.fillStyleId = objectLocal[frame.fillStyleId]
                    counter++
                }
                if (frame.effectStyleId !== figma.mixed && frame.effectStyleId && objectLocal && objectLocal[frame.effectStyleId]) {
                    frame.effectStyleId = objectLocal[frame.effectStyleId]
                    counter++
                }
                if (frame.strokeStyleId !== figma.mixed && frame.strokeStyleId && objectLocal && objectLocal[frame.strokeStyleId]) {
                    frame.strokeStyleId = objectLocal[frame.strokeStyleId]
                    counter++
                }
            }
        }
    }

    //Checking day colors
    function notDayObjects() {
        if (counter == 0) {
            figma.closePlugin(`😶 Selection does not have style pairs`)
        }
    }

    getPaintsNew().then(() => {
        findSelectedFrames()
        return 1
    }
    ).then(() => {
        notDayObjects()
    }
    ).then(() => figma.closePlugin('🤘🌗 Dark theme created!'))
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

        var days = {}
        var nights = {}
        var daysLocal = {}
        var nightsLocal = {}

        var dayFromStorage = await figma.clientStorage.getAsync('dayFromStorage')
        var nightFromStorage = await figma.clientStorage.getAsync('nightFromStorage')

        if (typeof publicStyles === 'undefined' && localStyles.length == 0) {
            figma.closePlugin('😶 This document does not have styles');
        } else {
            var importStyles = await Promise.all(
                publicStyles.map((styleKey) =>
                    figma.importStyleByKeyAsync(styleKey)
                        .catch(() => {})
                )
            );

            if (importStyles[0] == undefined) {
                // console.log(importStyles)
                var importStyles = [];
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
            if (frame.fillStyleId !== figma.mixed && frame.fillStyleId && object && object[frame.fillStyleId]) {
                frame.fillStyleId = object[frame.fillStyleId];
                counter++
            }
            if (frame.effectStyleId !== figma.mixed && frame.effectStyleId && object && object[frame.effectStyleId]) {
                frame.effectStyleId = object[frame.effectStyleId];
                counter++;
            }
            if (frame.strokeStyleId !== figma.mixed && frame.strokeStyleId && object && object[frame.strokeStyleId]) {
                frame.strokeStyleId = object[frame.strokeStyleId];
                counter++
            }
            if (frame.fillStyleId !== figma.mixed && frame.fillStyleId && objectLocal && objectLocal[frame.fillStyleId]) {
                frame.fillStyleId = objectLocal[frame.fillStyleId];
                counter++
            }
            if (frame.effectStyleId !== figma.mixed && frame.effectStyleId && objectLocal && objectLocal[frame.effectStyleId]) {
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