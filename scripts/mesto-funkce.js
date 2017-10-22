/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - základní funkce pro město

// ===========================================================================
// =~ Globální nastavení ~====================================================

// Čas pro dvojklik v milisekundách
// TODO: Nastavení v uživatelském rozhraní
nastaveni.dvojklik = 500;

// ===========================================================================
// =~ Globální proměnné ~=====================================================

// Pozice Karla
karel = new Object();

// Směr: 0-východ, 1-sever, 2-západ, 3-jih
karel.VYCHOD = 0;
karel.SEVER = 1;
karel.ZAPAD = 2;
karel.JIH = 3;

karel.smer = karel.VYCHOD;
karel.pozice = {x:0, y:0};
karel.nazev_smeru = new Array("vychod", "sever", "zapad", "jih");
karel.nazev_smeru_plny = new Array("východ", "sever", "západ", "jih");

// Pozice domova
domov = new Object();
domov.pozice = {x:0, y:0};

// Konstanty pohybu (východ, sever, západ, jih)
plus = new Object();
plus.x = new Array(1, 0, -1,  0);
plus.y = new Array(0, 1,  0, -1);

// Struktura města
mesto = new Object();

// Velikost
mesto.velikost = {x: 10, y: 10};

// Pole
mesto.pole = new Array();
mesto.pole[0] = new Array();
for ( var x = 0; x < mesto.velikost.x; x++ ) {
   mesto.pole[0].push(0);
}
for ( var y = 1; y < mesto.velikost.y; y++ ) {
	mesto.pole[y] = mesto.pole[0].concat();
}

// Názvy obrázků
mesto.obrazky = new Array();

mesto.obrazky[-1] = "zed";
mesto.obrazky[0] = null;
for ( var i = 1; i < 9; i++ ) {	// A potom značky
	mesto.obrazky[i] = "znacka-"+i;
}

// Objekt pro práci s myší
mesto.mys = new Mys();

// Čas posledního kliku (provedení akce) - pro dvojklik
mesto.posledni_klik = null;

// ===========================================================================
// =~ Základní funkce pro aktualizaci města ~=================================

// Nastav správné parametry políčka podle města
mesto.prekresli_pole = function (pozice)
{
	var element = document.getElementById('pozice_'+pozice.x+'_'+pozice.y);
	var pole = mesto.pole[pozice.x][pozice.y];
	var obrazek = mesto.obrazky[pole];

	if ( element.className != obrazek ) {
		element.className = obrazek;
	}
}

// Nastav pozici Karla
mesto.pozice_karla = function (pozice)
{
	if ( pozice.x >= 0 && pozice.x < mesto.velikost.x &&
		pozice.y >= 0 && pozice.y < mesto.velikost.y &&
		mesto.pole[pozice.x][pozice.y] >= 0 )
	{
		var element = document.getElementById('pozice_karel');
		element.style.left = (pozice.x*32)+"px";
		element.style.top = ((mesto.velikost.y - pozice.y - 1)*32)+"px";
		karel.pozice = pozice;
		ladici_vypis(DETAIL, "mesto.pozice_karla", pozice, "Karel umístěn");
		return true;
	} else {
		ladici_vypis(CHYBA, "mesto.pozice_karla", pozice, "Karla nelze umístit kvůli zdi");
		return false;
	}
}

// Nastav orientaci Karla
mesto.orientace_karla = function (smer)
{
	smer %= karel.nazev_smeru.length;
	if ( smer < 0 ) smer += karel.nazev_smeru.length;
	var element = document.getElementById('pozice_karel');
	element.className = "karel-"+karel.nazev_smeru[smer];
	karel.smer = smer;
	ladici_vypis(DETAIL, "mesto.orientace_karla",
		"Karel nasměrován na "+karel.nazev_smeru_plny[smer]);
}

// Nastav pozici Domova
mesto.pozice_domova = function (pozice)
{
	if ( mesto.pole[pozice.x][pozice.y] >= 0 ) {
		var element = document.getElementById('pozice_domov');
		element.style.left = (pozice.x*32)+"px";
		element.style.top = ((mesto.velikost.y - pozice.y - 1)*32)+"px";
		domov.pozice = pozice;
		ladici_vypis(DETAIL, "mesto.pozice_domova", pozice, "domov umístěn");
	} else {
		ladici_vypis(CHYBA, "mesto.pozice_domova", pozice, "domov nelze umístit kvůli zdi");
	}
}

