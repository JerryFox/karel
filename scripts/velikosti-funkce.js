/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - funkce pro práci s různými velikostmi Karla

// ===========================================================================
// =~ Tovární nastavení ~=====================================================

// Styl nastavený uživatelem
nastaveni.velikost = hodnota_cookie("velikost");

// ===========================================================================
// =~ Globální proměnné ~=====================================================

// Názvy různých velikostí
velikosti = [
	{jmeno: "Normální", trida: "velikost-normalni"}, 
	{jmeno: "Malý", trida: "velikost-maly"} 
];

// ===========================================================================
// =~ Základní nastavení ~====================================================

if ( nastaveni.velikost == null ) {
	nastaveni.velikost = velikosti[0].jmeno;
}

// ===========================================================================
// =~ Základní funkce pro práci se styly ~====================================

velikosti.zmen_velikost = function(velikost)
{
}

// Vyber styl po puštění klávesy
velikosti.vyber_klavesou = function()
{
	var velikost;
	ladici_vypis(LADENI, "velikosti.vyber_klavesou", "hledám vybranou velikost");
	for ( var i = 0; i < velikosti.length; i++ ) {
		var element = document.getElementById('velikost-'+i);
		if ( element && element.checked ) {
			velikost = velikosti[i].jmeno;
			ladici_vypis(LADENI, "velikosti.vyber_klavesou", "nalezena velikost "+velikost);
		}
	}

	if ( !velikost ) {
		ladici_vypis(CHYBA, "velikost.vyber_klavesou", "nenalezena vybraná velikost");
		return false;
	} else {
		this.vyber(velikost);
	}
}

// Vyber styl
velikosti.vyber = function(velikost)
{
	if ( velikost == nastaveni.velikost ) {
		ladici_vypis(LADENI, "velikost.vyber", "žádná změna velikosti, zůstává "+velikost);
		return true;
	} else {
		ladici_vypis(LADENI, "velikost.vyber", "změna velikosti na "+velikost);
	}

	// Nejdříve povolíme
	this.zmen_velikost( velikost );

	nastav_cookie("velikost", velikost, 365);
	if ( hodnota_cookie("velikost") != velikost ) {
		ladici_vypis(CHYBA, "velikosti.vyber", "nepodařilo se nastavit cookie");
	}
	nastaveni.velikost = velikost;
	return true;
}

// ===========================================================================
// =~ Aktivuj správnou velikost ~=============================================

velikosti.zmen_velikost(nastaveni.velikost);
