/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - formátování a rozpoznávání příkazů

// POZNÁMKA: Řetězec načtený z příkazového pole je vnitřně udržován ve formě
// escape(), protože Konqueror (KDE JavaScript) neumí pracovat s Unicode.

// ===========================================================================
// =~ Globální proměnné ~=====================================================

// Rozpoznávání příkazů
//
// Všechny rozpoznávače předpokládají odstarnění přebytečných mezer na začátku
// i na konci textového řetězce!
//
// Jednotlivé rozpoznávače pracují ve dvou režimech:
// * Hlavička příkazu. Zkontroluje se název, pokud nekoliduje s některým z
//   (systémových) příkazů. Vrací nový objekt s nastaveným atributem chyba a
//   pokud chyba opravdu nastala, popis je uložen v atributu text. Pokud
//   byl rozpoznán příkaz z hlavičky (ještě před názvem), je vrácen tento
//   příkaz - všechny takové příkazy patří před název do hlavičky a musí mít
//   nastaveny atribut hlavicka na true. Pokud je to název a s ničím nekoliduje,
//   je vrácen null.
// * Tělo příkazu. Vrací nový objekt s novým příkazem v atributu prikaz.
//   Případné parametry jsou v atributu parametry. Pokud nastala chyba, je
//   signalizována v atributu chyba a popis je v atributu text. Pokud nebyl
//   příkaz rozpoznán, vrátí se pouze atribut chyba s hodnotou false.
prikazy.rozpoznavac = new Object();

// Formátování příkazů
prikazy.formatovac = new Object();

// ===========================================================================
// =~ Objekt vracející jednotlivé řádky ~=====================================

Radkovac = function (obsah)
{
	this.obsah = obsah.split( "%0A" );
	this.obsah_index = 0;
	this.obsah_chyba = undefined;
	this.radky = new Array();
	this.radky_index = 0;
	this.radka = 0;
	this.radka_chyby = undefined;
}

// Vrátí číslo posledně zpracovávané řádky v původním obsahu. Buď vrátní 
// undefined, nebo číslo řádky (počítáno od 0)
Radkovac.prototype.puvodni_cislo_radky = function ()
{
	if ( this.obsah_chyba != undefined ) {
		if ( this.obsah_chyba > 0 ) {
			return this.obsah_chyba-1;
		} else {
			return undefined;
		}
	} else {
		if ( this.obsah_index ) {
			return this.obsah_index-1;
		} else {
			return undefined;
		}
	}
}

// Vrátí číslo posledně zpracovávané řádky v novém obsahu. Buď vrátní
// undefined, nebo číslo řádky (počítáno od 0)
Radkovac.prototype.nove_cislo_radky = function ()
{
	if ( this.radka_chyby != undefined ) {
		if ( this.radka_chyby > 0 ) {
			return this.radka_chyby-1;
		} else {
			return undefined;
		}
	} else {
		if ( this.radka ) {
			return this.radka-1;
		} else {
			return undefined;
		}
	}
}

// Označí řádku, na které nastala chyba
Radkovac.prototype.nastala_chyba = function ()
{
	if ( this.radka_chyby == undefined ) {
		this.radka_chyby = this.radka;
		this.obsah_chyba = this.obsah_index;
	}
}

// Převede řádku do velkých písmen. Důležité, protože Konqueror to nezvládá.
// Vstup a výstup je ve formě unescape().
Radkovac.prototype.velka_pismena = function (text)
{
	var pismena = text.split("");
	for ( var i = 0; i < pismena.length; i++ ) {
		// Při zběžném pohledu do Unicode tabulky existují tři typy metod získání
		// velkého písmena:
		// * posun kódu o 32 méně;
		// * posun kódu o 1 méně;
		// * posun kódu úplně někam jinam.
		var kod = text.charCodeAt(i);

		if (
			kod >= 0x0061 && kod <= 0x007A ||
			kod >= 0x00E0 && kod <= 0x00F6 ||
			kod >= 0x00F8 && kod <= 0x00FE
		) {
			// Posun kódu o 32 méně
			pismena[i] = String.fromCharCode( kod - 0x0020 );
		} else if (
			kod >= 0x0100 && kod <= 0x012F ||
			kod >= 0x0132 && kod <= 0x0137 ||
			kod >= 0x014A && kod <= 0x0177
		) {
			// Posun kódu o 1 méně
			pismena[i] = String.fromCharCode( kod & 0xFFFE );
		} else if (
			kod >= 0x0139 && kod <= 0x0148 ||
			kod >= 0x0179 && kod <= 0x017E
		) {
			// Posun kódu o 1 méně
			pismena[i] = String.fromCharCode( ((kod-1)&0xFFFE)+1 );
		} else if (
			kod == 0x00DF
		) {
			// Německé ß má velkou variantu SS
			pismena[i] = "SS";
		} else if (
			kod == 0x00FF
		) {
			// Malé ÿ
			pismena[i] = "\u0178";
		}
	}
	return pismena.join("");
}

