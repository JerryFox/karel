/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - objekt pro zobrazování nástrojových tipů a nápovědy

// ===========================================================================
// =~ Třída nástrojových tipů ~===============================================

// Konstruktor
function Tooltip()
{
	// Prodleva od posledního zobrazení, kdy se tooltip ukáže okamžitě
	this.prejeti_mysi = 100;

	// Čas před plným zobrazením tooltipu
	this.plne_zobrazeni = 500;

	// Objekt, nad kterým je myš
	this.objekt = null;

	// Informace použitá pro jednoznačné rozpoznání objektu (např. #id)
	this.info = null;

	// Detaily k objektu, jako je např. obsah tooltipu
	this.detail = null;

	// Tooltip je momentálně zobrazen
	this.zobrazen = false;

	// Čas ukrytí tooltipu
	this.cas_skryti = null;

	// Časovač spuštěný před prvním zobrazením
	this.casovac_zobrazeni = null;

	// Objekt tooltipu, jehož obsah se obnovuje při každém zobrazení tooltipu
	this.tooltip = null;
}

// Myš je nad objektem - zobraz tooltip, pokud to je nutné
Tooltip.prototype.pres = function (objekt, info, detail)
{
	// - Pokud nezobrazuji tooltip, zavolej this.pryc
	// - Jinak:
	//   * Když nebyl tooltip nikdy zobrazen, spusť časovač. Časovač spusť, i když
	//     je doba od posledního skrytí větší, než nastavení. Restartuj časovač,
	//     pokud objekt není ten samý a časovač už byl spuštěn.
	//   * Když je tooltip skryt a čas od posledního skrytí je menší, než
	//     nastavení, zobraz tooltip.

	if ( ! this.muzu_zobrazit(info, detail) ) {
		ladici_vypis(LADENI, "tooltip.pres", info, "nezobrazuji");
		this.pryc(objekt, info, detail);
	} else {
		var cas = new Date();
		var rozdil_casu;
		if ( this.cas_skryti ) {
			rozdil_casu = cas-this.cas_skryti;
		} else {
			rozdil_casu = 0;
		}
		if ( this.cas_skryti == null ||
			this.cas_skryti && rozdil_casu >= this.prejeti_mysi ||
			!jsou_shodne(info, this.info) && this.casovac_zobrazeni
		) {
			this.objekt = objekt;
			this.info = info;
			this.detail = detail;
			this.zastav_zobrazovani(info, detail);

			var tento_objekt = this;
			this.casovac_zobrazeni = setInterval(
				function() { tento_objekt.zobraz(objekt, info, detail); },
				this.plne_zobrazeni
			);

			ladici_vypis(LADENI, "tooltip.pres", info, "nastavení časovače na "+
				this.plne_zobrazeni+"ms");
		} else if ( this.cas_skryti && rozdil_casu < this.prejeti_mysi ) {
			this.zobraz(objekt, info, detail);
		} else {
			ladici_vypis(LADENI, "tooltip.pres", info, "žádná změna");
		}
	}
}

// Myš opustila objekt - skryj tooltip, pokud to je potřeba
Tooltip.prototype.pryc = function (objekt, info, detail)
{
	// Pokud byl nastaven časovač, ale tooltip ještě nebyl zobrazen, zastav
	// zobrazování. Pokud už byl zobrazen stejný objekt, skryj ho.
	var shodne = jsou_shodne(info, this.info);
	if ( this.casovac_zobrazeni || shodne ) {
		if ( shodne ) {
			ladici_vypis(LADENI, "tooltip.pryc", info, "myš úplně opustila tooltip");
			this.objekt = null;
			this.info = null;
			this.detail = null;
			this.skryj(objekt, info, detail);
		}
		this.zastav_zobrazovani(info, detail);
	} else {
		ladici_vypis(LADENI, "tooltip.pryc", info, "žádná změna");
	}
}

