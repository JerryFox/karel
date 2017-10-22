/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - vykonávání příkazů

// ===========================================================================
// =~ Globální nastavení ~====================================================

// Největší počet příkazů provedených v jedné smyčce
nastaveni.maximum_prikazu_smycky = 10;

// Maximální délka smyčky v milisekundách
nastaveni.maximalni_delka_smycky = 25;

// Prodleva mezi vykonáváním příkazů
// nastaveni.prodleva = 500;	// Nyní definováno v souboru nastaveni-funkce.js

// ===========================================================================
// =~ Globální proměnné ~=====================================================

// Informace a data o příkazech
prikazy = new Object();

// Jádro vykonávající příkazy
//
// Každá funkce pro jednotlivé příkazy je navržena tak, aby byla schopna jak
// vykonat příkaz, tak rozpoznat případné chyby syntaxe. Režim práce je předán
// v parametru syntaxe, který při hodnotě true rozhodne pouze o syntaxi a při
// hodnotě false vykoná příkaz.
prikazy.jadro = new Object();

// Verzování
prikazy.VERZE_10 = 1;
prikazy.VERZE_11 = 2;
prikazy.VERZE_12 = 4;
prikazy.VERZE_20 = 8;
prikazy.min_VERZE_20 = prikazy.VERZE_20;
prikazy.min_VERZE_12 = prikazy.min_VERZE_20 | prikazy.VERZE_12;
prikazy.min_VERZE_11 = prikazy.min_VERZE_12 | prikazy.VERZE_11;
prikazy.min_VERZE_10 = prikazy.min_VERZE_11 | prikazy.VERZE_10;

// ===========================================================================
// =~ Formátování chyby provádění ~===========================================

prikazy.formatuj_chybu_provadeni = function (jmeno, cislo_radky, telo, text)
{
	if ( jmeno ) {
		var prikaz_radky = "";
		if ( cislo_radky < telo.length ) {
			prikaz_radky = ": " +
				prikazy.formatovac.zformatuj_jednu_radku(telo[cislo_radky]);
		}
		return "Chyba při provádění příkazu " + jmeno + " na řádce " + 
			(cislo_radky+1) + prikaz_radky + ".\n\n" + text;
	} else {
		return "Chyba při provádění příkazu.\n\n" + text;
	}
}

// ===========================================================================
// =~ Testy ~=================================================================

// Test spuštění. Vrací true, jestli se může pokračovat
prikazy.test_spusteni = function ()
{
	var prikaz = prikazy.jadro.probiha();
	if ( prikaz ) {
		var uzivatel_chce = window.confirm( "Právě je prováděn příkaz " + prikaz.jmeno + ".\n\n" +
			"Pro pokračování je nutné provádění ukončit.\n" +
			"Mám příkaz ukončit?" );
		if ( uzivatel_chce ) {
			prikazy.jadro.zastav();
			return true;
		}
		return false;
	}
	return true;
}

// ===========================================================================
// =~ Stav provádění příkazů ~================================================

prikazy.Stav = function (prikaz)
{
	this.probiha = false;
	this.casovac = { id: null };
	this.doplnit_konec = true;
	this.rychle = 0;
	this.byla_rychla_akce = false;
	this.historie = new Array();
	this.pozice = new Object();
	if ( prikaz ) {
		this.prikaz = prikaz;
	} else {
		this.syntaxe = true;
	}
}

