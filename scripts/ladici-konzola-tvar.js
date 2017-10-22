/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - základní tvar ladicí konzole

// ===========================================================================
// =~ Vygenerování konzole ~==================================================

document.write('<div class="ovladani-ladeni">');

document.write('<div class="prvky"><div class="obsah">');

document.write('<div id="uroven" class="uroven-1"></div>');

document.write('<div class="maska">');
for ( var i = 1; i <= vypisy.uroven_tooltip.length; i++ ) {
	var mys_info = "'uroven-"+i+"'";
	var mys_detail =
		"{nadpis:'"+vypisy.uroven_tooltip[i-1][0]+"',"+
		"popis:'"+vypisy.uroven_tooltip[i-1][1]+"'}";
	document.write('<div id="uroven-'+i+'" '+
		'onmouseover="return vypisy.mys.pres(event,'+mys_info+','+mys_detail+');" '+
		'onmouseout="return vypisy.mys.pryc(event,'+mys_info+','+mys_detail+');" '+
		'onmousedown="return vypisy.mys.stisk(event,'+mys_info+','+mys_detail+');"'+
		'onmouseup="return vypisy.mys.pust(event,'+mys_info+','+mys_detail+');" '+
		'></div>');
}
document.write('</div>');

document.write('<div id="vypis-ikona" class="ikona-rozbalit"></div>');
document.write('<div class="vypis-ikona" '+
	'onmouseover="return vypisy.mys.pres(event,\'vypis\');" ' +
	'onmouseout="return vypisy.mys.pryc(event,\'vypis\');" '+
	'onmousedown="return vypisy.mys.stisk(event,\'vypis\');" '+
	'onmouseup="return vypisy.mys.pust(event,\'vypis\');" '+
	'></div>');

document.write('</div></div>');

document.write('<p class="popis">Ladicí konzola</p>');

document.write('</div>');

document.write('<div class="konzola"><p id="konzola"></p></div>');

// ===========================================================================
// =~ Základní nastavení ~====================================================

uroven_ladeni(vypisy.uroven);
