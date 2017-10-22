/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - inicializace a ovládání okna pro uložení a export

// ===========================================================================
// =~ Základní funkce pro ovládání vstupu a výstupu ~=========================

// Typ okna
data.ukladani.typ = new Object();
data.ukladani.typ.NORMALNI = 0;
data.ukladani.typ.KOMENTARE = 2;

// Zobrazení okna podle typu dat. Vstupní data se očekávají ve formátu
// unescape(), tedy tak, jak mají být zobrazena
data.ukladani.zobraz_v_okne = function (typ, hlavicka, popis, data, pocet_radek)
{
	// Nové okno
	var w = window.open( "", "", "directories=no,hotkeys=no,"+
		"location=no,menubar=no,personalbar=no,resizable=yes,scrollbars=yes,"+
		"status=no,toolbar=no,width=550,height=480" );

	// Zapiš hlavičku
	w.document.write(
	'<?xml version="1.0" encoding="utf-8"?>' +
	'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" ' +
	'"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">' +
	'<html xmlns="http://www.w3.org/1999/xhtml">' +
	'<head><title>Robot Karel: ' + hlavicka + '</title>' +
	'<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' +
	'<meta http-equiv="Content-Language" content="cs" />' +
	'<meta name="Description" content="Robot Karel: ' + hlavicka + '" />' +
	'<meta name="Author" content="Oldřich Jedlička" />' +
	'<link href="favicon.ico" rel="icon" />' +
	'<link href="favicon.ico" rel="shortcut icon" />' +
	'<style type="text/css">' +
		'body {' +
		'	font-family: Arial, Helvetica, sans-serif;' +
		'	font-weight: normal;' +
		'	font-size: small;' +
		'	cursor: default;' +
		'	height: auto;' +
		'	margin: 0;' +
		'	padding: 0;' +
		'}' +
		'' +
		'.stranka {' +
		'	z-index: -1;' +
		'	margin: 0;' +
		'	padding: 8px;' +
		'}' +
		'' +
		'.obsah {' +
		'	padding: 10px;' +
		'	border: 1px solid;' +
		'	border-top-color: rgb(90%, 90%, 90%);' +
		'	border-left-color: rgb(90%, 90%, 90%);' +
		'	border-right-color: rgb(40%, 40%, 40%);' +
		'	border-bottom-color: rgb(40%, 40%, 40%);' +
		'	background-color: rgb(75%, 75%, 75%);' +
		'}' +
		'' +
		'p {' +
		'	margin-top: 0;' +
		'	margin-bottom: 8px;' +
		'}' +
		'' +
		'form {' +
		'	margin: 0;' +
		'	padding: 0;' +
		'}' +
		'' +
		'#vnitrni-ramec {' +
		'	display: block;' +
		'	width: 100%;' +
		'	height: 100%;' +
		'	margin: 0;' +
		'	padding: 0;' +
		'	border: 0;' +
		'	background-color: rgb(50%, 90%, 50%);' +
		'}' +
		'' +
		'#ramecek {' +
		'	width: 100%;' +
		'	font-size: 12px;' +
		'	height: ' + (pocet_radek * 2) + 'ex;' +
		'	border: 1px solid;' +
		'	border-top-color: rgb(40%, 40%, 40%);' +
		'	border-left-color: rgb(40%, 40%, 40%);' +
		'	border-bottom-color: rgb(90%, 90%, 90%);' +
		'	border-right-color: rgb(90%, 90%, 90%);' +
		'	padding: 0;' +
		'	margin: 0;' +
		'}' +
	'</style>' );

	this.zapis_zmen_komentare( w.document, data );

	w.document.write(
	'</head>' +
	'<body>'+
	'<div class="stranka">' +		// Stránka
	'<div class="obsah">' +
	popis +
	'<form action="#">' );

	if ( typ == this.typ.KOMENTARE ) {
		w.document.write(
	'<p>\n' +
	'<input type="radio" name="komentare" id="zobraz-vse" ' +
		'alt="Zobrazit vše" checked="checked" ' +
		'onclick="zmen_komentare();" onkeyup="zmen_komentare();" />\n' +
	'<label for="zobraz-vse">Zobrazit vše</label>\n' +
	'<input type="radio" name="komentare" id="skryj-komentare" ' +
		'alt="Skrýt komentáře" '+
		'onclick="zmen_komentare();" onkeyup="zmen_komentare();" />\n' +
	'<label for="skryj-komentare">Skrýt komentáře</label>\n' +
	'<input type="radio" name="komentare" id="skryj-vse" ' +
		'alt="Skrýt komentáře i prázdné řádky" ' +
		'onclick="zmen_komentare();" onkeyup="zmen_komentare();" />\n' +
	'<label for="skryj-vse">Skrýt komentáře i prázdné řádky</label>\n' +
	'</p>' );
	}

	w.document.write(
	'<div id="ramecek"></div>' +
	'</form>' +
	'</div>' +
	'</div>' +
	'</body>' +
	'</html>'
	);

	w.document.close();

	var obsah = w.document.createElement('iframe');
	obsah.setAttribute("id", "vnitrni-ramec");
	w.document.getElementById("ramecek").appendChild(obsah);

	obsah.contentWindow.document.open('text/html', 'replace');
	obsah.contentWindow.document.write(
	'<?xml version="1.0" encoding="utf-8"?>' +
	'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" ' +
	'"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">' +
	'<html xmlns="http://www.w3.org/1999/xhtml">' +
	'<head><title>Robot Karel: ' + hlavicka + '</title>' +
	'<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' +
	'<meta http-equiv="Content-Language" content="cs" />' +
	'<meta name="Description" content="Robot Karel: ' + hlavicka + '" />' +
	'<meta name="Author" content="Oldřich Jedlička" />' +
	'<link href="favicon.ico" rel="icon" />' +
	'<link href="favicon.ico" rel="shortcut icon" />' +
	'<style type="text/css">' +
		'html {' +
		'	height: 100%;' +
		'}' +
		'' +
		'body {' +
		'	font-family: Arial, Helvetica, sans-serif;' +
		'	font-weight: normal;' +
		'	font-size: small;' +
		'	height: 100%;' +
		'	cursor: default;' +
		'	margin: 0;' +
		'	padding: 0;' +
		'}' +
		'' +
		'#zobrazene {' +
		'	border: 0px;' +
		'	margin: 0;' +
		'	padding: 0;' +
		'	width: 100%;' +
		'	height: 100%;' +
		'	font-size: 12px;' +
		'	white-space: pre-wrap;' +
		'	white-space: -moz-pre-wrap !important;' +
		'	white-space: -pre-wrap;' +
		'	white-space: -o-pre-wrap;' +
		'	word-wrap: break-word;' +
		'	background-color: rgb(50%, 90%, 50%);' +
		'}' +
	'</style>' +
	'</head>' +
	'<body>' +
	'<pre id="zobrazene">' +
	'</pre>' +
	'</body>' +
	'</html>'
	 );

	obsah.contentWindow.document.close();

	w.zmen_komentare();
	w.focus();
}