// Funkce najde odpovídající přikaz KONEC, případně KONEC, JINAK, nebo AŽ. Vrací
// objekt Vysledek s nastavenou chybou, pokud k nějaké došlo. Kontroluje
// syntaxi a jako jediná funkce není omezená na počet kroků. Po návratu je
// příkaz připraven na další krok.
prikazy.Stav.prototype.najdi_konec = function ()
{
	var stara_syntaxe = this.syntaxe;
	this.syntaxe = true;
	var vysledek = new Vysledek();

	if ( ! this.historie.length || this.historie.length < 1 ) {
		ladici_vypis(CHYBA, "stav.najdi_konec",
			"nebyl spuštěn žádný příkaz, nebo už skončil");
		this.syntaxe = stara_syntaxe;
		return vysledek;
	}
	var historie_pozice = this.historie.length - 1;
	var konec_jinak =
		( this.historie[historie_pozice][0] != prikazy.KONEC_JINAK );
 	if ( konec_jinak ) {
		ladici_vypis(DETAIL, "stav.najdi_konec",
			"přeskakuji na další KONEC nebo KONEC, JINAK")
	} else {
		ladici_vypis(DETAIL, "stav.najdi_konec",
			"přeskakuji na další KONEC")
	}

	while ( !vysledek.byla_chyba() && historie_pozice < this.historie.length
		&& ( !konec_jinak
		|| konec_jinak && this.historie[historie_pozice][0] != prikazy.KONEC_JINAK) ) {
		vysledek.nastav( this.krok() );
	}

	this.syntaxe = stara_syntaxe;
	return vysledek;
}

prikazy.Stav.prototype.dotaz_na_doplneni = function (dotaz, doplneni, text)
{
	if ( this.doplnit_konec && window.confirm(dotaz) ) {
		if ( doplneni instanceof Array ) {
			for ( var i = 0; i < doplneni.length; i++ ) {
				ladici_vypis( DETAIL, "stav.dotaz_na_doplneni",
					this.pozice.prikaz.jmeno, "doplňuji na konec příkaz " +
					doplneni[i].jmeno );
				this.pozice.prikaz.telo.push( [doplneni[i]] );
			}
		} else {
			ladici_vypis( DETAIL, "stav.dotaz_na_doplneni",
				this.pozice.prikaz.jmeno, "doplňuji na konec příkaz " +
				doplneni.jmeno );
			this.pozice.prikaz.telo.push( [doplneni] );
		}
		return new Vysledek( false, Vysledek.BYL_UPRAVEN );
	} else {
		return new Vysledek( new Chyba(true, text) );
	}
}

