/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - kódování odkazů do dokumentu

var kodovany_mail = [ "oldium", "pro", "seznam", "cz" ];
if ( typeof(je_oldium_dot_home) == "undefined" ) {
	je_oldium_dot_home = false;
	if ( /^https?:\/\/[^\/]+\.oldium\.home\//.exec(document.URL) ) {
		je_oldium_dot_home = true;
	}
}

function dekoduj_mail() {
	return kodovany_mail[0] + "." + kodovany_mail[1] + "@" +
		kodovany_mail[2] + "." + kodovany_mail[3];
}

function obnov_odkazy() {
	var odkazy = document.getElementsByTagName("a");
	var muj_mail = dekoduj_mail();
	for ( var i = 0; i < odkazy.length; i++ ) {
		if ( odkazy[i].href == "mailto:" ) {
			odkazy[i].href = "mailto:" + muj_mail;
		} else {
			if ( je_oldium_dot_home ) {
				var novy_odkaz = odkazy[i].href.replace(
					/^(https?:\/\/[^\/]+\.oldium)\.net\//, "$1.home/" );
				odkazy[i].href = novy_odkaz;
			}
			if ( typeof(verze_karla) != "undefined" ) {
				var odkaz_verze = odkazy[i].href.replace(
					/karel-VERZE/, "karel-" + verze_karla );
				odkazy[i].href = odkaz_verze;
			}
		}
	}
}
