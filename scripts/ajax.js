/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - funkce pro použití XMLHttpRequest (AJAX)

// ===========================================================================
// =~ Globální proměnné ~=====================================================

// Hlavní objekt
ajax = new Object();

// Typ používané metody pro AJAX
ajax.typ_metody = new Object();
ajax.typ_metody.NIC = 0;
ajax.typ_metody.JAVASCRIPT = 1;
ajax.typ_metody.ACTIVEX = 2;

// Nalezená metoda pro AJAX
ajax.metoda = ajax.typ_metody.NIC;

// ===========================================================================
// =~ Základní práce se soubory ~=============================================

// Zjištění podporované metody
ajax.zjisti_metodu = function ()
{
	ajax.metoda = ajax.typ_metody.NIC;
	try {
		if ( window.XMLHttpRequest ) {
			var nahravac = new XMLHttpRequest();
			if ( nahravac ) {
				ladici_vypis(LADENI, "ajax",
					"nalezen javascriptový XMLHttpRequest");
				ajax.metoda = ajax.typ_metody.JAVASCRIPT;
			}
		} else if ( window.ActiveXObject ) {
			var nahravac = new ActiveXObject("Microsoft.XMLHTTP");
			if ( nahravac ) {
				ladici_vypis(LADENI, "ajax", "nalezen ActiveX objekt XMLHTTP");
				ajax.metoda = ajax.typ_metody.ACTIVEX;
			}
		}
	} catch (e) {}

	if ( ajax.metoda == ajax.typ_metody.NIC ) {
		ladici_vypis(CHYBA, "ajax", "nenalezena vhodná metoda");
	}

	return ajax.metoda;
}

// Vrátí true, pokud je možné použít metodu XMLHttpRequest
ajax.je_funkcni = function ()
{
	return (ajax.metoda != ajax.typ_metody.NIC);
}

// Vytvoření nahrávače
ajax.vrat_nahravac = function ()
{
	try {
		if ( ajax.metoda == ajax.typ_metody.JAVASCRIPT ) {
			return new XMLHttpRequest();
		} else if ( ajax.metoda == ajax.typ_metody.ACTIVEX ) {
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
	} catch (vse) {}
	return undefined;
}

// Nahrání souboru
ajax.nahraj_soubor = function (nahravac, url, notifikace, asynchronne)
{
	if ( nahravac ) {
		try {
			if ( notifikace ) {
				nahravac.onreadystatechange = notifikace;
			}
			nahravac.open("GET", url, asynchronne);
			nahravac.send(null);
			return nahravac;
		} catch (vse) {
			return undefined;
		}
	} else {
		return undefined;
	}
}

// Nahrání souboru asynchronně
ajax.nahraj_soubor_pozdeji = function (nahravac, url, notifikace)
{
	return this.nahraj_soubor(nahravac, url, notifikace, true);
}

// Zkontrolování podporované metody
ajax.kontrola_metody = function ()
{
	if ( ajax.zjisti_metodu() == ajax.typ_metody.NIC ) {
		alert(
			"Nepodařilo se nalézt vhodnou metodu pro nahrávání souborů.\n\n" +
			"Funkce spojování slovníku nebude dostupná."
		);
	}
}
