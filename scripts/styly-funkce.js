/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - funkce pro práci se styly

// ===========================================================================
// =~ Tovární nastavení ~=====================================================

// Styl nastavený uživatelem
nastaveni.styl = hodnota_cookie("styl");

// ===========================================================================
// =~ Globální proměnné ~=====================================================

// Názvy alternativních stylů
styly = new Array();

// Všechny pojmenované styly
styly.pojmenovane_styly = new Array();

// Všechny obrázky ve všech stylech
styly.obrazky = new Array();
styly.posledni_obrazek = undefined;
styly.pridane_obrazky = " ";

// Stav nahrávání
styly.NAHRANO = 0;
styly.CHYBA = 1;
styly.ZRUSENO = 2;

// Všechny soubory se styly, pokud se nepodařilo zjistit obrázky
styly.soubory = new Array();
styly.posledni_soubor = undefined;
styly.pridane_soubory = " ";

// ===========================================================================
// =~ Základní nastavení ~====================================================

// Zjisti všechny styly v dokumentu
var linky = document.getElementsByTagName("link");
var link_styly = new Array();
var nacteno = " ";
for ( var i = 0; i < linky.length; i++ ) {
	if ( linky[i].getAttribute("rel").indexOf("stylesheet") != -1 ) {
		link_styly.push( linky[i] );
		var jmeno;
		if ( (jmeno=linky[i].getAttribute("title")) ) {
			styly.pojmenovane_styly.push( linky[i] );
			var jmeno_esc = escape(jmeno);
			if ( nacteno.indexOf(" "+jmeno_esc+" ") == -1 ) {
				var id=linky[i].getAttribute("id");
				if ( nastaveni.styl == null ) {
					nastaveni.styl = jmeno;
				}
				styly.push( {jmeno:jmeno, trida:id} );
				nacteno += jmeno_esc+" ";
			}
		}
	}
}

// ===========================================================================
// =~ Načti všechny obrázky ~=================================================

// Přidá obrázek do fronty, pokud ještě nebyl přidán
styly.pridej_obrazek = function (obrazek)
{
	var escape_url = escape(obrazek.url);
	if ( styly.pridane_obrazky.indexOf(" "+escape_url+" ") == -1 ) {
		styly.obrazky.push(obrazek);
		styly.pridane_obrazky += escape_url + " ";
		return true;
	} else {
		return false;
	}
}

// Připraví obrázek na automatické stažení na pozadí
styly.priprav_obrazek = function (url)
{
	var obrazek = new Image();
	obrazek.onload = function () {
		window.setTimeout(function () { styly.dalsi_obrazek(styly.NAHRANO); }, 0);
	}
	obrazek.onerror = function () {
		window.setTimeout(function () { styly.dalsi_obrazek(styly.CHYBA); }, 0);
	}
	obrazek.onabort = function () {
		window.setTimeout(function () { styly.dalsi_obrazek(styly.ZRUSENO); }, 0);
	}
	return { url: url, obrazek: obrazek };
}

// Spouští stahování obrázku (dalšího) na pozadí
styly.dalsi_obrazek = function (posledni_stav)
{
	if ( this.posledni_obrazek == undefined ) {
		if ( !this.obrazky.length ) {
			return;
		}
		this.posledni_obrazek = 0;
	} else {
		if ( posledni_stav == styly.NAHRANO ) {
			ladici_vypis(DETAIL, "styly.dalsi_obrazek",
				this.obrazky[this.posledni_obrazek].url, "nahráno");
			this.posledni_obrazek++;
		} else {
			if ( posledni_stav == styly.CHYBA ) {
				ladici_vypis(CHYBA, "styly.dalsi_obrazek",
					this.obrazky[this.posledni_obrazek].url,
						"nepodařilo se nahrát obrázek");
			} else {
				ladici_vypis(CHYBA, "styly.dalsi_obrazek",
					this.obrazky[this.posledni_obrazek].url, "zrušeno");
			}
			return;
		}
	}
	if ( this.posledni_obrazek >= this.obrazky.length ) {
		if ( this.obrazky.length ) {
			ladici_vypis(INFORMACE, "styly.dalsi_obrazek", "nahráno " +
				this.obrazky.length + " obrázků do vyrovnávací paměti");
		}
		return;
	}
	var obrazek = this.obrazky[this.posledni_obrazek];
	if ( ! obrazek ) return;
	obrazek.obrazek.src = obrazek.url;
}

styly.notifikace_nahravace = function ()
{
	if ( styly.posledni_soubor >= styly.soubory.length ) return;

	var soubor = styly.soubory[styly.posledni_soubor];
	if ( soubor.notifikovano ) return;

	var nahravac = styly.soubory[styly.posledni_soubor].nahravac;
	if ( nahravac.readyState == 4 ) {
		soubor.notifikovano = true;
		if ( nahravac.status == 200 || nahravac.status == 304
			|| ( nahravac.status == 0 && nahravac.responseText ) ) {
			setTimeout( function() { styly.dalsi_soubor(styly.NAHRANO); }, 0 );
		} else {
			setTimeout( function() { styly.dalsi_soubor(styly.CHYBA); }, 0 );
		}
	}
}

