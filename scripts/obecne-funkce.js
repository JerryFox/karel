/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - různé funkce

// ===========================================================================
// =~ Globální proměnné ~=====================================================

je_oldium_dot_home = false;

if ( /^https?:\/\/[^\/]+\.oldium\.home\//.exec(document.URL) ) {
	je_oldium_dot_home = true;
}

// ===========================================================================
// =~ Chyba při provádění příkazů ~===========================================

Chyba = function (chyba, text)
{
	if ( chyba != undefined ) {
		if ( chyba instanceof Chyba ) {
			this.chyba = chyba.chyba;
			this.text = chyba.formatuj( chyba.text );
			this.zobrazen = chyba.zobrazen;
		} else {
			this.chyba = chyba;
			this.text = text;
			this.zobrazen = false;
		}
	} else {
		this.chyba = false;
		this.zobrazen = false;
	}
}

Chyba.prototype.nastav = function (chyba, text)
{
	if ( !this.chyba ) {
		if ( chyba instanceof Chyba ) {
			this.chyba = chyba.chyba;
			this.text = chyba.formatuj(chyba.text);
			this.zobrazen = this.zobrazen || chyba.zobrazen;
		} else {
			this.chyba = chyba;
			this.text = text;
		}
	}
}

Chyba.prototype.formatuj = function (text)
{
	return text;
}

Chyba.prototype.zobraz = function ()
{
	if ( !this.zobrazen && this.chyba && this.text ) {
		alert( this.formatuj(this.text) );
		this.zobrazen = true;
	}
}

Chyba.prototype.byla_chyba = function ()
{
	return this.chyba;
}

// ===========================================================================
// =~ Výsledek provedení příkazu ~============================================

Vysledek = function (chyba, stav, hodnota)
{
	if ( !chyba ) chyba = new Chyba();

	this.chyba = chyba;										// Chyba
	this.stav = stav;
	this.hodnota = hodnota;								// Hodnota výsledku
}

Vysledek.NIC = 0;							// Žádná zvláštní akce
Vysledek.PROVEDL_AKCI = 1;		// Pokud byl proveden KROK, VLEVO-VBOK atp.
Vysledek.PRESKOC_KONEC = 2;		// Pokud se má přeskočit blok příkazů
Vysledek.KONEC = 4;						// Okamžitý konec
Vysledek.BYL_UPRAVEN = 8;			// Příkaz byl upraven

Vysledek.MASKA = Vysledek.KONEC|Vysledek.BYL_UPRAVEN;	// Maska neměnnosti

Vysledek.prototype.nastav = function (chyba, stav, hodnota)
{
	if ( chyba != null ) {
		if ( chyba instanceof Vysledek ) {
			var vysledek = chyba;
			if ( ! this.chyba.byla_chyba() ) {
				this.chyba.nastav( vysledek.chyba );
				this.stav =
					(this.stav & Vysledek.MASKA) | (vysledek.stav & (~Vysledek.MASKA));
				this.hodnota = vysledek.hodnota;
			}
			this.stav |= vysledek.stav&Vysledek.MASKA;
		} else {
			this.chyba.nastav( chyba );
			this.stav =
				((this.stav | stav) & Vysledek.MASKA) | (stav & (~Vysledek.MASKA));
			this.hodnota = hodnota;
		}
	}
}

Vysledek.prototype.byla_chyba = function ()
{
	return this.chyba.byla_chyba();
}

Vysledek.prototype.byla_akce = function ()
{
	return this.stav & Vysledek.PROVEDL_AKCI;
}

Vysledek.prototype.byl_upraven = function ()
{
	return this.stav & Vysledek.BYL_UPRAVEN;
}

Vysledek.prototype.je_konec = function ()
{
	return this.chyba.byla_chyba() || (this.stav & Vysledek.KONEC);
}

Vysledek.prototype.je_hodnota = function ()
{
	return ( !this.chyba.byla_chyba()
		&& this.hodnota != undefined && this.hodnota != null );
}

Vysledek.prototype.ma_preskocit = function ()
{
	return this.stav & Vysledek.PRESKOC_KONEC;
}

Vysledek.prototype.zobraz_chybu = function ()
{
	this.chyba.zobraz();
}

// ===========================================================================
// =~ Příkazy po nahrání dokumentu ~==========================================

seznam_po_spusteni = new Array();

function po_spusteni (funkce) {
	seznam_po_spusteni.push(funkce);
}

function spust_po_spusteni () {
	for ( var i = 0; i < seznam_po_spusteni.length; i++ ) {
		var funkce = seznam_po_spusteni[i];
		funkce();
	}
}

// ===========================================================================
// =~ Nahrání nápovědy a příkladů ~===========================================

okno_napoveda = null;
okno_priklady = null;

