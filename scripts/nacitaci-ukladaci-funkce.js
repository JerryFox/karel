/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - načítání, ukládání a export dat

// Příkazy a jejich indexy podle verze:
//
// Verze/Index          Příkaz
// 1.0  1.1  1.2  2.0
//   -    -    -    0   <prázdná řádka> (součást hlavičky)
//   -    -    -    1   <komentář>      (součást hlavičky)
//   -    -    -    2   <název příkazu> (součást hlavičky)
//   -    -    -    3   <prázdná řádka> (tělo příkazu)
//   -    -    -    4   <komentář>      (tělo příkazu)
//   0    0    0    5   KONEC, JINAK
//   1    1    1    6   KONEC
//   2    2    2    7   KDYŽ
//   3    3    3    8   DOKUD
//   4    4    4    9   OPAKUJ
//   -    5    5   10   AŽ
//   -    -    6   11   RYCHLE
//   -    -    7   12   POMALU
//   5    6    8   13   STOP
//   6    7    9   14   KROK
//   7    8   10   15   VLEVO-VBOK
//   8    9   11   16   POLOŽ
//   9   10   12   17   ZVEDNI
//
// Poznámky k formátům níže:
//
//    \t    označuje znak <tabulátor>
//    \n    je pro znak <nová řádka>
//
// Formát ukládání (příkazy)
// =========================
//
// Karel<verze>\n
// P\n
// <index posledního příkazu>
// <jméno příkazu>\t<příkaz 1>,<příkaz 2>,...\n
// <jméno příkazu>\t<příkaz 1>,<příkaz 2>,...\n
// ...
// KONEC
//
//    Takový řetězec se předá jako parametr funkci escape() a výsledná hodnota
//    je poté nabídnuta k uložení.
//
// Formát příkazů:
//
//    1. Příkaz bez parametrů (<prázdná řádka>, <název příkazu>, KONEC, RYCHLE,
//       POMALU, STOP, KROK, VLEVO-VBOK, POLOŽ, ZVEDNI a uživatelské příkazy
//
//      <index příkazu>
//
//    2. Příkaz má parametr (KDYŽ, DOKUD, AŽ, OPAKUJ)
//
//    (a) <index příkazu><mezera><podmínka KDYŽ, DOKUD, AŽ>
//    (b) <index příkazu OPAKUJ><mezera><počet opakování OPAKUJ>
//    (c) <index příkazu OPAKUJ>
//
//      <podmínka> je následující:
//
//        1   ZEĎ        -1   NENÍ ZEĎ
//        2   ZNAČKA     -2   NENÍ ZNAČKA
//        3   DOMOV      -3   NENÍ DOMOV
//        4   VÝCHOD     -4   NENÍ VÝCHOD
//        5   SEVER      -5   NENÍ SEVER
//        6   ZÁPAD      -6   NENÍ ZÁPAD
//        7   JIH        -7   NENÍ JIH
//
//      <počet opakování OPAKUJ> je kladné číslo včetně nuly
//
//    3. Komentář
//
//      <index příkazu><mezera><text upravený funkcí escape()>
//
//    !! VAROVÁNÍ!!
//
//    Od verze 1.1 se rozšířil repertoár o příkaz AŽ, proto při čtení verze
//    1.0 je nutno posunout <index příkazu> o 1, pokud je větší než 4.
//
//    Od verze 1.2 přibyly příkazy RYCHLE a POMALU, proto je nutné při čtení
//    verze 1.1 posunout <index příkazu> o 2, pokud je větší než 5.
//
//    Od verze 2.0 se rozšířil slovník o komentáře a hlavičku, proto je nutné
//    při čtení verze 1.2 posunout <index příkazu> vždy o 5.
//
//    Verze 2.0 zavedla nový prvek 2.c), který byl v předchozích verzích
//    ukládán s <počet opakování OPAKUJ> rovno -1 (minus jedné).
//
// Formát ukládání (město)
// =======================
//
// Karel<verze>\n
// M\n
// <pozice Karla X><mezera><pozice Karla Y>\n
// <směr natočení>\n
// <pozice domova X><mezera><pozice domova Y>\n
// <[0,9]><[0,8]>...<[0,0]>\n
// <[1,9]><[1,8]>...<[1,0]>\n
// ...
// <[9,9]><[9,8]>...<[9,0]>\n
// KONEC
//
//    Takový řetězec se předá jako parametr funkci escape() a výsledná hodnota
//    je poté nabídnuta k uložení.
//
//    Formát políčka města <[x,y]>: číslo od 0 do 8 podle položených značek,
//    nebo znak X, pokud je na daném políčku zeď.
//
//    Město nemělo žádnou změnu od začátku vývoje, proto je <verze> rovna
//    hodnotě "1.0" (bez uvozovek).
//
//  Poznámka k souřadnicím:
//
//    Pozice je vyjádřená jako dvojice [x,y], kde x a y je od 0 do 9. Symbol
//    x označuje sloupec a symbol y řádku. Formát ukládání je tedy po sloupcích
//    (první zapsaná textová řádka je rovna prvnímu sloupci města) shora dolů.
//    Sloupcové ukládání vzniklo nejspíš omylem, ale už nebylo dále upravováno.
//
//    Program Visual Karel 99 ukládá město po řádkách, takže zapsaná textová
//    řádka odpovídá skutečné řádce města - to je velký rozdíl!
//
//    Karel má na počátku pozici [0,0] (levý dolní roh), ale uživatelské
//    rozhraní v tu dobu ukazuje souřadnici "1 × 1" (o jednu vyšší). Pravý dolní
//    roh má pozici [9,0], v uživatelském rozhraní to je "10 × 1".
//
//    Program Visual Karel 99 počítá pozici od jedné, ne od nuly, navíc počátek
//    je vlevo nahoře. Levý horní roh je (1,1) (odpovídá pozici [0,9]), levý 
//    dolní roh má (1,10) (odpovídá umístění [0,0]), pravý dolní roh je (10,10)
//    (odpovídá pozici [9,0]).