// Doplnění příkazů KONEC a KONEC, JINAK pro všechny cykly a podmínky. Vrací
// objekt Vysledek, pokud došlo k chybě. Vrací null, pokud nemohlo být doplnění
// provedeno
prikazy.Stav.prototype.dopln_konec = function (posledni)
{
	var obecna_chyba = new Vysledek( new Chyba( true,
		"Na konci chybí příkaz KONEC.\n" +
		"Zkontrolujte příkazy podmínek, opakování a rychlých bloků." ) );

	// Nejdříve kontrola, jestli historie vůbec něco obsahuje a jestli náhodou
	// neobsahuje další volání - v tom případě se vrátíme bez jakékoliv úpravy
	if ( !this.historie || this.historie && !this.historie.length )
		return obecna_chyba;
	if ( !this.pozice || this.pozice && !this.pozice.prikaz )
		return obecna_chyba;
	if ( this.doplnit_konec ) {
		var prikaz_doplneni = false;	// Jestli je poslední příkaz pro doplnění
		for ( var i = 0; i < this.historie.length; i++ ) {
			if ( ! this.historie[i][0].systemovy ) {
				prikaz_doplneni = ( this.historie[i][0] == this.pozice.prikaz );
			}
		}
		if ( !prikaz_doplneni ) return obecna_chyba;
	}

	var stara_historie = new Array();
	if ( !posledni ) {
		posledni = this.historie.pop();
		stara_historie.unshift(posledni);
	}
	
	var vysledek = new Vysledek();
	do {
		if ( !posledni[0].systemovy ) {
			vysledek.nastav( this.dotaz_na_doplneni(
				"Příkaz " + this.pozice.prikaz.jmeno +
				" není ukončen příkazem KONEC.\n\nDoplnit?",
				prikazy.KONEC,
				"Příkaz není ukončen příkazem KONEC.\n" +
				"Prosím ukončete svůj příkaz slovem KONEC.") );
		} else if ( posledni[0] == prikazy.KDYZ ) {
			vysledek.nastav( this.dotaz_na_doplneni(
				"Podmínka KDYŽ není ukončena sérií příkazů KONEC, JINAK a KONEC.\n\n" +
				"Doplnit?",
				[ prikazy.KONEC_JINAK, prikazy.KONEC ],
				"Podmínka KDYŽ není ukončena alespoň příkazem KONEC.\n\n" +
				"Prosím ukončete podmínku KDYŽ slovem KONEC.") );
		} else if ( posledni[0] == prikazy.KONEC_JINAK ) {
			vysledek.nastav( this.dotaz_na_doplneni(
				"Podmínka KDYŽ není ukončena příkazem KONEC.\n\n" +
				"Doplnit?",
				prikazy.KONEC,
				"Podmínka KDYŽ je ukončena pouze slovem KONEC, JINAK.\n\n" +
				"Prosím ukončete podmínku KDYŽ slovem KONEC.") );
		} else if ( posledni[0] == prikazy.DOKUD ) {
			vysledek.nastav( this.dotaz_na_doplneni(
				"Cyklus DOKUD není ukončen příkazem KONEC, nebo AŽ.\n\n" +
				"Doplnit příkaz KONEC?",
				prikazy.KONEC,
				"Ukončení cyklu DOKUD není ukončeno alespoň příkazem KONEC.\n\n" +
				"Prosím ukončete cyklus DOKUD slovem KONEC.") );
		} else if ( posledni[0] == prikazy.OPAKUJ ) {
			vysledek.nastav( this.dotaz_na_doplneni(
				"Cyklus OPAKUJ není ukončen příkazem KONEC, nebo AŽ.\n\n" +
				"Doplnit příkaz KONEC?",
				prikazy.KONEC,
				"Cyklus OPAKUJ není ukončen alespoň příkazem KONEC.\n\n" +
				"Prosím ukončete cyklus OPAKUJ slovem KONEC.") );
		} else if ( posledni[0] == prikazy.RYCHLE ) {
			vysledek.nastav( this.dotaz_na_doplneni(
				"Blok RYCHLE není ukončen příkazem POMALU.\n\n" +
				"Doplnit?",
				prikazy.POMALU,
				"Rychlý blok RYCHLE není ukončen slovem POMALU, nebo KONEC.\n\n" +
				"Prosím ukončete bloku rychlého provádění slovem POMALU.") );
		} else {
			vysledek = obecna_chyba;
			break;
		}
		if ( this.doplnit_konec ) {
			posledni = this.historie.pop();
			if ( posledni ) stara_historie.unshift(posledni);
		}
	} while ( this.doplnit_konec && !vysledek.byla_chyba() && posledni );

	if ( this.historie.length > 0 ) {
		this.historie = this.historie.concat(stara_historie);
	} else {
		this.historie = stara_historie;
	}

	return vysledek;
}

// Proveď kontrolu syntaxe a vrať výsledek
prikazy.Stav.prototype.kontrola_syntaxe = function (prikaz, doplnit_konec)
{
	this.syntaxe = true;
	this.doplnit_konec = doplnit_konec;
	this.historie = new Array();
	this.prikaz = prikaz;
	delete this.pozice;
	this.rychle = 0;
	var vysledek = this.proved_volani( prikaz );
	this.pozice = vysledek.hodnota;
	while ( !vysledek.byla_chyba() && this.historie.length > 0 ) {
		vysledek.nastav( this.krok() );
	}
	return vysledek;
}

// Proveď (první) příkaz
prikazy.Stav.prototype.proved_volani = function (prikaz)
{
	var cislo_radky = 0;
	while ( cislo_radky < prikaz.telo.length
		&& prikaz.telo[cislo_radky][0].ignoruj ) {
		cislo_radky++;
	}
	if ( this.pozice instanceof Object && this.pozice.prikaz ) {
		// Kam se vrátit
		this.historie.push( [ this.pozice.prikaz, this.pozice.cislo_radky + 1 ] );
	} else {
		// První nastavení - nikam se nevracíme
		this.historie.push( [ this.prikaz ] );
	}
	return new Vysledek( false, Vysledek.NIC,
		{ prikaz: prikaz, cislo_radky: cislo_radky } );
}

