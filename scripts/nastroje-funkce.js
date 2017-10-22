/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - základní funkce pro panel nástrojů

// ===========================================================================
// =~ Globální proměnné ~=====================================================

// Informace o nástrojích
nastroje = new Object();

// Panel nástrojů
nastroje.nastroje = new Array(
	[ "karel", "tip-karel", "Robot Karel",
		"Přemísti Karla (jeden klik), otoč Karla vlevo (dvojklik)" ],
	[ "domov", "tip-domov", "Domov", "Přemísti Karlův domov" ],
	[ "zed", "tip-zed", "Zeď", "Postav, nebo zbourej zeď" ],
	[ "znacka-plus", "tip-znacka-plus", "Polož značku",
		"Polož jednu značku, nejvíce však 8 značek na jedno políčko" ],
	[ "znacka-minus", "tip-znacka-minus", "Zvedni značku",
		"Zvedni jednu značku, pokud je alespoň jedna na políčku" ],
	null,
	[ "smaz-vse", "tip-smaz-vse", "Vyčisti město",
		"Vyčisti celé město, umísti Karla a domov do levého dolního rohu" ],
	[ "smaz", "tip-smaz", "Posbírej značky",
		"Posbírej všechny značky ze všech políček města" ],
	null,
	[ "nacist", "tip-nacist", "Načti město", "Načti uložené město (i slovník)" ],
	[ "ulozit", "tip-ulozit", "Ulož město", "Ulož město pro budoucí použití" ],
	[ "exportovat-k99", "tip-exportovat-k99", "Exportuj město",
		"Ulož město do formátu Visual Karel 99" ]
);
nastroje.nastroje.id_prefix = "nastroje-";
nastroje.nastroje.mys = "nastroje.mys";

// Objekt pro práci s myší
nastroje.mys = new Mys(new Tooltip());

// ===========================================================================
// =~ Základní funkce pro práci s nástroji ~==================================

nastroje.zobraz_pozici = function (vyber)
{
	if ( vyber ) {
		document.getElementById("pozice-x").firstChild.firstChild.data = vyber.x+1;
		document.getElementById("pozice-y").firstChild.firstChild.data = vyber.y+1;
	} else {
		document.getElementById("pozice-x").firstChild.firstChild.data = "\u2022";
		document.getElementById("pozice-y").firstChild.firstChild.data = "\u2022";
	}
}

nastroje.mys.prekresli_stav = function(nastroj, detail, zvyraznen, stisknut,
vybran)
{
	tvoric.zvyraznovac(
		nastroje.nastroje.id_prefix+nastroj, zvyraznen, stisknut, vybran);
}

nastroje.mys.proved_zvyrazneni = function(nastroj, detail)
{
	return true;
}

nastroje.mys.proved_vyber = function(nastroj, detail)
{
	switch ( nastroj )
	{
		case "smaz-vse": {
			ladici_vypis(LADENI, "nastroje.mys.proved_vyber", "výmaz města");
			mesto.vymaz_mesto();
			return false;
		}
		case "smaz": {
			ladici_vypis(LADENI, "nastroje.mys.proved_vyber", "výmaz značek");
			mesto.vymaz_znacky();
			return false;
		}
		case "nacist": {
			data.nacitani.nacti();
			return false;
		}
		case "ulozit": {
			data.ukladani.uloz_mesto();
			return false;
		}
		case "exportovat-k99": {
			data.ukladani.export_mesto_k99();
			return false;
		}
		default: {
			ladici_vypis(LADENI, "nastroje.mys.proved_vyber", "změna nástroje na '"+nastroj+"'");
			return true;
		}
	}
}

nastroje.vybrany = function ()
{
	return nastroje.mys.vybran.info;
}

nastroje.vyber = function (nastroj)
{
	nastroje.mys.vyber(nastroj);
}

nastroje.mys.tooltip.obnov = function (tooltip, info, detail)
{
	tvoric.obnov_tooltip( tooltip, detail.ikona, detail.nadpis, detail.popis );
}
