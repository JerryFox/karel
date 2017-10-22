/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - ovládání editoru

// POZNÁMKA: Řetězec načtený z příkazového pole je vnitřně udržován ve formě
// escape(), protože Konqueror (KDE JavaScript) neumí pracovat s Unicode.

// ===========================================================================
// =~ Globální nastavení ~====================================================

// Ukládat, nebo neukládat syntakticky chybné příkazy?
nastaveni.ukladat_syntakticky_chybne = true;

// ===========================================================================
// =~ Globální proměnné ~=====================================================

// Editor
editor = new Object();

// Panel nástrojů
editor.nastroje = new Array(
	[ "novy", "tip-novy", "Nový příkaz", "Vytvoř nový příkaz" ],
	null,
	[ "ulozit", "tip-ulozit-prikaz", "Ulož příkaz", "Ulož příkaz do slovníku" ],
	[ "ulozit-jako", "tip-ulozit-jako", "Ulož příkaz nově", "Ulož příkaz pod novým jménem" ]
);
editor.nastroje.id_prefix = "editor-";
editor.nastroje.mys = "editor.mys_nastroje";

// Myš nad nástroji
editor.mys_nastroje = new Mys(new Tooltip());

// Zobrazený příkaz včetně textového obsahu (pro účely zjištění změny)
editor.zobrazeny = { prikaz: null, obsah: null, zmeneny: false };

// ===========================================================================
// =~ Základní funkce pro práci se slovníkem ~================================

editor.mys_nastroje.proved_zvyrazneni = function(info, detail)
{
	return true;
}

editor.mys_nastroje.prekresli_stav = function(nastroj, detail, zvyraznen,
                                              stisknut, vybran)
{
	tvoric.zvyraznovac( editor.nastroje.id_prefix+nastroj, zvyraznen, stisknut,
		vybran);
}

editor.mys_nastroje.vyber = function(nastroj, detail)
{
	switch ( nastroj ) {
		case "novy":
			editor.prikaz_novy();
			break;
		case "ulozit":
		case "ulozit-jako":
			editor.prikaz_uloz( (nastroj == "ulozit-jako") );
			break;
		default:
			ladici_vypis(CHYBA, "editor.mys_nastroje.vyber", nastroj,
				"vybrán neznámý příkaz");
	}
	return false;
}

editor.mys_nastroje.tooltip.obnov = function (tooltip, info, detail)
{
	tvoric.obnov_tooltip( tooltip, detail.ikona, detail.nadpis, detail.popis );
}

// Zruš ukazatel změny příkazu
editor.zrus_zmenu = function()
{
	nastav_text(document.getElementById('zmeneny-prikaz'), '');
	this.zobrazeny.zmeneny = false;
}

// Editovaný text s upravenými konci řádku
editor.editovany_text = function (text)
{
	var element = document.getElementById('editace');
	if ( text ) {
		element.value = unescape(text);
	} else {
		// Konqueror neumí správně nahrazovat, proto řetězec zpracováváme v escape
		// módu
		var obsah = escape(element.value);
		return obsah.replace(/%0D(%0A)?/g, "%0A");
	}
}

// Nastaví jméno zobrazeného příkazu
editor.zobrazene_jmeno = function (text)
{
	nastav_text(document.getElementById('zobrazeny-prikaz'),
		text);
}

// Nastav (obnov) ukazatel změny příkazu
editor.nastav_zmenu = function ()
{
	if ( this.zobrazeny.obsah != this.editovany_text() ) {
		nastav_text(document.getElementById('zmeneny-prikaz'), '+');
		this.zobrazeny.zmeneny = true;
	} else {
		this.zrus_zmenu();
	}
	return this.zobrazeny.zmeneny;
}