// ===========================================================================
// =~ Globální proměnné ~=====================================================

// Objekt pracující s daty
data = new Object();

// Načítací funkcionalita
data.nacitani = new Object();

// Ukládací funkcionalita
data.ukladani = new Object();

// Konstanty formatu
data.FORMAT_10 = 0;
data.FORMAT_11 = 1;
data.FORMAT_12 = 2;
data.FORMAT_20 = 3;
data.verze = [
	{ retezec: "1.0", verze: prikazy.VERZE_10 },
	{ retezec: "1.1", verze: prikazy.VERZE_11 },
	{ retezec: "1.2", verze: prikazy.VERZE_12 },
	{ retezec: "2.0", verze: prikazy.VERZE_20 }
];

// Typy zobrazovaného okna
data.typ = new Object();
data.typ.ULOZIT = "ulozit.html";
data.typ.EXPORT_MESTA = "export-mesto.html";
data.typ.EXPORT_SLOVNIKU = "export-slovnik.html";

// Značky
data.znacky = [ ".", "1", "2", "3", "4", "5", "6", "7", "8" ];
data.znacky[-1] = "X";

// ===========================================================================
// =~ Základní funkce pro ukládání a export města ~===========================

// Uložení do vnitřního formátu
data.ukladani.uloz_mesto = function ()
{
	var uloz = "Karel1.0\nM\n";
	uloz += karel.pozice.x + " " + (mesto.velikost.y - karel.pozice.y - 1) + "\n";
	uloz += karel.smer + "\n";
	uloz += domov.pozice.x + " " + (mesto.velikost.y - domov.pozice.y - 1) + "\n";
	for ( var x = 0; x < mesto.velikost.x; x++ ) {
		for ( var y = mesto.velikost.y-1; y >= 0; y-- ) {
			uloz += data.znacky[mesto.pole[x][y]];
		}
		uloz += "\n";
	}
	uloz += "KONEC";
	uloz = escape(uloz);
		this.zobraz_v_okne(this.typ.NORMALNI, "uložení města", "<p>"+
"Následující text si pečlivě uschovejte. Neprovádějte na něm <i>ŽÁDNÉ</i> "+
"úpravy. Každá změna může způsobit jeho zpětnou nepoužitelnost. Nejlépe text "+
"označte, zkopírujte do schránky Windows (případně do schránky jiného "+
"systému) a vložte do prázdného souboru, např. v aplikaci Poznámkový blok "+
"(Notepad). Raději nepoužívejte programy, které provádí další formátování "+
"textu, tím by se mohl text znehodnotit."+
"</p>", uloz, 24);
}