function otevri_okno( url, jmeno, okno )
{
	try {
		if ( okno && okno.closed() ) {
			okno = null;
		}
	} catch (e) {
	    okno = null;
	}
	if ( !okno ) {
		okno = window.open( url, jmeno );
	}
	if ( okno ) {
		okno.focus();
	}
	return okno;
}

function napoveda() {
	okno_napoveda = otevri_okno(
		"napoveda.html", "karel_napoveda", okno_napoveda
	);
}

function priklady() {
	okno_priklady = otevri_okno(
		"priklady.html", "karel_okno", okno_priklady
	);
}

// ===========================================================================
// =~ Různé funkce ~==========================================================

// Test shodnosti dvou objektů
function jsou_shodne(a, b)
{
	if ( a == null || b == null ) return false;
	var type_a = typeof(a);
	var type_b = typeof(b);
	if ( type_a != type_b ) return false;
	if ( type_a == "object" ) {
		var pocet=0;
		for ( var x in a ) {
			if ( a[x] != b[x] ) {
				return false;
			}
			pocet++;
		}
		for ( var x in b ) {
			pocet--;
		}
		return (pocet == 0);
	} else {
		return (a == b);
	}
}

// Vrať textovou reprezentaci
function formatuj_text(text)
{
	if ( text == undefined ) {
		return "nedefinován";
	} else if ( text == null ) {
		return "prázdný";
	} else {
		switch ( typeof(text) ) {
			case "boolean":
				if ( text ) {
					return "ano";
				} else {
					return "ne";
				}
			case "object":
				if ( text instanceof Date ) {
					var format = text.getUTCFullYear() + "-" +
						new String("0"+(text.getMonth()+1)).slice(-2) + "-" +
						new String("0"+(text.getDate())).slice(-2) + " " +
						new String("0"+(text.getHours())).slice(-2) + ":" +
						new String("0"+(text.getMinutes())).slice(-2) + ":" +
						new String("0"+(text.getSeconds())).slice(-2) + "." +
						new String("00"+(text.getMilliseconds())).slice(-3);
					return format;
				} else if ( "innerText" in text || "innerHTML" in text 
					|| typeof(Element) == "object" && text instanceof Element ) {
					var navrat = "";
					for ( var hodnota in text ) {
						var neni_text = ! /^((inner|outer)(HTML|Text)|text(Content)?)$/.exec(hodnota);
						var neni_funkce = (typeof(text[hodnota]) != "function");
						if ( neni_text && neni_funkce ) {
							navrat += hodnota+":"+text[hodnota]+" ";
						}
					}
					return navrat.slice(0,-1);
				} else {
					var hodnoty = new Array();
					var navrat = "";
					for ( var hodnota in text ) {
						var neni_funkce = (typeof(text[hodnota]) != "function");
						if ( neni_funkce ) {
							hodnoty.push(hodnota);
							navrat += hodnota+":"+text[hodnota]+" ";
						}
					}
					if ( hodnoty.length == 2 &&
						hodnoty[0] == 'x' || hodnoty[0] == 'y' &&
						hodnoty[1] == 'x' || hodnoty[1] == 'y'
					) {
						return "x:"+(text.x+1)+" y:"+(text.y+1);
					} else {
						return navrat.slice(0,-1);
					}
				}
			default:
				return ""+text;
		}
	}
}

// Nastav hodnotu cookie. Lze zadat buď čas, nebo počet dnů do vypršení
function nastav_cookie(nazev, hodnota, vyprsi)
{
	var text_vyprsi = "";
	if ( vyprsi != undefined ) {
		var datum;
		if ( typeof(vyprsi) == "object" ) {
			datum = text_vyprsi;
		} else {
			datum = new Date();
			datum.setTime(datum.getTime()+(vyprsi*24*60*60*1000));
		}
		text_vyprsi = "; expires="+datum.toUTCString();
	}
	var uloz = escape(hodnota);
	ladici_vypis(LADENI, "pridej_cookie", "nastavuji cookie "+nazev+"="+hodnota);
	document.cookie = nazev+"="+uloz+text_vyprsi+"; path=/";
}

// Zjisti hodnotu cookie
function hodnota_cookie(nazev)
{
	var vyhledej = nazev + "=";
	var cookie = document.cookie.split(";");
	for ( var i = 0; i < cookie.length; i++ ) {
		var hodnota = cookie[i];
		while ( hodnota.charAt(0) == " " ) {
			hodnota = hodnota.slice(1);
		}
		if ( hodnota.indexOf(vyhledej) == 0 ) {
			var vrat = unescape(hodnota.slice(vyhledej.length));
			ladici_vypis(LADENI, "hodnota_cookie", "hodnota cookie "+nazev+"="+vrat);
			return vrat;
		}
	}
	ladici_vypis(LADENI, "hodnota_cookie", "hodnota cookie "+nazev+" nenalezena");
	return null;
}