// Úprava řádky pro rozpoznávání. Vstup je textová řádka ve formě escape(),
// návratová hodnota je pole nových řádek ve formě unescape()
Radkovac.prototype.uprav_radku = function (text)
{
	text = text.replace( /^(%09|%0A|%0D|%20)+/, "" );
	text = text.replace( /(%09|%0A|%0D|%20)+$/, "" );

	// Rozpoznání komentáře na řádce. Přesune komentář na samostatnou řádku
	var strednik = text.search( "%3B" );	// %3B je znak ';'
	if ( strednik > 0 ) {
		var text1 = text.slice(0, strednik).replace(/(%09|%0A|%0D|%20)+$/, "");
		var text2 = text.slice(strednik);
		text1 = unescape( text1.replace( /(%09|%0A|%0D|%20)+/g, "%20" ) );
		text2 = unescape( text2 );
		if ( text2.length > 1 ) {
				return [ this.velka_pismena(text1), text2 ];
		} else {
				return [ this.velka_pismena(text1) ];
		}
	} else {
		if ( strednik < 0 ) {
			text = unescape( text.replace( /(%09|%0A|%0D|%20)+/g, "%20" ) );
			return [ this.velka_pismena(text) ];
		} else {
			// Na řádce je pouze komentář (strednik == 0)
			text = unescape( text );
			return [ text ];
		}
	}
}

// Vrátí true, pokud je nějaká řádka k dispozici
Radkovac.prototype.je_dalsi_radka = function ()
{
	return ( this.obsah_index < this.obsah.length
		|| this.radky_index < this.radky.length );
}

//.Vrací další řádku, výsledek je řádka po unescape()
Radkovac.prototype.dalsi_radka = function ()
{
	if ( this.radky_index < this.radky.length ) {
		var text = this.radky[this.radky_index];
		this.radky_index++;
		this.radka++;
		return text;
	} else if ( this.obsah_index < this.obsah.length ) {
		this.radky = this.uprav_radku( this.obsah[this.obsah_index] );
		this.obsah_index++;
		this.radky_index = 1;
		this.radka++;
		return this.radky[0];
	} else {
		ladici_vypis( LADENI, "Radkovac.dalsi_radka", "není žádná další řádka" );
		return null;
	}
}

// ===========================================================================
// =~ Zformátovaný obsah příkazu ~============================================

Obsah = function (prikaz)
{
	this.text = "";
	this.chyba = false;
	this.prikaz = prikaz;
	this.odsazeni = "";
}

// Vrátí momentální úroveň odsazení s přihlédnutím k chybě
Obsah.prototype.pridej = function (radka)
{
	if ( this.chyba ) {
		this.text += radka + "\n";
	} else {
		this.text += this.odsazeni + radka + "\n";
	}
}

// Přidá jednu úroveň odsazení
Obsah.prototype.odsad = function ()
{
	this.odsazeni += "  ";
}

// Zruší jednu úroveň odsazení
Obsah.prototype.predsad = function ()
{
	this.odsazeni = this.odsazeni.slice(0, -2);
}

// Zapnutí režimu chyby
Obsah.prototype.nastala_chyba = function ()
{
	this.chyba = true;
}

// Pravý obsah. Výstup je ve formátu escape()
Obsah.prototype.obsah = function ()
{
	var obsah = escape(this.text);
	return obsah.replace( /%0A$/, "" );
}

// ===========================================================================
// =~ Formátování chyb ~======================================================

prikazy.formatuj_chybu_rozpoznani = function (text, rezim_hlavicka)
{
	var ukonceno = "";
	if ( !rezim_hlavicka ) {
		ukonceno = "(V místě chyby je ukončeno formátování.)\n";
	}
	return ukonceno + "\n" + text;
}

