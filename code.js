var day = '[day]'
var night = '[night]'
var allSelection
var colorsArray = []
var counter = 0
var object = {}
var objectLocal = {}

const storageKeys = {
    ALL_COLORS: 'allColors',
    ALL_EFFECTS: 'allEffects',
    DAY: 'dayFromStorage',
    NIGHT: 'nightFromStorage',
}

const sliceId = (id) => id.slice(0, id.lastIndexOf(',') + 1)

initPlugin()

async function initPlugin() {
    var dayFromStorage = await figma.clientStorage.getAsync(storageKeys.DAY)
    var nightFromStorage = await figma.clientStorage.getAsync(storageKeys.NIGHT)

    if (typeof dayFromStorage === 'undefined') {
        await figma.clientStorage.setAsync(storageKeys.DAY, day)
    }
    if (typeof nightFromStorage === 'undefined') {
        await figma.clientStorage.setAsync(storageKeys.NIGHT, night)
    }
}

// Settings UI
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
        
        if (dayFromStorage.length > 0 || nightFromStorage.length > 0) {
            figma.ui.postMessage({ day: dayFromStorage, night: nightFromStorage })
        }
    }
    

    // Receiving settings from UI
    figma.ui.onmessage = async (msg) => {
        if (msg.type === 'dayInput') {
            await figma.clientStorage.setAsync('dayFromStorage', msg.dayColor)
            figma.closePlugin('👌 Settings saved')
        }
        if (msg.type === 'nightInput') {
            await figma.clientStorage.setAsync('nightFromStorage', msg.nightColor)
        }
        if (msg.type === 'clearStorage') {
            await figma.clientStorage.setAsync('dayFromStorage', day)
            await figma.clientStorage.setAsync('nightFromStorage', night)
            figma.closePlugin('😶 All settings were reset')
        }
    }
}

// Getting styles
if (figma.command == 'get_colors') {
    if (figma.getLocalPaintStyles().length == 0){
        figma.closePlugin('😶 This document does not have styles')
    } else {
        saveStylesToStorage()
        verifyStylesSaved()

        async function saveStylesToStorage() {
            await figma.clientStorage.setAsync(storageKeys.ALL_COLORS, figma.getLocalPaintStyles().map(a => a.key))
            await figma.clientStorage.setAsync(storageKeys.ALL_EFFECTS, figma.getLocalEffectStyles().map(a => a.key))
        }
    
        async function verifyStylesSaved() {
            var allColors = await figma.clientStorage.getAsync(storageKeys.ALL_COLORS) || []
    
            if (allColors.length > 0){
                figma.closePlugin('👌 Styles saved')
            } else {
                figma.closePlugin('😶 You don\'t have saved styles')
            }
        }
    }
}

async function collectPaintStyles(toNight) {
    const publicColorStyles = await figma.clientStorage.getAsync(storageKeys.ALL_COLORS) || []
    const publicEffectStyles = await figma.clientStorage.getAsync(storageKeys.ALL_EFFECTS) || []
    
    const publicStyles = [...publicColorStyles, ...publicEffectStyles]

    const localColorStyles = figma.getLocalPaintStyles()
    const localEffectStyles = figma.getLocalEffectStyles()
    const localStyles = [...localColorStyles, ...localEffectStyles]

    // Getting identificator words
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

        const allStyles = [...localStyles, ...importStyles].filter((style) => style !== undefined)
        const days = {}
        const nights = {}

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

        if (toNight) {
            Object.entries(days).forEach(([name, id]) => {
                object[sliceId(id)] = nights[name]
            })
            Object.entries(days).forEach(([name, id]) => {
                objectLocal[id] = nights[name]
            })
        } else {
            Object.entries(nights).forEach(([name, id]) => {
                object[sliceId(id)] = days[name]
            })
            Object.entries(nights).forEach(([name, id]) => {
                objectLocal[id] = days[name]
            })
        }
    }
}

function applySwappedStyles() {
    if (figma.currentPage.selection.length == 0) {
        figma.closePlugin('🤔 No object selected. Please select any object')
    } else {

        //Getting all nodes from selection
        let allSelection = []
        let visited = new Set()
        let stack = []
        
        const dfs = (node) => {
            stack.push(node)
            while (stack.length != 0) {
               node = stack.pop()
               if (!visited.has(node.id)) {
                  visited.add(node.id)
                  allSelection.push(node)
                  try { node.findAll().forEach((sel) => { stack.push(sel) }) } 
                  catch (error) {}
                }
            }
       }
       figma.currentPage.selection.forEach((sel) => { dfs(sel) })

        //Changing styles
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

function checkIfAnyStylesSwapped() {
    if (counter == 0) {
        figma.closePlugin('😶 Selection does not have style pairs')
    }
}

// Dark mode
if (figma.command == 'dark') {
    collectPaintStyles(true)
        .then(() => {
            applySwappedStyles()
            return 1
        })
        .then(() => { checkIfAnyStylesSwapped() })
        .then(() => figma.closePlugin('🤘🌗 Dark theme created!'))
}

// Light mode
if (figma.command == 'light') {
    collectPaintStyles(false)
        .then(() => {
            applySwappedStyles()
            return 1
        })
        .then(() => { checkIfAnyStylesSwapped() })
        .then(() => figma.closePlugin('🤘🌖 Light theme created!'))
}