/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - objekt pro práci s myší

// Konstruktor
function Mys(tooltip)
{
	// Atribut info je použit pro jednoznačné odlišení objektů
	// Atribut detail je použit pro uchovávání informací k objektu, jako je např.
	// obsah tooltipu, obrázky apod.

	// Uživatel na tomto objektu provedl stisk
	this.stisknut = { info: null, detail: null };

	// Zvýrazněný objekt, uživatel přejel myší nad objekt
	this.zvyraznen = { info: null, detail: null };

	// Vybraný objekt, běžně bývá zobrazen se sníženými okraji
	this.vybran = { info: null, detail: null };

	// Kde byl naposledy proveden stisk. Některé prohlížeče neposílají správně
	// stisky, tak se kontroluje puštění a předchozí stisk
	this.posledni_stisk = { info: null, detail: null };

	// Objekt třídy tooltipu. Pokud není nastaven, žádný tooltip se nezobrazí
	if ( !tooltip ) tooltip = null;
	this.tooltip = tooltip;
}

// ===========================================================================
// =~ Pomocné funkce ~========================================================

Mys.prototype.je_zvyraznen = function(zvyrazneni)
{
	if ( zvyrazneni == undefined ) {
		return ( this.zvyraznen.info != null );
	} else {
		return ( jsou_shodne(zvyrazneni, this.zvyraznen.info) );
	}
}

Mys.prototype.je_vybran = function(vyber)
{
	if ( vyber == undefined ) {
		return ( this.vybran.info != null );
	} else {
		return ( jsou_shodne(vyber, this.vybran.info) );
	}
}

Mys.prototype.je_stisknut = function(stisknuti)
{
	if ( stisknuti == undefined ) {
		return ( this.stisknut.info != null );
	} else {
		return ( jsou_shodne(stisknuti, this.stisknut.info) );
	}
}

// ===========================================================================
// =~ Obsluha událostí myši ~=================================================

Mys.prototype.pres = function(e, info, detail)
{
	if ( !e && typeof(event) != "undefined" ) e = event;	// IE

	ladici_vypis(LADENI, "mys.pres", info, "myš nad objektem");
	if ( !jsou_shodne(info,this.posledni_stisk.info) ) {
		this.posledni_stisk.info = this.posledni_stisk.detail = null;
	}
	if ( !jsou_shodne(info,this.zvyraznen.info ) ) {
		if ( this.proved_zvyrazneni(info) ) {
			var stary_zvyraznen = this.zvyraznen;
			this.zvyraznen = { info:info, detail:detail };
			if ( stary_zvyraznen.info != null )
				this.stav( stary_zvyraznen.info, stary_zvyraznen.detail);
			this.stav(info, detail);
		}
	}

	var element;
	if ( this.tooltip && (element = zdrojovy_element(e)) ) {
		this.tooltip.pres(element, info, detail);
	}
	return true;
}

Mys.prototype.pryc = function(e, info, detail)
{
	if ( !e && typeof(event) != "undefined" ) e = event;	// IE

	var zmena = false;
	ladici_vypis(LADENI, "mys.pryc", info, "myš pryč z objektu");
	if ( jsou_shodne(info,this.posledni_stisk.info) ) {
		this.posledni_stisk.info = this.posledni_stisk.detail = null;
	}
	if ( jsou_shodne(info,this.zvyraznen.info) ) {
		this.zvyraznen.info = this.zvyraznen.detail = null;
		zmena = true;
	}
	if ( jsou_shodne(info,this.stisknut.info) ) {
		this.stisknut.info = this.stisknut.detail = null;
		zmena = true;
	}
	this.zrus_zvyrazneni(info, detail);
	if ( zmena ) {
		this.stav(info, detail);
	}

	var element;
	if ( this.tooltip && (element = zdrojovy_element(e)) ) {
		this.tooltip.pryc(element, info, detail);
	}
}

Mys.prototype.stisk = function(e, info, detail)
{
	if ( !e && typeof(event) != "undefined" ) e = event;	// IE

	ladici_vypis(LADENI, "mys.stisk", info, "myš stiskla tlačítko");

	var stary_zvyraznen = { info: null };
	var stary_stisknut = { info: null };
	if ( !jsou_shodne(info,this.zvyraznen.info ) ) {
		if ( this.proved_zvyrazneni(info, detail) ) {
			stary_zvyraznen = this.zvyraznen;
			this.zvyraznen = {info: info, detail: detail};
		}
	}

	if ( !jsou_shodne(info,this.stisknut.info) ) {
		this.stary_stisknut=this.stisknut;
	}

	this.posledni_stisk = { info: info, detail: detail };
	this.stisknut = { info: info, detail: detail };
	if ( stary_stisknut.info != null || stary_zvyraznen.info != null ) {
		if ( jsou_shodne(stary_stisknut.info,stary_zvyraznen.info) ) {
			this.stav(stary_stisknut.info, stary_stisknut.detail);
		} else {
			if ( stary_stisknut.info != null )
				this.stav(stary_stisknut.info, stary_stisknut.detail);
			if ( stary_zvyraznen.info != null )
				this.stav(stary_zvyraznen.info, stary_zvyraznen.detail);
		}
	}
	this.proved_stisk(info, detail);
	this.stav(info, detail);

	var element;
	if ( this.tooltip && (element = zdrojovy_element(e)) ) {
		this.tooltip.zrus(element, info, detail);
	}
}