prikazy.formatuj_chybu_syntaxe = function (text, pocet_radek, radka_chyby)
{
	var ukonceno;
	if ( radka_chyby < pocet_radek ) {
		ukonceno = "(V místě chyby je ukončeno formátování.)\n";
	} else {
		ukonceno = "(Chyba je na konci příkazu.)\n";
	}
	return ukonceno + "\n" + text;
}

prikazy.vrat_chybu_jmena = function (text, detail) {
	return new Vysledek( new Chyba( true,
		"Jméno příkazu nemůže být " + text + ".\n" + detail ) );
}

prikazy.vrat_chybu_radky = function (text, detail) {
	return new Vysledek( new Chyba( true,
		"Na řádce se vyskytl chybný příkaz " + text + ".\n" + detail ) );
}

// ===========================================================================
// =~ Funkce rozpoznávání příkazů ~===========================================

// Rozpoznání příkazu podle vstupní řádky. Návrat je nový příkaz, který navíc
// obsahuje upravený obsah v atributu obsah a informaci o chybě v atributu
// chyba a číslo poslední zpracovávané řádky. Pokud se v rozpoznávaném příkazu
// najde stary_prikaz, bude považován za chybu v případě, že se název starého
// a načítaného příkazu liší.
prikazy.rozpoznavac.rozpoznej = function (text, stary_prikaz)
{
	// Odstraň (dlouhé) pomlčky a nahraď je znakem minus, zruš mezery před
	// příkazem a nech pouze jednu volnou řádku, pokud jich je víc za sebou
	text = text.replace( /(%u2013|%u2014|%u2015)/g, "-" );
	text = text.replace( /^(%09|%0A|%0D|%20)+/g, "" );
	text = text.replace( /%0A((%09|%0A|%0D|%20)*%0A){2,}/g, "%0A%0A" );
	text = text.replace( /(%0A)+$/g, "" );

	var novy_prikaz = new Object();
	var nove_telo;

	var radkovac = new Radkovac(text);
	var rozpoznano = new Vysledek();
	var obsah = new Obsah();

	// Nejprve najdi název
	rozpoznano.nastav( this.zpracuj_hlavicku(radkovac, obsah) );
	if ( rozpoznano.byla_chyba() ) {
		rozpoznano.chyba.formatuj = function (text) {
			return prikazy.formatuj_chybu_rozpoznani(text, true);
		}
		rozpoznano.nastav( false, Vysledek.NIC,
			{ obsah: text,
			  cislo_radky: radkovac.puvodni_cislo_radky(),
			  prikaz: novy_prikaz
			} );
		return rozpoznano;
	}

	novy_prikaz.jmeno = rozpoznano.hodnota.jmeno;
	nove_telo = rozpoznano.hodnota.telo;

	// Přidej speciální příkaz názvu
	nove_telo.push( [ prikazy.NAZEV, novy_prikaz ] );

	// Najdi tělo
	rozpoznano.nastav( this.zpracuj_telo(radkovac, obsah, 
	                                     novy_prikaz, stary_prikaz) );

	if ( rozpoznano.byla_chyba() ) {
		rozpoznano.chyba.formatuj = function (text) {
			return prikazy.formatuj_chybu_rozpoznani(text, false);
		}
		rozpoznano.nastav( false, Vysledek.NIC,
			{ obsah: obsah.obsah(),
			  cislo_radky: radkovac.nove_cislo_radky(),
			  prikaz: novy_prikaz
			} );
		return rozpoznano;
	}

	// Přidej nalezené tělo k hlavičce
	novy_prikaz.telo = nove_telo.concat( rozpoznano.hodnota.telo );
	rozpoznano.nastav( false, Vysledek.NIC,
		{ obsah: obsah.obsah(), prikaz: novy_prikaz } );

	return rozpoznano;
}

// Kontrola jména
prikazy.rozpoznavac.kontrola_jmena = function (jmeno)
{
	return this.najdi_prikaz( true, jmeno );
}

