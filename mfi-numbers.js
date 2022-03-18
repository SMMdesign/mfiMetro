function format(number) { //Type does nothing yet
    let exponent = Math.floor(Math.log10(number));
    let mantissa = number / 10 ** exponent;
	
	if (exponent < 6) return number.toLocaleString("en-US");
	if (exponent >= 6 && exponent < 9) return (number / 1000000).toFixed(2) + " Million";
	if (exponent >= 9 && exponent < 12) return (number / 1000000000).toFixed(2) + " Billion";
	if (exponent >= 12 && exponent < 15) return (number / 1000000000000).toFixed(2) + " Trillion";
	if (exponent >= 15 && exponent < 18) return (number / 1000000000000000).toFixed(2) + " Quadrillion";
	if (exponent >= 18 && exponent < 21) return (number / 1000000000000000000).toFixed(2) + " Quintillion";
	if (exponent >= 21 && exponent < 24) return (number / 1000000000000000000000).toFixed(2) + " Sextillion";
	
	
	
	return mantissa.toFixed(2) + "e" + exponent //eg, 1,546 -> 1.54e3
}