// Export do formátu Visual Karel 99
data.ukladani.export_mesto_k99 = function ()
{
	var uloz =
		"Velikost města: " + mesto.velikost.x + ", " + mesto.velikost.y + "\n";
	uloz += "Pozice Karla: " +
		(karel.pozice.x+1) + ", " + (mesto.velikost.y-karel.pozice.y) + "\n";
	uloz += "Otočení Karla: " + karel.nazev_smeru_plny[karel.smer] +"\n";
	uloz += "Umístění domova: " +
		(domov.pozice.x+1) + ", " + (mesto.velikost.y-domov.pozice.y) + "\n\n";
	uloz += "Definice města:\n";
	for ( var y = mesto.velikost.y-1; y >= 0; y-- ) {
		for ( var x = 0; x < mesto.velikost.x; x++ ) {
			uloz += data.znacky[mesto.pole[x][y]];
		}
		uloz += "\n";
	}
	uloz = uloz.slice( 0, -1 );	// Odstranit poslední ukončení řádky
	this.zobraz_v_okne(this.typ.NORMALNI, "export města", "<p>"+
"Následující text je určen pro program Visual Karel 99. Nevím, jak jsou na "+
"tom konkurenční programy s formátem, proto nelze zaručit větší "+
"přenositelnost města."+
"</p><p>"+
"Symbol X označuje zeď, číslo nahrazuje počet položených značek a tečka značí "+
"prázdné pole. Na jednom poli nemůže být zároveď zeď a Karel, nebo Karlův "+
"domov. Na jednom poli také nemůže být víc jak 8 značek."+
"</p>", uloz, 23);
}

// ===========================================================================
// =~ Základní funkce pro ukládání a export slovníku ~========================

// Kontrola prázdného slovníku
data.ukladani.zkontroluj_slovnik = function ()
{
 	if ( prikazy.seznam[prikazy.seznam.length-1].systemovy ) {
		alert( "Není co uložit. Slovník je prázdný." );
		return false;
	} else {
		return true;
	}
}

// Příprava slovníku na uložení
data.ukladani.priprav_slovnik = function (format)
{
	var verze = data.verze[format].verze;
	var index = 0;
	for ( var i = 0; i < prikazy.seznam.length; i++ ) {
		var prikaz = prikazy.seznam[i];
		if ( prikaz.kompatibilita & prikaz.verze_ulozeni & verze ) {
			prikaz.index = index;
			index++;
		} else {
			delete prikaz.index;
		}
	}
}

// Formátování seznamu příkazů
data.ukladani.formatuj_text = function (objekt)
{
	var text = "";
	if ( objekt.ostatni.length ) {
		text += objekt.ostatni.join( ", " );
	}
	if ( objekt.prikazy.length ) {
		if ( text.length > 0 ) {
			text += " a ";
		}
		if ( objekt.prikazy.length == 1 ) {
			text += "příkaz ";
		} else {
			text += "příkazy ";
		}
		text += objekt.prikazy.join( ", " );
	}
	return text;
}

// Přidá jeden příkaz do seznamu špatných příkazů, nebo varování
data.ukladani.pridej_prikaz = function (objekt, prikaz)
{
	if ( ! objekt.seznam[prikaz.jmeno] ) {
		if ( prikaz.prikaz ) {
			objekt.prikazy.push(prikaz.jmeno);
		} else {
			objekt.ostatni.push(prikaz.jmeno);
		}
		objekt.seznam[prikaz.jmeno] = true;
	}
}

// Vrací true, pokud není seznam prázdný
data.ukladani.nastalo = function (objekt)
{
	return (objekt.prikazy.length || objekt.ostatni.length);
}

// Kontrola verze slovníku
data.ukladani.zkontroluj_verze = function (format)
{
	var verze = data.verze[format].verze;
	var spatne = { seznam: {}, prikazy: [], ostatni: [] };
	var varovani = { seznam: {}, prikazy: [], ostatni: [] };
	var i = prikazy.seznam.length-1;
	while ( i >= 0 && !prikazy.seznam[i].systemovy ) {
		var prikaz = prikazy.seznam[i];
		for ( var j = 0; j < prikaz.telo.length; j++ ) {
			var radka = prikaz.telo[j];
			if ( radka[0].verze_ulozeni & (~radka[0].kompatibilita) & verze ) {
				// Příkaz nelze uložit
				this.pridej_prikaz( spatne, radka[0] );
			} else if ( !(radka[0].kompatibilita & verze) ) {
				// Příkaz se neukládá
				this.pridej_prikaz( varovani, radka[0] );
			}
		}
		i--;
	}

	if ( this.nastalo(spatne) ) {
		return { chyba: true, text: this.formatuj_text(spatne) };
	} else if ( this.nastalo(varovani) ) {
		return { varovani: true, text: this.formatuj_text(varovani) };
	} else {
		return {};
	}
}