// Zobrazení s komentáři, nebo bez nich
data.ukladani.zapis_zmen_komentare = function (d, text) {
	var puvodni_obsah = escape(text);
	var bez_komentaru = puvodni_obsah.replace(
		/%3B([^%]|%(?!0A))*/g, "" );
	bez_komentaru = bez_komentaru.replace(
		/^(%09|%0A|%0D|%20)+/g, "" );
	bez_komentaru = bez_komentaru.replace(
		/%0A((%09|%0A|%0D|%20)*%0A)+((%09|%0A|%0D|%20)*%0A)/g, "%0A$3" );
	bez_komentaru = bez_komentaru.replace(
		/%0A+$/g, "" );
	var beze_vseho = bez_komentaru.replace(
		/%0A(%20)+%0A/g, "%0A" );

	d.write(
	'<script type="text/javascript" charset="utf-8">' );

	d.write('puvodni_obsah="' + puvodni_obsah + '";' );
	d.write('bez_komentaru="' + bez_komentaru + '";' );
	d.write('beze_vseho="' + beze_vseho + '";' );

	d.write(
	'function nastav_text(element, text) {' +
	'	if ( (element.firstChild &&' +
	'		(( typeof(Text) != "undefined" && element.firstChild instanceof Text ) ||' +
	'			element.firstChild.splitText' +
	'		))' +
	'	) {' +
	'		if ( text == "" ) {' +
	'			element.removeChild(element.firstChild);' +
	'		} else {' +
	'			element.firstChild.nodeValue = text;' +
	'		}' +
	'	} else {' +
	'		if ( text != "" ) {' +
	'			element.insertBefore(document.createTextNode(text), element.firstChild);' +
	'		}' +
	'	}' +
	'}' );

	d.write(
	'function zmen_komentare() {' +
	'	var zobraz_vse = document.getElementById("zobraz-vse");' +
	'	var skryj_komentare = document.getElementById("skryj-komentare");' +
	'	var skryj_vse = document.getElementById("skryj-vse");' +
	'	var zobrazene = document.getElementById("vnitrni-ramec").contentWindow.document.getElementById("zobrazene");' +
	'	if ( zobrazene && zobraz_vse && skryj_komentare && skryj_vse ) {' +
	'		if ( zobraz_vse.checked ' +
	'			|| ( !skryj_komentare.checked && !skryj_vse.checked ) ) {'+
	'			nastav_text(zobrazene, unescape(puvodni_obsah));' +
	'		} else if ( skryj_komentare.checked ) {' +
	'			nastav_text(zobrazene, unescape(bez_komentaru));' +
	'		} else if ( skryj_vse.checked ) {' +
	'			nastav_text(zobrazene, unescape(beze_vseho));' +
	'		}' +
	'	} else {' +
	'		nastav_text(zobrazene, unescape(puvodni_obsah));' +
	'	}' +
	'}' );

	d.write(
	'</script>' );

}
