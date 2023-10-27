/**
 * ステージ設定
 */
const STAGE_W_PT = 10;
const STAGE_H_PT = 10;
const TILE_SIZE = 32;
const STAGE_DOM = $(`<div id="stage"></div>`);
STAGE_DOM.css("width", STAGE_W_PT*TILE_SIZE + "px");
STAGE_DOM.css("height", STAGE_H_PT*TILE_SIZE + "px");
STAGE_DOM.css("margin", "10px");
STAGE_DOM.css("background-image", "url(assets/bg.png)");
STAGE_DOM.css("background-repeat", "repeat");
STAGE_DOM.css("overflow", "hidden");

/**
 * キャラクター設定
 */
const charaConfig = [
    {'name': 'tora', 'role': 'staff'},
    {'name': 'maco', 'role': 'staff'},
    {'name': 'mob', 'role': 'guest'},
    {'name': 'tora', 'role': 'staff'},
    {'name': 'maco', 'role': 'staff'},
    {'name': 'mob', 'role': 'guest'}
];
// キャラ画像座標 
const charaMuki = {
    'bottom': 0,
    'left': -1,
    'right': -2,
    'top': -3
};
const charaWalk = {
    0: 0,
    1: -2,
    'stop': -1
};