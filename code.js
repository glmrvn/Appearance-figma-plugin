// -------------------------------COLOR CONSTANTS---------------------------------------

//Text
const text_primary_day = "S:9bd11703320c3134910979aea3b38a6d5fd90653,4569:0"
const text_primary_night = "S:5f447c44b63b5f637dda6899745949c2732e3fc8,4569:20"

const text_secondary_day = "S:5341fcb211e7c768833cbd7125b8b29881c5b89f,4569:1"
const text_secondary_night = "S:595185e9be5bc515a87a8424ce70aeae517ce7cd,4569:21"

const text_additional_day = "S:a05d2acbe5346a6baaef242893c57f14df1883f5,4569:2"
const text_additional_night = "S:8b6e2f95c03b079a723d3e8d669a1c0b49d57a11,4569:22"

const text_buttons_day = "S:b4e5f8d9f4f98303446bc9aae18123338d96e38f,4569:3"
const text_buttons_night = "S:cec9bea29e2aafea90575f6b4cec638284237ba2,4569:23"

const actions_buttons_day = "S:ffca6308d4826c1af59bd8c5db879c73f9f3136f,4569:4"
const actions_buttons_night = "S:8f5baf69bd0556c978b6a62678f28a4cd700cfeb,4569:24"

const actions_attention_day = "S:796f3331c5aed232ed8dcb33899b2c1d7e630a8f,4569:5"
const actions_attention_night = "S:691d81d027815e4d666d1324d308b38450dee4e5,4569:25"

const text_color_bg_day = "S:71f537806ca17691482fb338144423a7a0635497,4569:6"
const text_color_bg_night = "S:33c3e190c2cdc0a883adccadd05b252d3b714943,4569:26"

//BG
const bg_primary_day = "S:e1a2d66a7b683f05a2e8752ece127db0d4322756,4569:13"
const bg_primary_night = "S:dfafa66499e5e8052454d129fd232da41a9d05b2,4569:34"

const bg_additional_day = "S:61fb74a6cb3712bcdefbae662f136cea9f4b02cb,4569:14"
const bg_additional_night = "S:c9a7ada56e4c0f4fa89e473fdf875fc91296633d,4570:0"

const bg_separator_day = "S:e9e0e9afe3459c449a8fed53f511e385eece1d4d,4569:15"
const bg_separator_night = "S:aafc5ad7264de2cb0c8c5d63ba1c47af762ea95f,4569:32"

//Icons
const icons_primary_day = "S:6546491c351e9f68568edb16596080020edb03ea,4569:7"
const icons_primary_night = "S:54355b0ac71b9aef3c66ea9ca1d75871cdae16b8,4569:27"

const icons_secondary_day = "S:dd33f411fedf7a2e8635e102517f874a3758cb55,4569:8"
const icons_secondary_night = "S:9556f848f41e7890cec3d0a6c27005b3aa5a0877,4569:38"

const icons_additional_day = "S:35fe8548b4bc5d1b05b9df4f8f266fb60cf8b94f,4569:9"
const icons_additional_night = "S:a8ff701003a1ed5c70288b810fd393e1a2cb871d,4569:37"

const icons_actions_day = "S:c591947501ae673aba79400fd13c9ca3907ef81a,4569:11"
const icons_actions_night = "S:ba9f86a90ddf1bc63a2e13eb7a35a65788b75254,4569:36"

const icons_color_bg_day = "S:8115d3bb911a36c791a159faf003f12bd2f486e2,4569:12"
const icons_color_bg_night = "S:a7d33e4b7096b3ca7ad521bbd4392fcaf4b022f0,4569:35"

//Buttons
const buttons_primary_day = "S:52d48bd5f70f9fd01d49254d93ce541540ce7712,4569:16"
const buttons_primary_night = "S:01b5175e9405ad39b1a141e57a770118f1d2c67c,4569:31"

const buttons_secondary_day = "S:d0e0a6cb39568ad7aea9ae6109db460715362f2d,4569:17"
const buttons_secondary_night = "S:f156c8876c68b1abb896e2bbc0ac6dec3913e2a4,4569:30"

const buttons_accent_day = "S:cd55021ff456b631f38ffe791c9867c7a4d8e087,4569:18"
const buttons_accent_night = "S:370b6f6710b3d3433a2b9be108faa7b60f77be2a,4569:29"

