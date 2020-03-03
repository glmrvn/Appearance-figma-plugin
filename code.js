var day = "[day]"
var night = "[night]"
var allSelection
var colorsArray = []
var counter = 0
var object = {};
var objectLocal = {};

// GET LIBRARY COLORS
if (figma.command == 'get_colors') {

    if (figma.getLocalPaintStyles().length == 0){
        figma.closePlugin('😶 This document does not have colors style');
    } else {
        setPaints()
        colorsNumber()

        async function setPaints() {
            await figma.clientStorage.setAsync('allColors', figma.getLocalPaintStyles().map(a => a.key))
        }
    
        async function colorsNumber() {
            var allColors = await figma.clientStorage.getAsync('allColors')
            // console.log(allColors.length)
    
            if (allColors.length > 0){
                figma.closePlugin(`👌 Saved styles: ${allColors.length}`);
            } else {
                figma.closePlugin('😶 You dont have saved styles');
            }
        }
    }
}

// SELECTED DARK MODE
if (figma.command == 'dark') {

    async function getPaints() {
        var publicStyles = await figma.clientStorage.getAsync('allColors');
        var localStyles = figma.getLocalPaintStyles();

        var importStyles = []
        var days = {}
        var nights = {}

        if (publicStyles.length == 0 && localStyles.length == 0) {
            figma.closePlugin('😶 This document does not have color styles');

        } else {

            //Importing public styles
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
                if (name.includes(night)) {
                    const key = name.replace(night, '');
                    nights[key] = id;
                } else if (name.includes(day)) {
                    const key = name.replace(day, '');
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
            if (frame.strokeStyleId && object && object[frame.strokeStyleId]) {
                frame.strokeStyleId = object[frame.strokeStyleId];
                counter++;
            }
            if (frame.fillStyleId && objectLocal && objectLocal[frame.fillStyleId]) {
                frame.fillStyleId = objectLocal[frame.fillStyleId];
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
            figma.closePlugin(`😶 Selection does not have [day] colors`);
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
        var publicStyles = await figma.clientStorage.getAsync('allColors');
        var localStyles = figma.getLocalPaintStyles();

        var importStyles = []
        var days = {}
        var daysLocal = {}
        var nights = {}
        var nightsLocal = {}

        if (publicStyles.length == 0 && localStyles.length == 0) {
            figma.closePlugin('😶 This document does not have color styles');

        } else {

            //Importing public styles
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
                if (name.includes(night)) {
                    const key = name.replace(night, '');
                    nights[key] = id;
                    nightsLocal[key] = id.slice(0,43);
                } else if (name.includes(day)) {
                    const key = name.replace(day, '');
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
            if (frame.strokeStyleId && object && object[frame.strokeStyleId]) {
                frame.strokeStyleId = object[frame.strokeStyleId];
                counter++
            }
            if (frame.fillStyleId && objectLocal && objectLocal[frame.fillStyleId]) {
                frame.fillStyleId = objectLocal[frame.fillStyleId];
                counter++
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
            figma.closePlugin(`😶 Selection does not have [night] colors`);
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