// Najdi příkaz
prikazy.rozpoznavac.najdi_prikaz = function (rezim_hlavicka, text)
{
	var rozpoznano = new Vysledek();

	// Rozdělení na jednotlivá slova
	var rozdel_text = escape(text);
	var slova = rozdel_text.split( /(?:%09|%0A|%0D|%20)+/ );
	for ( var j = 0; j < slova.length; j++ ) {
		slova[j] = unescape(slova[j]);
	}

	for ( var i = 0; i < prikazy.seznam.length ; i++ ) {
		var prikaz = prikazy.seznam[i];
		if ( (rezim_hlavicka && prikaz.systemovy)
			|| !rezim_hlavicka ) {
			// Rozpoznání
			if ( prikaz.rozpoznavac ) {
				rozpoznano.nastav(
					prikaz.rozpoznavac(rezim_hlavicka, prikaz, text, slova) );
			} else {
				rozpoznano.nastav(
					prikazy.rozpoznavac.obecny(rezim_hlavicka, prikaz, text, slova) );
			}
			if ( rozpoznano.je_hodnota() || rozpoznano.byla_chyba() ) break;
		}
	}
	return rozpoznano;
}

// Zpracování hlavičky
prikazy.rozpoznavac.zpracuj_hlavicku = function (radkovac, obsah)
{
	var rozpoznano = new Vysledek();
	var telo = new Array();
	while ( radkovac.je_dalsi_radka() ) {
		var text = radkovac.dalsi_radka();

		rozpoznano.nastav( this.najdi_prikaz(true, text) );
		if ( rozpoznano.je_konec() ) {
			radkovac.nastala_chyba();
			return rozpoznano;
		}
		if ( rozpoznano.je_hodnota() ) {
			// Nalezen příkaz hlavičky
			ladici_vypis( LADENI, "prikazy.rozpoznavac.zpracuj_hlavicku",
				"nalezen příkaz před hlavičkou: " + rozpoznano.hodnota[0] );
			telo.push( rozpoznano.hodnota );
			prikazy.formatovac.zformatuj_radku( rozpoznano.hodnota, obsah );
		} else if ( text.length > 0 ) {
			// Nalezen název příkazu
			rozpoznano.nastav(false, Vysledek.NIC, { jmeno: text, telo: telo });
			obsah.pridej( text );
			obsah.odsad();
			return rozpoznano;
		}
	}
	ladici_vypis( CHYBA, "prikazy.rozpoznavac.zpracuj_hlavicku",
		"nenalezen název příkazu" );
	rozpoznano.nastav(new Chyba(true,
		"Nebyl nalezen žádný příkaz, který bych mohl uložit."));
	rozpoznano.zobraz_chybu();
	return rozpoznano;
}

// Zpracování těla
prikazy.rozpoznavac.zpracuj_telo = function (radkovac, obsah, 
                                             tento_prikaz, stary_prikaz)
{
	var rozpoznano = new Vysledek();
	var telo = new Array();
	while ( radkovac.je_dalsi_radka() ) {
		var text = radkovac.dalsi_radka();

		if ( !rozpoznano.je_konec() ) {
			if ( text == tento_prikaz.jmeno ) {
				// Upřednostnění rekurze
				telo.push( [ tento_prikaz ] );
				obsah.pridej( text );
			} else {
				rozpoznano.nastav( this.zpracuj_radku_tela(text, tento_prikaz, stary_prikaz) );
				if ( rozpoznano.je_konec() ) {
					obsah.nastala_chyba();
					radkovac.nastala_chyba();
					obsah.pridej( text );
					continue;
				} else if ( rozpoznano.je_hodnota() ) {
					// Nalezený příkaz
					telo.push( rozpoznano.hodnota );
					prikazy.formatovac.zformatuj_radku( rozpoznano.hodnota, obsah );
				} else {
					// Vnitřní chyba.
					// Příkaz má buď hodnotu, nebo je konec (kvůli chybě), ale nic mezi tím
					ladici_vypis( CHYBA, "formatovac.zpracuj_telo", rozpoznano,
						"vnitřní chyba při zpracování řádky příkazu" );
					alert( "Vnitřní chyba.\n\n" +
						"Nemá být konec rozpoznávání, ale příkaz se nepodařilo rozpoznat.\n" +
						"Informujte prosím autora o této chybě, nejlépe i o postupu " +
						"vzniku této chyby." );
				}
			} // end if ( text == tento_prikaz.jmeno)
		} else {	// else if ( rozpoznano.byla_chyba() )
			obsah.pridej(text);
		} // end if ( !rozpoznano.byla_chyba() )
	}
	rozpoznano.nastav(false, Vysledek.NIC, { telo: telo });
	return rozpoznano;
}