// Rychlé vykonávání příkazů
prikazy.Stav.prototype.proved_rychle = function (prikaz)
{
	this.rychle++;
	ladici_vypis( DETAIL, "stav.proved_rychle",
		"rychlé provádění, počet volání: " + this.rychle );
}

// Rychlé vykonávání příkazů
prikazy.Stav.prototype.proved_pomalu = function (prikaz)
{
	var provedl_akci = false;
	if ( this.rychle ) this.rychle--;
	if ( this.rychle ) {
		ladici_vypis( DETAIL, "stav.proved_pomalu",
			"zůstává rychlé provádění, počet volání: " + this.rychle );
	} else {
		provedl_akci = this.byla_rychla_akce;
		ladici_vypis( DETAIL, "stav.proved_pomalu",
			"nastaveno pomalé (normální) provádění, akce " +
			(provedl_akci?"byla":"nebyla") + " provedena" );
		this.byla_rychla_akce = false;
	}
	if ( provedl_akci ) {
		return new Vysledek( false, Vysledek.PROVEDL_AKCI );
	} else {
		return new Vysledek();
	}
}

// Spusť vykonávání příkazu
prikazy.Stav.prototype.spust = function ()
{
	var vysledek = new Vysledek();
	if ( this.prikaz.systemovy ) {
		vysledek.nastav( this.prikaz.spust() );
		this.probiha = false;
	} else {
		prikazy.obnov_stav( true );
		this.probiha = true;
		vysledek.nastav( this.proved_volani(this.prikaz) );

		if ( !vysledek.je_konec() ) {
			var pozice = this.pozice = vysledek.hodnota;
			vysledek.chyba.formatuj = function (text) {
				return prikazy.formatuj_chybu_provadeni(pozice.jmeno,
					pozice.cislo_radky, prikazy.prikaz[pozice.jmeno].telo, text);
			}
			vysledek.nastav( this.dalsi_krok(0) );
		}
	}
	return vysledek;
}

// Vynulování časovače
prikazy.Stav.prototype.nuluj_casovac = function ()
{
	if ( this.casovac && this.casovac.id ) {
		clearTimeout(this.casovac.id);
		this.casovac.id = null;
		delete this.casovac.cas;
		delete this.casovac.prodleva;
		delete this.casovac.funkce;
	}
}

// Nastav časovač
prikazy.Stav.prototype.nastav_casovac = function (funkce, prodleva)
{
	this.nuluj_casovac();
	this.casovac.cas = new Date();
	this.casovac.prodleva = prodleva;
	this.casovac.funkce = funkce;
	this.casovac.id = setTimeout( funkce, prodleva );
}

// Přenastav časovač
prikazy.Stav.prototype.prenastav_casovac = function (prodleva)
{
	if ( this.casovac && this.casovac.id ) {
		clearTimeout(this.casovac.id);
		var cas = new Date();
		var rozdil = cas-this.casovac.cas;
		if ( rozdil >= prodleva ) {
			prodleva = 0;
		} else {
			prodleva -= rozdil;
		}
		this.casovac.cas = cas;
		this.casovac.prodleva = prodleva;
		this.casovac.id = setTimeout( this.casovac.funkce, prodleva );
	}
}

// Zastav vykonávání příkazů
prikazy.Stav.prototype.zastav = function ()
{
	if ( this.probiha ) {
		this.probiha = false;
		prikazy.obnov_stav( this.probiha );
		this.nuluj_casovac();
	}
	return new Vysledek(new Chyba(), Vysledek.KONEC);
}

// ===========================================================================
// =~ Opakované provádění příkazů ~===========================================

