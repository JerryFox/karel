/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - příkazy a ovládání slovníku

// ===========================================================================
// =~ Globální nastavení ~====================================================

// Při smazání slovníku: zachovat zobrazený příkaz, nebo nezachovat?
nastaveni.zachovej_zobrazeny_prikaz = false;

// ===========================================================================
// =~ Globální proměnné ~=====================================================

// Počet systémových příkazů
prikazy.pocet_systemovych = prikazy.seznam.length;

// Tooltip
prikazy.tooltip = {
	spustit: "Proveď příkaz",
	zastavit: "Zastav provádění příkazu"
};

// Prefix pro ID příkazů
prikazy.id_prefix = "příkaz ";

// Prefix pro název příkazů
prikazy.nazev_prefix = "název ";

// Prefix pro celý příkaz
prikazy.prikaz_prefix = "celý příkaz ";

// Zobrazený název, když není nic vybraného
prikazy.zadny_prikaz = "(žádný)";

// Panel nástrojů
prikazy.nastroje = new Array(
	[ "zobraz", "tip-zobraz", "Ukaž příkaz", "Ukaž vybraný příkaz" ],
	[ "smaz", "tip-smaz-prikaz", "Smaž příkaz", "Vymaž vybraný příkaz z paměti" ],
	null,
	[ "smaz-vse", "tip-smaz-vse", "Reset paměti", "Vymaž všechny naučené příkazy z paměti" ],
	null,
	[ "nacist", "tip-nacist", "Načti slovník", "Načti uložený slovník (i město)" ],
	[ "ulozit", "tip-ulozit", "Ulož slovník", "Ulož slovník pro budoucí použití. " +
		"Při ukládání se automaticky použije nejstarší formát vhodný pro uložení" ],
	null,
	[ "exportovat-12", "tip-exportovat-12", "Ulož slovník",
		"Ulož slovník ve starším formátu rozpoznaném starším Karlem 1.2. "+
		"Komentáře a prázdné řádky nebudou zachovány. Při ukládání se " +
		"automaticky použije nejstarší formát vhodný pro uložení" ],
	[ "exportovat-k99", "tip-exportovat-k99", "Exportuj slovník",
		"Ulož slovník do formátu Visual Karel 99" ]
);
prikazy.nastroje.id_prefix = "slovnik-";
prikazy.nastroje.mys = "prikazy.mys_nastroje";

// Myš nad tlačítkem
prikazy.mys_tlacitko = new Mys(new Tooltip());

// Myš nad příkazem
prikazy.mys_prikaz = new Mys();

// Myš nad nástroji
prikazy.mys_nastroje = new Mys(new Tooltip());

// ===========================================================================
// =~ Základní funkce pro práci se slovníkem ~================================

// Kontrola prázdného slovníku
prikazy.je_slovnik_prazdny = function ()
{
	return ( prikazy.seznam[prikazy.seznam.length-1].systemovy );
}

// Zobraz nový příkaz v seznamu příkazů
prikazy.pridej = function (prikaz)
{
	var id = prikazy.id_prefix+prikaz.jmeno;
	var nazev = prikazy.nazev_prefix+prikaz.jmeno;
	var prikaz_id = prikazy.prikaz_prefix+prikaz.jmeno;

	// Elementy
	var element = document.getElementById('zobrazene');
	var element_prikaz = document.createElement('DIV');
	var element_nazev = element_prikaz.cloneNode(false);
	var element_nazev_text = document.createElement('DIV');

	// Text
	element_nazev_text.appendChild( document.createTextNode(prikaz.jmeno) );

	// Události
	tvoric.nastav_udalosti_mysi( element_nazev, "prikazy.mys_prikaz",
		'\''+nazev+'\'', '\''+prikaz.jmeno+'\'' );

	// Styly
	element_prikaz.className = "prikaz";
	element_nazev.className = "nazev";
	element_nazev.id = nazev;
	element_nazev_text.className = "nazev-text";
	element_prikaz.id = prikaz_id;

	// Tlačítko
	var element_tlacitko = tvoric.vytvor_tlacitko( false, id,
		"prikazy.mys_tlacitko", '\''+id+'\'', '\''+prikaz.jmeno+'\'' );

	// Tvar
	element_nazev.appendChild( element_nazev_text );

	element_prikaz.appendChild( element_tlacitko );
	element_prikaz.appendChild( element_nazev );

	// Zařazení do HTML
	element.appendChild( element_prikaz );
}

