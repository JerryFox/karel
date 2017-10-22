/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - základní tvar panelu stylů

// ===========================================================================
// =~ Vygenerování seznamu stylů ~============================================

document.write('<form action="#">');

document.write('<div class="styly">Styl zobrazení');
for ( var i = 0; i < styly.length; i++ ) {
	document.write(
		'<div><input name="styl" value="styl-'+i+'" id="styl-'+i+'" ' +
			'type="radio" alt="Nastavení stylu '+styly[i].jmeno+'" ' +
			'onclick="return styly.vyber(\''+styly[i].jmeno+'\');" ' +
			'onkeyup="return styly.vyber_klavesou();" ' +
			(styly[i].jmeno == nastaveni.styl?'checked="checked"':'') +
		'/>');
		
	if (ie_hack) {
		document.write(
			'<label for="styl-'+i+'">' +
			'<span class="ikona"><span></span><div class="' + styly[i].trida + '"></div>' +
			'</span>');
	} else {
		document.write(
			'<label for="styl-'+i+'" class="' + styly[i].trida + '">');
	}
	document.write(
		styly[i].jmeno+
		'</label></div>');
}
document.write('</div>');

document.write('</form>');