// Zpracování jedné řádky těla příkazu
prikazy.rozpoznavac.zpracuj_radku_tela = function (text, tento_prikaz, stary_prikaz)
{
	var rozpoznano = new Vysledek();
	rozpoznano.nastav( this.najdi_prikaz(false, text) );
	if ( !rozpoznano.je_konec() ) {
		if ( rozpoznano.je_hodnota() ) {
			// Nalezený příkaz
			if ( rozpoznano.hodnota[0] == stary_prikaz ) {
				// Nový příkaz má jiný název, než původní, a rekurze 
				// používá starý název
				ladici_vypis( LADENI, "prikazy.rozpoznavac.rozpoznej",
					"rekurze s původním názvem: " + text );
				rozpoznano.nastav( new Chyba(true, 
					"Příkaz volá sám sebe původním názvem " + text + ".") );			
			}
		} else {
			// Neznámý příkaz
			ladici_vypis( LADENI, "prikazy.rozpoznavac.rozpoznej",
				"nalezen neznámý příkaz: " + text );
			var uzivatel_chce = window.confirm(
				"Při čtení příkazu " + tento_prikaz.jmeno +
				" byl nalezen neznámý příkaz " + text + ".\n\n" +
				"Přejete si ho vytvořit?");
			if ( uzivatel_chce ) {
				var novy_prikaz = prikazy.pridej_novy(text);
				rozpoznano.nastav( false, Vysledek.NIC, [ novy_prikaz ] );
			} else {
				rozpoznano.nastav(
					new Chyba(true, "Nalezen neznámý příkaz " + text + ".") );
			}
		}
	}
	return rozpoznano;
}

// ===========================================================================
// =~ Jednotlivé rozpoznávače příkazů ~=======================================

// Obecný rozpoznávač
prikazy.rozpoznavac.obecny = function (rezim_hlavicka, prikaz, text, slova)
{
	if ( text == prikaz.jmeno ) {
		if ( rezim_hlavicka ) {
			if ( prikaz.systemovy ) {
				if ( ! prikaz.ignoruj ) {
					var detail;
					if ( prikaz == prikazy.KONEC || prikaz == prikazy.KONEC_JINAK ) {
						detail = "KONEC a KONEC, JINAK se používají "+
							"v podmínkách a cyklech.";
					} else {
						detail = "Jedná se o systémový příkaz.";
					}
					return prikazy.vrat_chybu_jmena( text, detail );
				} else if ( prikaz.hlavicka ) {
					return new Vysledek( false, Vysledek.NIC, [ prikaz ] );
				}
			}
		} else {
			return new Vysledek( false, Vysledek.NIC, [ prikaz ] );
		}
	}
	return null;
}

// Rozpoznávač prázdné řádky
prikazy.rozpoznavac.prazdna_radka = function (rezim_hlavicka, prikaz, text,
                                              slova)
{
	if ( text == "" ) {
		return new Vysledek( false, Vysledek.NIC, [ prikaz ] );
	} else {
		return null;
	}
}

// Rozpoznávač komentáře
prikazy.rozpoznavac.komentar = function (rezim_hlavicka, prikaz, text, slova)
{
	if ( text.charAt(0) == ';' ) {
		if (
			rezim_hlavicka && prikaz.hlavicka ||
			!rezim_hlavicka && !prikaz.hlavicka
		) {
			return new Vysledek( false, Vysledek.NIC,
				 [ prikaz, text.slice(1) ] );
		}
	}
	return null;
}

// Rozpoznání názvu
prikazy.rozpoznavac.nazev = function (rezim_hlavicka, prikaz, text, slova)
{
	return null;
}