Mys.prototype.pust = function(e, info, detail)
{
	if ( !e && typeof(event) != "undefined" ) e = event;	// IE

	var stary_stisknut = this.stisknut;
	if ( jsou_shodne(info,this.posledni_stisk.info) ) {
		if ( stary_stisknut.info == null ) {
			ladici_vypis(LADENI, "mys.pust", info, "pozice nezměněna; chybí stisk myši, simuluji...");
			this.proved_stisk(info, detail);
		}
		ladici_vypis(LADENI, "mys.pust", info, "myš pustila tlačítko, provedla stisk");
		this.vyber(info, detail, false);
	} else {
		ladici_vypis(LADENI, "mys.pust", info, "myš pustila tlačítko, žádný stisk");

		// Kvůli zrušení stisku
		info = stary_stisknut.info;
		detail = stary_stisknut.detail;
	}

	this.stisknut.info = this.stisknut.detail = null;
	if ( info != null ) {
		this.zrus_stisk(info, detail);
		this.stav(info, detail);
	}

	var element;
	if ( this.tooltip && (element = zdrojovy_element(e)) ) {
		this.tooltip.zrus(element, info, detail);
	}
}

Mys.prototype.stav = function(info, detail)
{
	var je_zvyraznen = this.je_zvyraznen(info);
	var je_vybran = this.je_vybran(info);
	var je_stisknut = this.je_stisknut(info);
	ladici_vypis(LADENI, "mys.stav", info, "překresluji"+
		" (z:"+ formatuj_text(je_zvyraznen)+
		" s:"+ formatuj_text(je_stisknut)+
		" v:"+ formatuj_text(je_vybran)+ ")");
	this.prekresli_stav(info, detail, je_zvyraznen, je_stisknut, je_vybran);
}

Mys.prototype.proved_prejmenovani = function(nazev, objekt, info_z, info_na,
                                             detail_na)
{
	if ( jsou_shodne( objekt.info, info_z ) ) {
		ladici_vypis( LADENI, "mys.proved_prejmenovani", "měním " + nazev + " z (" +
			formatuj_text(objekt.info) + ") na (" + formatuj_text(info_na) + ")" );
		objekt.info = info_na;
		objekt.detail = detail_na;
		return true;
	} else {
		ladici_vypis( LADENI, "mys.proved_prejmenovani", "žádná změna v " + nazev +
			", zůstává (" + formatuj_text(objekt.info) + ")" );
		return false;
	}
}

Mys.prototype.proved_smazani = function(nazev, objekt, info, detail)
{
	if ( jsou_shodne( objekt.info, info ) ) {
		ladici_vypis( LADENI, "mys.proved_smazani", info, "ruším " + nazev );
		objekt.info = objekt.detail = null;
		return true;
	} else {
		ladici_vypis( LADENI, "mys.proved_smazani", info, "žádná změna v " + nazev );
		return false;
	}
}

// ===========================================================================
// =~ Veřejně přístupné funkce ~==============================================

// Ruční provedení výběru
Mys.prototype.vyber = function(info, detail, prekresli)
{
	var stary_vybran = this.vybran;
	if ( !jsou_shodne(info,stary_vybran.info) ) {
		if ( this.proved_vyber(info, detail) ) {
			if ( stary_vybran.info != null ) {
				if ( this.zmen_vyber(stary_vybran.info, stary_vybran.detail, info, detail) ) {
					ladici_vypis(LADENI, "mys.vyber", info, "vybráno (předchozí:"+
						formatuj_text(stary_vybran.info)+")");
					this.vybran = { info: info, detail: detail };
					this.stav(stary_vybran.info, stary_vybran.detail );
				} else {
					ladici_vypis(LADENI, "mys.vyber", info, "změna nepovolena (předchozí:"+
						formatuj_text(stary_vybran.info)+")");
					prekresli = false;
				}
			} else {
				ladici_vypis(LADENI, "mys.vyber", info, "vybráno (předchozí nevybrán)");
				this.vybran = { info: info, detail: detail };
			}
			if ( prekresli == undefined || prekresli ) {
				this.stav(info, detail);
			}
		} else {
			ladici_vypis(LADENI, "mys.vyber", info, "změna výběru nebyla provedena");
		}
	} else {
		if ( this.zrus_vyber(info) ) {
			ladici_vypis(LADENI, "mys.vyber", info, "zrušení výběru");
			this.vybran.info = this.vybran.detail = null;
			if ( prekresli == undefined || prekresli ) {
				this.stav(info);
			}
		} else {
			ladici_vypis(LADENI, "mys.vyber", info, "žádná změna výběru");
		}
	}
}

