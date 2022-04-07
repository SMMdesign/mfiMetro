/*
* MFI Metro
* Copyright (C) 2022 Shandra McCollough <shandramccollough@gmail.com>
 */


// Initializing game data variables
var gameData = {
	version: 0.52,
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
    highestLine: 0,
	prestige:		{ upgrade1Lvl: 0, upgrade2Lvl: 0, upgrade3Lvl: 0, upgrade4Lvl: 0, upgrade5Lvl: 0, upgrade6Lvl: 0, upgrade7Lvl: 0 }

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
const ppsPerStatConst = 6;
const locoPerStatConst = 1;
const carPerLocoConst = 6;
const passPerCarConst = 100;
const statPerLine = 5;  // for determining balance


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
			if (typeof saveGame.highestLine === 'undefined') saveGame.highestLine = gameData.highestLine;
			if (typeof saveGame.prestige === 'undefined') saveGame.prestige = gameData.prestige;
			if (typeof saveGame.prestige.upgrade1Lvl === 'undefined') saveGame.prestige.upgrade7Lvl = gameData.prestige.upgrade7Lvl;
			
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
		document.getElementById("linesTabButton").setAttribute("class", "button nav active");
        window.scrollTo(0, 0);
		refresh();
	}
	if(tab === 'prestigeTab') {
		document.getElementById("prestigeTab").style.display = "block"; 
		document.getElementById("prestigeTabButton").setAttribute("class", "button nav active");
        window.scrollTo(0, 0);
		refreshPrestige();	// in theory, prestige should only need to be updated here
	}
	if(tab === 'optionsTab') {
		document.getElementById("optionsTab").style.display = "block"; 
		document.getElementById("optionsTabButton").setAttribute("class", "button nav active");
        window.scrollTo(0, 0);
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
	ppsPerStat = ppsPerStatConst + (2 * gameData.prestige.upgrade3Lvl);
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
    show("endMessage");
}

}









// INITIAL GAME LOAD
load();
refresh();
update("titleVer", `v${gameData.version}`);
if(window.location.href === "https://smmdesign.github.io/mfiMetro/alpha/") {titleVer.insertAdjacentHTML('afterend', ' <span style="font-size:70%;">ALPHA</span>');}
if(window.location.href !== "https://smmdesign.github.io/mfiMetro/" && window.location.href !== "https://smmdesign.github.io/mfiMetro/alpha/" && window.location.protocol !== "file:") {document.body.insertAdjacentHTML( 'afterbegin', '<div class="titleBar" style="height:auto;background-color:darkred;color:white;text-align:center;font-weight:bold;font-size:80%;"><a href="https://smmdesign.github.io/mfiMetro/" style="color:white;text-decoration: none;">This is a copy, please support the original game at <u>smmdesign.github.io/mfiMetro</u></a></div>');}
goToTab('linesTab');


// goToTab('prestigeTab');	// while editing so i dont have to switch every F5
// goToTab('optionsTab');	// while editing so i dont have to switch every F5







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
    updateMps();					// because mps is dependent on ticket price
}


function adjustTicketPrice(number) {
    if(number === 'min') {gameData.ticketPrice = 1;}
    if(number === 'eq') {
        if(ticketPriceEq > ticketPriceMax) {
            gameData.ticketPrice = ticketPriceMax;
        } else {gameData.ticketPrice = ticketPriceEq;}
    }
    if(number === 'max') {gameData.ticketPrice = ticketPriceMax;}
    // percentage based changes
    let priceAdjust = gameData.ticketPrice + ticketPriceEq * number;
    if(ticketPriceMax > priceAdjust > 0) { gameData.ticketPrice = priceAdjust; }
    if(priceAdjust > ticketPriceMax) { gameData.ticketPrice = ticketPriceMax; }
    if(priceAdjust < 1) { gameData.ticketPrice = 1; }
	update("ticketPrice", format(gameData.ticketPrice) );
	updatePps();					// because pps is dependent on ticket price
    updateMps();					// because mps is dependent on ticket price
}





// ticket price formula location
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
    if(gameData.prestige.upgrade7Lvl === 0) {
        mps = gameData.passengers * gameData.ticketPrice;
    }
    if(gameData.prestige.upgrade7Lvl > 0) {
        mps = (gameData.passengers * gameData.ticketPrice) * (calcTotalLines() ** gameData.prestige.upgrade7Lvl);
    }
	update("mps", `(¥${format(mps)}/s)`)
}

function updateMaxPassengers() {
	maxPassengers = calcTotalCars() * passPerCar;
	update("maxPassengers", `/${maxPassengers.toLocaleString("en-US")}`)
}












// calc functions that return values
// remember to adjust max+multi if you adjust the individuals

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
	return Math.floor(50000 * ( (statPerLine * locoPerStatConst * carPerLocoConst) ** calcTotalLines()));
}

function calcStationCost(stations) {
	return Math.floor(10000 * (2	** stations ));
}

// these functions automatically readjust prices based on ratios from upgrades
function calcLocomotiveCost(locomotives) {
	return Math.floor( (7000 * ( (1 + (0.8 * locoPerStatConst / locoPerStat)) ** locomotives )));
}

function calcCarCost(cars) {
	return Math.floor( 5000 * ( (1 + (.1 * carPerLocoConst / carPerLoco * locoPerStatConst / locoPerStat)) ** cars ));
}

