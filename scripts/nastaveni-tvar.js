/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - základní tvar nastavení

document.write('<div class="nastaveni-prodleva">');
document.write('<div class="prodleva">Rychlost vykonávání příkazů');

document.write('<div class="obsah">');

document.write('<div class="stupnice">');
document.write('<div class="duha"></div>');

for ( var i = 0; i < 2; i++ ) {
	if ( i == 0 ) {
		document.write('<div class="ukazatel">');
	} else {
		document.write('<div class="maska">');
	}
	for ( var j = 0; j < nastaveni.prodleva_tooltip.length; j++ ) {
		var id = "prodleva-"+(j+1);
		if ( i == 0 ) {
			document.write('<div id="'+id+'" class="nic"></div>');
		} else {
			var mys_info = "'" + id + "'";
			var mys_detail =
				"{index:"+i+","+
				"prodleva:"+nastaveni.prodleva_tooltip[j][0]+","+
				"nadpis:'"+nastaveni.prodleva_tooltip[j][1]+"',"+
				"popis:'"+nastaveni.prodleva_tooltip[j][2]+"'}";
			document.write('<div '+
				'onmouseover="return nastaveni.mys.pres(event,'+mys_info+','+
					mys_detail+');"'+
				'onmouseout="return nastaveni.mys.pryc(event,'+mys_info+','+
					mys_detail+');" '+
				'onmousedown="return nastaveni.mys.stisk(event,'+mys_info+','+
					mys_detail+');"'+
				'onmouseup="return nastaveni.mys.pust(event,'+mys_info+','+
					mys_detail+');" '+
				'></div>');
		}
	}
	document.write('</div>');
}

document.write('</div>');

document.write('<div class="pomalu">Pomalu</div>');
document.write('<div class="rychle">Rychle</div>');
document.write('<div class="stredne">Středně rychle</div>');

document.write('</div>');

document.write('</div></div>');

// Nastavení prodlevy
nastaveni.nastav_prodlevu(hodnota_cookie("prodleva"));
