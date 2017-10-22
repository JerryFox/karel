/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - základní tvar editoru příkazů

// ===========================================================================
// =~ Vygenerování editoru příkazů ~==========================================

document.write('<div class="editor">');

document.write('<div class="nadpis">Příkazové pole</div>');

document.write('<div class="nastroje">');
for ( var i = 0; i < editor.nastroje.length; i++ ) {
	var nastroj = editor.nastroje[i];
	if ( nastroj != null ) {
		tvoric.zapis_tlacitko(false, editor.nastroje.id_prefix+nastroj[0],
			editor.nastroje.mys, '\''+nastroj[0]+'\'',
			'{ikona:\''+nastroj[1]+'\',nadpis:\''+nastroj[2]+'\',popis:\''+nastroj[3]+'\'}');
	} else {
		tvoric.zapis_tlacitko(true);
	}
}
document.write('</div>');
document.write('<span class="zobrazeny">Zobrazený příkaz:</span>');
document.write('<span id="zobrazeny-prikaz">');
document.write('<span id="zmeneny-prikaz"></span></span>');

document.write('<div class="ramecek">');
document.write('<div class="textarea">');
document.write('<textarea rows="16" cols="50" id="editace" wrap="off" ');
document.write('onchange=\'editor.nastav_zmenu();\'></textarea>');
document.write('</div>');
document.write('</div>');

document.write('</div>');

// ===========================================================================
// =~ Základní nastavení editoru ~============================================

editor.prikaz_novy(true);

// Kvůli Konqueroru, který obnovuje obsahy textových polí po svém...
po_spusteni( function() { editor.prikaz_novy(true); } );
