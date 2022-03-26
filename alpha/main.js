/*
* MFI Metro
* Copyright (C) 2022 Shandra McCollough <shandramccollough@gmail.com>
 */


// Initializing game data variables
var gameData = {
	version: 0.51,
	money: 50000,
	ticketPrice: 100,
	passengers: 0,
	ginza: 			{ line: 0, stations: 0, locomotives: 0, cars: 0 },
	marunouchi: 	{ line: 0, stations: 0, locomotives: 0, cars: 0 },
	hibiya: 			{ line: 0, stations: 0, locomotives: 0, cars: 0 },
	tozai: 			{ line: 0, stations: 0, locomotives: 0, cars: 0 },
	chiyoda: 		{ line: 0, stations: 0, locomotives: 0, cars: 0 },
	yurakucho: 	{ line: 0, stations: 0, locomotives: 0, cars: 0 },
	hanzomon: 	{ line: 0, stations: 0, locomotives: 0, cars: 0 },
	namboku: 		{ line: 0, stations: 0, locomotives: 0, cars: 0 },
	fukutoshin: 	{ line: 0, stations: 0, locomotives: 0, cars: 0 },
	bXP: 0,
	prestige:		{ upgrade1Lvl: 0, upgrade2Lvl: 0, upgrade3Lvl: 0, upgrade4Lvl: 0, upgrade5Lvl: 0, upgrade6Lvl: 0 }

}	// remember to add new variables to load function, even ones in nested objects
	// remember to check compatibility with prestige resetting function


// non gameData variables
var pps = 0;
var maxPassengers = 0;
var mps = 0;
var unrealizedPrestige = 0;
var lineCost = 0;			// dont forget this exists

// constants for base values
const ticketPriceEqConst = 200;
const ticketPriceMaxConst = 1000;
const ppsPerStatConst = 5;
const locoPerStatConst = 1;
const carPerLocoConst = 6;
const passPerCarConst = 100;
const statPerLine = 4;


// variables than can be changed by upgrades
var ticketPriceEq = ticketPriceEqConst;
var ticketPriceMax = ticketPriceMaxConst;
var ppsPerStat = ppsPerStatConst;
var locoPerStat = locoPerStatConst;
var carPerLoco = carPerLocoConst;
var passPerCar = passPerCarConst;










// Defining save function
function save() {
	localStorage.setItem("mfiSave",JSON.stringify(gameData));	// mfiSave is name of locally stored data
	console.log('Game Saved!');
}


// Defining load function
function load() {
	var saveGame = JSON.parse(localStorage.getItem("mfiSave"));	// saveGame is the decoded save
	if (saveGame !==null) {	// runs if player has a save file
		if (saveGame.version !== gameData.version) { // runs if the save is out of date
			// removing support for saves before 0.50
			if (saveGame.version < 0.5 || isNaN(saveGame.version) ) {
				alert('MFI Metro v0.5 is incompatible with previous version saves. Your progress will be reset.');
				saveGame = gameData;
			}
		
			if (typeof saveGame.version === 'undefined') saveGame.version = gameData.version;
			if (typeof saveGame.money === 'undefined') saveGame.money = gameData.money;
			if (typeof saveGame.ticketPrice === 'undefined') saveGame.ticketPrice = gameData.ticketPrice;
			if (typeof saveGame.passengers === 'undefined') saveGame.passengers = gameData.passengers;
			if (typeof saveGame.ginza === 'undefined') saveGame.ginza = gameData.ginza;
			if (typeof saveGame.marunouchi === 'undefined') saveGame.marunouchi = gameData.marunouchi;
			if (typeof saveGame.hibiya === 'undefined') saveGame.hibiya = gameData.hibiya;
			if (typeof saveGame.tozai === 'undefined') saveGame.tozai = gameData.tozai;
			if (typeof saveGame.chiyoda === 'undefined') saveGame.chiyoda = gameData.chiyoda;
			if (typeof saveGame.yurakucho === 'undefined') saveGame.yurakucho = gameData.yurakucho;
			if (typeof saveGame.hanzomon === 'undefined') saveGame.hanzomon = gameData.hanzomon;
			if (typeof saveGame.namboku === 'undefined') saveGame.namboku = gameData.namboku;
			if (typeof saveGame.fukutoshin === 'undefined') saveGame.fukutoshin = gameData.fukutoshin;
			if (typeof saveGame.bXP === 'undefined') saveGame.bXP = gameData.bXP;
			if (typeof saveGame.prestige === 'undefined') saveGame.prestige = gameData.prestige;
			// if (typeof saveGame.prestige.upgrade1Lvl === 'undefined') saveGame.prestige.upgrade1Lvl = gameData.prestige.upgrade1Lvl;

			
			saveGame.version = gameData.version;
			console.log(`saveGame has been updated to ${gameData.version}`);
		}
		gameData = saveGame;	// loading the player's save data into the game
		refresh();	// visually refreshing values
		console.log('Game Loaded!');
	}
}


// Defining delete save function
function deleteSave() {
	clearInterval(autosaveLoop);
	if(confirm("This will delete your progress, are you sure?") === true) {
		localStorage.removeItem("mfiSave");
		console.log('Save Deleted!');
		location.reload();
	} else {
		console.log('Delete Cancelled.')
		location.reload();
	}
}




// General tools

function update(id, content) {
  document.getElementById(id).innerHTML = content;
}

function show(id) {
	document.getElementById(id).style.display = "inline-block"; 
}

function hide(id) {
	document.getElementById(id).style.display = "none"; 
}

