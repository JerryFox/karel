/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - slovník

// ===========================================================================
// =~ Globální proměnné ~=====================================================

// Příkazy
//
// Každý příkaz má následující vlastnosti:
//
// jmeno             jméno příkazu
// systemovy         true, pokud se jedná o systémový příkaz
// zobrazit          true, pokud má být příkaz zobrazen
// ignoruj           true, pokud příkaz neprovádí žádnou činnost
// hlavicka          true, pokud se příkaz může vyskytovat v hlavičce (před
//                   názvem příkazu)
// telo              pole jednotlivých řádek. Jedna řádka příkazu je pole dvou
//                   hodnot - příkazu a parametrů
// syntaxe           true, pokud příkaz vyžaduje kontrolu syntaxe (všechny
//                   příkazy, které neprovádí žádnou činnost)
// tooltip           text nápovědy (není povinné)
// spust             vykonání příkazu, provádí i kontrolu syntaxe (když je
//                   atribut syntaxe nastaven na true)
// formatovac        formátování příkazu. Pokud chybí, použije se obecný
//                   formátovač
// rozpoznavac       rozpoznání příkazu. Pokud chybí, použije se obecný
//                   rozpoznávač
// ukladac           ukládání příkazu. Pokud chybí, použije se obecní funkce
//                   ukládání
// kompatibilita     verze, které příkaz znají
// verze_ulozeni     verze, ve kterých se příkaz ukládá. Pokud se v dané verzi
//                   neukládá, je zobrazeno varování. Pokud se má uložit, ale
//                   příkaz není s verzí kompatibilní, je zobrazena chyba. Pokud
//                   se má uložit a je s verzí kompatibilní, pak se ukládá
// prikaz            true, pokud se jedná o příkaz. Pouze pro systémové příkazy
//                   a to jen pro zobrazení v chybové hlášce
//
// Navíc existuje pro každý příkaz prikazy.prikaz["PŘÍKAZ"]
//
prikazy.seznam = new Array(
	{ jmeno: "prázdná řádka", systemovy: true, zobrazit: false, ignoruj: true,
		hlavicka: true,
		rozpoznavac: prikazy.rozpoznavac.prazdna_radka,
		formatovac: prikazy.formatovac.prazdna_radka,
		kompatibilita: prikazy.min_VERZE_20,
		verze_ulozeni: prikazy.min_VERZE_20
	},
	{ jmeno: "komentář", systemovy: true, zobrazit: false, ignoruj: true,
		hlavicka: true,
		rozpoznavac: prikazy.rozpoznavac.komentar,
		formatovac: prikazy.formatovac.komentar,
		ukladac: data.ukladani.uloz_komentar,
		nacitac: data.nacitani.nacti_komentar,
		kompatibilita: prikazy.min_VERZE_20,
		verze_ulozeni: prikazy.min_VERZE_20
	},
	{ jmeno: "název příkazu", systemovy: true, zobrazit: false, ignoruj: true,
		hlavicka: true,
		rozpoznavac: prikazy.rozpoznavac.nazev,
		formatovac: prikazy.formatovac.nazev,
		ukladac: data.ukladani.uloz_nazev,
		nacitac: data.nacitani.nacti_nazev,
		kompatibilita: prikazy.min_VERZE_10,
		verze_ulozeni: prikazy.min_VERZE_20
	},
	{ jmeno: "prázdná řádka", systemovy: true, zobrazit: false, ignoruj: true,
		rozpoznavac: prikazy.rozpoznavac.prazdna_radka,
		formatovac: prikazy.formatovac.prazdna_radka,
		kompatibilita: prikazy.min_VERZE_20,
		verze_ulozeni: prikazy.min_VERZE_20
	},
	{ jmeno: "komentář", systemovy: true, zobrazit: false, ignoruj: true,
		rozpoznavac: prikazy.rozpoznavac.komentar,
		formatovac: prikazy.formatovac.komentar,
		ukladac: data.ukladani.uloz_komentar,
		nacitac: data.nacitani.nacti_komentar,
		kompatibilita: prikazy.min_VERZE_20,
		verze_ulozeni: prikazy.min_VERZE_20
	},
	{ jmeno: "KONEC, JINAK", systemovy: true, zobrazit: false,
		spust: prikazy.jadro.KONEC_JINAK,
		syntaxe: true,
		formatovac: prikazy.formatovac.konec,
		kompatibilita: prikazy.min_VERZE_10,
		verze_ulozeni: prikazy.min_VERZE_10,
		prikaz: true
	},
	{ jmeno: "KONEC", systemovy: true, zobrazit: false,
		spust: prikazy.jadro.KONEC,
		syntaxe: true,
		formatovac: prikazy.formatovac.konec,
		kompatibilita: prikazy.min_VERZE_10,
		verze_ulozeni: prikazy.min_VERZE_10,
		prikaz: true
	},
	{ jmeno: "KDYŽ", systemovy: true, zobrazit: false,
		spust: prikazy.jadro.KDYZ,
		syntaxe: true,
		rozpoznavac: prikazy.rozpoznavac.podminka,
		formatovac: prikazy.formatovac.podminka,
		nacitac: data.nacitani.nacti_podminku,
		kompatibilita: prikazy.min_VERZE_10,
		verze_ulozeni: prikazy.min_VERZE_10,
		prikaz: true
	},
	{ jmeno: "DOKUD", systemovy: true, zobrazit: false,
		spust: prikazy.jadro.DOKUD,
		syntaxe: true,
		rozpoznavac: prikazy.rozpoznavac.podminka,
		formatovac: prikazy.formatovac.podminka,
		nacitac: data.nacitani.nacti_podminku,
		kompatibilita: prikazy.min_VERZE_10,
		verze_ulozeni: prikazy.min_VERZE_10,
		prikaz: true
	},
	{ jmeno: "OPAKUJ", systemovy: true, zobrazit: false,
		spust: prikazy.jadro.OPAKUJ,
		syntaxe: true,
		rozpoznavac: prikazy.rozpoznavac.cyklus,
		formatovac: prikazy.formatovac.cyklus,
		ukladac: data.ukladani.uloz_OPAKUJ,
		nacitac: data.nacitani.nacti_OPAKUJ,
		kompatibilita: prikazy.min_VERZE_10,
		verze_ulozeni: prikazy.min_VERZE_10,
		prikaz: true
	},
	{ jmeno: "AŽ", systemovy: true, zobrazit: false,
		spust: prikazy.jadro.AZ,
		syntaxe: true,
		rozpoznavac: prikazy.rozpoznavac.podminka,
		formatovac: prikazy.formatovac.podminka,
		nacitac: data.nacitani.nacti_podminku,
		kompatibilita: prikazy.min_VERZE_11,
		verze_ulozeni: prikazy.min_VERZE_10,
		prikaz: true
	},
	{ jmeno: "RYCHLE", systemovy: true, zobrazit: false,
		spust: prikazy.jadro.RYCHLE,
		syntaxe: true,
		formatovac: prikazy.formatovac.odsazeni,
		kompatibilita: prikazy.min_VERZE_12,
		verze_ulozeni: prikazy.min_VERZE_10,
		prikaz: true
	},
	{ jmeno: "POMALU", systemovy: true, zobrazit: false,
		spust: prikazy.jadro.POMALU,
		syntaxe: true,
		formatovac: prikazy.formatovac.predsazeni,
		kompatibilita: prikazy.min_VERZE_12,
		verze_ulozeni: prikazy.min_VERZE_10,
		prikaz: true
	},
	{ jmeno: "STOP", systemovy: true, zobrazit: false,
		spust: prikazy.jadro.STOP,
		kompatibilita: prikazy.min_VERZE_10,
		verze_ulozeni: prikazy.min_VERZE_10,
		prikaz: true
	},
	{ jmeno: "KROK", systemovy: true, zobrazit: true,
		spust: prikazy.jadro.KROK,
		kompatibilita: prikazy.min_VERZE_10,
		verze_ulozeni: prikazy.min_VERZE_10,
		prikaz: true,
		tooltip: "Posune Karla o jedno políčko dopředu"
	},
	{ jmeno: "VLEVO-VBOK", systemovy: true, zobrazit: true,
		spust: prikazy.jadro.VLEVO_VBOK,
		kompatibilita: prikazy.min_VERZE_10,
		verze_ulozeni: prikazy.min_VERZE_10,
		prikaz: true,
		tooltip: "Otočí Karla jednou vlevo"
	},
	{ jmeno: "POLOŽ", systemovy: true, zobrazit: true,
		spust: prikazy.jadro.POLOZ,
		kompatibilita: prikazy.min_VERZE_10,
		verze_ulozeni: prikazy.min_VERZE_10,
		prikaz: true,
		tooltip: "Karel položí jednu značku, pokud je na políčku místo"
	},
	{ jmeno: "ZVEDNI", systemovy: true, zobrazit: true,
		spust: prikazy.jadro.ZVEDNI,
		kompatibilita: prikazy.min_VERZE_10,
		verze_ulozeni: prikazy.min_VERZE_10,
		prikaz: true,
		tooltip: "Karel zvedne jednu značku, pokud na políčku nějaká je"
	}
);