// Rozpoznání podmínky v příkazech KDYŽ, DOKUD a AŽ
prikazy.rozpoznavac.podminka = function (rezim_hlavicka, prikaz, text, slova)
{
	if ( slova[0] != prikaz.jmeno ) return null;

	var detail;
	if ( prikaz == prikazy.DOKUD ) {
		detail = [ "cyklus", "Cyklus", "správný", " cyklu" ];
	} else {
		detail = [ "podmínka", "Podmínka", "správná", "" ];
	}

	// Kontrola v názvu příkazu a základní kontrola syntaxe
	if ( rezim_hlavicka ) {
		return prikazy.vrat_chybu_jmena( text,
			"Příkaz " + prikaz.jmeno + " se používá jako " + detail[0] + "." );
	} else if ( slova.length < 2 || slova.length > 3 ) {
		return prikazy.vrat_chybu_radky(text,
			detail[1] + " není " + detail[2] + ". " +
			"Na příkaz " + prikaz.jmeno + " se prosím koukněte do nápovědy." );
	} else if ( slova.length == 3 && slova[1] != prikazy.JE
		&& slova[1] != prikazy.NENI ) {
		return prikazy.vrat_chybu_radky(text,
			"Druhé slovo v podmínce " + detail[3] + " (pokud je přítomno) musí být " +
			prikazy.JE + " nebo " + prikazy.NENI + ", nikoliv " + slova[1] + "." );
	}

	// Převedení podmínky na číslo
	var podminka = slova.pop();
	for ( var i = 0; i < prikazy.podminky.length; i++ ) {
		if ( prikazy.podminky[i].jmeno == podminka ) {
			break;
		}
	}
	if ( i == prikazy.podminky.length ) {
		return prikazy.vrat_chybu_radky(text, "Příkaz obsahuje neznámou podmínku.");
	}

	// Podmínka je nenulová. Negace podmínky je vyjádřená záporným číslem
	i++;
	if ( slova.length == 2 && slova[1] == prikazy.NENI ) i *= -1;

	return new Vysledek(false, Vysledek.NIC, [prikaz, i] );
}

// Rozpoznání podmínky
prikazy.rozpoznavac.cyklus = function (rezim_hlavicka, prikaz, text, slova)
{
	if ( slova[0] != prikaz.jmeno ) return null;
	if ( rezim_hlavicka ) {
		return prikazy.vrat_chybu_jmena( text,
			"Příkaz " + prikaz.jmeno + " se používá jako cyklus." );
	}

	var vyraz = new RegExp(
		"^" + escape(prikaz.jmeno) +
		"((%09|%0A|%0D|%20)(-?\\d+)(%09|%0A|%0D|%20)?-?(%09|%0A|%0D|%20)?(" +
		prikazy.KRAT_text + ")?)?$" );
	var rozpoznano = vyraz.exec(escape(text));
	if ( ! rozpoznano ) {
		return prikazy.vrat_chybu_radky(text, "Za příkazem " + prikaz.jmeno +
			" by měl následovat počet opakování jako počet-KRÁT " +
			"(-KRÁT může být vynecháno).\n" +
			"Bez uvedení počtu opakování se opakují příkazy po odpovídající " +
			"AŽ nebo KONEC.");
	} else if ( rozpoznano[3] < 0 ) {
		return prikazy.vrat_chybu_radky(text, "Počet opakování musí být kladný." );
	}
	if ( rozpoznano[3] == undefined || rozpoznano[3].length == 0 ) {
		return new Vysledek(false, Vysledek.NIC, [prikaz]);
	} else {
		return new Vysledek(false, Vysledek.NIC, [prikaz, rozpoznano[3]]);
	}
}

// ===========================================================================
// =~ Řízení kontroly syntaxe ~===============================================

// Kontrola syntaxe. Vrací objekt Vysledek s nastavenou hodnotou - řádkou chyby
prikazy.formatovac.kontrola_syntaxe = function (prikaz)
{
	var stav = new prikazy.Stav;
	var vysledek = new Vysledek();
	vysledek.nastav( stav.kontrola_syntaxe( prikaz, true ) );
	if ( !vysledek.byla_chyba() ) {
		vysledek.nastav( false, Vysledek.NIC, stav.pozice );
	}
	return vysledek;
}

// ===========================================================================
// =~ Funkce formátování příkazů ~============================================

