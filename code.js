var day = "[day]"
var night = "[night]"
var allSelection
var colorsArray = []

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
            }
        }
    }

    getPaints().then(() => {
        findSelectedFrames();
        return 1;
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
            // object[id] = nights[name];
            object[nights[name]] = id;
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
            }
        }
    }

    getPaints().then(() => {
        findSelectedFrames();
    }
    ).then(() => figma.closePlugin(`🤘🌖 Light theme created!`));
}