function calcMaxBuyNumber(type, owned) {
    let base;
    let increment;
    if(type === 'station') {
        base = 10000;
        increment = 2;
    }
    if(type === 'locomotive') {
        base = 7000;
        increment = (1 + (0.8 * locoPerStatConst / locoPerStat));
    }
    if(type === 'car') {
        base = 5000;
        increment = (1 + (.1 * carPerLocoConst / carPerLoco * locoPerStatConst / locoPerStat));
    }
    let y = (increment ** owned) - (gameData.money *( 1 - increment ) / base);
    let x = increment;
    // returns the logarithm of y with base x
    return Math.floor( (Math.log(y) / Math.log(x)) - owned);
}

function calcMultiBuyCost(type, owned, amount) {
    let base;
    let increment;
    if(type === 'station') {
        base = 10000;
        increment = 2;
    }
    if(type === 'locomotive') {
        base = 7000;
        increment = (1 + (0.8 * locoPerStatConst / locoPerStat));
    }
    if(type === 'car') {
        base = 5000;
        increment = (1 + (.1 * carPerLocoConst / carPerLoco * locoPerStatConst / locoPerStat));
    }
    return Math.floor( base *((increment ** (owned) - increment ** (owned + amount))/(1-increment)) );
}

// end of calc functions














// buying functions


// buy all buttons

function buyAll1Station() {
	if(gameData.ginza.line === 1) { buyGinStation(1); }
	if(gameData.marunouchi.line === 1) { buyMaruStation(1); }
	if(gameData.hibiya.line === 1) { buyHibiStation(1); }
	if(gameData.tozai.line === 1) { buyTozaStation(1); }
	if(gameData.chiyoda.line === 1) { buyChiyoStation(1); }
	if(gameData.yurakucho.line === 1) { buyYuraStation(1); }
	if(gameData.hanzomon.line === 1) { buyHanStation(1); }
	if(gameData.namboku.line === 1) { buyNamStation(1); }
	if(gameData.fukutoshin.line === 1) { buyFukuStation(1); }
}

function buyAllLocomotive() {
	if(gameData.ginza.line === 1) { buyGinLocomotive('max'); }
	if(gameData.marunouchi.line === 1) { buyMaruLocomotive('max'); }
	if(gameData.hibiya.line === 1) { buyHibiLocomotive('max'); }
	if(gameData.tozai.line === 1) { buyTozaLocomotive('max'); }
	if(gameData.chiyoda.line === 1) { buyChiyoLocomotive('max'); }
	if(gameData.yurakucho.line === 1) { buyYuraLocomotive('max'); }
	if(gameData.hanzomon.line === 1) { buyHanLocomotive('max'); }
	if(gameData.namboku.line === 1) { buyNamLocomotive('max'); }
	if(gameData.fukutoshin.line === 1) { buyFukuLocomotive('max'); }
}