function changeAccentColor() {
	let accentColor = prompt("Enter a HEX color","#40CFFF");
	if(!accentColor.match(/^#[0-9A-F]{6}$/i) ) {
		alert("Please enter a valid HEX color."); return;
	}
	document.documentElement.style.setProperty('--accentColor', accentColor);
}




// navigation tools


function goToTab(tab) {
	hide("linesTab");
	document.getElementById("linesTabButton").setAttribute("class", "button nav")
	hide("prestigeTab");
	document.getElementById("prestigeTabButton").setAttribute("class", "button nav")
	hide("optionsTab");
	document.getElementById("optionsTabButton").setAttribute("class", "button nav")

	if(tab === 'linesTab') {
		document.getElementById("linesTab").style.display = "block"; 
		document.getElementById("linesTabButton").setAttribute("class", "button nav active")
		refresh();
	}
	if(tab === 'prestigeTab') {
		document.getElementById("prestigeTab").style.display = "block"; 
		document.getElementById("prestigeTabButton").setAttribute("class", "button nav active")
		refreshPrestige();	// in theory, prestige should only need to be updated here
	}
	if(tab === 'optionsTab') {
		document.getElementById("optionsTab").style.display = "block"; 
		document.getElementById("optionsTabButton").setAttribute("class", "button nav active")
	}
}













// line refresh functions

function refreshGinza() {
	update("ginStations", format(gameData.ginza.stations) );
	ginStationCost = calcStationCost(gameData.ginza.stations);
	update("ginStationCost", format(ginStationCost));
	update("ginLocomotives", format(gameData.ginza.locomotives) );
	update("ginMaxLocomotives", format(gameData.ginza.stations * locoPerStat) );
	ginLocomotiveCost = calcLocomotiveCost(gameData.ginza.locomotives);
	update("ginLocomotiveCost", format(ginLocomotiveCost));
	update("ginCars", format(gameData.ginza.cars) );
	update("ginMaxCars", format(gameData.ginza.locomotives * carPerLoco) );
	ginCarCost = calcCarCost(gameData.ginza.cars);
	update("ginCarCost", format(ginCarCost));
}

function refreshMarunouchi() {
	update("maruStations", format(gameData.marunouchi.stations) );
	maruStationCost = calcStationCost(gameData.marunouchi.stations);
	update("maruStationCost", format(maruStationCost));
	update("maruLocomotives", format(gameData.marunouchi.locomotives) );
	update("maruMaxLocomotives", format(gameData.marunouchi.stations * locoPerStat) );
	maruLocomotiveCost = calcLocomotiveCost(gameData.marunouchi.locomotives);
	update("maruLocomotiveCost", format(maruLocomotiveCost));
	update("maruCars", format(gameData.marunouchi.cars) );
	update("maruMaxCars", format(gameData.marunouchi.locomotives * carPerLoco) );
	maruCarCost = calcCarCost(gameData.marunouchi.cars);
	update("maruCarCost", format(maruCarCost));
}

function refreshHibiya() {
	update("hibiStations", format(gameData.hibiya.stations) );
	hibiStationCost = calcStationCost(gameData.hibiya.stations);
	update("hibiStationCost", format(hibiStationCost));
	update("hibiLocomotives", format(gameData.hibiya.locomotives) );
	update("hibiMaxLocomotives", format(gameData.hibiya.stations * locoPerStat) );
	hibiLocomotiveCost = calcLocomotiveCost(gameData.hibiya.locomotives);
	update("hibiLocomotiveCost", format(hibiLocomotiveCost));
	update("hibiCars", format(gameData.hibiya.cars) );
	update("hibiMaxCars", format(gameData.hibiya.locomotives * carPerLoco) );
	hibiCarCost = calcCarCost(gameData.hibiya.cars);
	update("hibiCarCost", format(hibiCarCost));
}

function refreshTozai() {
	update("tozaStations", format(gameData.tozai.stations) );
	tozaStationCost = calcStationCost(gameData.tozai.stations);
	update("tozaStationCost", format(tozaStationCost));
	update("tozaLocomotives", format(gameData.tozai.locomotives) );
	update("tozaMaxLocomotives", format(gameData.tozai.stations * locoPerStat) );
	tozaLocomotiveCost = calcLocomotiveCost(gameData.tozai.locomotives);
	update("tozaLocomotiveCost", format(tozaLocomotiveCost));
	update("tozaCars", format(gameData.tozai.cars) );
	update("tozaMaxCars", format(gameData.tozai.locomotives * carPerLoco) );
	tozaCarCost = calcCarCost(gameData.tozai.cars);
	update("tozaCarCost", format(tozaCarCost));
}

function refreshChiyoda() {
	update("chiyoStations", format(gameData.chiyoda.stations) );
	chiyoStationCost = calcStationCost(gameData.chiyoda.stations);
	update("chiyoStationCost", format(chiyoStationCost));
	update("chiyoLocomotives", format(gameData.chiyoda.locomotives) );
	update("chiyoMaxLocomotives", format(gameData.chiyoda.stations * locoPerStat) );
	chiyoLocomotiveCost = calcLocomotiveCost(gameData.chiyoda.locomotives);
	update("chiyoLocomotiveCost", format(chiyoLocomotiveCost));
	update("chiyoCars", format(gameData.chiyoda.cars) );
	update("chiyoMaxCars", format(gameData.chiyoda.locomotives * carPerLoco) );
	chiyoCarCost = calcCarCost(gameData.chiyoda.cars);
	update("chiyoCarCost", format(chiyoCarCost));
}

function refreshYurakucho() {
	update("yuraStations", format(gameData.yurakucho.stations) );
	yuraStationCost = calcStationCost(gameData.yurakucho.stations);
	update("yuraStationCost", format(yuraStationCost));
	update("yuraLocomotives", format(gameData.yurakucho.locomotives) );
	update("yuraMaxLocomotives", format(gameData.yurakucho.stations * locoPerStat) );
	yuraLocomotiveCost = calcLocomotiveCost(gameData.yurakucho.locomotives);
	update("yuraLocomotiveCost", format(yuraLocomotiveCost));
	update("yuraCars", format(gameData.yurakucho.cars) );
	update("yuraMaxCars", format(gameData.yurakucho.locomotives * carPerLoco) );
	yuraCarCost = calcCarCost(gameData.yurakucho.cars);
	update("yuraCarCost", format(yuraCarCost));
}

function refreshHanzomon() {
	update("hanStations", format(gameData.hanzomon.stations) );
	hanStationCost = calcStationCost(gameData.hanzomon.stations);
	update("hanStationCost", format(hanStationCost));
	update("hanLocomotives", format(gameData.hanzomon.locomotives) );
	update("hanMaxLocomotives", format(gameData.hanzomon.stations * locoPerStat) );
	hanLocomotiveCost = calcLocomotiveCost(gameData.hanzomon.locomotives);
	update("hanLocomotiveCost", format(hanLocomotiveCost));
	update("hanCars", format(gameData.hanzomon.cars) );
	update("hanMaxCars", format(gameData.hanzomon.locomotives * carPerLoco) );
	hanCarCost = calcCarCost(gameData.hanzomon.cars);
	update("hanCarCost", format(hanCarCost));
}

function refreshNamboku() {
	update("namStations", format(gameData.namboku.stations) );
	namStationCost = calcStationCost(gameData.namboku.stations);
	update("namStationCost", format(namStationCost));
	update("namLocomotives", format(gameData.namboku.locomotives) );
	update("namMaxLocomotives", format(gameData.namboku.stations * locoPerStat) );
	namLocomotiveCost = calcLocomotiveCost(gameData.namboku.locomotives);
	update("namLocomotiveCost", format(namLocomotiveCost));
	update("namCars", format(gameData.namboku.cars) );
	update("namMaxCars", format(gameData.namboku.locomotives * carPerLoco) );
	namCarCost = calcCarCost(gameData.namboku.cars);
	update("namCarCost", format(namCarCost));
}

function refreshFukutoshin() {
	update("fukuStations", format(gameData.fukutoshin.stations) );
	fukuStationCost = calcStationCost(gameData.fukutoshin.stations);
	update("fukuStationCost", format(fukuStationCost));
	update("fukuLocomotives", format(gameData.fukutoshin.locomotives) );
	update("fukuMaxLocomotives", format(gameData.fukutoshin.stations * locoPerStat) );
	fukuLocomotiveCost = calcLocomotiveCost(gameData.fukutoshin.locomotives);
	update("fukuLocomotiveCost", format(fukuLocomotiveCost));
	update("fukuCars", format(gameData.fukutoshin.cars) );
	update("fukuMaxCars", format(gameData.fukutoshin.locomotives * carPerLoco) );
	fukuCarCost = calcCarCost(gameData.fukutoshin.cars);
	update("fukuCarCost", format(fukuCarCost));
}

// end line refresh functions







// Defining refresh function to update page after loading game
function refresh() {
	// refreshing values from gameData
	update("money", format(gameData.money));
	update("ticketPrice", format(gameData.ticketPrice) );
	update("passengers", gameData.passengers.toLocaleString("en-US"));
	
	// refreshing variables effected by prestige upgrades
	ticketPriceEq = ticketPriceEqConst * 2 ** gameData.prestige.upgrade1Lvl;
	ticketPriceMax = ticketPriceMaxConst * 2 ** gameData.prestige.upgrade2Lvl;
	ppsPerStat = ppsPerStatConst + (1 * gameData.prestige.upgrade3Lvl);
	locoPerStat = locoPerStatConst + (1 * gameData.prestige.upgrade4Lvl);
	carPerLoco = carPerLocoConst + (2 * gameData.prestige.upgrade5Lvl);
	passPerCar = passPerCarConst + (50 * gameData.prestige.upgrade6Lvl);


	// refreshing formulas dependent on gameData
	updatePps();
	updateMps();
	updateMaxPassengers();
	lineCost = calcLineCost();

	
	// making sure proper elements are displayed per line
	if(gameData.bXP < 1 && gameData.tozai.line < 1) {
		hide("prestigeTabButton");
	}	// make sure buyTozaLine makes this button show
	
	if(gameData.ginza.line < 1) {
		update("ginLineCost", format(lineCost));
	}
	if(gameData.ginza.line > 0) {
		show("ginzaBody"); hide("ginzaHead");
		refreshGinza();
		show("marunouchiHead");
		update("maruLineCost", format(lineCost));
	}
		if(gameData.marunouchi.line > 0) {
		show("marunouchiBody"); hide("marunouchiHead");
		refreshMarunouchi();
		show("hibiyaHead");
		update("hibiLineCost", format(lineCost));
	}
		if(gameData.hibiya.line > 0) {
		show("hibiyaBody"); hide("hibiyaHead");
		refreshHibiya();
		show("tozaiHead");
		update("tozaLineCost", format(lineCost));
	}
		if(gameData.tozai.line > 0) {
		show("tozaiBody"); hide("tozaiHead");
		refreshTozai();
		show("chiyodaHead");
		update("chiyoLineCost", format(lineCost));
	}
		if(gameData.chiyoda.line > 0) {
		show("chiyodaBody"); hide("chiyodaHead");
		refreshChiyoda();
		show("yurakuchoHead");
		update("yuraLineCost", format(lineCost));
	}
		if(gameData.yurakucho.line > 0) {
		show("yurakuchoBody"); hide("yurakuchoHead");
		refreshYurakucho();
		show("hanzomonHead");
		update("hanLineCost", format(lineCost));
	}
		if(gameData.hanzomon.line > 0) {
		show("hanzomonBody"); hide("hanzomonHead");
		refreshHanzomon();
		show("nambokuHead");
		update("namLineCost", format(lineCost));
	}
		if(gameData.namboku.line > 0) {
		show("nambokuBody"); hide("nambokuHead");
		refreshNamboku();
		show("fukutoshinHead");
		update("fukuLineCost", format(lineCost));
	}
		if(gameData.fukutoshin.line > 0) {
		show("fukutoshinBody"); hide("fukutoshinHead");
		refreshFukutoshin();
	}
	
}









// INITIAL GAME LOAD
load();
refresh();
update("titleVer", `v${gameData.version}`);
if(window.location.href === "https://smmdesign.github.io/mfiMetro/alpha/") {titleVer.insertAdjacentHTML('afterend', ' <span style="font-size:70%;">ALPHA</span>');}
goToTab('linesTab');


// goToTab('prestigeTab');	// while editing so i dont have to switch every F5








// GAME FUNCTIONS

function makeMoney(number) {
	gameData.money += number;
	update("money", format(gameData.money));
	
}

function generatePassengers(number) {
	gameData.passengers += number;
	// Prevents passengers from exceeding passenger car max
	if (gameData.passengers >= calcTotalCars() * passPerCar) {
		gameData.passengers = calcTotalCars() * passPerCar;
	}
	// Prevents passengers from going below zero
	if (gameData.passengers < 0) {
		gameData.passengers = 0;
	}
	update("passengers", gameData.passengers.toLocaleString("en-US"));
	updateMps();
	updatePps();
}




function setTicketPrice() {
	let userPrice = prompt(`Set Price ( 1 - ${format(ticketPriceMax)} )`,"100");
	if(userPrice === null || isNaN(userPrice)) { return;}
	if(userPrice < 1 || userPrice > ticketPriceMax) {
		alert(`Please enter a number between 1 and ${format(ticketPriceMax)}.`); return;
	}
	gameData.ticketPrice = Math.round(userPrice);
	update("ticketPrice", format(gameData.ticketPrice) );
	updatePps();					// because pps is dependent on ticket price
}






// equilibrium is ¥200 price

function updatePps() {
	pps = Math.ceil( (( ticketPriceEq - gameData.ticketPrice ) / ticketPriceEq ) * ( calcTotalStations() * ppsPerStat ) );
	// prevents errors from dividing by zero
	if(!pps) {
		pps = 0;
	}
	// prevents stalling at 0 passengers once game has started
	if(gameData.passengers === 0 && gameData.ginza.line > 0) {
		gameData.passengers = 1;
	}
	update("pps", `(${pps.toLocaleString("en-US")}/s)`)
}

function updateMps() {
	mps = gameData.passengers * gameData.ticketPrice;
	update("mps", `(¥${format(mps)}/s)`)
}

function updateMaxPassengers() {
	maxPassengers = calcTotalCars() * passPerCar;
	update("maxPassengers", `/${maxPassengers.toLocaleString("en-US")}`)
}












// functions that return values

function calcTotalLines() {
	return gameData.ginza.line + gameData.marunouchi.line + gameData.hibiya.line + gameData.tozai.line + gameData.chiyoda.line + gameData.yurakucho.line + gameData.hanzomon.line + gameData.namboku.line + gameData.fukutoshin.line;
}
function calcTotalStations() {
	return gameData.ginza.stations + gameData.marunouchi.stations + gameData.hibiya.stations + gameData.tozai.stations + gameData.chiyoda.stations + gameData.yurakucho.stations + gameData.hanzomon.stations + gameData.namboku.stations + gameData.fukutoshin.stations
}
function calcTotalLocomotives() {
	return gameData.ginza.locomotives + gameData.marunouchi.locomotives + gameData.hibiya.locomotives + gameData.tozai.locomotives + gameData.chiyoda.locomotives + gameData.yurakucho.locomotives + gameData.hanzomon.locomotives + gameData.namboku.locomotives + gameData.fukutoshin.locomotives
}
function calcTotalCars() {
	return gameData.ginza.cars + gameData.marunouchi.cars + gameData.hibiya.cars + gameData.tozai.cars + gameData.chiyoda.cars + gameData.yurakucho.cars + gameData.hanzomon.cars + gameData.namboku.cars + gameData.fukutoshin.cars
}


function calcLineCost() {
	return Math.floor(50000 * (24 ** calcTotalLines()));
}

function calcStationCost(stations) {
	return Math.floor(10000 * (2.2	** stations ));
}

// these functions automatically readjust prices based on ratios from upgrades
function calcLocomotiveCost(locomotives) {
	return Math.floor( (10000 * ( (1 + (1 * locoPerStatConst / locoPerStat)) ** locomotives )));
}

function calcCarCost(cars) {
	return Math.floor( 5000 * ( (1 + (.1 * carPerLocoConst / carPerLoco * locoPerStatConst / locoPerStat)) ** cars ));
}









// buying functions


// EXPERIMENTAL BUY ALL BUTTON
// this currently only works properly because un-bought lines rolling stock are limited by stations (which dont exist yet). it will not work for max buying stations.

function buyAllStock() {
	buyGinLocomotive('max');
	buyGinCar('max');
	buyMaruLocomotive('max');
	buyMaruCar('max');
	buyHibiLocomotive('max');
	buyHibiCar('max');
	buyTozaLocomotive('max');
	buyTozaCar('max');
	buyChiyoLocomotive('max');
	buyChiyoCar('max');
	buyYuraLocomotive('max');
	buyYuraCar('max');
	buyHanLocomotive('max');
	buyHanCar('max');
	buyNamLocomotive('max');
	buyNamCar('max');
	buyFukuLocomotive('max');
	buyFukuCar('max');
}


function buyAll1Station() {
	if(gameData.ginza.line === 1) { buyGinStation(); }
	if(gameData.marunouchi.line === 1) { buyMaruStation(); }
	if(gameData.hibiya.line === 1) { buyHibiStation(); }
	if(gameData.tozai.line === 1) { buyTozaStation(); }
	if(gameData.chiyoda.line === 1) { buyChiyoStation(); }
	if(gameData.yurakucho.line === 1) { buyYuraStation(); }
	if(gameData.hanzomon.line === 1) { buyHanStation(); }
	if(gameData.namboku.line === 1) { buyNamStation(); }
	if(gameData.fukutoshin.line === 1) { buyFukuStation(); }
}








// ginza buying functions
function buyGinLine() {
	if(gameData.money >= lineCost) {
		gameData.ginza.line = 1;
		gameData.money -= lineCost;		
		gameData.ginza.stations += 2;
		gameData.ginza.locomotives += 1;
		gameData.ginza.cars += 1;
		show("ginzaBody");
		hide("ginzaHead");
		show("marunouchiHead");
		update("money", format(gameData.money));
		lineCost = calcLineCost();
		update("maruLineCost", format(lineCost));
		refreshGinza();
		updatePps();					// because pps is dependent on station number
		updateMaxPassengers();	// because max is dependent on car number
}}
function buyGinStation(x) {
	if(gameData.money >= ginStationCost) {
		gameData.ginza.stations += 1;
		gameData.money -= ginStationCost;
		ginStationCost = calcStationCost(gameData.ginza.stations);
		if(x === 'max' && gameData.money >= ginStationCost) { buyGinStation('max'); }
		update("money", format(gameData.money));
		refreshGinza();
		updatePps();					// because pps is dependent on station number
}}
function buyGinLocomotive(x) {
	if(gameData.ginza.locomotives < gameData.ginza.stations * locoPerStat && gameData.money >= ginLocomotiveCost) {
		gameData.ginza.locomotives += 1;
		gameData.money -= ginLocomotiveCost;
		ginLocomotiveCost = calcLocomotiveCost(gameData.ginza.locomotives);
		if(x === 'max' && gameData.money >= ginLocomotiveCost) { buyGinLocomotive('max'); }
		update("money", format(gameData.money));
		refreshGinza();
}}
function buyGinCar(x) {
	if(gameData.ginza.cars < gameData.ginza.locomotives * carPerLoco && gameData.money >= ginCarCost) {
		gameData.ginza.cars += 1;
		gameData.money -= ginCarCost;
		ginCarCost = calcCarCost(gameData.ginza.cars);
		if(x === 'max' && gameData.money >= ginCarCost) { buyGinCar('max'); }
		update("money", format(gameData.money));
		refreshGinza();
		updateMaxPassengers();	// because max is dependent on car number
}}
// end of ginza buying functions


// marunouchi buying functions
function buyMaruLine() {
	if(gameData.money >= lineCost) {
		gameData.marunouchi.line = 1;
		gameData.money -= lineCost;		
		gameData.marunouchi.stations += 2;
		gameData.marunouchi.locomotives += 1;
		gameData.marunouchi.cars += 1;
		show("marunouchiBody");
		hide("marunouchiHead");
		show("hibiyaHead");
		update("money", format(gameData.money));
		lineCost = calcLineCost();
		update("hibiLineCost", format(lineCost));
		refreshMarunouchi();
		updatePps();					// because pps is dependent on station number
		updateMaxPassengers();	// because max is dependent on car number
}}
function buyMaruStation(x) {
	if(gameData.money >= maruStationCost) {
		gameData.marunouchi.stations += 1;
		gameData.money -= maruStationCost;
		maruStationCost = calcStationCost(gameData.marunouchi.stations);
		if(x === 'max' && gameData.money >= maruStationCost) { buyMaruStation('max'); }
		update("money", format(gameData.money));
		refreshMarunouchi();
		updatePps();					// because pps is dependent on station number
}}
function buyMaruLocomotive(x) {
	if(gameData.marunouchi.locomotives < gameData.marunouchi.stations * locoPerStat && gameData.money >= maruLocomotiveCost) {
		gameData.marunouchi.locomotives += 1;
		gameData.money -= maruLocomotiveCost;
		maruLocomotiveCost = calcLocomotiveCost(gameData.marunouchi.locomotives);
		if(x === 'max' && gameData.money >= maruLocomotiveCost) { buyMaruLocomotive('max'); }
		update("money", format(gameData.money));
		refreshMarunouchi();
}}
function buyMaruCar(x) {
	if(gameData.marunouchi.cars < gameData.marunouchi.locomotives * carPerLoco && gameData.money >= maruCarCost) {
		gameData.marunouchi.cars += 1;
		gameData.money -= maruCarCost;
		maruCarCost = calcCarCost(gameData.marunouchi.cars);
		if(x === 'max' && gameData.money >= maruCarCost) { buyMaruCar('max'); }
		update("money", format(gameData.money));
		refreshMarunouchi();
		updateMaxPassengers();	// because max is dependent on car number
}}
// end of marunouchi buying functions


// hibiya buying functions
function buyHibiLine() {
	if(gameData.money >= lineCost) {
		gameData.hibiya.line = 1;
		gameData.money -= lineCost;		
		gameData.hibiya.stations += 2;
		gameData.hibiya.locomotives += 1;
		gameData.hibiya.cars += 1;
		show("hibiyaBody");
		hide("hibiyaHead");
		show("tozaiHead");
		update("money", format(gameData.money));
		lineCost = calcLineCost();
		update("tozaLineCost", format(lineCost));
		refreshHibiya();
		updatePps();					// because pps is dependent on station number
		updateMaxPassengers();	// because max is dependent on car number
}}
function buyHibiStation(x) {
	if(gameData.money >= hibiStationCost) {
		gameData.hibiya.stations += 1;
		gameData.money -= hibiStationCost;
		hibiStationCost = calcStationCost(gameData.hibiya.stations);
		if(x === 'max' && gameData.money >= hibiStationCost) { buyHibiStation('max'); }
		update("money", format(gameData.money));
		refreshHibiya();
		updatePps();					// because pps is dependent on station number
}}
function buyHibiLocomotive(x) {
	if(gameData.hibiya.locomotives < gameData.hibiya.stations * locoPerStat && gameData.money >= hibiLocomotiveCost) {
		gameData.hibiya.locomotives += 1;
		gameData.money -= hibiLocomotiveCost;
		hibiLocomotiveCost = calcLocomotiveCost(gameData.hibiya.locomotives);
		if(x === 'max' && gameData.money >= hibiLocomotiveCost) { buyHibiLocomotive('max'); }
		update("money", format(gameData.money));
		refreshHibiya();
}}
function buyHibiCar(x) {
	if(gameData.hibiya.cars < gameData.hibiya.locomotives * carPerLoco && gameData.money >= hibiCarCost) {
		gameData.hibiya.cars += 1;
		gameData.money -= hibiCarCost;
		hibiCarCost = calcCarCost(gameData.hibiya.cars);
		if(x === 'max' && gameData.money >= hibiCarCost) { buyHibiCar('max'); }
		update("money", format(gameData.money));
		refreshHibiya();
		updateMaxPassengers();	// because max is dependent on car number
}}
// end of hibiya buying functions


// tozai buying functions
function buyTozaLine() {
	if(gameData.money >= lineCost) {
		gameData.tozai.line = 1;
		gameData.money -= lineCost;		
		gameData.tozai.stations += 2;
		gameData.tozai.locomotives += 1;
		gameData.tozai.cars += 1;
		show("tozaiBody");
		hide("tozaiHead");
		show("chiyodaHead");
		update("money", format(gameData.money));
		lineCost = calcLineCost();
		update("chiyoLineCost", format(lineCost));
		refreshTozai();
		updatePps();					// because pps is dependent on station number
		updateMaxPassengers();	// because max is dependent on car number
		show("prestigeTabButton");	// prestige unlocks here
		document.getElementById("prestigeTabButton").setAttribute("class", "button nav highlight")
}}
function buyTozaStation(x) {
	if(gameData.money >= tozaStationCost) {
		gameData.tozai.stations += 1;
		gameData.money -= tozaStationCost;
		tozaStationCost = calcStationCost(gameData.tozai.stations);
		if(x === 'max' && gameData.money >= tozaStationCost) { buyTozaStation('max'); }
		update("money", format(gameData.money));
		refreshTozai();
		updatePps();					// because pps is dependent on station number
}}
function buyTozaLocomotive(x) {
	if(gameData.tozai.locomotives < gameData.tozai.stations * locoPerStat && gameData.money >= tozaLocomotiveCost) {
		gameData.tozai.locomotives += 1;
		gameData.money -= tozaLocomotiveCost;
		tozaLocomotiveCost = calcLocomotiveCost(gameData.tozai.locomotives);
		if(x === 'max' && gameData.money >= tozaLocomotiveCost) { buyTozaLocomotive('max'); }
		update("money", format(gameData.money));
		refreshTozai();
}}
function buyTozaCar(x) {
	if(gameData.tozai.cars < gameData.tozai.locomotives * carPerLoco && gameData.money >= tozaCarCost) {
		gameData.tozai.cars += 1;
		gameData.money -= tozaCarCost;
		tozaCarCost = calcCarCost(gameData.tozai.cars);
		if(x === 'max' && gameData.money >= tozaCarCost) { buyTozaCar('max'); }
		update("money", format(gameData.money));
		refreshTozai();
		updateMaxPassengers();	// because max is dependent on car number
}}
// end of tozai buying functions


// chiyoda buying functions
function buyChiyoLine() {
	if(gameData.money >= lineCost) {
		gameData.chiyoda.line = 1;
		gameData.money -= lineCost;		
		gameData.chiyoda.stations += 2;
		gameData.chiyoda.locomotives += 1;
		gameData.chiyoda.cars += 1;
		show("chiyodaBody");
		hide("chiyodaHead");
		show("yurakuchoHead");
		update("money", format(gameData.money));
		lineCost = calcLineCost();
		update("yuraLineCost", format(lineCost));
		refreshChiyoda();
		updatePps();					// because pps is dependent on station number
		updateMaxPassengers();	// because max is dependent on car number
}}
function buyChiyoStation(x) {
	if(gameData.money >= chiyoStationCost) {
		gameData.chiyoda.stations += 1;
		gameData.money -= chiyoStationCost;
		chiyoStationCost = calcStationCost(gameData.chiyoda.stations);
		if(x === 'max' && gameData.money >= chiyoStationCost) { buyChiyoStation('max'); }
		update("money", format(gameData.money));
		refreshChiyoda();
		updatePps();					// because pps is dependent on station number
}}
function buyChiyoLocomotive(x) {
	if(gameData.chiyoda.locomotives < gameData.chiyoda.stations * locoPerStat && gameData.money >= chiyoLocomotiveCost) {
		gameData.chiyoda.locomotives += 1;
		gameData.money -= chiyoLocomotiveCost;
		chiyoLocomotiveCost = calcLocomotiveCost(gameData.chiyoda.locomotives);
		if(x === 'max' && gameData.money >= chiyoLocomotiveCost) { buyChiyoLocomotive('max'); }
		update("money", format(gameData.money));
		refreshChiyoda();
}}
function buyChiyoCar(x) {
	if(gameData.chiyoda.cars < gameData.chiyoda.locomotives * carPerLoco && gameData.money >= chiyoCarCost) {
		gameData.chiyoda.cars += 1;
		gameData.money -= chiyoCarCost;
		chiyoCarCost = calcCarCost(gameData.chiyoda.cars);
		if(x === 'max' && gameData.money >= chiyoCarCost) { buyChiyoCar('max'); }
		update("money", format(gameData.money));
		refreshChiyoda();
		updateMaxPassengers();	// because max is dependent on car number
}}
// end of chiyoda buying functions


// yurakucho buying functions
function buyYuraLine() {
	if(gameData.money >= lineCost) {
		gameData.yurakucho.line = 1;
		gameData.money -= lineCost;		
		gameData.yurakucho.stations += 2;
		gameData.yurakucho.locomotives += 1;
		gameData.yurakucho.cars += 1;
		show("yurakuchoBody");
		hide("yurakuchoHead");
		show("hanzomonHead");
		update("money", format(gameData.money));
		lineCost = calcLineCost();
		update("hanLineCost", format(lineCost));
		refreshYurakucho();
		updatePps();					// because pps is dependent on station number
		updateMaxPassengers();	// because max is dependent on car number
}}
function buyYuraStation(x) {
	if(gameData.money >= yuraStationCost) {
		gameData.yurakucho.stations += 1;
		gameData.money -= yuraStationCost;
		yuraStationCost = calcStationCost(gameData.yurakucho.stations);
		if(x === 'max' && gameData.money >= yuraStationCost) { buyYuraStation('max'); }
		update("money", format(gameData.money));
		refreshYurakucho();
		updatePps();					// because pps is dependent on station number
}}
function buyYuraLocomotive(x) {
	if(gameData.yurakucho.locomotives < gameData.yurakucho.stations * locoPerStat && gameData.money >= yuraLocomotiveCost) {
		gameData.yurakucho.locomotives += 1;
		gameData.money -= yuraLocomotiveCost;
		yuraLocomotiveCost = calcLocomotiveCost(gameData.yurakucho.locomotives);
		if(x === 'max' && gameData.money >= yuraLocomotiveCost) { buyYuraLocomotive('max'); }
		update("money", format(gameData.money));
		refreshYurakucho();
}}
function buyYuraCar(x) {
	if(gameData.yurakucho.cars < gameData.yurakucho.locomotives * carPerLoco && gameData.money >= yuraCarCost) {
		gameData.yurakucho.cars += 1;
		gameData.money -= yuraCarCost;
		yuraCarCost = calcCarCost(gameData.yurakucho.cars);
		if(x === 'max' && gameData.money >= yuraCarCost) { buyYuraCar('max'); }
		update("money", format(gameData.money));
		refreshYurakucho();
		updateMaxPassengers();	// because max is dependent on car number
}}
// end of yurakucho buying functions


// hanzomon buying functions
function buyHanLine() {
	if(gameData.money >= lineCost) {
		gameData.hanzomon.line = 1;
		gameData.money -= lineCost;		
		gameData.hanzomon.stations += 2;
		gameData.hanzomon.locomotives += 1;
		gameData.hanzomon.cars += 1;
		show("hanzomonBody");
		hide("hanzomonHead");
		show("nambokuHead");
		update("money", format(gameData.money));
		lineCost = calcLineCost();
		update("namLineCost", format(lineCost));
		refreshHanzomon();
		updatePps();					// because pps is dependent on station number
		updateMaxPassengers();	// because max is dependent on car number
}}
function buyHanStation(x) {
	if(gameData.money >= hanStationCost) {
		gameData.hanzomon.stations += 1;
		gameData.money -= hanStationCost;
		hanStationCost = calcStationCost(gameData.hanzomon.stations);
		if(x === 'max' && gameData.money >= hanStationCost) { buyHanStation('max'); }
		update("money", format(gameData.money));
		refreshHanzomon();
		updatePps();					// because pps is dependent on station number
}}
function buyHanLocomotive(x) {
	if(gameData.hanzomon.locomotives < gameData.hanzomon.stations * locoPerStat && gameData.money >= hanLocomotiveCost) {
		gameData.hanzomon.locomotives += 1;
		gameData.money -= hanLocomotiveCost;
		hanLocomotiveCost = calcLocomotiveCost(gameData.hanzomon.locomotives);
		if(x === 'max' && gameData.money >= hanLocomotiveCost) { buyHanLocomotive('max'); }
		update("money", format(gameData.money));
		refreshHanzomon();
}}
function buyHanCar(x) {
	if(gameData.hanzomon.cars < gameData.hanzomon.locomotives * carPerLoco && gameData.money >= hanCarCost) {
		gameData.hanzomon.cars += 1;
		gameData.money -= hanCarCost;
		hanCarCost = calcCarCost(gameData.hanzomon.cars);
		if(x === 'max' && gameData.money >= hanCarCost) { buyHanCar('max'); }
		update("money", format(gameData.money));
		refreshHanzomon();
		updateMaxPassengers();	// because max is dependent on car number
}}
// end of hanzomon buying functions


// namboku buying functions
function buyNamLine() {
	if(gameData.money >= lineCost) {
		gameData.namboku.line = 1;
		gameData.money -= lineCost;		
		gameData.namboku.stations += 2;
		gameData.namboku.locomotives += 1;
		gameData.namboku.cars += 1;
		show("nambokuBody");
		hide("nambokuHead");
		show("fukutoshinHead");
		update("money", format(gameData.money));
		lineCost = calcLineCost();
		update("fukuLineCost", format(lineCost));
		refreshNamboku();
		updatePps();					// because pps is dependent on station number
		updateMaxPassengers();	// because max is dependent on car number
}}
function buyNamStation(x) {
	if(gameData.money >= namStationCost) {
		gameData.namboku.stations += 1;
		gameData.money -= namStationCost;
		namStationCost = calcStationCost(gameData.namboku.stations);
		if(x === 'max' && gameData.money >= namStationCost) { buyNamStation('max'); }
		update("money", format(gameData.money));
		refreshNamboku();
		updatePps();					// because pps is dependent on station number
}}
function buyNamLocomotive(x) {
	if(gameData.namboku.locomotives < gameData.namboku.stations * locoPerStat && gameData.money >= namLocomotiveCost) {
		gameData.namboku.locomotives += 1;
		gameData.money -= namLocomotiveCost;
		namLocomotiveCost = calcLocomotiveCost(gameData.namboku.locomotives);
		if(x === 'max' && gameData.money >= namLocomotiveCost) { buyNamLocomotive('max'); }
		update("money", format(gameData.money));
		refreshNamboku();
}}
function buyNamCar(x) {
	if(gameData.namboku.cars < gameData.namboku.locomotives * carPerLoco && gameData.money >= namCarCost) {
		gameData.namboku.cars += 1;
		gameData.money -= namCarCost;
		namCarCost = calcCarCost(gameData.namboku.cars);
		if(x === 'max' && gameData.money >= namCarCost) { buyNamCar('max'); }
		update("money", format(gameData.money));
		refreshNamboku();
		updateMaxPassengers();	// because max is dependent on car number
}}
// end of namboku buying functions


// fukutoshin buying functions
function buyFukuLine() {
	if(gameData.money >= lineCost) {
		gameData.fukutoshin.line = 1;
		gameData.money -= lineCost;		
		gameData.fukutoshin.stations += 2;
		gameData.fukutoshin.locomotives += 1;
		gameData.fukutoshin.cars += 1;
		show("fukutoshinBody");
		hide("fukutoshinHead");
		update("money", format(gameData.money));
		refreshFukutoshin();
		updatePps();					// because pps is dependent on station number
		updateMaxPassengers();	// because max is dependent on car number
}}
function buyFukuStation(x) {
	if(gameData.money >= fukuStationCost) {
		gameData.fukutoshin.stations += 1;
		gameData.money -= fukuStationCost;
		fukuStationCost = calcStationCost(gameData.fukutoshin.stations);
		if(x === 'max' && gameData.money >= fukuStationCost) { buyFukuStation('max'); }
		update("money", format(gameData.money));
		refreshFukutoshin();
		updatePps();					// because pps is dependent on station number
}}
function buyFukuLocomotive(x) {
	if(gameData.fukutoshin.locomotives < gameData.fukutoshin.stations * locoPerStat && gameData.money >= fukuLocomotiveCost) {
		gameData.fukutoshin.locomotives += 1;
		gameData.money -= fukuLocomotiveCost;
		fukuLocomotiveCost = calcLocomotiveCost(gameData.fukutoshin.locomotives);
		if(x === 'max' && gameData.money >= fukuLocomotiveCost) { buyFukuLocomotive('max'); }
		update("money", format(gameData.money));
		refreshFukutoshin();
}}
function buyFukuCar(x) {
	if(gameData.fukutoshin.cars < gameData.fukutoshin.locomotives * carPerLoco && gameData.money >= fukuCarCost) {
		gameData.fukutoshin.cars += 1;
		gameData.money -= fukuCarCost;
		fukuCarCost = calcCarCost(gameData.fukutoshin.cars);
		if(x === 'max' && gameData.money >= fukuCarCost) { buyFukuCar('max'); }
		update("money", format(gameData.money));
		refreshFukutoshin();
		updateMaxPassengers();	// because max is dependent on car number
}}
// end of fukutoshin buying functions









// PRESTIGE FUNCTIONS

function refreshPrestige() {
	unrealizedPrestige = calcUnrealizedPrestige();
	update("unrealizedPrestige", `${format(unrealizedPrestige)}`)
	update("bXP", `${format(gameData.bXP)}`)

	update("upgrade1Lvl", format(gameData.prestige.upgrade1Lvl) );
	upgrade1Cost = calcUpgrade1Cost();
	update("upgrade1Lvl", format(gameData.prestige.upgrade1Lvl) );
	update("upgrade1Cost", format(upgrade1Cost) );
	update("bXP", `${format(gameData.bXP)}`)

	update("upgrade2Lvl", format(gameData.prestige.upgrade2Lvl) );
	upgrade2Cost = calcUpgrade2Cost();
	update("upgrade2Lvl", format(gameData.prestige.upgrade2Lvl) );
	update("upgrade2Cost", format(upgrade2Cost) );
	update("bXP", `${format(gameData.bXP)}`)

	update("upgrade3Lvl", format(gameData.prestige.upgrade3Lvl) );
	upgrade3Cost = calcUpgrade3Cost();
	update("upgrade3Lvl", format(gameData.prestige.upgrade3Lvl) );
	update("upgrade3Cost", format(upgrade3Cost) );
	update("bXP", `${format(gameData.bXP)}`)

	update("upgrade4Lvl", format(gameData.prestige.upgrade4Lvl) );
	upgrade4Cost = calcUpgrade4Cost();
	update("upgrade4Lvl", format(gameData.prestige.upgrade4Lvl) );
	update("upgrade4Cost", format(upgrade4Cost) );
	update("bXP", `${format(gameData.bXP)}`)

	update("upgrade5Lvl", format(gameData.prestige.upgrade5Lvl) );
	upgrade5Cost = calcUpgrade5Cost();
	update("upgrade5Lvl", format(gameData.prestige.upgrade5Lvl) );
	update("upgrade5Cost", format(upgrade5Cost) );
	update("bXP", `${format(gameData.bXP)}`)

	update("upgrade6Lvl", format(gameData.prestige.upgrade6Lvl) );
	upgrade6Cost = calcUpgrade6Cost();
	update("upgrade6Lvl", format(gameData.prestige.upgrade6Lvl) );
	update("upgrade6Cost", format(upgrade6Cost) );
	update("bXP", `${format(gameData.bXP)}`)

}	// remember to add relevant info to the main refresh function too


function prestigeReset() {
	gameData.money = 50000;
	gameData.ticketPrice = 100;
	gameData.passengers = 0;
	gameData.ginza = 			{ line: 0, stations: 0, locomotives: 0, cars: 0 };
	gameData.marunouchi =	{ line: 0, stations: 0, locomotives: 0, cars: 0 };
	gameData.hibiya = 			{ line: 0, stations: 0, locomotives: 0, cars: 0 };
	gameData.tozai = 			{ line: 0, stations: 0, locomotives: 0, cars: 0 };
	gameData.chiyoda = 		{ line: 0, stations: 0, locomotives: 0, cars: 0 };
	gameData.yurakucho = 	{ line: 0, stations: 0, locomotives: 0, cars: 0 };
	gameData.hanzomon = 	{ line: 0, stations: 0, locomotives: 0, cars: 0 };
	gameData.namboku = 		{ line: 0, stations: 0, locomotives: 0, cars: 0 };
	gameData.fukutoshin = 	{ line: 0, stations: 0, locomotives: 0, cars: 0 };
}





function calcUnrealizedPrestige() {
	if(calcTotalLines() < 4) { return 0; }
	return Math.round((((calcTotalCars() * 1) + (calcTotalLocomotives() * carPerLocoConst) + (calcTotalStations() * locoPerStatConst * carPerLocoConst)) * (calcTotalLines() - 2) ** 3) * 0.01);
}



function calcUpgrade1Cost() {
	return Math.floor(50 * (1.5 ** gameData.prestige.upgrade1Lvl));
}

function calcUpgrade2Cost() {
	return Math.floor(50 * (2	** gameData.prestige.upgrade2Lvl));
}

function calcUpgrade3Cost() {
	return Math.floor(10 * (1.5	** gameData.prestige.upgrade3Lvl));
}

function calcUpgrade4Cost() {
	return Math.floor(200 * (2	** gameData.prestige.upgrade4Lvl));
}

function calcUpgrade5Cost() {
	return Math.floor(100 * (1.5	** gameData.prestige.upgrade5Lvl));
}

function calcUpgrade6Cost() {
	return Math.floor(50 * (1.5	** gameData.prestige.upgrade6Lvl));
}





function prestige() {
	clearInterval(autosaveLoop);
	if(confirm(`This will reset your progress and give you ${format(unrealizedPrestige)} Business Expertise. Are you sure?`) === true) {
		unrealizedPrestige = calcUnrealizedPrestige();
		prestigeReset();
		gameData.bXP += unrealizedPrestige;
		save();
		console.log('Prestige Successful!');
		location.reload();
	} else {
		console.log('Prestige Cancelled.')
		location.reload();
	}
}


function buyUpgrade1() {
	if(gameData.bXP >= upgrade1Cost ) {
		gameData.prestige.upgrade1Lvl += 1;
		ticketPriceEq = ticketPriceEqConst * 2 ** gameData.prestige.upgrade1Lvl;
		gameData.bXP -= upgrade1Cost;
		upgrade1Cost = calcUpgrade1Cost();
		update("upgrade1Lvl", format(gameData.prestige.upgrade1Lvl) );
		update("upgrade1Cost", format(upgrade1Cost) );
		update("bXP", `${format(gameData.bXP)}`);
		updatePps();		// because this changes variables in the ticketprice formula

	}
}

function buyUpgrade2() {
	if(gameData.bXP >= upgrade2Cost ) {
		gameData.prestige.upgrade2Lvl += 1;
		ticketPriceMax = ticketPriceMaxConst * 2 ** gameData.prestige.upgrade2Lvl;
		gameData.bXP -= upgrade2Cost;
		upgrade2Cost = calcUpgrade2Cost();
		update("upgrade2Lvl", format(gameData.prestige.upgrade2Lvl) );
		update("upgrade2Cost", format(upgrade2Cost) );
		update("bXP", `${format(gameData.bXP)}`);
	}
}

function buyUpgrade3() {
	if(gameData.bXP >= upgrade3Cost ) {
		gameData.prestige.upgrade3Lvl += 1;
		ppsPerStat = ppsPerStatConst + (1 * gameData.prestige.upgrade3Lvl);
		gameData.bXP -= upgrade3Cost;
		upgrade3Cost = calcUpgrade3Cost();
		update("upgrade3Lvl", format(gameData.prestige.upgrade3Lvl) );
		update("upgrade3Cost", format(upgrade3Cost) );
		update("bXP", `${format(gameData.bXP)}`);
		updatePps();

	}
}

function buyUpgrade4() {
	if(gameData.bXP >= upgrade4Cost ) {
		gameData.prestige.upgrade4Lvl += 1;
		locoPerStat = locoPerStatConst + (1 * gameData.prestige.upgrade4Lvl);
		gameData.bXP -= upgrade4Cost;
		upgrade4Cost = calcUpgrade4Cost();
		update("upgrade4Lvl", format(gameData.prestige.upgrade4Lvl) );
		update("upgrade4Cost", format(upgrade4Cost) );
		update("bXP", `${format(gameData.bXP)}`);
	}
}

function buyUpgrade5() {
	if(gameData.bXP >= upgrade5Cost ) {
		gameData.prestige.upgrade5Lvl += 1;
		carPerLoco = carPerLocoConst + (2 * gameData.prestige.upgrade5Lvl);
		gameData.bXP -= upgrade5Cost;
		upgrade5Cost = calcUpgrade5Cost();
		update("upgrade5Lvl", format(gameData.prestige.upgrade5Lvl) );
		update("upgrade5Cost", format(upgrade5Cost) );
		update("bXP", `${format(gameData.bXP)}`);
	}
}

function buyUpgrade6() {
	if(gameData.bXP >= upgrade6Cost ) {
		gameData.prestige.upgrade6Lvl += 1;
		passPerCar = passPerCarConst + (50 * gameData.prestige.upgrade6Lvl);
		gameData.bXP -= upgrade6Cost;
		upgrade6Cost = calcUpgrade6Cost();
		update("upgrade6Lvl", format(gameData.prestige.upgrade6Lvl) );
		update("upgrade6Cost", format(upgrade6Cost) );
		update("bXP", `${format(gameData.bXP)}`);
		updateMaxPassengers();
	}
}




















// Game Loop
gameLoop = window.setInterval(function() {
	makeMoney(gameData.passengers * gameData.ticketPrice);
	generatePassengers(pps);
	
}, 1000);



// Autosave Loop
autosaveLoop = window.setInterval(function() {
	save();
	
	
}, 1000);
