// GET LIBRARY COLORS
if (figma.command == 'get_colors') {
    async function setPaints() {
        await figma.clientStorage.setAsync('allColors', figma.getLocalPaintStyles().map(a => a.key))
    }

    setPaints()
    figma.closePlugin()

}

// DARK MODE
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

                const rect = figma.createRectangle();
                rect.fillStyleId = id;
            }
        })
    }

    getPaints()
    figma.closePlugin()

}