function buyAllCar() {
	if(gameData.ginza.line === 1) { buyGinCar('max'); }
	if(gameData.marunouchi.line === 1) { buyMaruCar('max'); }
	if(gameData.hibiya.line === 1) { buyHibiCar('max'); }
	if(gameData.tozai.line === 1) { buyTozaCar('max'); }
	if(gameData.chiyoda.line === 1) { buyChiyoCar('max'); }
	if(gameData.yurakucho.line === 1) { buyYuraCar('max'); }
	if(gameData.hanzomon.line === 1) { buyHanCar('max'); }
	if(gameData.namboku.line === 1) { buyNamCar('max'); }
	if(gameData.fukutoshin.line === 1) { buyFukuCar('max'); }
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
        updateMps();            // because mps is dependent on line number
        gtag("event", "level_start", {
          level_name: "Ginza Line"
        });
}}
function buyGinStation(number) {
	if(gameData.money >= ginStationCost) {
        if(number === 1) {
            gameData.ginza.stations += 1;
            gameData.money -= ginStationCost;
        } 
        if(number > 1) {
            // calculate cost first because it depends on current number
            gameData.money -= calcMultiBuyCost('station', gameData.ginza.stations, number);
            gameData.ginza.stations += number;
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('station', gameData.ginza.stations);
            // calculate cost first because it depends on current number
            gameData.money -= calcMultiBuyCost('station', gameData.ginza.stations, maxNumber);
            gameData.ginza.stations += maxNumber;
        }
        ginStationCost = calcStationCost(gameData.ginza.stations);
        update("money", format(gameData.money));
        refreshGinza();
        updatePps();					// because pps is dependent on station number
    }
}
function buyGinLocomotive(number) {
	if(gameData.ginza.locomotives < gameData.ginza.stations * locoPerStat && gameData.money >= ginLocomotiveCost) {
        if(number === 1) {
            gameData.ginza.locomotives += 1;
            gameData.money -= ginLocomotiveCost;
        } 
        if(number > 1) {
            if(gameData.ginza.locomotives + number <= gameData.ginza.stations * locoPerStat) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('locomotive', gameData.ginza.locomotives, number);
                gameData.ginza.locomotives += number;
            }
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('locomotive', gameData.ginza.locomotives);
            if(gameData.ginza.locomotives + maxNumber <= gameData.ginza.stations * locoPerStat) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('locomotive', gameData.ginza.locomotives, maxNumber);
                gameData.ginza.locomotives += maxNumber;
            } else {
                buyGinLocomotive((gameData.ginza.stations * locoPerStat) - gameData.ginza.locomotives); //buys to max capacity
            }
        }
    ginLocomotiveCost = calcLocomotiveCost(gameData.ginza.locomotives);
    update("money", format(gameData.money));
    refreshGinza();
    }
}
function buyGinCar(number) {
	if(gameData.ginza.cars < gameData.ginza.locomotives * carPerLoco && gameData.money >= ginCarCost) {
        if(number === 1) {
            gameData.ginza.cars += 1;
            gameData.money -= ginCarCost;
        } 
        if(number > 1) {
            if(gameData.ginza.cars + number <= gameData.ginza.locomotives * carPerLoco) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('car', gameData.ginza.cars, number);
                gameData.ginza.cars += number;
            }
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('car', gameData.ginza.cars);
            if(gameData.ginza.cars + maxNumber <= gameData.ginza.locomotives * carPerLoco) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('car', gameData.ginza.cars, maxNumber);
                gameData.ginza.cars += maxNumber;
            } else {
                buyGinCar((gameData.ginza.locomotives * carPerLoco) - gameData.ginza.cars); //buys to max capacity
            }
        }
    ginCarCost = calcCarCost(gameData.ginza.cars);
    update("money", format(gameData.money));
    refreshGinza();
    updateMaxPassengers();	// because max is dependent on car number
    }
}
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
        updateMps();            // because mps is dependent on line number
        gtag("event", "level_start", {
          level_name: "Marunouchi Line"
        });
}}
function buyMaruStation(number) {
	if(gameData.money >= maruStationCost) {
        if(number === 1) {
            gameData.marunouchi.stations += 1;
            gameData.money -= maruStationCost;
        } 
        if(number > 1) {
            // calculate cost first because it depends on current number
            gameData.money -= calcMultiBuyCost('station', gameData.marunouchi.stations, number);
            gameData.marunouchi.stations += number;
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('station', gameData.marunouchi.stations);
            // calculate cost first because it depends on current number
            gameData.money -= calcMultiBuyCost('station', gameData.marunouchi.stations, maxNumber);
            gameData.marunouchi.stations += maxNumber;
        }
        maruStationCost = calcStationCost(gameData.marunouchi.stations);
        update("money", format(gameData.money));
        refreshMarunouchi();
        updatePps();					// because pps is dependent on station number
    }
}
function buyMaruLocomotive(number) {
	if(gameData.marunouchi.locomotives < gameData.marunouchi.stations * locoPerStat && gameData.money >= maruLocomotiveCost) {
        if(number === 1) {
            gameData.marunouchi.locomotives += 1;
            gameData.money -= maruLocomotiveCost;
        } 
        if(number > 1) {
            if(gameData.marunouchi.locomotives + number <= gameData.marunouchi.stations * locoPerStat) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('locomotive', gameData.marunouchi.locomotives, number);
                gameData.marunouchi.locomotives += number;
            }
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('locomotive', gameData.marunouchi.locomotives);
            if(gameData.marunouchi.locomotives + maxNumber <= gameData.marunouchi.stations * locoPerStat) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('locomotive', gameData.marunouchi.locomotives, maxNumber);
                gameData.marunouchi.locomotives += maxNumber;
            } else {
                buyMaruLocomotive((gameData.marunouchi.stations * locoPerStat) - gameData.marunouchi.locomotives); //buys to max capacity
            }
        }
    maruLocomotiveCost = calcLocomotiveCost(gameData.marunouchi.locomotives);
    update("money", format(gameData.money));
    refreshMarunouchi();
    }
}
function buyMaruCar(number) {
	if(gameData.marunouchi.cars < gameData.marunouchi.locomotives * carPerLoco && gameData.money >= maruCarCost) {
        if(number === 1) {
            gameData.marunouchi.cars += 1;
            gameData.money -= maruCarCost;
        } 
        if(number > 1) {
            if(gameData.marunouchi.cars + number <= gameData.marunouchi.locomotives * carPerLoco) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('car', gameData.marunouchi.cars, number);
                gameData.marunouchi.cars += number;
            }
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('car', gameData.marunouchi.cars);
            if(gameData.marunouchi.cars + maxNumber <= gameData.marunouchi.locomotives * carPerLoco) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('car', gameData.marunouchi.cars, maxNumber);
                gameData.marunouchi.cars += maxNumber;
            } else {
                buyMaruCar((gameData.marunouchi.locomotives * carPerLoco) - gameData.marunouchi.cars); //buys to max capacity
            }
        }
    maruCarCost = calcCarCost(gameData.marunouchi.cars);
    update("money", format(gameData.money));
    refreshMarunouchi();
    updateMaxPassengers();	// because max is dependent on car number
    }
}
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
        updateMps();            // because mps is dependent on line number
        gtag("event", "level_start", {
          level_name: "Hibiya Line"
        });
}}
function buyHibiStation(number) {
	if(gameData.money >= hibiStationCost) {
        if(number === 1) {
            gameData.hibiya.stations += 1;
            gameData.money -= hibiStationCost;
        } 
        if(number > 1) {
            // calculate cost first because it depends on current number
            gameData.money -= calcMultiBuyCost('station', gameData.hibiya.stations, number);
            gameData.hibiya.stations += number;
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('station', gameData.hibiya.stations);
            // calculate cost first because it depends on current number
            gameData.money -= calcMultiBuyCost('station', gameData.hibiya.stations, maxNumber);
            gameData.hibiya.stations += maxNumber;
        }
        hibiStationCost = calcStationCost(gameData.hibiya.stations);
        update("money", format(gameData.money));
        refreshHibiya();
        updatePps();					// because pps is dependent on station number
    }
}
function buyHibiLocomotive(number) {
	if(gameData.hibiya.locomotives < gameData.hibiya.stations * locoPerStat && gameData.money >= hibiLocomotiveCost) {
        if(number === 1) {
            gameData.hibiya.locomotives += 1;
            gameData.money -= hibiLocomotiveCost;
        } 
        if(number > 1) {
            if(gameData.hibiya.locomotives + number <= gameData.hibiya.stations * locoPerStat) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('locomotive', gameData.hibiya.locomotives, number);
                gameData.hibiya.locomotives += number;
            }
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('locomotive', gameData.hibiya.locomotives);
            if(gameData.hibiya.locomotives + maxNumber <= gameData.hibiya.stations * locoPerStat) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('locomotive', gameData.hibiya.locomotives, maxNumber);
                gameData.hibiya.locomotives += maxNumber;
            } else {
                buyHibiLocomotive((gameData.hibiya.stations * locoPerStat) - gameData.hibiya.locomotives); //buys to max capacity
            }
        }
    hibiLocomotiveCost = calcLocomotiveCost(gameData.hibiya.locomotives);
    update("money", format(gameData.money));
    refreshHibiya();
    }
}
function buyHibiCar(number) {
	if(gameData.hibiya.cars < gameData.hibiya.locomotives * carPerLoco && gameData.money >= hibiCarCost) {
        if(number === 1) {
            gameData.hibiya.cars += 1;
            gameData.money -= hibiCarCost;
        } 
        if(number > 1) {
            if(gameData.hibiya.cars + number <= gameData.hibiya.locomotives * carPerLoco) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('car', gameData.hibiya.cars, number);
                gameData.hibiya.cars += number;
            }
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('car', gameData.hibiya.cars);
            if(gameData.hibiya.cars + maxNumber <= gameData.hibiya.locomotives * carPerLoco) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('car', gameData.hibiya.cars, maxNumber);
                gameData.hibiya.cars += maxNumber;
            } else {
                buyHibiCar((gameData.hibiya.locomotives * carPerLoco) - gameData.hibiya.cars); //buys to max capacity
            }
        }
    hibiCarCost = calcCarCost(gameData.hibiya.cars);
    update("money", format(gameData.money));
    refreshHibiya();
    updateMaxPassengers();	// because max is dependent on car number
    }
}
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
        updateMps();            // because mps is dependent on line number
        gtag("event", "level_start", {
          level_name: "Tozai Line"
        });
		show("prestigeTabButton");	// prestige unlocks here
		document.getElementById("prestigeTabButton").setAttribute("class", "button nav highlight")
}}
function buyTozaStation(number) {
	if(gameData.money >= tozaStationCost) {
        if(number === 1) {
            gameData.tozai.stations += 1;
            gameData.money -= tozaStationCost;
        } 
        if(number > 1) {
            // calculate cost first because it depends on current number
            gameData.money -= calcMultiBuyCost('station', gameData.tozai.stations, number);
            gameData.tozai.stations += number;
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('station', gameData.tozai.stations);
            // calculate cost first because it depends on current number
            gameData.money -= calcMultiBuyCost('station', gameData.tozai.stations, maxNumber);
            gameData.tozai.stations += maxNumber;
        }
        tozaStationCost = calcStationCost(gameData.tozai.stations);
        update("money", format(gameData.money));
        refreshTozai();
        updatePps();					// because pps is dependent on station number
    }
}
function buyTozaLocomotive(number) {
	if(gameData.tozai.locomotives < gameData.tozai.stations * locoPerStat && gameData.money >= tozaLocomotiveCost) {
        if(number === 1) {
            gameData.tozai.locomotives += 1;
            gameData.money -= tozaLocomotiveCost;
        } 
        if(number > 1) {
            if(gameData.tozai.locomotives + number <= gameData.tozai.stations * locoPerStat) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('locomotive', gameData.tozai.locomotives, number);
                gameData.tozai.locomotives += number;
            }
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('locomotive', gameData.tozai.locomotives);
            if(gameData.tozai.locomotives + maxNumber <= gameData.tozai.stations * locoPerStat) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('locomotive', gameData.tozai.locomotives, maxNumber);
                gameData.tozai.locomotives += maxNumber;
            } else {
                buyTozaLocomotive((gameData.tozai.stations * locoPerStat) - gameData.tozai.locomotives); //buys to max capacity
            }
        }
    tozaLocomotiveCost = calcLocomotiveCost(gameData.tozai.locomotives);
    update("money", format(gameData.money));
    refreshTozai();
    }
}
function buyTozaCar(number) {
	if(gameData.tozai.cars < gameData.tozai.locomotives * carPerLoco && gameData.money >= tozaCarCost) {
        if(number === 1) {
            gameData.tozai.cars += 1;
            gameData.money -= tozaCarCost;
        } 
        if(number > 1) {
            if(gameData.tozai.cars + number <= gameData.tozai.locomotives * carPerLoco) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('car', gameData.tozai.cars, number);
                gameData.tozai.cars += number;
            }
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('car', gameData.tozai.cars);
            if(gameData.tozai.cars + maxNumber <= gameData.tozai.locomotives * carPerLoco) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('car', gameData.tozai.cars, maxNumber);
                gameData.tozai.cars += maxNumber;
            } else {
                buyTozaCar((gameData.tozai.locomotives * carPerLoco) - gameData.tozai.cars); //buys to max capacity
            }
        }
    tozaCarCost = calcCarCost(gameData.tozai.cars);
    update("money", format(gameData.money));
    refreshTozai();
    updateMaxPassengers();	// because max is dependent on car number
    }
}
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
        updateMps();            // because mps is dependent on line number
        gtag("event", "level_start", {
          level_name: "Chiyoda Line"
        });
}}
function buyChiyoStation(number) {
	if(gameData.money >= chiyoStationCost) {
        if(number === 1) {
            gameData.chiyoda.stations += 1;
            gameData.money -= chiyoStationCost;
        } 
        if(number > 1) {
            // calculate cost first because it depends on current number
            gameData.money -= calcMultiBuyCost('station', gameData.chiyoda.stations, number);
            gameData.chiyoda.stations += number;
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('station', gameData.chiyoda.stations);
            // calculate cost first because it depends on current number
            gameData.money -= calcMultiBuyCost('station', gameData.chiyoda.stations, maxNumber);
            gameData.chiyoda.stations += maxNumber;
        }
        chiyoStationCost = calcStationCost(gameData.chiyoda.stations);
        update("money", format(gameData.money));
        refreshChiyoda();
        updatePps();					// because pps is dependent on station number
    }
}
function buyChiyoLocomotive(number) {
	if(gameData.chiyoda.locomotives < gameData.chiyoda.stations * locoPerStat && gameData.money >= chiyoLocomotiveCost) {
        if(number === 1) {
            gameData.chiyoda.locomotives += 1;
            gameData.money -= chiyoLocomotiveCost;
        } 
        if(number > 1) {
            if(gameData.chiyoda.locomotives + number <= gameData.chiyoda.stations * locoPerStat) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('locomotive', gameData.chiyoda.locomotives, number);
                gameData.chiyoda.locomotives += number;
            }
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('locomotive', gameData.chiyoda.locomotives);
            if(gameData.chiyoda.locomotives + maxNumber <= gameData.chiyoda.stations * locoPerStat) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('locomotive', gameData.chiyoda.locomotives, maxNumber);
                gameData.chiyoda.locomotives += maxNumber;
            } else {
                buyChiyoLocomotive((gameData.chiyoda.stations * locoPerStat) - gameData.chiyoda.locomotives); //buys to max capacity
            }
        }
    chiyoLocomotiveCost = calcLocomotiveCost(gameData.chiyoda.locomotives);
    update("money", format(gameData.money));
    refreshChiyoda();
    }
}
function buyChiyoCar(number) {
	if(gameData.chiyoda.cars < gameData.chiyoda.locomotives * carPerLoco && gameData.money >= chiyoCarCost) {
        if(number === 1) {
            gameData.chiyoda.cars += 1;
            gameData.money -= chiyoCarCost;
        } 
        if(number > 1) {
            if(gameData.chiyoda.cars + number <= gameData.chiyoda.locomotives * carPerLoco) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('car', gameData.chiyoda.cars, number);
                gameData.chiyoda.cars += number;
            }
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('car', gameData.chiyoda.cars);
            if(gameData.chiyoda.cars + maxNumber <= gameData.chiyoda.locomotives * carPerLoco) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('car', gameData.chiyoda.cars, maxNumber);
                gameData.chiyoda.cars += maxNumber;
            } else {
                buyChiyoCar((gameData.chiyoda.locomotives * carPerLoco) - gameData.chiyoda.cars); //buys to max capacity
            }
        }
    chiyoCarCost = calcCarCost(gameData.chiyoda.cars);
    update("money", format(gameData.money));
    refreshChiyoda();
    updateMaxPassengers();	// because max is dependent on car number
    }
}
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
        updateMps();            // because mps is dependent on line number
        gtag("event", "level_start", {
          level_name: "Yurakucho Line"
        });
}}
function buyYuraStation(number) {
	if(gameData.money >= yuraStationCost) {
        if(number === 1) {
            gameData.yurakucho.stations += 1;
            gameData.money -= yuraStationCost;
        } 
        if(number > 1) {
            // calculate cost first because it depends on current number
            gameData.money -= calcMultiBuyCost('station', gameData.yurakucho.stations, number);
            gameData.yurakucho.stations += number;
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('station', gameData.yurakucho.stations);
            // calculate cost first because it depends on current number
            gameData.money -= calcMultiBuyCost('station', gameData.yurakucho.stations, maxNumber);
            gameData.yurakucho.stations += maxNumber;
        }
        yuraStationCost = calcStationCost(gameData.yurakucho.stations);
        update("money", format(gameData.money));
        refreshYurakucho();
        updatePps();					// because pps is dependent on station number
    }
}
function buyYuraLocomotive(number) {
	if(gameData.yurakucho.locomotives < gameData.yurakucho.stations * locoPerStat && gameData.money >= yuraLocomotiveCost) {
        if(number === 1) {
            gameData.yurakucho.locomotives += 1;
            gameData.money -= yuraLocomotiveCost;
        } 
        if(number > 1) {
            if(gameData.yurakucho.locomotives + number <= gameData.yurakucho.stations * locoPerStat) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('locomotive', gameData.yurakucho.locomotives, number);
                gameData.yurakucho.locomotives += number;
            }
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('locomotive', gameData.yurakucho.locomotives);
            if(gameData.yurakucho.locomotives + maxNumber <= gameData.yurakucho.stations * locoPerStat) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('locomotive', gameData.yurakucho.locomotives, maxNumber);
                gameData.yurakucho.locomotives += maxNumber;
            } else {
                buyYuraLocomotive((gameData.yurakucho.stations * locoPerStat) - gameData.yurakucho.locomotives); //buys to max capacity
            }
        }
    yuraLocomotiveCost = calcLocomotiveCost(gameData.yurakucho.locomotives);
    update("money", format(gameData.money));
    refreshYurakucho();
    }
}
function buyYuraCar(number) {
	if(gameData.yurakucho.cars < gameData.yurakucho.locomotives * carPerLoco && gameData.money >= yuraCarCost) {
        if(number === 1) {
            gameData.yurakucho.cars += 1;
            gameData.money -= yuraCarCost;
        } 
        if(number > 1) {
            if(gameData.yurakucho.cars + number <= gameData.yurakucho.locomotives * carPerLoco) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('car', gameData.yurakucho.cars, number);
                gameData.yurakucho.cars += number;
            }
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('car', gameData.yurakucho.cars);
            if(gameData.yurakucho.cars + maxNumber <= gameData.yurakucho.locomotives * carPerLoco) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('car', gameData.yurakucho.cars, maxNumber);
                gameData.yurakucho.cars += maxNumber;
            } else {
                buyYuraCar((gameData.yurakucho.locomotives * carPerLoco) - gameData.yurakucho.cars); //buys to max capacity
            }
        }
    yuraCarCost = calcCarCost(gameData.yurakucho.cars);
    update("money", format(gameData.money));
    refreshYurakucho();
    updateMaxPassengers();	// because max is dependent on car number
    }
}
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
        updateMps();            // because mps is dependent on line number
        gtag("event", "level_start", {
          level_name: "Hanzomon Line"
        });
}}
function buyHanStation(number) {
	if(gameData.money >= hanStationCost) {
        if(number === 1) {
            gameData.hanzomon.stations += 1;
            gameData.money -= hanStationCost;
        } 
        if(number > 1) {
            // calculate cost first because it depends on current number
            gameData.money -= calcMultiBuyCost('station', gameData.hanzomon.stations, number);
            gameData.hanzomon.stations += number;
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('station', gameData.hanzomon.stations);
            // calculate cost first because it depends on current number
            gameData.money -= calcMultiBuyCost('station', gameData.hanzomon.stations, maxNumber);
            gameData.hanzomon.stations += maxNumber;
        }
        hanStationCost = calcStationCost(gameData.hanzomon.stations);
        update("money", format(gameData.money));
        refreshHanzomon();
        updatePps();					// because pps is dependent on station number
    }
}
function buyHanLocomotive(number) {
	if(gameData.hanzomon.locomotives < gameData.hanzomon.stations * locoPerStat && gameData.money >= hanLocomotiveCost) {
        if(number === 1) {
            gameData.hanzomon.locomotives += 1;
            gameData.money -= hanLocomotiveCost;
        } 
        if(number > 1) {
            if(gameData.hanzomon.locomotives + number <= gameData.hanzomon.stations * locoPerStat) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('locomotive', gameData.hanzomon.locomotives, number);
                gameData.hanzomon.locomotives += number;
            }
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('locomotive', gameData.hanzomon.locomotives);
            if(gameData.hanzomon.locomotives + maxNumber <= gameData.hanzomon.stations * locoPerStat) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('locomotive', gameData.hanzomon.locomotives, maxNumber);
                gameData.hanzomon.locomotives += maxNumber;
            } else {
                buyHanLocomotive((gameData.hanzomon.stations * locoPerStat) - gameData.hanzomon.locomotives); //buys to max capacity
            }
        }
    hanLocomotiveCost = calcLocomotiveCost(gameData.hanzomon.locomotives);
    update("money", format(gameData.money));
    refreshHanzomon();
    }
}
function buyHanCar(number) {
	if(gameData.hanzomon.cars < gameData.hanzomon.locomotives * carPerLoco && gameData.money >= hanCarCost) {
        if(number === 1) {
            gameData.hanzomon.cars += 1;
            gameData.money -= hanCarCost;
        } 
        if(number > 1) {
            if(gameData.hanzomon.cars + number <= gameData.hanzomon.locomotives * carPerLoco) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('car', gameData.hanzomon.cars, number);
                gameData.hanzomon.cars += number;
            }
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('car', gameData.hanzomon.cars);
            if(gameData.hanzomon.cars + maxNumber <= gameData.hanzomon.locomotives * carPerLoco) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('car', gameData.hanzomon.cars, maxNumber);
                gameData.hanzomon.cars += maxNumber;
            } else {
                buyHanCar((gameData.hanzomon.locomotives * carPerLoco) - gameData.hanzomon.cars); //buys to max capacity
            }
        }
    hanCarCost = calcCarCost(gameData.hanzomon.cars);
    update("money", format(gameData.money));
    refreshHanzomon();
    updateMaxPassengers();	// because max is dependent on car number
    }
}
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
        updateMps();            // because mps is dependent on line number
        gtag("event", "level_start", {
          level_name: "Namboku Line"
        });
}}
function buyNamStation(number) {
	if(gameData.money >= namStationCost) {
        if(number === 1) {
            gameData.namboku.stations += 1;
            gameData.money -= namStationCost;
        } 
        if(number > 1) {
            // calculate cost first because it depends on current number
            gameData.money -= calcMultiBuyCost('station', gameData.namboku.stations, number);
            gameData.namboku.stations += number;
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('station', gameData.namboku.stations);
            // calculate cost first because it depends on current number
            gameData.money -= calcMultiBuyCost('station', gameData.namboku.stations, maxNumber);
            gameData.namboku.stations += maxNumber;
        }
        namStationCost = calcStationCost(gameData.namboku.stations);
        update("money", format(gameData.money));
        refreshNamboku();
        updatePps();					// because pps is dependent on station number
    }
}
function buyNamLocomotive(number) {
	if(gameData.namboku.locomotives < gameData.namboku.stations * locoPerStat && gameData.money >= namLocomotiveCost) {
        if(number === 1) {
            gameData.namboku.locomotives += 1;
            gameData.money -= namLocomotiveCost;
        } 
        if(number > 1) {
            if(gameData.namboku.locomotives + number <= gameData.namboku.stations * locoPerStat) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('locomotive', gameData.namboku.locomotives, number);
                gameData.namboku.locomotives += number;
            }
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('locomotive', gameData.namboku.locomotives);
            if(gameData.namboku.locomotives + maxNumber <= gameData.namboku.stations * locoPerStat) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('locomotive', gameData.namboku.locomotives, maxNumber);
                gameData.namboku.locomotives += maxNumber;
            } else {
                buyNamLocomotive((gameData.namboku.stations * locoPerStat) - gameData.namboku.locomotives); //buys to max capacity
            }
        }
    namLocomotiveCost = calcLocomotiveCost(gameData.namboku.locomotives);
    update("money", format(gameData.money));
    refreshNamboku();
    }
}
function buyNamCar(number) {
	if(gameData.namboku.cars < gameData.namboku.locomotives * carPerLoco && gameData.money >= namCarCost) {
        if(number === 1) {
            gameData.namboku.cars += 1;
            gameData.money -= namCarCost;
        } 
        if(number > 1) {
            if(gameData.namboku.cars + number <= gameData.namboku.locomotives * carPerLoco) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('car', gameData.namboku.cars, number);
                gameData.namboku.cars += number;
            }
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('car', gameData.namboku.cars);
            if(gameData.namboku.cars + maxNumber <= gameData.namboku.locomotives * carPerLoco) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('car', gameData.namboku.cars, maxNumber);
                gameData.namboku.cars += maxNumber;
            } else {
                buyNamCar((gameData.namboku.locomotives * carPerLoco) - gameData.namboku.cars); //buys to max capacity
            }
        }
    namCarCost = calcCarCost(gameData.namboku.cars);
    update("money", format(gameData.money));
    refreshNamboku();
    updateMaxPassengers();	// because max is dependent on car number
    }
}
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
        updateMps();            // because mps is dependent on line number
        show("endMessage");

        gtag("event", "level_start", {
          level_name: "Fukutoshin Line"
        });
}}
function buyFukuStation(number) {
	if(gameData.money >= fukuStationCost) {
        if(number === 1) {
            gameData.fukutoshin.stations += 1;
            gameData.money -= fukuStationCost;
        } 
        if(number > 1) {
            // calculate cost first because it depends on current number
            gameData.money -= calcMultiBuyCost('station', gameData.fukutoshin.stations, number);
            gameData.fukutoshin.stations += number;
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('station', gameData.fukutoshin.stations);
            // calculate cost first because it depends on current number
            gameData.money -= calcMultiBuyCost('station', gameData.fukutoshin.stations, maxNumber);
            gameData.fukutoshin.stations += maxNumber;
        }
        fukuStationCost = calcStationCost(gameData.fukutoshin.stations);
        update("money", format(gameData.money));
        refreshFukutoshin();
        updatePps();					// because pps is dependent on station number
    }
}
function buyFukuLocomotive(number) {
	if(gameData.fukutoshin.locomotives < gameData.fukutoshin.stations * locoPerStat && gameData.money >= fukuLocomotiveCost) {
        if(number === 1) {
            gameData.fukutoshin.locomotives += 1;
            gameData.money -= fukuLocomotiveCost;
        } 
        if(number > 1) {
            if(gameData.fukutoshin.locomotives + number <= gameData.fukutoshin.stations * locoPerStat) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('locomotive', gameData.fukutoshin.locomotives, number);
                gameData.fukutoshin.locomotives += number;
            }
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('locomotive', gameData.fukutoshin.locomotives);
            if(gameData.fukutoshin.locomotives + maxNumber <= gameData.fukutoshin.stations * locoPerStat) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('locomotive', gameData.fukutoshin.locomotives, maxNumber);
                gameData.fukutoshin.locomotives += maxNumber;
            } else {
                buyFukuLocomotive((gameData.fukutoshin.stations * locoPerStat) - gameData.fukutoshin.locomotives); //buys to max capacity
            }
        }
    fukuLocomotiveCost = calcLocomotiveCost(gameData.fukutoshin.locomotives);
    update("money", format(gameData.money));
    refreshFukutoshin();
    }
}
function buyFukuCar(number) {
	if(gameData.fukutoshin.cars < gameData.fukutoshin.locomotives * carPerLoco && gameData.money >= fukuCarCost) {
        if(number === 1) {
            gameData.fukutoshin.cars += 1;
            gameData.money -= fukuCarCost;
        } 
        if(number > 1) {
            if(gameData.fukutoshin.cars + number <= gameData.fukutoshin.locomotives * carPerLoco) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('car', gameData.fukutoshin.cars, number);
                gameData.fukutoshin.cars += number;
            }
        }
        if(number === 'max') {
            let maxNumber = calcMaxBuyNumber('car', gameData.fukutoshin.cars);
            if(gameData.fukutoshin.cars + maxNumber <= gameData.fukutoshin.locomotives * carPerLoco) {
                // calculate cost first because it depends on current number
                gameData.money -= calcMultiBuyCost('car', gameData.fukutoshin.cars, maxNumber);
                gameData.fukutoshin.cars += maxNumber;
            } else {
                buyFukuCar((gameData.fukutoshin.locomotives * carPerLoco) - gameData.fukutoshin.cars); //buys to max capacity
            }
        }
    fukuCarCost = calcCarCost(gameData.fukutoshin.cars);
    update("money", format(gameData.money));
    refreshFukutoshin();
    updateMaxPassengers();	// because max is dependent on car number
    }
}
// end of fukutoshin buying functions








