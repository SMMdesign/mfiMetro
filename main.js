
// Initializing game data variables
var gameData = {
	version: '0.1',
	cookies: 0,
	cursors: 0,
	prestige: 0
}


function update(id, content) {
  document.getElementById(id).innerHTML = content;
}



// Defining save function
function save() {
	localStorage.setItem("mfiSave",JSON.stringify(gameData));	// mfiSave is name of locally stored data
	console.log('Game Saved!');
}


// Defining load function
function load() {
	var saveGame = JSON.parse(localStorage.getItem("mfiSave"));	//saveGame is the decoded save
	if (saveGame !==null) {
		if (saveGame.version !== gameData.version) {
			if (typeof saveGame.version === 'undefined') saveGame.version = gameData.version;
			if (typeof saveGame.cookies === 'undefined') saveGame.cookies = gameData.cookies;
			if (typeof saveGame.cursors === 'undefined') saveGame.cursors = gameData.cursors;
			if (typeof saveGame.prestige === 'undefined') saveGame.prestige = gameData.prestige;
		}
		gameData = saveGame;
		refresh();
		console.log('Game Loaded!');
	}
}


// Defining delete save function
function deleteSave() {
	localStorage.removeItem("mfiSave");
	console.log('Save Deleted!');
	location.reload();
}


// Defining refresh function to update page after loading game
function refresh() {
	cookieClick(0);
	buyCursor(0);
	
}




// INITIAL GAME LOAD
load();
update("titleVer", gameData.version);













// GAME FUNCTIONS


function cookieClick(number) {
	gameData.cookies += number;
	update("cookies", gameData.cookies.toLocaleString("en-US"));
}

function buyCursor(number) {
	var cursorCost = Math.floor(10 * (1.1 ** gameData.cursors));
	if(gameData.cookies >= cursorCost) {
		gameData.cursors += number;
		gameData.cookies -= cursorCost;
		update("cursors", gameData.cursors.toLocaleString("en-US"));
		update("cookies", gameData.cookies.toLocaleString("en-US"));
	};
	var nextCost = Math.floor(10 * (1.1 ** gameData.cursors));
	update("cursorCost", nextCost.toLocaleString("en-US"))

}







// Game Loop
window.setInterval(function() {
	cookieClick(gameData.cursors);
	
}, 1000);


//Autosave Loop
window.setInterval(function() {
	save();
	
}, 10000);