// Kontrola minimální verze slovníku
data.ukladani.zkontroluj_minimalni_format = function (format)
{
	var novy_format = format-1;
	while ( novy_format >= data.FORMAT_10 ) {
		var test = this.zkontroluj_verze(novy_format);
		if ( !test.chyba && !test.varovani ) {
			format = novy_format;
		} else {
			break;
		}
		novy_format--;
	}
	return format;
}

// Provede uložení slovníku v daném formátu
data.ukladani.proved_ulozeni_prikazu = function (format, prikaz)
{
	var verze = data.verze[format].verze;
	var uloz = "";
	if ( !prikaz.systemovy ) {
		var radka_uloz = new Array();
		for ( var i = 0; i < prikaz.telo.length; i++ ) {
			var radka = prikaz.telo[i];
			var prikaz_uloz;
			// Pokud se má uložit (příkaz získal index z přípravy slovníku), ulož
			if ( radka[0].index != undefined ) {
				if ( radka[0].ukladac ) {
					prikaz_uloz = radka[0].ukladac(verze, radka);
				} else {
					prikaz_uloz = this.obecny(verze, radka);
				}
				if ( prikaz_uloz ) {
					radka_uloz.push(prikaz_uloz);
				}
			}
		}
		uloz = prikaz.jmeno + "\t" + radka_uloz.join(",") + "\n";
	}
	return uloz;
}

// Provede uložení slovníku
data.ukladani.proved_ulozeni_slovniku = function (format)
{
	this.priprav_slovnik(format);

	var uloz =
		"Karel" + data.verze[format].retezec + "\n" +
		"P\n" +
		prikazy.seznam[prikazy.seznam.length-1].index + "\n";
	for ( var i = 0; i < prikazy.seznam.length; i++ ) {
		uloz += this.proved_ulozeni_prikazu(format, prikazy.seznam[i]);
	}
	uloz += "KONEC";
	return escape(uloz);
}

// Ulož slovník v novém formátu
data.ukladani.uloz_slovnik = function (format)
{
	if ( this.zkontroluj_slovnik() ) {
		var navrat = this.zkontroluj_verze(format);
		if ( navrat.chyba ) {
			alert( "Chyba!\n\nSlovník nelze uložit ve formátu " +
				data.verze[format].retezec +
				", protože obsahuje " + navrat.text + "." );
		} else {
			if ( navrat.varovani ) {
				if ( ! window.confirm(
					"Varování!\n\nSlovník při ukládání do formátu " +
					data.verze[format].retezec +
					" nebude obsahovat " + navrat.text + ".\n\nPřesto uložit?" ) ) {
					return;
				}
			} else {
				// Najdi minimální verzi, ve které jde uložit příkaz
				format = this.zkontroluj_minimalni_format(format);
			}

			var uloz = this.proved_ulozeni_slovniku(format);
			this.zobraz_v_okne(this.typ.NORMALNI, "uložení slovníku", "<p>"+
"Následující text si pečlivě uschovejte. Neprovádějte na něm <i>ŽÁDNÉ</i> "+
"úpravy. Každá změna může způsobit jeho zpětnou nepoužitelnost. Nejlépe text "+
"označte, zkopírujte do schránky Windows (případně do schránky jiného "+
"systému) a vložte do prázdného souboru, např. v aplikaci Poznámkový blok "+
"(Notepad). Raději nepoužívejte programy, které provádí další formátování "+
"textu, tím by se mohl text znehodnotit."+
"</p>", uloz, 24);
		}
	}
}