// Nahrání celého města
mesto.nahraj_mesto = function (karel_pozice, smer, domov_pozice, mesto_pole)
{
	var uzivatel_chce = window.confirm("Opravdu si přejete nahrát město?");
	if ( uzivatel_chce ) {
		mesto.velikost.x = mesto_pole.length;
		mesto.velikost.y = mesto_pole[0].length;
		
		this.pozice_karla(karel_pozice);
		this.orientace_karla(smer);
		this.pozice_domova(domov_pozice);
		for ( var x = 0; x < mesto.pole.length; x++ ) {
			for ( var y = 0; y < mesto.pole[0].length; y++ ) {
				if ( mesto.pole[x][y] != mesto_pole[x][y] ) {
					mesto.pole[x][y] = mesto_pole[x][y];
					this.prekresli_pole( {x: x, y: y} );
				}
			}
		}
	}
}

// ===========================================================================
// =~ Podmínky pro Karla ~====================================================

mesto.JE_ZED = function ()
{
	var pozice = {
		x: karel.pozice.x+plus.x[karel.smer],
		y: karel.pozice.y+plus.y[karel.smer]
	};
	return !( pozice.x >= 0 && pozice.x < mesto.velikost.x &&
		pozice.y >= 0 && pozice.y < mesto.velikost.y &&
		mesto.pole[pozice.x][pozice.y] >= 0 );
}

mesto.JE_ZNACKA = function ()
{
	return mesto.pole[karel.pozice.x][karel.pozice.y] > 0;
}

mesto.JE_DOMOV = function ()
{
	return ( karel.pozice.x == domov.pozice.x
		&& karel.pozice.y == domov.pozice.y );
}

mesto.JE_VYCHOD = function ()
{
	return karel.smer == karel.VYCHOD;
}

mesto.JE_SEVER = function ()
{
	return karel.smer == karel.SEVER;
}

mesto.JE_ZAPAD = function ()
{
	return karel.smer == karel.ZAPAD;
}

mesto.JE_JIH = function ()
{
	return karel.smer == karel.JIH;
}

// ===========================================================================
// =~ Práce s myší ~==========================================================

mesto.mys.prekresli_stav = function (pozice, detail, zvyraznen, stisknut,
                                     vybran)
{
	var element = document.getElementById('pozice_vyber');
	if ( zvyraznen ) {
		element.style.visibility = "visible";
		element.style.left = (pozice.x*32)+"px";
		element.style.top = ((mesto.velikost.y - pozice.y - 1)*32)+"px";
		nastroje.zobraz_pozici(pozice);
	} else if ( !this.je_zvyraznen() ) {
		element.style.visibility = "hidden";
		nastroje.zobraz_pozici(null);
	}
}

mesto.mys.proved_zvyrazneni = function(pozice, detail)
{
	return true;
}

mesto.mys.proved_vyber = function(pozice, detail)
{
	var cas = new Date();
	var rychly = (
		mesto.posledni_klik != null &&
		(cas-mesto.posledni_klik) < nastaveni.dvojklik
	);
	mesto.posledni_klik = cas;
	switch ( nastroje.vybrany() ) {
		case "karel":
			if ( ! rychly || ! jsou_shodne(pozice, karel.pozice) ) {
				mesto.pozice_karla(pozice);
			} else {
				mesto.proved_vlevo_vbok();
			}
			break;
		case "domov":
			mesto.pozice_domova(pozice);
			break;
		case "zed":
			mesto.umisti_zed(pozice);
			break;
		case "znacka-plus":
			mesto.poloz(pozice);
			break;
		case "znacka-minus":
			mesto.zvedni(pozice);
			break;
		default:
	}
	return false;
}

// ===========================================================================
// =~ Příkazy a funkce pro editaci města ~====================================

mesto.proved_poloz = function (pozice)
{
	var chyba = new Chyba();
	if ( pozice == null ) {
		pozice = {x:karel.pozice.x, y:karel.pozice.y};
	}
	if ( mesto.pole[pozice.x][pozice.y] >= 0 ) {
		if ( mesto.pole[pozice.x][pozice.y] < 8 ) {
			mesto.pole[pozice.x][pozice.y]++;
			ladici_vypis(DETAIL, "mesto.proved_poloz", pozice,
				"položena značka, aktuální počet: "+mesto.pole[pozice.x][pozice.y]);
			mesto.prekresli_pole(pozice);
		} else {
			ladici_vypis(VAROVANI, "mesto.proved_poloz", pozice,
				"příliš mnoho značek");
			chyba.nastav( true, "Nemohu položit více jak 8 značek." );
		}
	} else {
		ladici_vypis(CHYBA, "mesto.proved_poloz", pozice,
			"nelze položit značku kvůli zdi");
	}
	return new Vysledek( chyba, Vysledek.PROVEDL_AKCI );
}