Tooltip.prototype.zrus = function (objekt, info, detail)
{
	// Skryj tooltip
	ladici_vypis(LADENI, "tooltip.zrus", info, "zrušení tooltipu");
	this.skryj(objekt, info, detail);
	this.cas_skryti = null;
}

// Zastav zobrazování
Tooltip.prototype.zastav_zobrazovani = function (info, detail)
{
	if ( this.casovac_zobrazeni ) {
		ladici_vypis(LADENI, "tooltip.zastav_zobrazovani", info, "zrušení časovače");
		clearInterval( this.casovac_zobrazeni );
		this.casovac_zobrazeni = null;
	}
}

// Skryj tooltip
Tooltip.prototype.skryj = function (objekt, info, detail)
{
	this.zastav_zobrazovani(info, detail);
	ladici_vypis(LADENI, "tooltip.skryj", info, "skrytí tooltipu");
	if ( this.zobrazen ) {
		if ( this.tooltip ) {
			this.tooltip.style.display = "none";
			this.tooltip.style.visibility = "hidden";
		}
		this.cas_skryti = new Date();
	}
	this.zobrazen = false;
}

// Zobraz tooltip
Tooltip.prototype.zobraz = function (objekt, info, detail)
{
	this.objekt = objekt;
	this.info = info;
	this.detail = detail;
	this.zastav_zobrazovani(info, detail);
	this.zobrazen = true;

	if ( ! this.tooltip ) this.tooltip = this.vytvor(info, detail);
	if ( this.tooltip ) {
		this.tooltip.style.zIndex = -1;
		this.tooltip.style.left = this.tooltip.style.top = "0";
		this.tooltip.style.visibility = "hidden";
		this.tooltip.style.display = "block";
		
		this.obnov(this.tooltip, info, detail);
		this.pozicuj(this.tooltip, objekt, info, detail);

		this.tooltip.style.display = "block";
		this.tooltip.style.zIndex = 1;
		this.tooltip.style.visibility = "visible";
	}

	ladici_vypis(LADENI, "tooltip.zobraz", info, "zobrazení tooltipu");
}

// Změň pozici tooltipu
Tooltip.prototype.pozicuj = function (tooltip, objekt, info, detail)
{
	this.uprav_rozmery(tooltip);

	var rozmery = this.vypocti_pozici(tooltip, objekt, true);
	if ( ! rozmery.uspech ) {
		var nove_rozmery =
			this.vypocti_pozici(tooltip, objekt, false);
		if ( nove_rozmery.uspech ) {
			rozmery = nove_rozmery;
		}
	}

	tooltip.style.left = rozmery.levy+"px";
	tooltip.style.top = rozmery.horni+"px";
}