// Smaž příkaz ze zobrazeného seznamu příkazů
prikazy.zrus = function (prikaz)
{
	var prikaz_id = prikazy.prikaz_prefix+prikaz.jmeno;
	var element_prikaz = document.getElementById( prikaz_id );
	element_prikaz.parentNode.removeChild(element_prikaz);
}

// Inicializace nového příkazu
prikazy.nastav_novy = function (prikaz)
{
	prikaz.zobrazit = true;
	prikaz.spust = prikazy.jadro.UZIVATELSKY;
	prikaz.kompatibilita = prikazy.min_VERZE_10;
	prikaz.verze_ulozeni = prikazy.min_VERZE_10;
}

// Přidej nový příkaz a obnov zobrazený seznam
prikazy.pridej_novy = function (prikaz)
{
	if ( ! (prikaz instanceof Object) ) {
		ladici_vypis( DETAIL, "prikazy.pridej_novy", "přidávám nový příkaz " +
			prikaz );
		prikaz = { jmeno: prikaz, telo: [ [ prikazy.KONEC ]] };
		prikaz.telo.unshift( [ prikazy.NAZEV, prikaz ] );
	} else {
		ladici_vypis( DETAIL, "prikazy.pridej_novy", "přidávám nový příkaz " +
			prikaz.jmeno );
	}
	prikazy.nastav_novy(prikaz);
	prikazy.seznam.push(prikaz);
	prikazy.prikaz[prikaz.jmeno] = prikaz;
	prikazy.pridej( prikaz );

	return prikaz;
}

// Změň příkaz v tělech ostatních příkazů. Pokud je novy_prikaz prazdny, smaže
// ho z příkazu
prikazy.nahrad_telo = function (stary_prikaz, novy_prikaz)
{
	if ( novy_prikaz ) {
		ladici_vypis( DETAIL, "prikazy.nahrad_telo", "měním výskyt příkazu " +
			stary_prikaz.jmeno + " na " + novy_prikaz.jmeno );
	} else {
		ladici_vypis( DETAIL, "prikazy.nahrad_telo", "mažu výskyt příkazu " +
			stary_prikaz.jmeno + " ze všech příkazů" );
	}

	var i = prikazy.seznam.length-1;
	while ( i >= 0 && !prikazy.seznam[i].systemovy ) {
		var prikaz = prikazy.seznam[i];
		for ( var j = prikaz.telo.length-1; j >= 0; j-- ) {
			if ( prikaz.telo[j][0] == stary_prikaz ) {
				if ( novy_prikaz ) {
					ladici_vypis( LADENI, "prikazy.nahrad_telo", "změna v příkazu " +
						prikaz.jmeno + " na řádce " + (j+1) );
					prikaz.telo[j][0] = novy_prikaz;
				} else {
					ladici_vypis( LADENI, "prikazy.nahrad_telo", "smazán z příkazu " +
						prikaz.jmeno + " z řádky " + (j+1) );
					var pred_prikazem = prikaz.telo.slice(0, j);
					var po_prikazu = prikaz.telo.slice(j+1);
					prikaz.telo = pred_prikazem.concat(po_prikazu);
				}
			}
		}
		i--;
	}
}

// Připrav příkaz na smazání
prikazy.dokonci_smazani = function (prikaz)
{
	delete prikaz.telo;
}