prikazy.Stav.prototype.dalsi_krok = function (pocet_prikazu)
{
	var vysledek = new Vysledek();

	if ( pocet_prikazu == undefined ) {
		pocet_prikazu = nastaveni.maximum_prikazu_smycky;
	}

	this.nuluj_casovac();

	var start = new Date();
	var i = 0;
	while ( i < pocet_prikazu
		&& ((new Date())-start) <= nastaveni.maximalni_delka_smycky ) {
		vysledek.nastav( this.krok() );
		if ( vysledek.byl_upraven() && this.pozice.prikaz ) {
			editor.prikaz_upraven( this.pozice.prikaz );
		}
		if ( vysledek.je_konec() || !this.rychle && vysledek.byla_akce() ) {
			break;
		}
		if ( this.rychle && vysledek.byla_akce() ) {
			this.byla_rychla_akce = true;
		}
		i++;
	}

	if ( vysledek.je_konec() ) {
		this.zastav();
		var pozice = this.pozice;
		vysledek.chyba.formatuj = function (text) {
			return prikazy.formatuj_chybu_provadeni(pozice.prikaz.jmeno,
				pozice.cislo_radky, pozice.prikaz.telo, text);
		}
		vysledek.zobraz_chybu();
	} else {
		var interval = nastaveni.prodleva;
		if ( i == pocet_prikazu || this.rychle || pocet_prikazu == 0 ) {
			interval = 0;
		}
		this.nastav_casovac( prikazy.dalsi_krok, interval );
	}

	return vysledek;
}

// Proveď jeden krok příkazu. Vrací objekt Vysledek
prikazy.Stav.prototype.krok = function ()
{
	var vysledek = new Vysledek();
	var cislo_radky = this.pozice.cislo_radky;
	if ( cislo_radky >= this.pozice.prikaz.telo.length ) {
		ladici_vypis( DETAIL, "stav.krok", this.pozice.prikaz.jmeno,
			"příkaz není správně ukončen" );
		vysledek.nastav( this.dopln_konec() );
		if ( vysledek.je_konec() ) {
			// Aktualizace čísla řádku
			this.pozice.cislo_radky = this.pozice.prikaz.telo.length;
		}
		// Aktualizuj pozici chyby
		vysledek.nastav( false, vysledek.stav, this.pozice );
	} else {
		var radka = this.pozice.prikaz.telo[cislo_radky];
		if ( !this.syntaxe || this.syntaxe && radka[0].syntaxe ) {
			if ( !radka[0].ignoruj ) {
				vysledek.nastav( radka[0].spust(radka, this) );
			}
		}
	}

	if ( vysledek.hodnota ) {
		this.pozice = vysledek.hodnota;
	} else if ( !vysledek.je_konec() ) {
		this.pozice.cislo_radky++;
	} else if( vysledek.byla_chyba() ) {
		// Byla chyba, ale nebyla nastavena řádka chyby - aktualizuj
		vysledek.nastav( false, vysledek.stav, this.pozice );
	}

	if ( vysledek.ma_preskocit() ) {
		vysledek.nastav( this.najdi_konec() );
	}

	return vysledek;
}

// ===========================================================================
// =~ Základní systémové funkce ~=============================================

prikazy.jadro.KROK = function (radka, stav)
{
	ladici_vypis(INFORMACE, "prikazy.jadro", "KROK");
	return mesto.proved_krok();
}

prikazy.jadro.VLEVO_VBOK = function (radka, stav)
{
	ladici_vypis(INFORMACE, "prikazy.jadro", "VLEVO-VBOK");
	return mesto.proved_vlevo_vbok();
}

prikazy.jadro.POLOZ = function (radka, stav)
{
	ladici_vypis(INFORMACE, "prikazy.jadro", "POLOŽ");
	return mesto.proved_poloz();
}

prikazy.jadro.ZVEDNI = function (radka, stav)
{
	ladici_vypis(INFORMACE, "prikazy.jadro", "ZVEDNI");
	return mesto.proved_zvedni();
}