data.ukladani.export_slovnik_k99 = function ()
{
	if ( this.zkontroluj_slovnik() ) {
		var format = new Array();
		for ( var i = 0; i < prikazy.seznam.length; i++ ) {
			var prikaz = prikazy.seznam[i];
			if ( !prikaz.systemovy ) {
				var obsah = new Obsah();
				var vysledek = prikazy.formatovac.zformatuj_prikaz(prikaz, obsah);
				format.push(obsah.obsah());
			}
		}
		uloz = format.join("%0A%0A");
		this.zobraz_v_okne(this.typ.KOMENTARE, "export slovníku", "<p>"+
"Následující text je určen pro program Visual Karel 99. Bez větších úprav ho "+
"jistě bude možno použít i v jiných (konkurenčních) programech zabývající se "+
"problematikou robota Karla."+
"</p>"+
"<p><b>Varování!</b> Pokud jste použili podmínku nebo opakování s příkazem "+
"AŽ, pak nebude v programu Visual Karel 99 fungovat, protože v něm tato "+
"vlastnost není naprogramována."+
"</p>", unescape(uloz), 21);
	}
}

// ===========================================================================
// =~ Funkce pro ukládání a export jednotlivých příkazů ~=====================

// Obecné ukládání
data.ukladani.obecny = function (format, radka)
{
	if ( radka[0].index != undefined ) {
		if ( radka.length > 1 ) {
			return radka[0].index + " " + radka.slice(1).join(" ");
		} else {
			return "" + radka[0].index;
		}
	} else {
		return undefined;
	}
}

// Cyklus
data.ukladani.uloz_OPAKUJ = function (format, radka)
{
	var pocet = "";
	if ( radka.length == 1 && format < data.FORMAT_20 ) {
		pocet = " -1";
	} else if ( radka.length == 2 ) {
		pocet = " " + radka[1];
	}
	return radka[0].index + pocet;
}

// Komentář
data.ukladani.uloz_komentar = function (format, radka)
{
	if ( format >= data.FORMAT_20 ) {
		return radka[0].index + " " + escape(radka[1]);
	} else {
		return undefined;
	}
}

// Název
data.ukladani.uloz_nazev = function (format, radka)
{
	if ( format >= data.FORMAT_20 ) {
		return radka[0].index;
	} else {
		return undefined;
	}
}

// ===========================================================================
// =~ Základní funkce pro načítání ~==========================================

// Nahraj příkazy/město
data.nacitani.nacti = function ()
{
	var hodnota = window.prompt(
		"Vložte prosím text města nebo příkazů, který byl předtím vytvořen tímto " +
		"Karlem. Jediná dlouhá řádka začíná slovem Karel a končí slovem KONEC.");
	if ( hodnota && hodnota.length ) {
		hodnota = hodnota.replace( /\s+/g, "" );
	}
	var vysledek = data.nacitani.proved_nacteni(hodnota);
	vysledek.zobraz_chybu();
}

// Proveď nahrání příkazů/města
data.nacitani.proved_nacteni = function (hodnota)
{
	var vysledek = new Vysledek();
	// Základní kontroly
	if ( hodnota && hodnota.length ) {
		var radky = hodnota.split("%0A");
		vysledek.chyba.formatuj - function (text) {
			return text + "\n\nNemohu nehrát.";
		}
		vysledek.nastav( data.nacitani.kontrola_formatu(radky[0]) );
		if ( vysledek.byla_chyba() ) return vysledek;
		var format = vysledek.hodnota;
		if ( radky[radky.length-1] != "KONEC" ) {
			vysledek.nastav( new Chyba( true,
				"Textová řádka není celá, nebo je poškozená." ) );
		} else if ( radky.length < 4
			|| radky.length > 2 && radky[1] != 'M' && radky[1] != 'P' ) {
			vysledek.nastav( new Chyba( true,
				"Nelze rozpoznat, zda se jedná o město nebo příkazy." ) );
		} else if ( radky[1] == 'M' ) {
			vysledek.chyba.formatuj = function (text) {
				return text + "\n\nNemohu načíst město.";
			}
			vysledek.nastav( this.nacti_mesto(format, radky) );
			if ( vysledek.je_hodnota() ) {
				var hodnota = vysledek.hodnota;
				mesto.nahraj_mesto( hodnota.karel, hodnota.smer, hodnota.domov,
					hodnota.mesto );
			}
		} else {
			vysledek.chyba.formatuj = function (text) {
				return text + "\n\nNemohu načíst slovník.";
			}
			vysledek.nastav( this.nacti_slovnik(format, radky) );
			if ( vysledek.je_hodnota() ) {
				var hodnota = vysledek.hodnota;
				prikazy.nahraj_slovnik( hodnota );
			}
		}
	}
	return vysledek;
}

