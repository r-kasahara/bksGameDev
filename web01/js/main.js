/**
 * メイン動作
 */
const charaList = [];
let isRunning = false;

// 画面読み込み時処理
$(window).on('load', function() {
	// データロード
	console.log("load");
	load();
	
	// 1.2secごとに自動的に動作
	setInterval(turnAction,1200);

	// ゲームスタート
	console.log("start");
	isRunning = true;
});

// 入力受付
if(isRunning){
	// TODO：clickActionとかで反応する動作など
}

// データロード関数
function load(){

	// stage
	$("body").append(STAGE_DOM);

	// chara
	charaConfig.forEach((con, i)=>{
		let chara; 
		// Charaインスタンスを作成
		switch(con.role){
			case 'staff':
				chara = new Staff(con, i);
				break;
			case 'guest':
				chara = new Guest(con, i);
				break;
			default:
				// roleがない場合とりあえずCharaクラスを適用
				chara = new Chara(con, i);
		}
		// charaListに詰める
		charaList.push(chara);
	});
}

// ターンごとの自動アクション
function turnAction(){
	// charaList内のキャラを動かす
	charaList.forEach((chara)=>{
		if(chara.onStage){
			// stage上を移動
			chara.move();
		} else {
			// charaをstage上に表示
			chara.entry();
		}
	});
}


/**
 * キャラクターオブジェクト
 */
class Chara{
	pos = {"x": -1, "y": -1}; // 座標
	onStage = false; // stage上に表示されている状態か

	// コンストラクタ
	constructor(con, corY){
		this.name = con.name;
		this.role = con.role;
		this.corY = corY;
		// domを作る
		this.dom = $(`<div id="${this.name}" class="chara">
		<img src="assets/${this.name}.png">
		</div>`);
	}
	
	// charaをstage上に表示
	entry(){
		// ステージ上のランダムな位置に出現する
		let spawnPos = getRandomPosOnStage();
		this.dom.css('left', spawnPos['x']*TILE_SIZE + 'px');
		this.dom.css('top', (spawnPos['y']-this.corY)*TILE_SIZE + 'px');
		STAGE_DOM.append(this.dom);
		this.dom.addClass('on-stage');
		this.onStage = true;
		// 座標更新
		this.pos["x"] = spawnPos['x'];
		this.pos["y"] = spawnPos['y'];
	}

	// stage上を移動
	move(){
		// 現在地を取得
		let x = this.pos["x"];
		let y = this.pos["y"];
		// 移動方向決定
		let dir = [getRandomInt(2), getRandomInt(2)];
		let d;
		let muki;
		if(dir[0]){
			// 横方向移動
			if(x == 0 || x == STAGE_W_PT-1){
				// 壁にぶつかる場合逆方向へ
				d = x?-1:1;
			}else{
				d = dir[1]?1:-1;
			}
			muki = (d==1?charaMuki["right"]:charaMuki["left"])*TILE_SIZE;
			x += d;
		}else{
			// 縦方向移動
			if(y == 0 || y == STAGE_H_PT-1){
				// 壁にぶつかる場合逆方向へ
				d = y?-1:1;
			}else{
				d = dir[1]?1:-1;
			}
			muki = (d==1?charaMuki["bottom"]:charaMuki["top"])*TILE_SIZE;
			y += d;
		}
		// 向き
		let charaImg = this.dom.children('img');
		charaImg.css('top', muki + 'px');
		// 進行方向に他のものがなければ歩く
		let obj = getObjectOnPos(x, y);
		console.log(obj);
		if(!obj){
			let step = 0;
			let intId = setInterval(()=>{
				// てくてくする
				charaImg.css('left', charaWalk[step%2]*TILE_SIZE + 'px');
				// 移動をはじめる
				if(step==0){
					this.dom.css(
						dir[0]?'left':'top',
						(dir[0]?x:y-this.corY)*TILE_SIZE + 'px'
					);
				}
				step++;
			},250);
			// 歩き終わり
			setTimeout(()=>{
				clearInterval(intId);
				charaImg.css('left', charaWalk['stop']*TILE_SIZE + 'px');
			},1000);
			// 座標更新
			this.pos['x'] = x;
			this.pos['y'] = y;
		}
	}

	// domを画面から除く
	exit(){
		this.dom.removeClass('on-stage');
		this.dom.remove();
		this.onStage = false;
	}
}
// スタッフ
class Staff extends Chara{
	constructor(con, corY){
		super(con, corY);
	}

}
// ゲスト
class Guest extends Chara{
	constructor(con, corY){
		super(con, corY);
	}

}


/**
 * 値取得する用関数
 */

// stage上のランダムな座標を返す
function getRandomPosOnStage(){
	return {
		'x': getRandomInt(STAGE_W_PT),
		'y': getRandomInt(STAGE_H_PT)
	};
}

// 指定座標にあるモノを取得する
function getObjectOnPos(x, y){
	let ret;
	charaList.forEach((chara)=>{
		if(x == chara.pos['x'] && y == chara.pos['y']){
			console.log(`衝突！！`);
			ret = chara;
		}
	});
	return ret;
}


/**
 * 汎用関数
 */
function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}