// ===========================================================================
// =~ Vlastní zpracování CSS ~================================================

// Přidá soubor do fronty, pokud ještě nebyl přidán
styly.pridej_soubor = function (url)
{
	var escape_url = escape(url);
	if ( styly.pridane_soubory.indexOf(" "+escape_url+" ") == -1 ) {
		styly.soubory.push( { url: url } );
		styly.pridane_soubory += escape_url + " ";
		return true;
	} else {
		return false;
	}
}

// Započítej soubor do souborů ve frontě
styly.zapocitej_soubor = function (url)
{
	var escape_url = escape(url);
	if ( styly.pridane_soubory.indexOf(" "+escape_url+" ") == -1 ) {
		styly.pridane_soubory += escape_url + " ";
		return true;
	} else {
		return false;
	}
}

// Spouští stahování obrázku (dalšího) na pozadí
styly.dalsi_soubor = function (posledni_stav)
{
	if ( this.posledni_soubor == undefined ) {
		this.posledni_soubor = 0;
	} else {
		var soubor = this.soubory[this.posledni_soubor];
		var url = soubor.url.slice(soubor.url.indexOf("style/"));
		var nahravac = soubor.nahravac;
		if ( posledni_stav == styly.NAHRANO ) {
			ladici_vypis(DETAIL, "styly.dalsi_soubor", url, "nahráno");
			this.zpracuj_soubor( url, nahravac.responseText );
			this.posledni_soubor++;
			delete soubor.nahravac;
		} else {
			ladici_vypis(CHYBA, "styly.dalsi_soubor",
				soubor.url, "nepodařilo se nahrát");
			return;
		}
	}
	if ( this.posledni_soubor >= this.soubory.length ) {
		if ( this.obrazky.length == 0 ) {
			ladici_vypis(CHYBA, "styly-funkce",
				"vyrovnávací paměť obrázků je prázdná, očekávejte různá zpoždění");
			if ( /^https?:[\/][\/]/.exec(document.URL) ) {
				alert(
					"Nelze dopředu načíst všechny obrázky, " +
					"nenalezena vhodná metoda.\n\nOčekávejte různá zpoždění." );
			}
		} else {
			this.dalsi_obrazek();
		}
		return;
	}
	var soubor = this.soubory[this.posledni_soubor];
	if ( soubor && soubor.url ) {
		soubor.nahravac = ajax.vrat_nahravac();
		ajax.nahraj_soubor_pozdeji(soubor.nahravac, soubor.url,
		                           styly.notifikace_nahravace);
	}
}

