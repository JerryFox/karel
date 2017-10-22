/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - základní tvar panelu nástrojů

// ===========================================================================
// =~ Vygenerování nástrojů ~=================================================

document.write('<div class="mesto-nastroje">');
document.write('<div id="pozice-x"><span>&bull;</span></div>');
document.write('<div class="times"><span>&times;</span></div>');
document.write('<div id="pozice-y"><span>&bull;</span></div>');
document.write('<div class="nastroje">');
for ( var i = 0; i < nastroje.nastroje.length; i++ ) {
	var nastroj = nastroje.nastroje[i];
	if ( nastroj != null ) {
		tvoric.zapis_tlacitko(false, nastroje.nastroje.id_prefix+nastroj[0],
			nastroje.nastroje.mys,
			'\''+nastroj[0]+'\'',
			'{ikona:\''+nastroj[1]+'\',nadpis:\''+nastroj[2]+'\',popis:\''+nastroj[3]+'\'}');
	} else {
		tvoric.zapis_tlacitko(true);
	}
}
document.write('</div>');
document.write('</div>');

// ===========================================================================
// =~ Základní nastavení ~====================================================

nastroje.vyber( nastroje.nastroje[0][0] );
