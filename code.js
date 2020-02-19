var day = "[day]"
var night = "[night]"
var allSelection
var colorsArray = []
var counter = 0

// GET LIBRARY COLORS
if (figma.command == 'get_colors') {
    async function setPaints() {
        await figma.clientStorage.setAsync('allColors', figma.getLocalPaintStyles().map(a => a.key))
    }

    async function colorsNumber() {
        var allColors = await figma.clientStorage.getAsync('allColors')
        console.log(allColors.length)

        if (allColors.length > 0){
            figma.closePlugin(`👌 Saved colors: ${allColors.length}`)
        } else { figma.closePlugin('😶 You dont have colors') }
    }

    setPaints()
    colorsNumber()
}

var object = {};
var objectLocal = {};

// SELECTED DARK MODE
if (figma.command == 'dark') {

    async function getPaints() {
        var allColors = await figma.clientStorage.getAsync('allColors')
        if (allColors.length == 0) {
            figma.closePlugin("Please add colors from library")
        }

        var days = {}
        var nights = {}
        for (let paintStyle of allColors) {
            const {name, id} = await figma.importStyleByKeyAsync(paintStyle).then((i) => ({name: i.name, id: i.id}));
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

// Changing colors
    function findSelectedFrames() {
        let allSelection = [];
        if (figma.currentPage.selection.length == 0) {
            figma.closePlugin("🤔 No object selected.")

        } else if (!["FRAME", "COMPONENT", "INSTANCE"].includes(figma.currentPage.selection[0].type)) {
            figma.closePlugin("👆🤓 Select frame or instance")

        } else {
            allSelection = figma.currentPage.selection[0].findAll();
            allSelection.unshift(figma.currentPage.selection[0])
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
        var allColors = await figma.clientStorage.getAsync('allColors')
        if (allColors.length == 0) {
            figma.closePlugin("Please add colors from library")
        }

        var days = {}
        var daysLocal = {}
        var nights = {}
        var nightsLocal = {}
        for (let paintStyle of allColors) {
            const {name, id} = await figma.importStyleByKeyAsync(paintStyle).then((i) => ({name: i.name, id: i.id}));
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

// Changing colors
    function findSelectedFrames() {
        let allSelection = [];
        if (figma.currentPage.selection.length == 0) {
            figma.closePlugin("🤔 No object selected.")

        } else if (!["FRAME", "COMPONENT", "INSTANCE"].includes(figma.currentPage.selection[0].type)) {
            figma.closePlugin("👆🤓 Select frame or instance")

        } else {
            allSelection = figma.currentPage.selection[0].findAll();
            allSelection.unshift(figma.currentPage.selection[0])
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