prikazy.jadro.STOP = function (radka, stav)
{
	ladici_vypis(INFORMACE, "prikazy.jadro", "STOP");
	if ( !stav.syntaxe ) {
		var vysledek = new Vysledek( new Chyba(true, "Bohužel musím končit.\n\n" +
			"Narazil jsem na příkaz STOP.") );
		vysledek.zobraz_chybu();
		return vysledek;
	} else {
		return new Vysledek();
	}
}

prikazy.jadro.RYCHLE = function (radka, stav)
{
	stav.historie.push( radka );
	ladici_vypis(INFORMACE, "prikazy.jadro", "RYCHLE");
	if ( !stav.syntaxe ) stav.proved_rychle();
	return new Vysledek();
}

prikazy.jadro.POMALU = function (radka, stav)
{
	var posledni = stav.historie.pop();
	if ( !posledni || posledni && posledni[0] != prikazy.RYCHLE ) {
		return new Vysledek( new Chyba( true,
			"Nalezen příkaz POMALU bez odpovídajícího RYCHLE." ) );
	}
	ladici_vypis(INFORMACE, "prikazy.jadro", "POMALU");
	if ( !stav.syntaxe ) {
		return stav.proved_pomalu();
	}
	return new Vysledek();
}

// ===========================================================================
// =~ Konce ~=================================================================

prikazy.jadro.KONEC_JINAK = function (radka, stav)
{
	var posledni = stav.historie.pop();
	if ( !stav.syntaxe ) ladici_vypis(INFORMACE, "prikazy.jadro", "KONEC, JINAK");
	if ( !posledni || posledni && posledni[0] != prikazy.KDYZ ) {
		return new Vysledek( new Chyba( true,
			"Nalezen příkaz KONEC, JINAK bez odpovídající podmínky KDYŽ.\n" +
			"Na příkaz KDYŽ a KONEC, JINAK se prosím koukněte do nápovědy." ) );
	}
	stav.historie.push( radka );
	if ( !stav.syntaxe ) {
		// Přeskoč až na další konec
		return new Vysledek(false, Vysledek.PRESKOC_KONEC);
	} else {
		return new Vysledek();
	}
}

// Vyhodnotí konec opakování příkazu OPAKUJ
prikazy.jadro.konec_OPAKUJ = function (radka, stav, posledni)
{
	// Opakování příkazu
	if ( posledni.length == 2 || (posledni.length == 3 && posledni[1] > 0) ) {
		if ( posledni.length == 3 ) {
			ladici_vypis(DETAIL, "prikazy.jadro", "nový test cyklu OPAKUJ, " +
				"počet opakování:" + posledni[1]);
			posledni[1]--;
		} else {
			ladici_vypis(DETAIL, "prikazy.jadro", "zpět na cyklus OPAKUJ, " +
				"nekonečný počet opakování");
		}
		stav.historie.push( posledni );
		return new Vysledek(false, Vysledek.NIC,
			{ prikaz: stav.pozice.prikaz, cislo_radky: posledni[posledni.length-1] });
	} else {
		ladici_vypis(DETAIL, "prikazy.jadro", "nový test cyklu OPAKUJ, " +
			"konec opakování");
		return new Vysledek();
	}
}

// Vyhodnotí konec opakování příkazu DOKUD
prikazy.jadro.konec_DOKUD = function (radka, stav, posledni)
{
	// Cyklus DOKUD
	ladici_vypis(DETAIL, "prikazy.jadro", "nový test příkazu DOKUD");
	if ( prikazy.jadro.podminka(posledni) ) {
		// Podmínka je splněna, posuň se zpět za příkaz DOKUD
		stav.historie.push(posledni);
		return new Vysledek( false, Vysledek.NIC,
			{ prikaz: stav.pozice.prikaz, cislo_radky: posledni[2] } );
	} else {
		return new Vysledek();
	}
}

