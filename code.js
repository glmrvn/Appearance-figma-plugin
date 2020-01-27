// -------------------------------COLOR CONSTANTS---------------------------------------

//Text
const text_primary_day = "S:9bd11703320c3134910979aea3b38a6d5fd90653,4246:2"
const text_primary_night = "S:5f447c44b63b5f637dda6899745949c2732e3fc8,4246:4"

const text_secondary_day = "S:5341fcb211e7c768833cbd7125b8b29881c5b89f,4246:6"
const text_secondary_night = "S:595185e9be5bc515a87a8424ce70aeae517ce7cd,4246:8"

const text_additional_day = "S:a05d2acbe5346a6baaef242893c57f14df1883f5,4246:10"
const text_additional_night = "S:8b6e2f95c03b079a723d3e8d669a1c0b49d57a11,4246:11"

const text_buttons_day = "S:b4e5f8d9f4f98303446bc9aae18123338d96e38f,4248:14"
const text_buttons_night = "S:cec9bea29e2aafea90575f6b4cec638284237ba2,4248:16"

const actions_buttons_day = "S:ffca6308d4826c1af59bd8c5db879c73f9f3136f,4248:18"
const actions_buttons_night = "S:8f5baf69bd0556c978b6a62678f28a4cd700cfeb,4248:20"

const actions_attention_day = "S:796f3331c5aed232ed8dcb33899b2c1d7e630a8f,4248:22"
const actions_attention_night = "S:691d81d027815e4d666d1324d308b38450dee4e5,4248:24"

//BG
const bg_primary_day = "S:9bd11703320c3134910979aea3b38a6d5fd90653,4246:2"
const bg_primary_night = "S:dfafa66499e5e8052454d129fd232da41a9d05b2,4248:52"

const bg_secondary_day = "S:61fb74a6cb3712bcdefbae662f136cea9f4b02cb,4248:54"
const bg_secondary_night = "S:c9a7ada56e4c0f4fa89e473fdf875fc91296633d,4248:56"

const bg_separator_day = "S:e9e0e9afe3459c449a8fed53f511e385eece1d4d,4248:58"
const bg_separator_night = "S:aafc5ad7264de2cb0c8c5d63ba1c47af762ea95f,4248:60"

//Icons
const icons_primary_day = "S:6546491c351e9f68568edb16596080020edb03ea,4248:30"
const icons_primary_night = "S:54355b0ac71b9aef3c66ea9ca1d75871cdae16b8,4248:32"

const icons_secondary_day = "S:dd33f411fedf7a2e8635e102517f874a3758cb55,4248:34"
const icons_secondary_night = "S:9556f848f41e7890cec3d0a6c27005b3aa5a0877,4248:36"

const icons_additional_day = "S:35fe8548b4bc5d1b05b9df4f8f266fb60cf8b94f,4248:38"
const icons_additional_night = "S:a8ff701003a1ed5c70288b810fd393e1a2cb871d,4248:40"

const icons_actions_day = "S:c591947501ae673aba79400fd13c9ca3907ef81a,4248:42"
const icons_actions_night = "S:ba9f86a90ddf1bc63a2e13eb7a35a65788b75254,4248:44"

//Buttons
const buttons_primary_day = "S:52d48bd5f70f9fd01d49254d93ce541540ce7712,4260:1"
const buttons_primary_night = "S:01b5175e9405ad39b1a141e57a770118f1d2c67c,4260:3"

const buttons_secondary_day = "S:d0e0a6cb39568ad7aea9ae6109db460715362f2d,4260:5"
const buttons_secondary_night = "S:f156c8876c68b1abb896e2bbc0ac6dec3913e2a4,4260:7"

const buttons_accent_day = "S:cd55021ff456b631f38ffe791c9867c7a4d8e087,4260:9"
const buttons_accent_night = "S:370b6f6710b3d3433a2b9be108faa7b60f77be2a,4260:11"

const buttons_gp_day = "S:8505cd0a02441a477aeeceb3a6c4da157855454a,4260:13"
const buttons_gp_night = "S:cdf1657be0c730cb7ec0bc885951e794f81dc243,4260:15"

// -------------------------------ERROR NOTIFICATION------------------------------------
if (figma.currentPage.selection.length == 0) {
    figma.closePlugin("🤔 You are not selected items.")
} else {
    var allSelection = figma.currentPage.selection[0].findAll()
    allSelection.unshift(figma.currentPage.selection[0])
}

// ------------------------------------FIND OBJECTS------------------------------------

// var allSelection = figma.currentPage.selection[0].findAll()
// allSelection.unshift(figma.currentPage.selection[0])

// ------------------------------------REPLACE COLORS----------------------------------
for (let index in allSelection) {
    let frame = allSelection[index];

    //Text
    if (frame.fillStyleId == text_primary_day) {
        frame.fillStyleId = text_primary_night;
    }
    if (frame.fillStyleId == text_secondary_day) {
        frame.fillStyleId = text_secondary_night;
    }

}

// Close plugin
figma.closePlugin();