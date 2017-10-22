/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - funkce konzole pro ladění

// ===========================================================================
// =~ Globální nastavení ~====================================================

// Maximální počet řádek ve výpisu
// TODO: Nastavení v uživatelském rozhraní
nastaveni.pocet_radek_vypisu = 120;

// ===========================================================================
// =~ Globální proměnné ~=====================================================

// Informace o vypisu
vypisy = new Object();

// Aktuální počet řádek výpisu
vypisy.pocet_radek = 0;

// Sledování myši
vypisy.stisknute = false;

// Výpis v obráceném pořadí (novější první)
vypisy.obracene = true;

// Úrovně ladicích výpisů
CHYBA = 1;	// Činnost nelze provést a uživatel nebyl informován
VAROVANI = 2;	// Činnost nelze provést, ale uživatel byl informován
INFORMACE = 3;	// Informace o provedené (!) činnosti
DETAIL = 4;	// Detailní informace o činnosti
LADENI = 5;	// Ladicí infomace pro vývojáře

vypisy.nazvy_urovni = new Array(
	"chyba",
	"varování",
	"informace",
	"detail",
	"ladění"
);

// Nastavená úrovně výpisů
var uroven = unescape(hodnota_cookie("uroven_ladeni"));
for ( var i = 0; i < vypisy.nazvy_urovni.length; i++ ) {
	if ( uroven == vypisy.nazvy_urovni[i] ) {
		vypisy.uroven = i+1;
		break;
	}
}

if ( vypisy.uroven == undefined ) {
	if ( je_oldium_dot_home ) {
		vypisy.uroven = DETAIL;
	} else {
		vypisy.uroven = INFORMACE;
	}
}

// Nápověda k nastavení hloubky výpisů
vypisy.uroven_tooltip = new Array(
	[ "Úroveň chyb", "Zapisuj pouze chyby" ],
	[ "Uroveň varování", "Zapisuj chyby a varování" ],
	[ "Úroveň informací", "Zapisuj chyby, varování a informativní zprávy" ],
	[ "Úroveň detailů",
		"Zapisuj chyby, varování, informativní a detailní zprávy" ],
	[ "Úroveň pro vývojáře", "Zapisuj všechny informace pro vývojáře" ]
);

vypisy.zobrazeni_tooltip = new Array(
	[ "Ladicí konzola", "Zobraz ladicí konzolu" ],
	[ "Ladicí konzola", "Skryj ladicí konzolu" ]
);

// Objekt pro práci s myší
vypisy.mys = new Mys(new Tooltip());
vypisy.mys.tooltip.muzu_zobrazit = function (info, detail) { return true; }

// ===========================================================================
// =~ Funkce pro operace s konzolí ~==========================================

function ladici_vypis(uroven, funkce, info, text)
{
	if ( uroven > vypisy.uroven ) return;
	var konzola = document.getElementById("konzola");
	if ( !konzola ) return;

	if ( vypisy.pocet_radek == nastaveni.pocet_radek_vypisu ) {
		if ( ! vypisy.obracene ) {
			// Smaž první řádku ve výpisu
			konzola.removeChild(konzola.firstChild);	// Text
			konzola.removeChild(konzola.firstChild);	// <BR />
			vypisy.pocet_radek--;
		} else {
			// Smaž poslední řádku ve výpisu
			konzola.removeChild(konzola.lastChild);	// <BR />
			konzola.removeChild(konzola.lastChild);	// Text
			vypisy.pocet_radek--;
		}
	}

	if ( text == undefined ) {
		text = info;
		info = undefined;
	}

	var cas = formatuj_text(new Date());
	if ( info != undefined ) {
		info = formatuj_text(info);
	}

	var element_radka = document.createElement("SPAN");
	var element_cas = element_radka.cloneNode(false);
	var element_uroven = element_radka.cloneNode(false);
	var element_funkce = element_radka.cloneNode(false);
	if ( info != undefined ) var element_info = element_radka.cloneNode(false);
	var element_text = element_radka.cloneNode(false);
	var element_mezera = document.createTextNode("\u00A0");	// &nbsp;
	var element_br = document.createElement("BR");

	// Text
	element_cas.appendChild(document.createTextNode(cas));
	element_funkce.appendChild(document.createTextNode(funkce));
	element_uroven.appendChild(document.createTextNode(
		"["+vypisy.nazvy_urovni[uroven-1]+"]"));
	if ( info != undefined )
		element_info.appendChild(document.createTextNode("("+info+")"));
	element_text.appendChild(document.createTextNode(text));;

	// Styly
	element_radka.className = "radka";
	element_cas.className = "cas";
	element_uroven.className = "uroven";
	element_funkce.className = "funkce";
	if ( info != undefined ) element_info.className = "info";
	element_text.className = "text";

	// Tvar
	element_radka.appendChild(element_cas);
	element_radka.appendChild(element_mezera.cloneNode(false));
	element_radka.appendChild(element_uroven);
	element_radka.appendChild(element_mezera.cloneNode(false));
	element_radka.appendChild(element_funkce);
	if ( info != undefined ) {
		element_radka.appendChild(element_mezera.cloneNode(false));
		element_radka.appendChild(element_info);
	}
	element_radka.appendChild(element_mezera);
	element_radka.appendChild(element_text);

	// Zařazení do HTML
	if ( ! vypisy.obracene ) {
		konzola.appendChild(element_radka);
		konzola.appendChild(element_br);
	} else {
		konzola.insertBefore(element_br, konzola.firstChild);
		konzola.insertBefore(element_radka, konzola.firstChild);
	}

	vypisy.pocet_radek++;
}

vypisy.mys.proved_vyber = function(objekt)
{
	if ( objekt == "vypis" ) {
		return false;
	} else {
		vypisy.uroven = objekt.slice(-1);
		nastav_cookie("uroven_ladeni",
			escape(vypisy.nazvy_urovni[vypisy.uroven-1]), 365);
		return true;
	}
}

vypisy.mys.prekresli_stav = function(objekt, detail, zvyraznen, stisknut,
                                     vybran)
{
	if ( objekt != "vypis" ) {
		var element=document.getElementById("uroven");
		ladici_vypis(LADENI,"vypisy.mys.prekresli_stav",objekt,
			"nastavuji odpovídající pozadí");
		element.className = objekt;
	}
}

vypisy.mys.proved_stisk = function(objekt)
{
	if ( objekt == "vypis" ) {
		var element = document.getElementById("konzola");
		var konzola = element.parentNode;
		var ikona = document.getElementById("vypis-ikona");

		if ( konzola.style.display != "block" ) {
			konzola.style.display = "block";
			ikona.className = "ikona-sbalit";
		} else {
			konzola.style.display = "none";
			ikona.className = "ikona-rozbalit";
		}
	}
}

vypisy.mys.tooltip.obnov = function (tooltip, info, detail)
{
	if ( info == 'vypis' ) {
		var element = document.getElementById("konzola");
		var konzola = element.parentNode;
		var id = ( konzola.style.display != "block" ) ? 0 : 1;
		tvoric.obnov_tooltip( tooltip, "",
			vypisy.zobrazeni_tooltip[id][0], vypisy.zobrazeni_tooltip[id][1] );
	} else {
		tvoric.obnov_tooltip( tooltip, "", detail.nadpis, detail.popis );
	}
}

function uroven_ladeni(uroven)
{
	vypisy.mys.vyber("uroven-"+uroven);
}