prikazy.jadro.KONEC = function (radka, stav)
{
	var posledni = stav.historie.pop();
	if ( !stav.syntaxe ) ladici_vypis(INFORMACE, "prikazy.jadro", "KONEC");
	if ( !posledni || posledni
		&& posledni[0].systemovy && posledni[0] != prikazy.KDYZ
		&& posledni[0] != prikazy.KONEC_JINAK && posledni[0] != prikazy.DOKUD
		&& posledni[0] != prikazy.OPAKUJ && posledni[0] != prikazy.RYCHLE ) {
		return new Vysledek( new Chyba( true,
			"Nalezen příkaz KONEC, který neukončuje ani uživatelský příkaz, "+
			"ani podmínku, ani opakování.\n" +
			"Na ukončování příkazů se prosím koukněte do nápovědy.") );
	}

	if ( !posledni[0].systemovy ) {
		// Konec příkazu
		var prikaz = stav.pozice.prikaz;
		var prazdny = true;
		var dalsi_cislo_radky = stav.pozice.cislo_radky+1;
		if ( dalsi_cislo_radky < prikaz.telo.length ) {
			var dalsi_prikaz = prikaz.telo[dalsi_cislo_radky][0];
			stav.historie.push(posledni);
			if ( !dalsi_prikaz.ignoruj ) {
				return new Vysledek( new Chyba( true,
					"Nalezen příkaz za posledním příkazem KONEC. " +
					"Pravděpodobně nějaká podmínka nebo cyklus byl špatně " +
					"ukončen." ),
					Vysledek.NIC,
					{ prikaz: prikaz, cislo_radky: dalsi_cislo_radky } );
			} else {
				return new Vysledek( new Chyba( true,
					"Nalezen " + dalsi_prikaz.jmeno + 
					" za posledním příkazem KONEC, který ukončuje popis " +
					"celého příkazu." ),
					Vysledek.NIC, 
					{ prikaz: prikaz, cislo_radky: dalsi_cislo_radky } );
			}
		}
		if ( stav.historie.length == 0 ) {
			return new Vysledek(false, Vysledek.KONEC);
		} else {
			return new Vysledek(false, Vysledek.NIC,
				{ prikaz:posledni[0], cislo_radky: posledni[1] } );
		}
	} else if ( posledni[0] == prikazy.OPAKUJ && !stav.syntaxe ) {
		// Cyklus OPAKUJ
		return prikazy.jadro.konec_OPAKUJ(radka, stav, posledni);
	} else if ( posledni[0] == prikazy.DOKUD && !stav.syntaxe ) {
		// Cyklys DOKUD
		return prikazy.jadro.konec_DOKUD(radka, stav, posledni);
	} else if ( posledni[0] == prikazy.RYCHLE ) {
		// Konec rychlého bloku
		return stav.proved_pomalu();
	}	// Všechno ostatní prostě skončí (KDYŽ-KONEC, KDYŽ-KONEC_JINAK-KONEC)

	return new Vysledek();
}

// ===========================================================================
// =~ Podmínky a cykly ~======================================================

prikazy.jadro.podminka = function (radka)
{
	var vysledek = prikazy.podminky[Math.abs(radka[1])-1].test();
	if ( radka[1] < 0 ) vysledek = !vysledek;
	ladici_vypis(INFORMACE, "prikazy.jadro", "podmínka " +
		prikazy.formatuj_podminku(radka) + " " +
		(vysledek?"je":"není") + " pravdivá" );
	return vysledek;
}

prikazy.jadro.KDYZ = function (radka, stav)
{
	stav.historie.push( radka );
	if ( !stav.syntaxe && !prikazy.jadro.podminka(radka) ) {
		return new Vysledek( false, Vysledek.PRESKOC_KONEC );
	} else {
		return new Vysledek();
	}
}

prikazy.jadro.DOKUD = function (radka, stav)
{
	stav.historie.push( radka.concat(stav.pozice.cislo_radky+1) );
	if ( !stav.syntaxe && !prikazy.jadro.podminka(radka) ) {
		return new Vysledek( false, Vysledek.PRESKOC_KONEC );
	} else {
		return new Vysledek();
	}
}

