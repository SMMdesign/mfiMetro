
//Initializing game data variables
var gameData = {
	version: '0.1',
	cookies: 0,
	cursors: 0,
	prestige: 0
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
			if (typeof saveGame.update === 'undefined') saveGame.update = gameData.update;
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




// Loading save
load();


















function cookieClick(number) {
	gameData.cookies += number;
	document.getElementById("cookies").innerHTML = gameData.cookies; 
}

function buyCursor(number) {
	var cursorCost = Math.floor(10 * Math.pow(1.1,gameData.cursors));
	if(gameData.cookies >= cursorCost) {
		gameData.cursors += number;
		gameData.cookies -= cursorCost;
		document.getElementById("cursors").innerHTML = gameData.cursors;
		document.getElementById("cookies").innerHTML = gameData.cookies;
	};
	var nextCost = Math.floor(10 * Math.pow(1.1,gameData.cursors));
	document.getElementById("cursorCost").innerHTML = nextCost;
}







// Game Loop
window.setInterval(function() {
	cookieClick(gameData.cursors);
	
}, 1000);


//Autosave Loop
window.setInterval(function() {
	save();
	
}, 10000);