// Obnov informaci v seznamu známých příkazů. Pokud není uveden novy_prikaz,
// je příkaz smazán
prikazy.zmen_seznam = function (stary_prikaz, novy_prikaz)
{
	if ( novy_prikaz ) {
		ladici_vypis( LADENI, "prikazy.zmen_seznam",
			"měním v seznamu příkaz " + stary_prikaz.jmeno + " na " +
			novy_prikaz.jmeno );
	} else {
		ladici_vypis( LADENI, "prikazy.zmen_seznam",
			"mažu ze seznamu příkaz " + stary_prikaz.jmeno );
	}

	var i;
	for ( i = prikazy.seznam.length - 1; i >= 0; i-- ) {
		if ( prikazy.seznam[i] == stary_prikaz ) {
		  if ( novy_prikaz ) {
				prikazy.seznam[i] = novy_prikaz;
			} else {
			  prikazy.dokonci_smazani( prikazy.seznam[i] );
				var pred_prikazem = prikazy.seznam.slice(0, i);
				var po_prikazu = prikazy.seznam.slice(i+1);
			  prikazy.seznam = pred_prikazem.concat(po_prikazu);
			}
			break;
		}
	}
	if ( i < 0 ) {
		ladici_vypis( CHYBA, "prikazy.zmen_seznam", "příkaz " +
			stary_prikaz.jmeno + " nebyl nalezen v seznamu příkazů" );
		return false;
	} else {
		return true;
	}
}

// Změň příkaz a obnov zobrazenou informaci
prikazy.zmen_prikaz = function (stary_prikaz, novy_prikaz)
{
	if ( stary_prikaz.jmeno == novy_prikaz.jmeno ) {
		ladici_vypis( DETAIL, "prikazy.zmen_prikaz", "aktualizuji příkaz " +
			novy_prikaz.jmeno );
	} else {
		ladici_vypis( DETAIL, "prikazy.zmen_prikaz", "měním příkaz " +
			stary_prikaz.jmeno + " na " + novy_prikaz.jmeno );
	}

	// Obnov seznam známých příkazů
	if ( !this.zmen_seznam(stary_prikaz, novy_prikaz) ) {
		ladici_vypis( CHYBA, "prikazy.zmen_prikaz", "starý příkaz " +
			stary_prikaz.jmeno + " nenalezen v seznamu, raději přidám nový" );
		prikazy.pridej_novy( novy_prikaz );
		return;
	}

	// Atributy nového příkazu
	prikazy.nastav_novy(novy_prikaz);
	delete prikazy.prikaz[stary_prikaz.jmeno];
	prikazy.prikaz[novy_prikaz.jmeno] = novy_prikaz;

	var stary_id = prikazy.id_prefix+stary_prikaz.jmeno;
	var stary_nazev = prikazy.nazev_prefix+stary_prikaz.jmeno;
	var novy_id = prikazy.id_prefix+novy_prikaz.jmeno;
	var novy_nazev = prikazy.nazev_prefix+novy_prikaz.jmeno;
	var novy_prikaz_id = prikazy.prikaz_prefix+novy_prikaz.jmeno;

	// Zjisti, jestli je co upravovat u tlačítek a zobrazení
	if ( novy_nazev != stary_nazev || novy_id != stary_id
		|| stary_prikaz.jmeno != novy_prikaz.jmeno ) {

		var element_nazev = document.getElementById(stary_nazev);
		var element_ikona = document.getElementById(stary_id);
		var element_maska = tvoric.maska_tlacitka_z_ikony(element_ikona);
		var element_prikaz = element_nazev.parentNode;

		// Uprav Id
		element_nazev.id = novy_nazev;
		element_ikona.id = novy_id;
		element_prikaz.id = novy_prikaz_id;

		// Uprav název
		element_nazev.firstChild.firstChild.nodeValue = novy_prikaz.jmeno;

		// Obnov informaci myši
		tvoric.nastav_udalosti_mysi( element_nazev, "prikazy.mys_prikaz",
			'\''+novy_nazev+'\'', '\''+novy_prikaz.jmeno+'\'' );
		tvoric.nastav_udalosti_mysi( element_maska, "prikazy.mys_tlacitko",
			'\''+novy_id+'\'', '\''+novy_prikaz.jmeno+'\'' );

		// Informace objektu myši, že proběhlo přejmenování
		ladici_vypis( LADENI, "prikazy.zmen_prikaz",
			"měním detaily u názvu příkazu" );
		prikazy.mys_prikaz.prejmenuj(stary_nazev, novy_nazev, novy_prikaz.jmeno);

		ladici_vypis( LADENI, "prikazy.zmen_prikaz",
			"měním detaily u tlačítka příkazu" );
		prikazy.mys_tlacitko.prejmenuj(stary_id, novy_id, novy_prikaz.jmeno);
	}

	this.nahrad_telo( stary_prikaz, novy_prikaz );
	prikazy.dokonci_smazani( stary_prikaz );
}