// Kontrola verze
data.nacitani.kontrola_formatu = function (format)
{
	format = unescape(format);
	for ( var i = 0; i < data.verze.length; i++ ) {
		if ( format == "Karel" + data.verze[i].retezec ) {
			return new Vysledek( false, Vysledek.NIC, i );
		}
	}
	ladici_vypis( CHYBA, "nacitani.kontrola_formatu", format,
		"nerozpoznán formát" );
	return new Vysledek( new Chyba( true,
		"Neznámá verze " + format + "." ) );
}

// ===========================================================================
// =~ Základní funkce pro načítání města ~====================================

// Přečti pozici
data.nacitani.precti_pozici = function (radka, jmeno)
{
	radka = radka.split( "%20" );
	var x = parseInt(radka[0]);
	var y = parseInt(radka[1]);
	if ( radka.length == 2 && !isNaN(x) && !isNaN(y) ) {
		if ( x >= 0 && x < mesto.velikost.x && y >= 0 && y < mesto.velikost.y ) {
			return new Vysledek( false, Vysledek.NIC, 
			                     { x: x, y: (mesto.velikost.y - y - 1) } );
		} else {
			return new Vysledek( new Chyba( true,
				"Chybná pozice " + jmeno + "." ) );
		}
	} else {
		return new Vysledek( new Chyba( true,
			"Nerozpoznána pozice " + jmeno + "." ) );
	}
}

// Přečti směr
data.nacitani.precti_smer = function (radka, jmeno)
{
	var smer = parseInt(radka);
	if ( !isNaN(smer) ) {
		if ( smer >= 0 & smer < 4 ) {
			return new Vysledek( false, Vysledek.NIC, smer );
		} else {
			return new Vysledek( new Chyba( true,
				"Chybný směr natočení Karla." ) );
		}
	} else {
		return new Vysledek( new Chyba( true,
			"Nerozpoznán směr natočení Karla." ) );
	}
}

// Přečti řádku města
data.nacitani.precti_radku_mesta = function (radka, pocet_radku)
{
	if ( radka.length != pocet_radku ) {
		return new Vysledek( new Chyba( true,
			"Nebyly nalezeny všechny řádky města." ) );
	}
	var mesto_radka = new Array();
	for ( var y = 0; y < pocet_radku; y++ ) {
		var znak = radka.charAt(y);
		for ( var i = -1; i < data.znacky.length; i++ ) {
			if ( znak == data.znacky[i] ) {
				mesto_radka[y] = i;
				break;
			}
		}
		if ( i == data.znacky.length ) {
			return new Vysledek( new Chyba( true,
				"Nerozpoznáno pole města." ) );
		}
	}
	return new Vysledek( false, Vysledek.NIC, mesto_radka.reverse() );
}

// Načti město
data.nacitani.nacti_mesto = function (format, radky)
{
	var vysledek = new Vysledek();
	if ( format != data.FORMAT_10 ) {
		vysledek.nastav( new Chyba( true,
			"Bohužel neznám verzi " + data.verze[format].retezec + "." ) );
	} else {
		var velikost_mesta = { x: 10, y: 10 };
		
 		if ( radky.length != (velikost_mesta.y + 6) ) {
			vysledek.nastav( new Chyba(true,
				"Nebyly nalezeny všechny sloupce města." ) );
		} else {
			vysledek.nastav( this.precti_pozici(radky[2], "Karla") );
			var karel_pozice = vysledek.hodnota;
			vysledek.nastav( this.precti_smer(radky[3]) );
			var smer = vysledek.hodnota;
			vysledek.nastav( this.precti_pozici(radky[4], "domova") );
			var domov_pozice = vysledek.hodnota;
			var mesto_pole = new Array();
			if ( !vysledek.byla_chyba() ) {
				for ( var x = 0; x < velikost_mesta.x && !vysledek.byla_chyba(); x++ ) {
					var nacteno = data.nacitani.precti_radku_mesta( radky[x+5], 
					                                                velikost_mesta.y );
					vysledek.nastav( nacteno );
					mesto_pole[x] = vysledek.hodnota;
				}
			}
			if ( !vysledek.byla_chyba() ) {
				vysledek.nastav( false, Vysledek.NIC,
					{ karel: karel_pozice,
					  smer: smer,
					  domov: domov_pozice,
					  mesto: mesto_pole } );
			}
		}
	}
	return vysledek;
}

