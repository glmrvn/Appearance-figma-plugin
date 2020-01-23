// ------------------------------------CONSTANTS---------------------------------------

const blue_day = "S:4e1fa5d96bfbd0c6da73af458b2be1b53aeb7099,1745:81"
const blue_night = "S:8361e8f9e0194f03489c14b346ea2e9279937e8f,1745:83"

// ------------------------------------FIND OBJECTS------------------------------------

const allSelection = figma.currentPage.selection[0].findAll()


for (let index in allSelection) {
    let frame = allSelection[index];
    //buttons
    if (frame.backgroundStyleId == blue_day && frame.type == "INSTANCE") {
        frame.backgroundStyleId = blue_night;
    }

    if (frame.fillStyleId == blue_day && frame.type == "VECTOR") {
        frame.fillStyleId = blue_night;
    }
}

// Close plugin
figma.closePlugin();