// Smaž příkaz (i z těl příkazů) a obnov zobrazenou informaci
prikazy.proved_smazani = function (prikaz)
{
	ladici_vypis( DETAIL, "prikazy.proved_smazani", "mažu příkaz " +
		prikaz.jmeno );
	var nazev = prikazy.nazev_prefix+prikaz.jmeno;

	// Informace objektu myši, že proběhlo přejmenování
	ladici_vypis( LADENI, "prikazy.proved_smazani",
		"mažu detaily u názvu příkazu" );
	prikazy.mys_prikaz.smaz(nazev, prikaz.jmeno);

	ladici_vypis( LADENI, "prikazy.proved_smazani",
		"mažu detaily u tlačítka příkazu" );
	prikazy.mys_tlacitko.smaz(nazev, prikaz.jmeno);

	// Vymaž příkaz z těl ostatních příkazů
	this.nahrad_telo( prikaz );

	// Vymaž příkaz ze známých příkazů
	this.zmen_seznam( prikaz );

	// Smaž příkaz ze zobrazeného seznamu příkazů
	this.zrus( prikaz );
}

prikazy.obsahuje_prikaz = function (ktery_prikaz)
{
	var seznam = new Array();
	for ( var i = 0; i < prikazy.seznam.length; i++ ) {
		var prikaz = prikazy.seznam[i];
		if ( !prikaz.systemovy && prikaz != ktery_prikaz ) {
			for ( var j = 0; j < prikaz.telo.length; j++ ) {
				if ( prikaz.telo[j][0] == ktery_prikaz ) {
					seznam.push(prikaz.jmeno);
					break;
				}
			}
		}
	}
	return seznam;
}

prikazy.smaz_prikaz = function (prikaz)
{
	if ( !prikazy.test_spusteni() ) return;
	var obsahuje = prikazy.obsahuje_prikaz(prikaz);
	var detail = "";
	if ( obsahuje.length ) {
		var detail_prikaz;
		if ( obsahuje.length == 1 ) {
			detail_prikaz = "příkazu ";
		} else {
			detail_prikaz = "příkazech ";
		}
		detail = "\n\nPříkaz je obsažen v " + detail_prikaz + obsahuje.join(", ") +
			".";
	}
	var uzivatel_chce = window.confirm( "Opravdu si přejete smazat příkaz " +
		prikaz.jmeno + "?" + detail );
	if ( uzivatel_chce ) {
		prikazy.proved_smazani(prikaz);
		editor.smaz_prikaz(prikaz);
	}
}

// Smaž celý slovník
prikazy.smaz_vse = function (bez_kontroly, bez_noveho_prikazu)
{
	if ( !prikazy.test_spusteni() ) return;
	if ( prikazy.je_slovnik_prazdny() ) {
		if ( !bez_noveho_prikazu ) {
			if ( editor.nastav_zmenu() && !nastaveni.zachovej_zobrazeny_prikaz ) {
				if ( bez_kontroly
					|| !bez_kontroly && window.confirm( "Slovník je prázdný. " +
					"Přejete si začít novým příkazem?" ) ) {
					editor.prikaz_novy(true);
				}
			} else {
				if ( !bez_kontroly ) alert( "Slovník je prázdný." );
				editor.prikaz_novy(true);
			}
		}
	} else {
		if ( bez_kontroly || !bez_kontroly
			&& window.confirm( "Opravdu si přejete smazat všechny příkazy?" ) ) {
			var i = prikazy.seznam.length-1;
			while ( i >= 0 && !prikazy.seznam[i].systemovy ) {
				var prikaz = prikazy.seznam[i];
				prikazy.proved_smazani(prikaz);
				if ( nastaveni.zachovej_zobrazeny_prikaz ) editor.smaz_prikaz(prikaz);
				i--;
			}
			if ( !bez_noveho_prikazu ) {
				if ( !editor.nastav_zmenu() || !nastaveni.zachovej_zobrazeny_prikaz ) {
					editor.prikaz_novy(true);
				}
			}
		}
	}
}