// Změna informací. Změní výběr a ostatní informace myši, pokud se změnily
// informace, nebo detaily
Mys.prototype.prejmenuj = function(info_z, info_na, detail_na)
{
	ladici_vypis(LADENI, "mys.prejmenuj", info_z, "přejmenování na (" +
		formatuj_text(info_na) + ")");
	var prekresli = false;
	if ( this.proved_prejmenovani( "mys.stisknut",
		this.stisknut, info_z, info_na, detail_na ) ) {
		ladici_vypis(LADENI, "mys.prejmenuj", info_na, "stisk po přejmenování");
		this.proved_stisk( info_na, detail_na );
		prekresli = true;
	}
	if ( this.proved_prejmenovani( "mys.zvyraznen",
		this.zvyraznen, info_z, info_na, detail_na ) ) {
		ladici_vypis(LADENI, "mys.prejmenuj", info_na, "zvýraznění po přejmenování");
		this.proved_zvyrazneni( info_na, detail_na );
		prekresli = true;
	}
	if ( this.proved_prejmenovani( "mys.vybran",
		this.vybran, info_z, info_na, detail_na ) ) {
		ladici_vypis(LADENI, "mys.prejmenuj", info_na, "výběr po přejmenování");
		this.proved_vyber( info_na, detail_na );
		prekresli = true;
	}
	this.proved_prejmenovani( "mys.posledni_stisk",
		this.posledni_stisk, info_z, info_na, detail_na );
	if ( prekresli ) {
		this.stav( info_na, detail_na );
	}
}

// Smazání informací. Zruší výběr a zvýraznění prvku
Mys.prototype.smaz = function(info, detail)
{
	ladici_vypis(LADENI, "mys.smaz", info, "smazání prvku");
	var prekresli = false;
	if ( this.proved_smazani( "mys.stisknut", this.stisknut, info, detail ) ) {
		ladici_vypis(LADENI, "mys.smaz", info, "zrušení stisku");
		this.zrus_stisk( info, detail );
		prekresli = true;
	}
	if ( this.proved_smazani( "mys.zvyraznen", this.zvyraznen, info, detail ) ) {
		ladici_vypis(LADENI, "mys.smaz", info, "zrušení zvýraznění");
		this.zrus_zvyrazneni( info, detail );
		prekresli = true;
	}
	if ( this.proved_smazani( "mys.vybran", this.vybran, info, detail ) ) {
		ladici_vypis(LADENI, "mys.smaz", info, "zrušení výběru");
		this.smaz_vyber( info, detail );
		prekresli = true;
	}
	this.proved_smazani( "mys.posledni_stisk",
		this.posledni_stisk, info, detail );
	if ( prekresli ) {
		this.stav( info, detail );
	}
}

// ===========================================================================
// =~ Veřejně editovatelné funkce ~===========================================

// Překeslení stavu prvku
Mys.prototype.prekresli_stav = function(info, detail, zvyraznen, stisknut,
                                        vybran)
{
}

// Myš stiskla tlačítko
Mys.prototype.proved_stisk = function(info, detail)
{
}

// Myš pustila tlačítko
Mys.prototype.zrus_stisk = function(info, detail)
{
}

// Myš klikla na objekt. Vrací true, pokud se vybralo
Mys.prototype.proved_vyber = function(info, detail)
{
	return false;
}

// Zrušen výběr objektu kliknutím na jiný objekt. Vrací true, pokud se má vybrat
Mys.prototype.zmen_vyber = function(info_z, detail_z, info_na, detail_na)
{
	return true;
}

// Zrušen výběr objektu kliknutím na stejný objekt. Vrací true, pokud se má 
// zrušit výběr
Mys.prototype.zrus_vyber = function(info, detail)
{
	return false;
}

// Vybraný objekt byl smazán
Mys.prototype.smaz_vyber = function(info, detail)
{
}

// Myš je nad objektem. Vrací true, pokud se zvýraznilo
Mys.prototype.proved_zvyrazneni = function(info, detail)
{
	return false;
}

// Myš není nad objektem
Mys.prototype.zrus_zvyrazneni = function(info, detail)
{
}