// Kontrola změny příkazu a uložení změn. Vrací true, pokud se může pokračovat
editor.kontrola_zmeny = function ()
{
	if ( this.nastav_zmenu() ) {
		var jmeno = "Nový příkaz";
		if ( this.zobrazeny.prikaz ) {
			jmeno = "Zobrazený příkaz " + this.zobrazeny.prikaz.jmeno;
		}
		var uzivatel_chce = window.confirm( jmeno + " byl změněn.\n\nPřejete si ho uložit?\n" +
			"(OK=Ano, Storno=Ne)" );
		if ( uzivatel_chce ) {
			return editor.prikaz_uloz();
		} else {
			var uzivatel_chce = window.confirm( jmeno + 
				" nebyl uložen. Přesto pokračovat?" );
			if ( !uzivatel_chce ) {
				return false;
			}
		}
	}
	return true;
}

// ===========================================================================
// =~ Formátování chyb ~======================================================

// Zobrazení chyby při ukládání příkazu
editor.formatuj_chybu_ukladani = function (text, uloz_nove, nove_jmeno,
                                           cislo_radky, telo, ulozit)
{
	var text_radky = "";
	var prikaz_radky = "";
	var varovani = "";
	if ( cislo_radky != undefined && cislo_radky != null && cislo_radky >= 0 ) {
		text_radky = " na řádce " + (cislo_radky+1);
		if ( telo && cislo_radky < telo.length ) {
			prikaz_radky = ": " +
				prikazy.formatovac.zformatuj_jednu_radku(telo[cislo_radky]);
		}
	}
	if ( !ulozit ) {
		varovani = "\n\nZměny příkazu nebyly uloženy.";
	}
	if ( nove_jmeno ) {
		return "Ukládaný příkaz " + nove_jmeno +
			" má chybu" + text_radky + prikaz_radky + ".\n" + text + varovani;
	} else if ( uloz_nove && this.zobrazeny.prikaz ) {
		return "Zobrazený příkaz " + this.zobrazeny.prikaz.jmeno +
			" má chybu" + text_radky + prikaz_radky + ".\n" + text + varovani;
	} else {
		return "Ukládaný příkaz má" + text_radky + " chybu" + prikaz_radky +
			".\n" + text + varovani;
	}
}

// Zobrazení chyby při zobrazení příkazu
editor.formatuj_chybu_zobrazeni = function (text, jmeno, cislo_radky, telo)
{
	var text_radky = "";
	var prikaz_radky = "";
	if ( cislo_radky != undefined && cislo_radky != null ) {
		text_radky = " na řádce " + (cislo_radky+1);
		if ( telo && cislo_radky < telo.length ) {
			prikaz_radky = ": " +
				prikazy.formatovac.zformatuj_jednu_radku(telo[cislo_radky]);
		}
	}
	return "Zobrazovaný příkaz " + jmeno +
			" má chybu" + text_radky + prikaz_radky + ".\n" + text;
}

// ===========================================================================
// =~ Příkazy editace ~=======================================================

// Nový příkaz
editor.prikaz_novy = function (bez_kontroly)
{
	if ( !bez_kontroly && !this.kontrola_zmeny() ) return;
	var jmeno;
	var i = 1;
	do {
		jmeno = "NOVÝ PŘÍKAZ";
		if ( i > 1 ) jmeno += " "+i;
		for ( var j = prikazy.seznam.length-1;
			j >= 0 && !prikazy.seznam[j].systemovy; j-- ) {
			if ( jmeno == prikazy.seznam[j].jmeno ) break;
		}
		if ( j < 0 || j >= 0 && prikazy.seznam[j].systemovy ) break;
		i++;
	} while ( true );

	// Struktura nového příkazu pro zformátování. Zformátování je nutné, protože
	// se obsah uchovává ve formě escape()
	var prikaz = { jmeno: jmeno };
	prikaz.telo = [ [ prikazy.NAZEV, prikaz ], [ prikazy.KONEC ] ];
	var obsah = new Obsah();
	var vysledek = prikazy.formatovac.zformatuj_prikaz(prikaz, obsah);

	this.zobrazene_jmeno(prikazy.zadny_prikaz);
	this.zobrazeny.prikaz = null;
	this.zobrazeny.obsah = obsah.obsah();
	this.editovany_text( this.zobrazeny.obsah );
	this.zrus_zmenu();
}