// Obnov ikonu přehrání a tooltip
prikazy.obnov_stav = function (probiha)
{
	var element = document.getElementById('zobrazene');
	if ( probiha ) {
		element.className = "zastavit";
	} else {
		element.className = "spustit";
	}
	for ( var i = 0; i < prikazy.seznam.length; i++ ) {
		var prikaz = prikazy.seznam[i];
		if ( prikaz.zobrazit ) {
			var element_ikona = document.getElementById(prikazy.id_prefix+prikaz.jmeno);
			var element_maska = element_ikona.parentNode.nextSibling;
		}
	}
	prikazy.mys_tlacitko.tooltip.prekresli();
}

// Nahrání nového slovníku
prikazy.nahraj_slovnik = function (novy_slovnik)
{
	if ( !novy_slovnik.length ) return;
	if ( !window.confirm(
		"Opravdu si přejete nahrát příkazy?\n\n" +
		"Všechny současné příkazy budou ztraceny. Mám pokračovat?" ) ) return;
	if ( !prikazy.test_spusteni() ) return;

	prikazy.smaz_vse(true, true);
	for ( var i = 0; i < novy_slovnik.length; i++ ) {
		var prikaz = novy_slovnik[i];
		prikazy.pridej_novy( prikaz );
	}
	if ( editor.nastav_zmenu() ) {
		if ( !nastaveni.zachovej_zobrazeny_prikaz ) {
			editor.prikaz_novy(true);
		}
	} else {
		editor.prikaz_novy(true);
	}
}

// ===========================================================================
// =~ Práce myši ~============================================================

prikazy.mys_tlacitko.proved_zvyrazneni = function(info, detail)
{
	return true;
}

prikazy.mys_tlacitko.prekresli_stav = function(info, detail, zvyraznen,
                                               stisknut, vybran)
{
	tvoric.zvyraznovac(info, zvyraznen, stisknut, vybran);
}

prikazy.mys_tlacitko.proved_vyber = function(info, detail)
{
	var vysledek = prikazy.jadro.proved_nebo_zastav(detail);
	vysledek.zobraz_chybu();
	return false;
}

prikazy.mys_prikaz.proved_zvyrazneni = function(info, detail)
{
	return true;
}

prikazy.mys_prikaz.proved_vyber = function(info, detail)
{
	var element = document.getElementById('vybrany-prikaz');
	element.lastChild.nodeValue = detail;
	return true;
}

prikazy.mys_prikaz.zrus_vyber = function(info, detail)
{
	var element = document.getElementById('vybrany-prikaz');
	element.lastChild.nodeValue = prikazy.zadny_prikaz;
	return true;
}

prikazy.mys_prikaz.smaz_vyber = function(info, detail)
{
	this.zrus_vyber(info, detail);
}

prikazy.mys_prikaz.prekresli_stav = function(info, detail, zvyraznen, stisknut,
                                             vybran)
{
	var element = document.getElementById(info);
	var vybrany = (vybran?"-vybrany":"");
	var zvyrazneny = (zvyraznen?"-zvyrazneny":"");
	if ( stisknut ) {
		element.className = "nazev"+vybrany+"-stisknuty";
	} else {
		element.className = "nazev"+vybrany+zvyrazneny;
	}
}

prikazy.mys_nastroje.proved_zvyrazneni = function(info, detail)
{
	return true;
}

prikazy.mys_nastroje.prekresli_stav = function(nastroj, detail, zvyraznen,
                                               stisknut, vybran)
{
	tvoric.zvyraznovac(prikazy.nastroje.id_prefix+nastroj, zvyraznen, stisknut,
		vybran);
}

