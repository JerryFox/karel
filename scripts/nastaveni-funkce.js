/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - základní funkce nastavení

// ===========================================================================
// =~ Globální proměnné ~=====================================================

// Objekt globálního nastavení
nastaveni = new Object();

// Základní nastavení prodlevy
nastaveni.zakladni_prodleva = 500;

// Nápověda k nastavení rychlosti provádění příkazů
nastaveni.prodleva_tooltip = new Array(
	[ 2000, "Prodleva 2,00s", "" ],
	[ 1750, "Prodleva 1,75s", "" ],
	[ 1500, "Prodleva 1,50s", "" ],
	[ 1250, "Prodleva 1,25s", "" ],
	[ 1000, "Prodleva 1,00s", "" ],
	[  750, "Prodleva 0,75s", "" ],
	[  500, "Prodleva 0,50s", "" ],
	[  250, "Prodleva 0,25s", "" ],
	[  200, "Prodleva 0,20s", "" ],
	[  150, "Prodleva 0,15s", "" ],
	[  100, "Prodleva 0,10s", "" ],
	[   50, "Prodleva 0,05s", "" ],
	[    0, "Minimální prodleva", "Prováděj příkazy tak rychle, jak to jen jde" ]
);

// Myš
nastaveni.mys = new Mys(new Tooltip());
nastaveni.mys.tooltip.muzu_zobrazit = function (info, detail) { return true; }

// ===========================================================================
// =~ Funkce pro práci s myší ~===============================================

// Proveď nastavení podle výběru
nastaveni.mys.proved_vyber = function(info, detail)
{
	nastaveni.prodleva = detail.prodleva;
	nastav_cookie("prodleva", detail.prodleva, 365);
	prikazy.jadro.prenastav_casovac(detail.prodleva);
	return true;
}

nastaveni.mys.proved_zvyrazneni = function(info, detail)
{
	return true;
}

nastaveni.mys.prekresli_stav = function(info, detail, zvyraznen, stisknut,
                                        vybran)
{
	var element=document.getElementById(info);
	var trida;
	if ( stisknut || vybran ) {
		trida = "vybrany";
	} else if ( zvyraznen ) {
		trida = "zvyrazneny";
	} else {
		trida = "nic";
	}
	ladici_vypis(LADENI, "nastaveni.mys.prekresli_stav", info,
		"nastavuji třídu na "+trida);
	element.className = trida;
}

nastaveni.mys.tooltip.obnov = function (tooltip, info, detail)
{
	tvoric.obnov_tooltip( tooltip, "", detail.nadpis, detail.popis );
}

nastaveni.nastav_prodlevu = function (prodleva)
{
	var hodnota = parseInt(prodleva);
	if ( prodleva == undefined || isNaN(hodnota) ) {
		prodleva = nastaveni.zakladni_prodleva;
	}
	var nejblizsi = { rozdil: Infinity };
	for ( var i = 0; i < nastaveni.prodleva_tooltip.length; i++ ) {
		var rozdil = Math.abs(nastaveni.prodleva_tooltip[i][0]-prodleva);
		if ( rozdil < nejblizsi.rozdil ) {
			nejblizsi.index = i;
			nejblizsi.prodleva = nastaveni.prodleva_tooltip[i][0];
			nejblizsi.rozdil = rozdil;
			nejblizsi.nadpis = nastaveni.prodleva_tooltip[i][1];
			nejblizsi.popis = nastaveni.prodleva_tooltip[i][1];
		}
	}
	var mys_info = "prodleva-"+(nejblizsi.index+1);
	var mys_detail = {
		index: nejblizsi.index,
		prodleva: nejblizsi.prodleva,
		nadpis: nejblizsi.nadpis,
		popis: nejblizsi.popis
	};

	nastaveni.mys.vyber(mys_info, mys_detail);
}