// Formátovač příkazu pro ostatní moduly. Vrací syntaktickou chybu
prikazy.formatovac.zformatuj_prikaz = function (prikaz, obsah)
{
	var vysledek = new Vysledek();
	var radka_chyby = undefined;
	vysledek.nastav( this.kontrola_syntaxe( prikaz ) );
	if ( vysledek.byla_chyba() ) {
		if ( vysledek.hodnota && vysledek.hodnota.prikaz == prikaz ) {
			radka_chyby = vysledek.hodnota.cislo_radky;
			ladici_vypis( CHYBA, "formatovac.zformatuj_prikaz", prikaz.jmeno,
				"syntaktická chyba na řádce " + (radka_chyby+1) );
			vysledek.chyba.formatuj = function (text) {
				return prikazy.formatuj_chybu_syntaxe( text, prikaz.telo.length,
				                                       radka_chyby );
			}
		} else {
			ladici_vypis( CHYBA, "formatovac.zformatuj_prikaz", vysledek.hodnota,
				"vnitřní chyba po syntaktické kontrole" );
			alert( "Vnitřní chyba.\n\n" +
				"Nalezena syntaktická chyba, ale nejsou o ní informace.\n" +
				"Informujte prosím autora o této chybě, nejlépe i o postupu " +
				"vzniku této chyby." );
		}
	}

	vysledek.nastav( this.zformatuj_telo( prikaz, obsah, radka_chyby ) );
	return vysledek;
}

// Hlavní formátovač těla příkazu
prikazy.formatovac.zformatuj_telo = function (prikaz, obsah, radka_chyby)
{
	for ( var i = 0; i < prikaz.telo.length; i++ ) {
		if ( radka_chyby == i ) obsah.nastala_chyba();
		this.zformatuj_radku( prikaz.telo[i], obsah );
	}
	return new Vysledek(false, Vysledek.NIC, { cislo_radky: (radka_chyby+1) });
}

// Formátování jedné řádky
prikazy.formatovac.zformatuj_radku = function (radka, obsah)
{
	if ( radka[0].formatovac ) {
		radka[0].formatovac( obsah, radka );
	} else {
		prikazy.formatovac.obecny( obsah, radka );
	}
}

// Speciální formátování jednoho příkazu. Výstup je ve formátu unescape()
prikazy.formatovac.zformatuj_jednu_radku = function (radka)
{
	var obsah = new Obsah();
	this.zformatuj_radku(radka, obsah);
	return unescape(obsah.obsah());
}

// Obecný formátovač (běžné příkazy a prázdná řádka)
prikazy.formatovac.obecny = function (obsah, radka)
{
	obsah.pridej(radka[0].jmeno);
}

// Formátovač prázdné řádky
prikazy.formatovac.prazdna_radka = function (obsah, radka)
{
	obsah.pridej("");
}

// Formátovač komentáře
prikazy.formatovac.komentar = function (obsah, radka)
{
	obsah.pridej(";" + radka[1]);
}

// Formátovač s odsazením
prikazy.formatovac.odsazeni = function (obsah, radka)
{
	obsah.pridej(radka[0].jmeno);
	obsah.odsad();
}

// Formátovač s předsazením
prikazy.formatovac.predsazeni = function (obsah, radka)
{
	obsah.predsad();
	obsah.pridej(radka[0].jmeno);
}

// Jádro formátovače podmínky
prikazy.formatuj_podminku = function (radka)
{
	var je_neni = (radka[1] > 0?prikazy.JE:prikazy.NENI);
	return radka[0].jmeno + " " + je_neni + " " +
		prikazy.podminky[Math.abs(radka[1])-1].jmeno;
}

// Formátovač podmínky
prikazy.formatovac.podminka = function (obsah, radka)
{
	if ( radka[0] == prikazy.AZ ) obsah.predsad();
	obsah.pridej( prikazy.formatuj_podminku(radka) );
	if ( radka[0] != prikazy.AZ ) obsah.odsad();
}

// Jádro formátovače podmínky
prikazy.formatuj_cyklus = function (radka)
{
	var pocet = (radka.length == 2? " "+radka[1]+prikazy._KRAT :"");
	return radka[0].jmeno + pocet;
}

// Formátovač cyklu
prikazy.formatovac.cyklus = function (obsah, radka)
{
	obsah.pridej( prikazy.formatuj_cyklus(radka) );
	obsah.odsad();
}

// Formátovač konců
prikazy.formatovac.konec = function (obsah, radka)
{
	obsah.predsad();
	obsah.pridej( radka[0].jmeno );
	if ( radka[0] == prikazy.KONEC_JINAK ) obsah.odsad();
}

// Formátovač názvu
prikazy.formatovac.nazev = function (obsah, radka)
{
	obsah.pridej( radka[1].jmeno );
	obsah.odsad();
}
