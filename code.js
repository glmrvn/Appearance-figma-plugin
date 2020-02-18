var day = "[day]"
var night = "[night]"
var allSelection

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
    // figma.closePlugin()
}

// SELECTED DARK MODE
if (figma.command == 'dark') {

    async function getPaints() {
        var allColors = await figma.clientStorage.getAsync('allColors')
        console.log(allColors)

        if (allColors.length == 0) {
            figma.closePlugin("Please add colors from library")
        }

        allColors.forEach((paint_style, i) => {
            createRect()
            async function createRect() {
                var id = await figma.importStyleByKeyAsync(paint_style).then(i => i.id)

                const rect = figma.createRectangle()
                rect.fillStyleId = id
                rect.remove()
            }
        })
    }

// Changing colors
    function findSelectedFrames() {
        if (figma.currentPage.selection.length == 0) {
            figma.closePlugin("🤔 No object selected.")
        
        } else if (!["FRAME", "COMPONENT", "INSTANCE"].includes(figma.currentPage.selection[0].type)) {
            figma.closePlugin("👆🤓 Select frame or instance")
        
        } else {
            const allSelection = figma.currentPage.selection[0].findAll()
            allSelection.unshift(figma.currentPage.selection[0])
        }

        for (let index in allSelection) {
            let frame = allSelection[index];

            if (frame.fillStyleId == text_primary_day) {
                frame.fillStyleId = text_primary_night
            }
        }
    }

    getPaints()
    findSelectedFrames()
    figma.closePlugin()

}

// SELECTED LIGHT MODE
if (figma.command == 'light') {
    figma.closePlugin()
}