// PRESTIGE FUNCTIONS

function refreshPrestige() {
	unrealizedPrestige = calcUnrealizedPrestige();
	update("unrealizedPrestige", `${format(unrealizedPrestige)}`)
	update("bXP", `${format(gameData.bXP)}`)
	if(gameData.tozai.line < 1) {
		hide("prestigeHead");
	} else {show("prestigeHead");}
    if( calcTotalLines() > gameData.highestLine ) {
        gameData.highestLine = calcTotalLines();
    }
    
	if(gameData.highestLine < 0) { hide("upgrade1"); } else { show("upgrade1"); }
	if(gameData.highestLine < 4) { hide("upgrade2"); } else { show("upgrade2"); }
	if(gameData.highestLine < 0) { hide("upgrade3"); } else { show("upgrade3"); }
	if(gameData.highestLine < 7) { hide("upgrade4"); } else { show("upgrade4"); }
	if(gameData.highestLine < 6) { hide("upgrade5"); } else { show("upgrade5"); }
	if(gameData.highestLine < 5) { hide("upgrade6"); } else { show("upgrade6"); }
	if(gameData.highestLine < 7) { hide("upgrade7"); } else { show("upgrade7"); }
 
    upgrade1Cost = calcUpgrade1Cost();
    update("upgrade1Lvl", format(gameData.prestige.upgrade1Lvl) );
    update("upgrade1Cost", format(upgrade1Cost) );
    update("ticketPriceEq", format(ticketPriceEq));
    upgrade2Cost = calcUpgrade2Cost();
    update("upgrade2Lvl", format(gameData.prestige.upgrade2Lvl) );
    update("upgrade2Cost", format(upgrade2Cost) );
    update("ticketPriceMax", format(ticketPriceMax));
    upgrade3Cost = calcUpgrade3Cost();
    update("upgrade3Lvl", format(gameData.prestige.upgrade3Lvl) );
    update("upgrade3Cost", format(upgrade3Cost) );
    update("ppsPerStat", format(ppsPerStat));
    upgrade4Cost = calcUpgrade4Cost();
    update("upgrade4Lvl", format(gameData.prestige.upgrade4Lvl) );
    update("upgrade4Cost", format(upgrade4Cost) );
    update("locoPerStat", format(locoPerStat));
    upgrade5Cost = calcUpgrade5Cost();
    update("upgrade5Lvl", format(gameData.prestige.upgrade5Lvl) );
    update("upgrade5Cost", format(upgrade5Cost) );
    update("carPerLoco", format(carPerLoco));
    upgrade6Cost = calcUpgrade6Cost();
    update("upgrade6Lvl", format(gameData.prestige.upgrade6Lvl) );
    update("upgrade6Cost", format(upgrade6Cost) );
    update("passPerCar", format(passPerCar));
    upgrade7Cost = calcUpgrade7Cost();
    update("upgrade7Lvl", format(gameData.prestige.upgrade7Lvl) );
    update("upgrade7Cost", format(upgrade7Cost) );


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
	return Math.floor(50 * (2 ** gameData.prestige.upgrade1Lvl));
}
function calcUpgrade2Cost() {
	return Math.floor(175 * (2	** gameData.prestige.upgrade2Lvl));
}
function calcUpgrade3Cost() {
	return Math.floor(10 * (1.1	** gameData.prestige.upgrade3Lvl));
}
function calcUpgrade4Cost() {
	return Math.floor(1000 * (4	** gameData.prestige.upgrade4Lvl));
}
function calcUpgrade5Cost() {
	return Math.floor(400 * (2	** gameData.prestige.upgrade5Lvl));
}
function calcUpgrade6Cost() {
	return Math.floor(200 * (1.2	** gameData.prestige.upgrade6Lvl));
}
function calcUpgrade7Cost() {
	return Math.floor(4000 * (5 ** gameData.prestige.upgrade7Lvl));
}