const buttons_gp_day = "S:8505cd0a02441a477aeeceb3a6c4da157855454a,4569:19"
const buttons_gp_night = "S:cdf1657be0c730cb7ec0bc885951e794f81dc243,4569:28"

//Map
const map_day = "S:e37c0e16af4aa924466f62b0c52c709d58cdd780,1744:8"
const map_night = "S:f12d09c339332a37d25d4b06bd6cff9afaa0bac4,1744:17"

// // UI

// figma.showUI(__html__, { width: 300, height: 150 })

// // Recieving token from UI
// figma.ui.onmessage = (message) => {
//     var token = message
//     console.log(token)
// }
// var allColorStyles = figma.getLocalPaintStyles()
// -------------------------------ERROR NOTIFICATION------------------------------------
if (figma.currentPage.selection.length == 0) {
    figma.closePlugin("🤔 No object selected.")
} else {
    const allSelection = figma.currentPage.selection[0].findAll()
    allSelection.unshift(figma.currentPage.selection[0])
    var allObjectsCount = allSelection.length

// ------------------------------------REPLACE COLORS----------------------------------
    for (let index in allSelection) {
        let frame = allSelection[index];
        var counter = 0;

        //Text
        if (frame.fillStyleId == text_primary_day) {
            frame.fillStyleId = text_primary_night
            counter++
        }
        if (frame.fillStyleId == text_secondary_day) {
            frame.fillStyleId = text_secondary_night
            counter++
        }
        if (frame.fillStyleId == text_additional_day) {
            frame.fillStyleId = text_additional_night
            counter++
        }
        if (frame.fillStyleId == text_buttons_day) {
            frame.fillStyleId = text_buttons_night
            counter++
        }
        if (frame.fillStyleId == actions_buttons_day) {
            frame.fillStyleId = actions_buttons_night
            counter++
        }
        if (frame.fillStyleId == actions_attention_day) {
            frame.fillStyleId = actions_attention_night
            counter++
        }
        if (frame.fillStyleId == text_color_bg_day) {
            frame.fillStyleId = text_color_bg_night
            counter++
        }

        //BG
        if (frame.fillStyleId == bg_primary_day) {
            frame.fillStyleId = bg_primary_night
            counter++
        }
        if (frame.fillStyleId == bg_additional_day) {
            frame.fillStyleId = bg_additional_night
            counter++
        }
        if (frame.fillStyleId == bg_separator_day) {
            frame.fillStyleId = bg_separator_night
            counter++
        }

        //Icons
        if (frame.fillStyleId == icons_primary_day) {
            frame.fillStyleId = icons_primary_night
            counter++
        }
        if (frame.fillStyleId == icons_secondary_day) {
            frame.fillStyleId = icons_secondary_night
            counter++
        }
        if (frame.fillStyleId == icons_additional_day) {
            frame.fillStyleId = icons_additional_night
            counter++
        }
        if (frame.fillStyleId == icons_actions_day) {
            frame.fillStyleId = icons_actions_night
            counter++
        }
        if (frame.fillStyleId == icons_color_bg_day) {
            frame.fillStyleId = icons_color_bg_night
            counter++
        }

        //Buttons
        if (frame.fillStyleId == buttons_primary_day) {
            frame.fillStyleId = buttons_primary_night
            counter++
        }
        if (frame.fillStyleId == buttons_secondary_day) {
            frame.fillStyleId = buttons_secondary_night
            counter++
        }
        if (frame.fillStyleId == buttons_accent_day) {
            frame.fillStyleId = buttons_accent_night
            counter++
        }
        if (frame.fillStyleId == buttons_gp_day) {
            frame.fillStyleId = buttons_gp_night
            counter++
        }
    
        //Map
        if (frame.fillStyleId == map_day) {
            frame.fillStyleId = map_night
            counter++
    }

    // Calculate unchanged objects
    var unchanedObjects = allObjectsCount-counter

    // Close plugin
    figma.closePlugin(`🤘🌗 Dark theme created!`)
    // figma.closePlugin(`🌑 Dark! Unchanged: ${unchanedObjects}`)
}
console.log(counter);
figma.closePlugin()