// Příkazy přístupné podle jména
prikazy.prikaz = new Object();

// Textové řetězce spojené s příkazy
prikazy.JE = "JE";
prikazy.NENI = "NENÍ";
prikazy.KRAT = "KRÁT";
prikazy.KRAT_text = escape(prikazy.KRAT);
prikazy._KRAT = "-" + prikazy.KRAT;
prikazy.podminky = [
	{ jmeno: "ZEĎ", test: mesto.JE_ZED },
	{ jmeno: "ZNAČKA", test: mesto.JE_ZNACKA },
	{ jmeno: "DOMOV", test: mesto.JE_DOMOV },
	{ jmeno: "VÝCHOD", test: mesto.JE_VYCHOD },
	{ jmeno: "SEVER", test: mesto.JE_SEVER },
	{ jmeno: "ZÁPAD", test: mesto.JE_ZAPAD },
	{ jmeno: "JIH", test: mesto.JE_JIH }
];


// ===========================================================================
// =~ Základní nastavení ~====================================================

for ( var i = 0; i < prikazy.seznam.length; i++ ) {
	var prikaz = prikazy.seznam[i];
	if (! (prikaz.jmeno in prikazy.prikaz)) {
		prikazy.prikaz[prikaz.jmeno] = prikaz;
	}
}