prikazy.mys_nastroje.proved_vyber = function(nastroj, detail)
{
	switch (nastroj) {
		case "zobraz":
		case "smaz": {
		  // Kontrola vybraného příkazu
			var jmeno = prikazy.vybrany_prikaz();
			if ( jmeno && prikazy.prikaz[jmeno] ) {
				prikazy.zobraz_nebo_smaz( nastroj, jmeno );
			} else {
				alert( "Není vybrán žádný příkaz.\n\n" +
					"Příkaz vyberte klepnutím myši." );
			}
			break;
		}
		case "smaz-vse": {
			prikazy.smaz_vse();
			break;
		}
		case "ulozit":
		case "exportovat-12":
		case "exportovat-k99": {
		  if ( editor.kontrola_zmeny() ) {
				if ( nastroj != "exportovat-k99" ) {
					data.ukladani.uloz_slovnik(
						(nastroj == "ulozit"?data.FORMAT_20:data.FORMAT_12) );
				} else {
					data.ukladani.export_slovnik_k99();
				}
			}
			break;
		}
		case "nacist": {
			data.nacitani.nacti();
		}
	}
	return false;
}

// Zobraz nebo smaž vybraný příkaz
prikazy.zobraz_nebo_smaz = function(akce, jmeno)
{
	var prikaz = prikazy.prikaz[jmeno];
	if ( !prikaz.systemovy ) {
		if ( akce == "zobraz" ) {
			editor.zobraz_vybrany_prikaz();
		} else {
			prikazy.smaz_prikaz(prikaz);
		}
	} else {
		if ( akce == "zobraz" ) {
			alert( "Nelze prohližet systémový příkaz." );
			// TODO: Nápověda k systémovým příkazům?
		} else {
			alert( "Nelze smazat systémový příkaz." );
		}
	}
}

// Který příkaz je vybraný
prikazy.vybrany_prikaz = function()
{
	return this.mys_prikaz.vybran.detail;
}

// Vyber konkrétní příkaz
prikazy.vyber_prikaz = function(nazev)
{
	var prikaz = prikazy.prikaz[nazev];
	if ( prikaz && prikaz.zobrazit ) {
		this.mys_prikaz.vyber(prikazy.nazev_prefix+nazev, prikaz.jmeno);
	} else {
	  ladici_vypis(CHYBA, "prikazy.vyber_prikaz", nazev,
			"výběr neexistujícího příkazu");
	}
}

// ===========================================================================
// =~ Tooltipy ~==============================================================

prikazy.text_tooltipu = function (jmeno)
{
	var tooltip = new Object();
	if ( prikazy.jadro.probiha() ) {
		tooltip.nadpis = prikazy.tooltip["zastavit"];
	} else {
		tooltip.nadpis = prikazy.tooltip["spustit"]+" "+jmeno;
		if ( prikazy.prikaz[jmeno] instanceof Object ) {
			var prikaz = prikazy.prikaz[jmeno];
			if ( prikaz.tooltip ) {
				tooltip.popis = prikaz.tooltip;
			} else if ( prikaz.telo ) {
				var radka = prikaz.telo[0];
				if ( radka && radka[0] == prikazy.HLAVICKA_KOMENTAR ) {
					tooltip.popis = radka[1];
				}
			}
		}
	}
	return tooltip;
}

prikazy.mys_tlacitko.tooltip.muzu_zobrazit = function (info, detail)
{
	return ( prikazy.prikaz[detail] ? true : false );
}

prikazy.mys_tlacitko.tooltip.obnov = function (tooltip, info, detail)
{
	var obsah = prikazy.text_tooltipu(detail);
	tvoric.obnov_tooltip(tooltip, "", obsah.nadpis, obsah.popis);
}

prikazy.mys_tlacitko.tooltip.zjisti_rozmery = function (objekt)
{
	var rozmery = zjisti_rozmery(objekt);
	var element = document.getElementById('zobrazene');
	if ( element.scrollTop ) {
		rozmery = posun_y(rozmery, -element.scrollTop);
	}
	return rozmery;
}

prikazy.mys_nastroje.tooltip.obnov = function (tooltip, info, detail)
{
	tvoric.obnov_tooltip(tooltip, detail.ikona, detail.nadpis, detail.popis);
}