// ===========================================================================
// =~ Základní funkce pro načítání slovníku ~=================================

// Načti slovník
data.nacitani.nacti_slovnik = function (format, radky)
{
	var vysledek = new Vysledek();
	var novy_slovnik = this.priprav_slovnik(format);
	// Základní kontrola
	if ( radky.length < 4
		|| radky.length > 3 && (radky.length-4 != radky[2]-novy_slovnik.length+1)) {
		vysledek.nastav( new Chyba( true,
			"Slovník nejspíš není celý." ) );
	} else {
		var radky_slovniku = radky.slice(3, -1);
		vysledek.nastav(
			this.dekoduj_slovnik(format, radky_slovniku, novy_slovnik) );
	}
	return vysledek;
}

// Příprava slovníku na načtení
data.nacitani.priprav_slovnik = function (format)
{
	var novy_slovnik = new Array();
	var verze = data.verze[format].verze;
	var slovnik = prikazy.seznam;
	for ( var i = 0; i < slovnik.length && slovnik[i].systemovy; i++ ) {
		var prikaz = slovnik[i];
		if ( prikaz.kompatibilita & prikaz.verze_ulozeni & verze ) {
			novy_slovnik.push( prikaz );
		}
	}
	return novy_slovnik;
}

// Dekóduj slovník
data.nacitani.dekoduj_slovnik = function (format, radky_slovniku, novy_slovnik)
{
	// Připrav prázdné příkazy
	var vysledek = new Vysledek();
	var start_index = novy_slovnik.length;

	// Oddělit jednotlivé příkazy
	vysledek.nastav( this.oddel_prikazy( radky_slovniku, novy_slovnik ) );

	// Změna jmen
	if ( !vysledek.byla_chyba() ) {
		vysledek.nastav( this.oprav_nazvy( novy_slovnik ) );
	}

	// Načti příkazy
	if ( !vysledek.byla_chyba() ) {
		var i = start_index;
		while ( i < novy_slovnik.length && !vysledek.byla_chyba() ) {
			var novy_prikaz = novy_slovnik[i];
			var radky_prikazu = novy_prikaz.kodovane_telo;
			delete novy_prikaz.kodovane_telo;
			vysledek.nastav(
				this.dekoduj_prikaz(format, radky_prikazu, novy_prikaz, novy_slovnik) );
			i++;
		}

		if ( !vysledek.byla_chyba() ) {
			novy_slovnik = novy_slovnik.slice(start_index);
			vysledek.nastav( false, Vysledek.NIC, novy_slovnik );
		}
	}
	return vysledek;
}

// Odděl příkazy
data.nacitani.oddel_prikazy = function (radky_slovniku, slovnik)
{
	for ( var i = 0; i < radky_slovniku.length; i++ ) {
		var zaklad_prikazu = radky_slovniku[i].split("%09");
		if ( zaklad_prikazu.length != 2 ) {
			return new Vysledek( new Chyba( true,
				"Nerozpoznán příkaz." ) );
		}
		var radky_prikazu = zaklad_prikazu[1].split("%2C");
		var novy_prikaz = {
			jmeno: unescape(zaklad_prikazu[0]),
			telo: new Array(),
			kodovane_telo: radky_prikazu
		};
		if ( !novy_prikaz.jmeno.length ) {
			return new Vysledek( new Chyba( true,
				"Nerozpoznán název příkazu." ) );
		}
		slovnik.push(novy_prikaz);
	}
	return new Vysledek();
}

// Oprav názvy
data.nacitani.oprav_nazvy = function (novy_slovnik)
{
	for ( var i = 0; i < novy_slovnik.length; i++ ) {
		var prikaz = novy_slovnik[i];
		if ( !prikaz.systemovy ) {
			var vysledek = new Vysledek();
			vysledek.nastav(
				prikazy.rozpoznavac.kontrola_jmena(prikaz.jmeno) );
			if ( vysledek.byla_chyba() ) {
				var nove_jmeno = this.najdi_nove_jmeno(prikaz.jmeno, novy_slovnik);
				prikaz.jmeno = nove_jmeno;
				vysledek.chyba.formatuj = function (text) {
					return "Chyba při načítání slovníku: " + text +
						"\n\nPříkaz byl přejmenován na " + nove_jmeno + ".";
				}
				vysledek.zobraz_chybu();
			}
		}
	}
	return new Vysledek();
}