prikazy.jadro.OPAKUJ = function (radka, stav)
{
	var historie = radka.concat(stav.pozice.cislo_radky+1);
	if ( !stav.syntaxe && radka.length == 2 && radka[1] == 0 ) {
		ladici_vypis(INFORMACE, "prikazy.jadro",
			"cyklus OPAKUJ s nulovým počtem opakování" );
		stav.historie.push( historie );
		return new Vysledek(false, Vysledek.PRESKOC_KONEC);
	} else {
		if ( historie.length == 3 ) {
			ladici_vypis(INFORMACE, "prikazy.jadro",
				"cyklus OPAKUJ, počet opakování:" + historie[1]);
			historie[1]--;
		} else {
			ladici_vypis(INFORMACE, "prikazy.jadro",
				"cyklus OPAKUJ, nekonečný počet opakování");
		}
		stav.historie.push( historie );
		return new Vysledek();
}
}

prikazy.jadro.AZ = function (radka, stav)
{
	var posledni = stav.historie.pop();
	if ( !posledni || posledni
		&& posledni[0] != prikazy.OPAKUJ && posledni[0] != prikazy.DOKUD ) {
		return new Vysledek( new Chyba( true,
			"Nalezen příkaz AŽ, který neukončuje opakování OPAKUJ nebo DOKUD.\n" +
			"Na příkaz AŽ se prosím koukněte do nápovědy." ) );
	}
	if ( !stav.syntaxe && !prikazy.jadro.podminka(radka) ) {
		if ( posledni[0] == prikazy.OPAKUJ ) {
			return prikazy.jadro.konec_OPAKUJ(radka, stav, posledni);
		} else {
			return prikazy.jadro.konec_DOKUD(radka, stav, posledni);
		}
	} else {
		return new Vysledek();
	}
}

// ===========================================================================
// =~ Uživatelské příkazy ~===================================================

prikazy.jadro.UZIVATELSKY = function (radka, stav)
{
	ladici_vypis(INFORMACE, "prikazy.jadro", "Uživatelský příkaz " +
		radka[0].jmeno );
	if ( !stav.syntaxe ) {
		// TODO: Optimalizace rekurze, pokud za voláním následuje KONEC (případně
		// nějaký ignorovaný příkaz) - neukládat volání jako nové volání. Ale pouze
		// v případě, pokud je poslední příkaz v historii ten samý - nastavit první
		// parametr na počet vnoření
		return stav.proved_volani( radka[0] );
	} else {
		return new Vysledek();
	}
}

// ===========================================================================
// =~ Provádení příkazů ~=====================================================

prikazy.dalsi_krok = function ()
{
	if ( prikazy.stav ) {
		prikazy.stav.dalsi_krok();
	}
}

prikazy.jadro.proved = function (jmeno)
{
	prikazy.stav = new prikazy.Stav( prikazy.prikaz[jmeno] );
	return prikazy.stav.spust();
}

prikazy.jadro.zastav = function ()
{
	if ( prikazy.stav ) {
		var vysledek = prikazy.stav.zastav();
		delete prikazy.stav;
		return vysledek;
	} else {
		return new Vysledek(false, Vysledek.KONEC);
	}
}

// Zjisti, jestli nějaký příkaz zrovna probíhá
prikazy.jadro.probiha = function ()
{
	var spusteno = ( prikazy.stav && prikazy.stav.probiha );
	if ( spusteno ) {
		return prikazy.stav.prikaz;
	} else {
		return false;
	}
}

prikazy.jadro.proved_nebo_zastav = function(jmeno)
{
	if ( prikazy.stav && prikazy.stav.probiha ) {
		return prikazy.jadro.zastav();
	} else {
		return prikazy.jadro.proved(jmeno);
	}
}

prikazy.jadro.prenastav_casovac = function(prodleva)
{
	if ( prikazy.stav && prikazy.stav.probiha ) {
		prikazy.stav.prenastav_casovac(prodleva);
	}
}