// Zkontroluj, jestli se nepřepisuje nějaký příkaz. Vrací false, pokud se nemá
// přepisovat; true, pokud se normálně pokračuje; nebo příkaz pro smazání, pokud
// se přepisuje
editor.kontrola_prepsani = function (uloz_nove, novy_prikaz)
{
	var smaz_prikaz;
	for ( var i = prikazy.seznam.length-1; i >= 0; i-- ) {
		var prikaz = prikazy.seznam[i];
		if ( prikaz.zobrazit ) {
			if ( prikaz.jmeno == novy_prikaz.jmeno
				&& this.zobrazeny.prikaz != prikaz ) {
				if ( !window.confirm("Opravdu má být přepsán příkaz " +
					prikaz.jmeno + "?") ) {
					return false;
				} else {
					if ( !uloz_nove && this.zobrazeny.prikaz ) {
						// Po změně musíme smazat původní příkaz
						smaz_prikaz = this.zobrazeny.prikaz;
						this.zobrazeny.prikaz = prikaz;
						return smaz_prikaz;
					} else {
						this.zobrazeny.prikaz = prikaz;
						return true;
					}
				}
			}
		}
	}
	return true;
}

// Proveď uložení příkazu
editor.proved_ulozeni = function (uloz_nove, novy_prikaz, obsah)
{
		if ( uloz_nove || !this.zobrazeny.prikaz ) {
			prikazy.pridej_novy(novy_prikaz);
		} else {
			prikazy.zmen_prikaz(this.zobrazeny.prikaz, novy_prikaz);
		}

		this.zobrazeny.obsah = obsah;
		this.zobrazeny.prikaz = novy_prikaz;
		this.zobrazene_jmeno(novy_prikaz.jmeno);
}

// Ulož příkaz. Vrací true, pokud se může pokračovat
editor.prikaz_uloz = function (uloz_nove)
{
	if ( !prikazy.test_spusteni() ) return false;
	var text = this.editovany_text();
	var vysledek = new Vysledek();

	var uloz_nove_prikaz = (!uloz_nove ? this.zobrazeny.prikaz : undefined);
	vysledek.nastav( prikazy.rozpoznavac.rozpoznej( text, uloz_nove_prikaz ) );

	var novy_prikaz = vysledek.hodnota.prikaz;
	var obsah = vysledek.hodnota.obsah;
	var cislo_radky = vysledek.hodnota.cislo_radky;

	var ulozit = false;

	if ( !vysledek.byla_chyba() ) {
		var novy_obsah = new Obsah();
		vysledek.nastav(
			prikazy.formatovac.zformatuj_prikaz(novy_prikaz, novy_obsah) );
		obsah = novy_obsah.obsah();
		cislo_radky = vysledek.hodnota.cislo_radky;

		// Uložit příkaz, stejně jako ve verzi 1.2, nebo neuložit?
		if ( nastaveni.ukladat_syntakticky_chybne ) {
			ulozit = true;
		} else {
			ulozit = !vysledek.byla_chyba();
		}
	}

	vysledek.chyba.formatuj = function (text) {
		return editor.formatuj_chybu_ukladani(text, uloz_nove, novy_prikaz.jmeno,
                                          cislo_radky, novy_prikaz.telo,
                                          ulozit);
	}

	// Obnov obsah editovacího pole
	if ( obsah != this.editovany_text() ) {
		this.editovany_text( obsah );
	}

	// Kontrola přepsání zobrazeného příkazu
	if ( novy_prikaz.jmeno ) {
		if ( uloz_nove && this.zobrazeny.prikaz
		&& this.zobrazeny.prikaz.jmeno == novy_prikaz.jmeno ) {
			uloz_nove = false;
		}
	}

	vysledek.zobraz_chybu();

	if ( ulozit ) {
		var smaz_prikaz;
		var vyber_prikaz;

		// Kontrola přepsání
		smaz_prikaz = this.kontrola_prepsani(uloz_nove, novy_prikaz);
		if ( !smaz_prikaz ) {
			ulozit = false;
		}

		// Zjisti, jestli se má udržet nějaký výběr
		if ( ulozit && !uloz_nove && smaz_prikaz instanceof Object
			&& prikazy.vybrany_prikaz() == smaz_prikaz.jmeno ) {
			vyber_prikaz = novy_prikaz.jmeno;
		}

		// Smaž příkaz, pokud je co smazat
		if ( smaz_prikaz instanceof Object ) {
			prikazy.nahrad_telo( smaz_prikaz, novy_prikaz );
			prikazy.proved_smazani( smaz_prikaz );
		}

		// Ulož nový příkaz
		if ( ulozit ) {
			this.proved_ulozeni( uloz_nove, novy_prikaz, obsah );
		}

		// Obnov výběr příkazu
		if ( vyber_prikaz && vyber_prikaz != prikazy.vybrany_prikaz() ) {
			prikazy.vyber_prikaz(vyber_prikaz);
		}
	} // end if ( !chyba.byla_chyba() )

	// Indikuj změnu obsahu a vrať výsledek - true, pokud bylo uloženo
	return !this.nastav_zmenu();
}