// ===========================================================================
// =~ Příkazové konstanty ~===================================================

prikazy.HLAVICKA_KOMENTAR = prikazy.prikaz["komentář"];
prikazy.HLAVICKA_PRAZDNA_RADKA = prikazy.prikaz["prázdná řádka"];
prikazy.NAZEV = prikazy.prikaz["název příkazu"];
prikazy.KONEC_JINAK = prikazy.prikaz["KONEC, JINAK"];
prikazy.KONEC = prikazy.prikaz["KONEC"];
prikazy.KDYZ = prikazy.prikaz["KDYŽ"];
prikazy.DOKUD = prikazy.prikaz["DOKUD"];
prikazy.OPAKUJ = prikazy.prikaz["OPAKUJ"];
prikazy.AZ = prikazy.prikaz["AŽ"];
prikazy.RYCHLE = prikazy.prikaz["RYCHLE"];
prikazy.POMALU = prikazy.prikaz["POMALU"];
prikazy.STOP = prikazy.prikaz["STOP"];
prikazy.KROK = prikazy.prikaz["KROK"];
prikazy.VLEVO_VBOK = prikazy.prikaz["VLEVO_VBOK"];
prikazy.POLOZ = prikazy.prikaz["POLOŽ"];
prikazy.ZVEDNI = prikazy.prikaz["ZVEDNI"];
