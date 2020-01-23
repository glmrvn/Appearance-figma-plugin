// ------------------------------------CONSTANTS---------------------------------------

const blue_day = "S:4e1fa5d96bfbd0c6da73af458b2be1b53aeb7099,1745:81"
const blue_night = "S:8361e8f9e0194f03489c14b346ea2e9279937e8f,1745:83"

const white = "S:bd34c5d8c651904906f6102b210fae0f1232d767,1745:79"
const black = "S:5950ec739048a26cf27906cefc6b52fabf98720c,1745:55"

const grey_20 = "S:6e987c306dd14728dfeac0099ea85b12766e7eb1,1745:61"
const grey_30 = "S:928bf1894b84b631db58dea67d2c8391de551f86,1745:63"
const grey_40 = "S:60ea61ea208c26a0c3cebfc54f2c6b0e5426b79a,1745:65"
const grey_80 = "S:ba452cb9cf790c6badbceca8ca36a038303a8599,1745:73"
const grey_96 = "S:d0d23f021daa2ea97f7495e70df5878e4ba577d3,1745:77"

// ------------------------------------FIND OBJECTS------------------------------------

const allSelection = figma.currentPage.selection[0].findAll()

// ------------------------------------REPLACE COLORS----------------------------------
for (let index in allSelection) {
    let frame = allSelection[index];
    //buttons
    if (frame.backgroundStyleId == blue_day && frame.type == "INSTANCE") {
        frame.backgroundStyleId = blue_night;
    }

    if (frame.fillStyleId == blue_day && (frame.type == "VECTOR" || frame.type == "RECTANGLE")) {
        frame.fillStyleId = blue_night;
    }
    //bg
    if (frame.fillStyleId == white && frame.type == "VECTOR" && frame.width >= 320) {
        frame.fillStyleId = grey_20;
    }

    if (frame.fillStyleId == white && (frame.type == "FRAME" || frame.type == "INSTANCE")) {
        frame.fillStyleId = grey_20;
    }

    if (frame.fillStyleId == white && frame.type == "RECTANGLE") {
        frame.fillStyleId = grey_20;
    }

    if (frame.fillStyleId == grey_80 && frame.type == "VECTOR") {
        frame.fillStyleId = grey_40;
    }

    //text
    if (frame.fillStyleId == black && frame.type == "TEXT") {
        frame.fillStyleId = grey_80;
    }

    if (frame.fillStyleId == grey_30 && frame.type == "TEXT") {
        frame.fillStyleId = grey_80;
    }

    if (frame.fillStyleId == blue_day && frame.type == "TEXT") {
        frame.fillStyleId = blue_night;
    }
    
}

// Close plugin
figma.closePlugin();