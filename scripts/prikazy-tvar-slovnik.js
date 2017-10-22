/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - základní tvar slovníku

// ===========================================================================
// =~ Vygenerování slovníku ~=================================================

document.write('<div class="slovnik">');

document.write('<div class="nadpis">Slovník (Karel verze ' +
	verze_karla + ')</div>');
document.write('<div class="ramecek">' +
	'<div id="zobrazene" class="spustit"></div></div>');

document.write('<div class="nastroje">');
for ( var i = 0; i < prikazy.nastroje.length; i++ ) {
	var nastroj = prikazy.nastroje[i];
	if ( nastroj != null ) {
		tvoric.zapis_tlacitko(false, prikazy.nastroje.id_prefix+nastroj[0],
			prikazy.nastroje.mys, '\''+nastroj[0]+'\'',
			'{ikona:\''+nastroj[1]+'\',nadpis:\''+nastroj[2]+'\',popis:\''+nastroj[3]+'\'}');
	} else {
		tvoric.zapis_tlacitko(true);
	}
}
document.write('</div>');
document.write('<span class="vybrany">Vybraný příkaz:</span>');
document.write('<span id="vybrany-prikaz">'+prikazy.zadny_prikaz+'</span>');

document.write('</div>');

// ===========================================================================
// =~ Základní nastavení slovníku ~===========================================

for ( var i = 0; i < prikazy.seznam.length; i++ ) {
	var prikaz = prikazy.seznam[i];
	if ( prikaz.zobrazit ) {
		prikazy.pridej( prikaz );
	}
}
