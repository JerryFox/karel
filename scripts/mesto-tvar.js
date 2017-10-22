/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - základní tvar města

// Pomocné funkce
function zapis_strukturu(obsah)
{
   for ( var y = mesto.velikost.y-1; y >= 0; y-- ) {
      for ( var x = 0; x < mesto.velikost.x; x++ ) {
         formatovany_obsah = obsah(x, y);
         document.write('<div>' + formatovany_obsah + '</div>');
      }
   }
}

// ===========================================================================
// =~ Vygenerování města ~====================================================

// Začátek
document.write('<div class="mesto">');

// Nadpis
document.write('<div class="nadpis">Město</div>');

// Obsah
document.write('<div class="obsah">');

// Pozadí
document.write('<div class="linka"></div>');
document.write('<div class="pozadi">');
zapis_strukturu(function(x, y){ return '<div class="policko"></div>'; });
document.write('</div>');

// Struktura města
document.write('<div class="struktura">');
zapis_strukturu(function(x, y){ return '<div id="pozice_'+x+'_'+y+'"></div>'; });
document.write('</div>');

// Domov
document.write('<div class="policko-domov">' +
	'<div class="domov" id="pozice_domov"></div></div>');

// Karel
document.write('<div class="policko-karel">' +
	'<div class="karel-vychod" id="pozice_karel"></div></div>');

// Výběr
document.write('<div class="policko-vyber">' +
	'<div class="vyber" id="pozice_vyber"></div></div>');

// Maska města - rychlejší řešení, než :hover
document.write('<div class="maska">');
zapis_strukturu(function(x, y){ return '<div '+
   'onmouseover="return mesto.mys.pres(event,{x:'+x+',y:'+y+'});" ' +
   'onmouseout="return mesto.mys.pryc(event,{x:'+x+',y:'+y+'});" '+
   'onmousedown="return mesto.mys.stisk(event,{x:'+x+',y:'+y+'});" '+
   'onmouseup="return mesto.mys.pust(event,{x:'+x+',y:'+y+'});" '+
   '></div>' });
document.write('</div>');

// Konec
document.write('</div>');
document.write('</div>');

// ===========================================================================
// =~ Základní nastavení ~====================================================

mesto.pozice_karla( karel.pozice );
mesto.orientace_karla( karel.smer );
mesto.pozice_domova( domov.pozice );