// Vypočti pozici tooltipu
Tooltip.prototype.vypocti_pozici = function (tooltip, objekt, dole)
{
	var rozmery_objektu = this.zjisti_rozmery(objekt);
	ladici_vypis(LADENI, "tooltip.vypocti_pozici", rozmery_objektu, "objekt");

	var rozmery = zjisti_rozmery();

	var tooltip_velikost = zjisti_velikost(tooltip.element_tooltip);

	var tooltip_rozmery = {
		levy: rozmery_objektu.levy,
		pravy: rozmery_objektu.levy + tooltip_velikost.x
	};

	if ( dole ) {
		tooltip_rozmery.horni = rozmery_objektu.dolni;
		tooltip_rozmery.dolni = rozmery_objektu.dolni + tooltip_velikost.y;
	} else {
		tooltip_rozmery.horni = rozmery_objektu.horni - tooltip_velikost.y;
		tooltip_rozmery.dolni = rozmery_objektu.horni;
	}

	/* Pozice X:
		 * Levá pozice se shoduje s objektem
		-> Když pravý okraj přesahuje okno, posuň nadoraz
		-> Když levý okraj přesahuje okno, posuň nadoraz
		-> Když pravý okraj přesahuje stránku, posuň nadoraz
		-> Když levý okraj přesahuje stránku, posuň na nulu
	*/

	if ( tooltip_rozmery.pravy > rozmery.okno.pravy ) {
		tooltip_rozmery = posun_x( tooltip_rozmery,
			rozmery.okno.pravy-tooltip_rozmery.pravy);
	}
	if ( tooltip_rozmery.levy < rozmery.okno.levy ) {
		tooltip_rozmery = posun_x( tooltip_rozmery,
			rozmery.okno.levy-tooltip_rozmery.levy);
	}
	if ( tooltip_rozmery.pravy > rozmery.stranka.pravy ) {
		tooltip_rozmery = posun_x( tooltip_rozmery,
			rozmery.stranka.pravy-tooltip_rozmery.pravy);
	}
	if ( tooltip_rozmery.levy < rozmery.stranka.levy ) {
		tooltip_rozmery = posun_x( tooltip_rozmery,
			rozmery.stranka.levy-tooltip_rozmery.levy);
	}

	tooltip_rozmery.uspech = (
		tooltip_rozmery.levy >= rozmery.okno.levy &&
		tooltip_rozmery.pravy <= rozmery.okno.pravy &&
		tooltip_rozmery.horni >= rozmery.okno.horni &&
		tooltip_rozmery.dolni <= rozmery.okno.dolni
	);

	ladici_vypis(LADENI, "tooltip.vypocti_pozici", tooltip_rozmery,
		"rozměry tooltipu");

	return tooltip_rozmery;
}

// Uprav rozměry tooltipu
Tooltip.prototype.uprav_rozmery = function (tooltip)
{
	// Zjisti aktuální velikosti
	var rozmery = zjisti_rozmery();

	// Šířka maximálně 30% velikosti okna, ale při zmenšení ne méně než 250px,
	// ale rozhorně ne více, než jsou rozměry stránky (ať už to znamená cokoliv
	// pro IE)
	var max;
	max = Math.max( 250, Math.floor(0.3*(rozmery.okno.pravy-rozmery.okno.levy)));
	max = Math.min( max, rozmery.stranka.pravy-rozmery.stranka.levy );

	// Největší velikost tooltipu
	tooltip.style.width = max+"px";

	var tooltip_velikost = zjisti_velikost(tooltip.element_tooltip);
	tooltip.style.width = tooltip_velikost.x+"px";
}

// ===========================================================================
// =~ Veřejně dostupné funkce ~===============================================

Tooltip.prototype.prekresli = function ()
{
	if ( this.zobrazen ) {
		if ( this.tooltip ) {
			if ( this.muzu_zobrazit( info, detail ) ) {
				ladici_vypis(LADENI, "tooltip.prekresli", info, "překreslení tooltipu");
				this.zobraz( this.objekt, this.info, this.detail );
			} else {
				ladici_vypis(LADENI, "tooltip.prekresli", info,
					"nemůže být zobrazen, skrývám");
				this.skryj( this.objekt, this.info, this.detail );
			}
		}
	}
}

// ===========================================================================
// =~ Veřejně editovatelné funkce ~===========================================

// Jestli zobrazit tooltip
Tooltip.prototype.muzu_zobrazit = function (info, detail)
{
	var muzu = ( detail != undefined && detail != null );
	if ( ! muzu ) {
		ladici_vypis(LADENI, "tooltip.muzu_zobrazit", info,
			"nemůžu zobrazit, detail:"+formatuj_text(detail));
	}
	return muzu;
}

// Zjisti rozměry objektu pro zobrazení tooltipu
Tooltip.prototype.zjisti_rozmery = function (objekt)
{
	return zjisti_rozmery(objekt);
}

// Obnov obsah tooltipu
Tooltip.prototype.obnov = function (tooltip, info, detail)
{
}

// Vytvoř objekt tooltipu
Tooltip.prototype.vytvor = function (info, detail)
{
	var tooltip = tvoric.tooltip();
	var element = document.getElementById('stranka');
	element.insertBefore(tooltip, element.firstChild);
	return tooltip;
}