function prestige() {
	clearInterval(autosaveLoop);
	if(confirm(`This will reset your progress and give you ${format(unrealizedPrestige)} Business Expertise. Are you sure?`) === true) {
        if( calcTotalLines() > gameData.highestLine ) {
            gameData.highestLine = calcTotalLines();
        }
		unrealizedPrestige = calcUnrealizedPrestige();
		prestigeReset();
		gameData.bXP += unrealizedPrestige;
		save();
		console.log('Prestige Successful!');
        gtag("event", "level_up",);
		location.reload();  // needs this to re-enable autosave
	} else {
		console.log('Prestige Cancelled.')
		location.reload();  // needs this to re-enable autosave
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
        update("ticketPriceEq", format(ticketPriceEq));
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
        update("ticketPriceMax", format(ticketPriceMax));
		update("bXP", `${format(gameData.bXP)}`);
	}
}

function buyUpgrade3() {
	if(gameData.bXP >= upgrade3Cost ) {
		gameData.prestige.upgrade3Lvl += 1;
		ppsPerStat = ppsPerStatConst + (2 * gameData.prestige.upgrade3Lvl);
		gameData.bXP -= upgrade3Cost;
		upgrade3Cost = calcUpgrade3Cost();
		update("upgrade3Lvl", format(gameData.prestige.upgrade3Lvl) );
		update("upgrade3Cost", format(upgrade3Cost) );
        update("ppsPerStat", format(ppsPerStat));
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
        update("locoPerStat", format(locoPerStat));
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
        update("carPerLoco", format(carPerLoco));
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
        update("passPerCar", format(passPerCar));
		update("bXP", `${format(gameData.bXP)}`);
		updateMaxPassengers();
	}
}


function buyUpgrade7() {
	if(gameData.bXP >= upgrade7Cost) {
		gameData.prestige.upgrade7Lvl += 1;
		gameData.bXP -= upgrade7Cost;
		upgrade7Cost = calcUpgrade7Cost();
		update("upgrade7Lvl", format(gameData.prestige.upgrade7Lvl) );
		update("upgrade7Cost", format(upgrade7Cost) );
		update("bXP", `${format(gameData.bXP)}`);
		updateMps();
	}
}


















// Game Loop
var gameLoop = window.setInterval(function() {
    makeMoney(mps);
	generatePassengers(pps);
	
}, 1000);



// Autosave Loop
var autosaveLoop = window.setInterval(function() {
	save();
	
	
}, 1000);