// Najdi nové nekonfliktní jméno
data.nacitani.najdi_nove_jmeno = function (jmeno, slovnik)
{
	var nove_jmeno;
	var i = 1;
	var spravne = false;
	while ( !spravne ) {
		spravne = true;
		if ( i == 1 ) {
			nove_jmeno = "!" + jmeno;
		} else {
			nove_jmeno = "!" + jmeno + " " + i;
		}
		for ( var j = slovnik.length-1; j >= 0 && !slovnik[j].systemovy; j-- ) {
			if ( nove_jmeno == slovnik[j].jmeno ) {
				spravne = false;
				break;
			}
		}
		i++;
	}
	return nove_jmeno;
}

// ===========================================================================
// =~ Funkce pro načítání jednotlivých příkazů ~==============================

// TODO: Podrobnější popis chyby v příkazu?
// Načtení příkazu
data.nacitani.dekoduj_prikaz = function (format, radky_prikazu, novy_prikaz,
                                         novy_slovnik)
{
	var vysledek = new Vysledek();
	if ( format < data.FORMAT_20 ) {
		novy_prikaz.telo.push( [ prikazy.NAZEV, novy_prikaz ] );
	}
	var i = 0;
	while	( i < radky_prikazu.length && !vysledek.byla_chyba() ) {
		var radka = radky_prikazu[i].split("%20");
		var cislo = parseInt(radka[0]);
		if ( isNaN(cislo) || cislo < 0 || cislo >= novy_slovnik.length ) {
			vysledek.nastav( new Chyba( true,
				"Při zpracování těla příkazu " + novy_prikaz.jmeno +
				" nebyl rozpoznán příkaz." ) );
		} else {
			var novy_jeden_prikaz;
			var prikaz = novy_slovnik[cislo];
			radka[0] = prikaz;
			for ( var j = 1; j < radka.length; j++ ) {
				radka[j] = unescape(radka[j]);
			}
			if ( !prikaz.nacitac ) {
				novy_jeden_prikaz = this.obecny(format, radka, novy_prikaz);
			} else {
				novy_jeden_prikaz = prikaz.nacitac(format, radka, novy_prikaz);
			}
			if ( novy_jeden_prikaz ) {
				novy_prikaz.telo.push(novy_jeden_prikaz);
			} else {
				vysledek.nastav( new Chyba( true,
					"Chybné parametry na řádce " + (i+1) + " v těle příkazu " +
					novy_prikaz.jmeno + "." ) );
			}
		}
		i++;
	}
	return vysledek;
}

// Obecné ukládání
data.nacitani.obecny = function (format, radka, novy_prikaz)
{
	if ( radka.length != 1 ) {
		return undefined;
	} else {
		return radka;
	}
}

// Cyklus
data.nacitani.nacti_OPAKUJ = function (format, radka, novy_prikaz)
{
	if ( radka.length > 2 ) return undefined;
	else if ( radka.length == 2 ) {
		var pocet = parseInt(radka[1]);
		if ( isNaN(pocet) || pocet < -1 ) return undefined;
		if ( pocet == -1 ) {
			radka = [ radka[0] ];
		}
	}
	return radka;
}

// Podmínka
data.nacitani.nacti_podminku = function (format, radka, novy_prikaz)
{
	if ( radka.length != 2 ) return undefined;
	var podminka = parseInt(radka[1]);
	if ( isNaN(podminka) || podminka == 0
		|| !isNaN(podminka) && Math.abs(podminka) > prikazy.podminky.length ) {
		return undefined;
	}
	return radka;
}

// Komentář
data.nacitani.nacti_komentar = function (format, radka, novy_prikaz)
{
	if ( radka.length != 2 ) return undefined;
	radka[1] = unescape(radka[1]);
	return radka;
}

// Název
data.nacitani.nacti_nazev = function (format, radka, novy_prikaz)
{
	if ( radka.length != 1 ) return undefined;
	radka[1] = novy_prikaz;
	return radka;
}