// Příkaz byl doplněn, obnov zobrazení
editor.prikaz_upraven = function (prikaz)
{
	if ( this.zobrazeny.prikaz == prikaz ) {
		var obsah = new Obsah();
		prikazy.formatovac.zformatuj_prikaz( this.zobrazeny.prikaz, obsah );
		this.zobrazeny.obsah = obsah.obsah();
		if ( this.nastav_zmenu() ) {
			// Pokud nebyl příkaz změněný, zobraz nový obsah
			this.editovany_text( obsah.obsah() );
			this.nastav_zmenu();
		}
	}
}

// Zobrazit vybraný příkaz
editor.zobraz_vybrany_prikaz = function ()
{
	if ( !this.kontrola_zmeny() ) return;

	// Kontrola vybraného příkazu je nutná i zde, protože se výběr mohl
	// uložením změnit
	var jmeno = prikazy.vybrany_prikaz();
	if ( !(jmeno && prikazy.prikaz[jmeno]) ) {
		alert( "Není vybrán žádný příkaz.\n\n" +
			"Příkaz vyberte klepnutím myši." );
		return;
	}

	var prikaz = prikazy.prikaz[jmeno];

	var vysledek = new Vysledek();
	var obsah = new Obsah();
	var chyba = new Chyba();
	vysledek.nastav( prikazy.formatovac.zformatuj_prikaz(prikaz, obsah) );

	vysledek.chyba.formatuj = function (text) {
		return editor.formatuj_chybu_zobrazeni(text, prikaz.jmeno,
		                                       vysledek.hodnota.cislo_radky,
		                                       prikaz.telo);
	}

	this.zobrazeny.prikaz = prikaz;
	this.zobrazene_jmeno(prikaz.jmeno);
	this.zobrazeny.obsah = obsah.obsah();
	this.editovany_text( obsah.obsah() );
	this.nastav_zmenu();

	vysledek.zobraz_chybu();
}

// Příkaz byl smazán
editor.smaz_prikaz = function (prikaz)
{
	if ( this.zobrazeny.prikaz == prikaz ) {
		this.zobrazeny.prikaz = null;
		this.zobrazeny.obsah = null;
		this.zobrazene_jmeno(prikazy.zadny_prikaz);
		this.nastav_zmenu();
	}
}