mesto.proved_zvedni = function (pozice)
{
	var chyba = new Chyba();
	if ( pozice == null ) {
		pozice = {x:karel.pozice.x, y:karel.pozice.y};
	}
	if ( mesto.pole[pozice.x][pozice.y] >= 0 ) {
		if ( mesto.pole[pozice.x][pozice.y] > 0 ) {
			mesto.pole[pozice.x][pozice.y]--;
			ladici_vypis(DETAIL, "mesto.proved_zvedni", pozice,
				"zvednuta značka, aktuální počet: "+mesto.pole[pozice.x][pozice.y]);
			mesto.prekresli_pole(pozice);
		} else {
			ladici_vypis(VAROVANI, "mesto.proved_zvedni", pozice,
				"žádná značka, nelze zvednout");
			chyba.nastav( true, "Nemohu zvednout značku. Žádná tam není." );
		}
	} else {
		ladici_vypis(CHYBA, "mesto.proved_zvedni", pozice,
			"pouze zeď, nelze zvednout");
	}
	return new Vysledek( chyba, Vysledek.PROVEDL_AKCI );
}

mesto.proved_vlevo_vbok = function (pozice)
{
	mesto.orientace_karla(karel.smer+1);
	return new Vysledek( new Chyba(), Vysledek.PROVEDL_AKCI );
}

mesto.proved_krok = function (pozice)
{
	if ( pozice == null ) {
		pozice = {x:karel.pozice.x, y:karel.pozice.y};
	}
	var nova_pozice =
		{ x:pozice.x+plus.x[karel.smer], y:pozice.y+plus.y[karel.smer] };
	var chyba = new Chyba();
	if ( ! mesto.pozice_karla( nova_pozice ) ) {
		chyba.nastav( true, "Nemůžu učinit KROK, přede mnou je zeď." );
	}
	return new Vysledek( chyba, Vysledek.PROVEDL_AKCI );
}

mesto.poloz = function (pozice)
{
	var navrat = mesto.proved_poloz(pozice);
	navrat.chyba.zobraz();
}

mesto.zvedni = function (pozice)
{
	var navrat = mesto.proved_zvedni(pozice);
	navrat.chyba.zobraz();
}

mesto.umisti_zed = function (pozice)
{
	var je_karel = jsou_shodne(pozice, karel.pozice);
	var je_domov = jsou_shodne(pozice, domov.pozice);
	if ( !je_karel && !je_domov ) {
		if ( mesto.pole[pozice.x][pozice.y] >= 0 ) {
			mesto.pole[pozice.x][pozice.y] = -1;
			ladici_vypis(DETAIL, "mesto.umisti_zed", pozice, "zeď umístěna");
		} else {
			mesto.pole[pozice.x][pozice.y] = 0;
			ladici_vypis(DETAIL, "mesto.umisti_zed", pozice, "zeď zrušena");
		}
		mesto.prekresli_pole(pozice);
	} else {
		var hlaska = "";
		if ( je_karel ) {
			hlaska = "Karlovi a ";
		}
		if ( je_domov ) {
			hlaska += "domovu   ";
		}
		ladici_vypis(CHYBA, "mesto.umisti_zed", pozice,
			"nelze umístit zeď kvůli "+hlaska.slice(0,-3));
	}
}

mesto.vymaz_znacky = function ()
{
	for ( var x=0; x<mesto.pole.length; x++ ) {
		for ( var y=0; y<mesto.pole[x].length; y++ ) {
			if ( mesto.pole[x][y] > 0 ) {
				mesto.pole[x][y] = 0;
				mesto.prekresli_pole({x:x, y:y});
			}
		}
	}
	ladici_vypis(INFORMACE, "mesto.vymaz_znacky", "značky vymazány");
}

mesto.vymaz_mesto = function ()
{
	var uzivatel_chce = window.confirm("Opravdu chcete vyčistit celé město?");
	if ( uzivatel_chce ) {
		ladici_vypis(INFORMACE, "mesto.vymaz_mesto", "mažu značky");
		for ( var x=0; x<mesto.pole.length; x++ ) {
			for ( var y=0; y<mesto.pole[x].length; y++ ) {
				if ( mesto.pole[x][y] != 0 ) {
					mesto.pole[x][y] = 0;
					mesto.prekresli_pole({x:x, y:y});
				}
			}
		}
		mesto.pozice_karla({x:0, y:0});
		mesto.orientace_karla(0);
		mesto.pozice_domova({x:0, y:0});
	} else {
		ladici_vypis(DETAIL, "mesto.vymaz_mesto", "zrušené mazání města");
	}
}