// Zpracování obsahu souboru se styly
styly.zpracuj_soubor = function (soubor, obsah)
{
	var pridano = 0;
	var url_obrazku;
	var regex = /(-image|filter:progid):[^"']*['"]\.\.\/([^'"]+)['"]/g;	// "
	while ( url_obrazku = regex.exec(obsah) ) {
		var obrazek = styly.priprav_obrazek( url_obrazku[2] );
		if ( styly.pridej_obrazek(obrazek) ) {
			pridano++;
		}
	}
	ladici_vypis(LADENI, "styly.zpracuj_soubor", soubor, "přidáno " + pridano + " obrázků");
}

// ===========================================================================
// =~ Zjisti všechny obrázky ~================================================

styly.nahraj_obrazky = function ()
{
	// Které linky byly analyzovány
	var pocet_analyzovano = 0;
	
	// Projdi všechny styly a najdi background-image
	if ( document.styleSheets ) {
		ladici_vypis(LADENI, "styly.nahraj_obrazky", "zkouším metodu document.styleSheets");
		for ( var i = 0; i < document.styleSheets.length; i++ ) {
			var styleSheet = document.styleSheets[i];
			var rules = new Array();
			if ( styleSheet.rules ) rules = styleSheet.rules;
			if ( !rules && styleSheet.cssRules ) rules = styleSheet.cssRules;
			if ( !rules ) continue;
			var nacteno = 0;
			for ( var j = 0; j < rules.length; j++ ) {
				var cssRule = rules[j];
				var style = cssRule.style;
				if ( typeof(style) != "object" ) continue;

				var url = undefined;
				if ( style.backgroundImage && style.backgroundImage != "none" ) {
					url = style.backgroundImage;
				} else if ( style.filter ) {
					url = style.filter;
				}
				
				if ( url && url.length > 4 ) {
					url = url.slice(url.indexOf('images/'));
					url = url.slice(0, url.indexOf('"'));
					var obrazek = styly.priprav_obrazek( url );
					if ( styly.pridej_obrazek(obrazek) ) {
						nacteno++;
					}
				}
			}
			var styl = styleSheet.href.slice(styleSheet.href.indexOf('style/'));
			ladici_vypis(LADENI, "styly.nahraj_obrazky", styl, "nalezeno " + nacteno + " obrázků");

			if ( nacteno && styly.zapocitej_soubor(styleSheet.href) ) {
				pocet_analyzovano++;
			}
		}
		ladici_vypis(LADENI, "styly.nahraj_obrazky", 
			"nalezeno " + pocet_analyzovano + " stylových souborů prohlížeče");
	} else {
		ladici_vypis(LADENI, "styly.nahraj_obrazky", "metoda document.styleSheets není dostupná");
	}

	// Alternativní metoda - XMLHttpRequest
	if ( styly.obrazky.length == 0 || pocet_analyzovano < link_styly.length ) {
		// Načti všechny styly ručně a najdi v nich background-image
		if ( ajax.je_funkcni() ) {
			if ( styly.obrazky.length > 0 ) {
				ladici_vypis(LADENI, "styly.nahraj_obrazky", "zkouším dočíst styly metodou XMLHttpRequest");
			} else {
				ladici_vypis(LADENI, "styly.nahraj_obrazky", "zkouším metodu XMLHttpRequest");
			}
			for ( var i = 0; i < link_styly.length; i++ ) {
				var url = link_styly[i].href;
				if ( styly.pridej_soubor(url) ) {
					var styl = url.slice(url.indexOf('style/'));
					ladici_vypis(LADENI, "styly.nahraj_obrazky", styl, "bude načten");
					pocet_analyzovano++;
				}
			}
			ladici_vypis(INFORMACE, "styly.nahraj_obrazky", 
				"nalezeno celkem " + pocet_analyzovano + " stylových souborů");
		} else {
			if ( pocet_analyzovano == 0 ) {
				ladici_vypis(CHYBA, "styly.nahraj_obrazky",
					"nenalezena metoda pro načtení všech obrázků");
			} else {
				ladici_vypis(CHYBA, "styly.nahraj_obrazky",
					"nenalezena metoda pro dočtení zbylých stylových souborů");
			}
		}
	} else {
		ladici_vypis(INFORMACE, "styly.nahraj_obrazky", 
			"nalezeno celkem " + pocet_analyzovano + " stylových souborů");
	}

	setTimeout( function() { styly.dalsi_soubor(); }, 0 );
}

po_spusteni( function() { styly.nahraj_obrazky(); } );

// ===========================================================================
// =~ Aktivuj správný styl ~==================================================

for ( var i = 0; i < styly.pojmenovane_styly.length; i++ ) {
	var link = styly.pojmenovane_styly[i];
	var jmeno = link.getAttribute("title");
	if ( jmeno != nastaveni.styl ) {
		link.disabled = true;
	} else {
		link.disabled = false;
	}
}

// ===========================================================================
// =~ Základní funkce pro práci se styly ~====================================

styly.zmen_styl = function(styl, povolit)
{
	for ( var i = 0; i < styly.pojmenovane_styly.length; i++ ) {
		var link = styly.pojmenovane_styly[i];
		if ( (povolit && link.title == styl) ||
			(!povolit && link.title != styl) ) {
			link.disabled = !povolit;
			ladici_vypis(LADENI, "styly.zmen_styl", link.href.match(/style.*/)[0],
				"vybraný:"+formatuj_text(!link.disabled));
		}
	}
}

// Vyber styl po puštění klávesy
styly.vyber_klavesou = function()
{
	var styl;
	ladici_vypis(LADENI, "styly.vyber_klavesou", "hledám vybraný styl");
	for ( var i = 0; i < styly.length; i++ ) {
		var element = document.getElementById('styl-'+i);
		if ( element && element.checked ) {
			styl = styly[i].jmeno;
			ladici_vypis(LADENI, "styly.vyber_klavesou", "nalezen styl "+styl);
		}
	}

	if ( !styl ) {
		ladici_vypis(CHYBA, "styly.vyber_klavesou", "nenalezen vybraný styl");
		return false;
	} else {
		this.vyber(styl);
	}
}

// Vyber styl
styly.vyber = function(styl)
{
	if ( styl == nastaveni.styl ) {
		ladici_vypis(LADENI, "styly.vyber", "žádná změna stylu, zůstává "+styl);
		return true;
	} else {
		ladici_vypis(LADENI, "styly.vyber", "změna stylu na "+styl);
	}

	// Nejdříve povolíme
	this.zmen_styl( styl, true );

	// Potom zakážeme
	this.zmen_styl( styl, false );

	nastav_cookie("styl", styl, 365);
	if ( hodnota_cookie("styl") != styl ) {
		ladici_vypis(CHYBA, "styly.vyber", "nepodařilo se nastavit cookie");
	}
	nastaveni.styl = styl;
	return true;
}