// Zruš cookie
function zrus_cookie(nazev)
{
	pridej_cookie(nazev, "", -1);
}

// Nastav text objektu
function nastav_text(element, text)
{
	if ( (element.firstChild &&
		(( typeof(Text) != "undefined" && element.firstChild instanceof Text ) ||
			element.firstChild.splitText
		))
	) {
		if ( text == "" ) {
			element.removeChild(element.firstChild);
		} else {
			element.firstChild.nodeValue = text;
		}
	} else {
		if ( text != "" ) {
			element.insertBefore(document.createTextNode(text), element.firstChild);
		}
	}
}

// Zjisti zdrojový element události (např. kde bylo kliknuto)
function zdrojovy_element(udalost)
{
	if ( ! udalost ) {
		return undefined;
	} else if ( udalost.currentTarget ) {
		return udalost.currentTarget;
	} else if ( udalost.srcElement ) {
		return udalost.srcElement;
	} else {
		return undefined;
	}
}

// Zjisti pozici objektu
function zjisti_pozici(objekt)
{
	if ( objekt != null ) {
		var otec = zjisti_pozici(objekt.offsetParent);
		return {
			x: objekt.offsetLeft+otec.x,
			y: objekt.offsetTop+otec.y
		};
	} else {
		return { x: 0, y: 0 };
	}
}

// Zjisti velikost objektu
function zjisti_velikost(objekt)
{
	return { x: objekt.clientWidth, y: objekt.clientHeight };
}

// Zjisti velikost okna prohlížeče - pouze viditelnou část bez posuvníků
function zjisti_velikost_okna()
{
	var velikost1 = zjisti_pozici( document.getElementById('okno1') );
	var velikost2 = zjisti_velikost( document.getElementById('okno2') );

	if ( velikost1.x != 0 || velikost1.y != 0 || velikost2.x == 0 ) {
		return velikost1;
	} else {
		return velikost2;
	}
}

// Zjisti pozici posuvníků
function zjisti_scroll()
{
	var element = document.documentElement;
	var body = document.body;
	return {
		x: Math.max(body.scrollLeft, element.scrollLeft),
		y: Math.max(body.scrollTop, element.scrollTop)
	};
}

// Spočítej rozměry (okraje) podle pozice a velikost
function spocitej_rozmery(pozice, velikost)
{
	return {
		levy: pozice.x,
		pravy: pozice.x + velikost.x,
		horni: pozice.y,
		dolni: pozice.y + velikost.y
	};
}

// Zmenši okraj o dané rozměry
function pridej_okraj(rozmery, okraj)
{
	return {
		levy: rozmery.levy + okraj,
		horni: rozmery.horni + okraj,
		pravy: rozmery.pravy - okraj,
		dolni: rozmery.dolni - okraj
	}
}

// Posun horizontálně
function posun_x(rozmery, posun)
{
	return {
		levy: rozmery.levy + posun,
		horni: rozmery.horni,
		pravy: rozmery.pravy + posun,
		dolni: rozmery.dolni
	};
}

// Posun vertikálně
function posun_y(rozmery, posun)
{
	return {
		levy: rozmery.levy,
		horni: rozmery.horni + posun,
		pravy: rozmery.pravy,
		dolni: rozmery.dolni + posun
	};
}

// Zjisti rozměry objektu. Pokud není určen objekt, vrať velikost okna
// prohlížeče a stránky
function zjisti_rozmery(objekt)
{
	if ( objekt != undefined ) {
		return spocitej_rozmery(zjisti_pozici(objekt), zjisti_velikost(objekt));
	} else {
		var okraj = document.getElementById('okraj').offsetTop/2;
		var stranka = document.getElementById('stranka');
		var velikost_okna = zjisti_velikost_okna();
		var scroll = zjisti_scroll();

		var okno_rozmery = {
			levy: scroll.x,
			horni: scroll.y,
			pravy: scroll.x + velikost_okna.x,
			dolni: scroll.y + velikost_okna.y
		};

		// Rozměry stránky nemůžou být menší, než je okno prohlížeče
		var stranka_rozmery = {
			levy: 0,
			horni: 0,
			pravy: Math.max( stranka.offsetWidth, okno_rozmery.pravy ),
			dolni: Math.max( stranka.offsetHeight, okno_rozmery.dolni )
		};

		ladici_vypis(LADENI, "zjisti_rozmery", okno_rozmery, "rozměry okna");
		ladici_vypis(LADENI, "zjisti_rozmery", stranka_rozmery, "rozměry stránky");

		return {
			okno: pridej_okraj( okno_rozmery, okraj ),
			stranka: pridej_okraj( stranka_rozmery, okraj )
		};
	}
}

