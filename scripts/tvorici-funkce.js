/*
 * [Česky]
 * Projekt: Robot Karel
 * Copyright: Viz KOPIROVANI v kořenovém adresáři projektu
 *
 * [English]
 * Project: Karel, the Robot
 * Copyright: See COPYING in the top level directory
 */

// JavaScript - tvořicí funkce pro HTML

// ===========================================================================
// =~ Globální proměnné ~=====================================================

tvoric = new Object();

// ===========================================================================
// =~ Vygenerování nástrojů ~=================================================

// Vytvoř nové tlačítko zápisem do dokumentu. Všechny parametry jsou řetězce
tvoric.zapis_tlacitko = function (vytvor_mezeru, id, mys, mys_info, mys_detail)
{
	if ( ! vytvor_mezeru ) {
		var detail = '';
		if ( mys_detail ) {
			detail = ','+mys_detail;
		}
		document.write('<div class="tlacitko">'+
			'<div class="tlacitko-nastroj"><div class="ikona" id="'+id+'">'+
			'</div></div>'+
			'<div class="tlacitko-maska" '+
			'onmouseover="return '+mys+'.pres(event,'+mys_info+detail+');" ' +
			'onmouseout="return '+mys+'.pryc(event,'+mys_info+detail+');" '+
			'onmousedown="return '+mys+'.stisk(event,'+mys_info+detail+');" '+
			'onmouseup="return '+mys+'.pust(event,'+mys_info+detail+');"');
		document.write('></div></div>');
	} else {
		document.write('<div class="tlacitko-mezera">'+
			'<div class="nastroje-mezera"></div></div>');
	}
}

tvoric.nastav_udalosti_mysi = function (element, mys, mys_info, mys_detail)
{
	var detail = '';
	if ( mys_detail ) {
		detail = ','+mys_detail;
	}

	// Události
	element.onmouseover = new Function( "e",
		'return '+mys+'.pres(e,'+mys_info+detail+');' );
	element.onmouseout = new Function( "e",
		'return '+mys+'.pryc(e,'+mys_info+detail+');' );
	element.onmousedown = new Function( "e",
		'return '+mys+'.stisk(e,'+mys_info+detail+');' );
	element.onmouseup = new Function( "e",
		'return '+mys+'.pust(e,'+mys_info+detail+');' );
}

tvoric.vytvor_tlacitko = function (vytvor_mezeru, id, mys, mys_info, mys_detail)
{
	if ( ! vytvor_mezeru ) {
		// Vytvoř tlačítko

		// Elementy
		var element_tlacitko = document.createElement('DIV');
		var element_tlacitko_nastroj = element_tlacitko.cloneNode(false);
		var element_tlacitko_ikona = element_tlacitko.cloneNode(false);
		var element_tlacitko_maska = element_tlacitko.cloneNode(false);

		// Události
		tvoric.nastav_udalosti_mysi(element_tlacitko_maska, mys,
			mys_info, mys_detail);

		// Styly
		element_tlacitko.className = "tlacitko";
		element_tlacitko_nastroj.className = "tlacitko-nastroj";
		element_tlacitko_ikona.className = "ikona";
		element_tlacitko_ikona.id = id;
		element_tlacitko_maska.className = "tlacitko-maska";

		// Tvar
		element_tlacitko_nastroj.appendChild( element_tlacitko_ikona );
		element_tlacitko.appendChild( element_tlacitko_nastroj );
		element_tlacitko.appendChild( element_tlacitko_maska );

		return element_tlacitko;
	} else {
		// Vytvoř mezeru

		// Elementy
		var element_tlacitko_mezera = document.createElement('DIV');
		var element_nastroje_mezera = element_tlacitko_mezera.cloneNode(false);

		// Styly
		element_tlacitko_mezera.className = "tlacitko-mezera";
		element_nastroje_mezera.className = "nastroje-mezera";

		// Tvar
		element_tlacitko_mezera.appendChild(element_nastroje_mezera);

		return element_tlacitko_mezera;
	}
}

tvoric.maska_tlacitka_z_ikony = function (element_ikona)
{
	return element_ikona.parentNode.nextSibling;
}

// Zvýrazňování tlačítek
tvoric.zvyraznovac = function(id, zvyraznen, stisknut, vybran)
{
	var element = document.getElementById(id);
	var parent = element.parentNode;
	if ( vybran || stisknut )
	{
		parent.className = "tlacitko-dole";
	} else if ( zvyraznen ) {
		parent.className = "tlacitko-nahore";
	} else {
		parent.className = "tlacitko-nastroj";
	}
}

// Tvar nástrojových tipů
tvoric.tooltip = function()
{
/* Struktura tooltipu

	<div class=tooltip-hranice>
	<div class=tooltip>
	<div class=horni>
		<div class=margin-5><div class=pixel></div></div>
		<div class=margin-3><div class=margin-2><div class=pixel></div></div></div>
		<div class=margin-2><div class=margin-1><div class=pixel></div></div></div>
		<div class=margin-1><div class=margin-1><div class=pixel></div></div></div>
		<div class=margin-1><div class=margin-1><div class=pixel></div></div></div>
	</div>
	<div class=stred>
		<div class=vypln><div></div></div>
		<div class=ikona><div></div></div>
		<div class=nadpis></div>
		<div class=popis></div>
		<div class=vypln><div></div></div>
	</div>
	<div class=spodni>
		<div class=margin-1><div class=margin-1><div class=pixel></div></div></div>
		<div class=margin-1><div class=margin-1><div class=pixel></div></div></div>
		<div class=margin-2><div class=margin-1><div class=pixel></div></div></div>
		<div class=margin-3><div class=margin-2><div class=pixel></div></div></div>
		<div class=margin-5><div class=pixel></div></div>
	</div>
	</div>
	</div>
*/

	// Elementy
	var tooltip_hranice = document.createElement('DIV')
	var tooltip = tooltip_hranice.cloneNode(false);
	var horni = tooltip.cloneNode(false);
	var pixel = tooltip.cloneNode(false);
	var margin_5 = tooltip.cloneNode(false);
	var margin_3 = tooltip.cloneNode(false);
	var margin_2 = tooltip.cloneNode(false);
	var margin_1 = tooltip.cloneNode(false);
	var stred = tooltip.cloneNode(false);
	var ikona = tooltip.cloneNode(false);
	var nadpis = tooltip.cloneNode(false);
	var popis = tooltip.cloneNode(false);
	var vypln = tooltip.cloneNode(false);
	var prazdny = tooltip.cloneNode(false);
	var spodni = tooltip.cloneNode(false);

	// Styly
	tooltip_hranice.className = 'tooltip-hranice';
	tooltip.className = 'tooltip';
	horni.className = 'horni';
	pixel.className = 'pixel';
	margin_5.className = 'margin-5';
	margin_3.className = 'margin-3';
	margin_2.className = 'margin-2';
	margin_1.className = 'margin-1';
	stred.className = 'stred';
	ikona.className = 'ikona';
	nadpis.className = 'nadpis';
	popis.className = 'popis';
	vypln.className = 'vypln';
	spodni.className = 'spodni';

	// Tvar
	tooltip_hranice.appendChild(tooltip);
	tooltip.appendChild(horni);
		horni.appendChild(margin_5.cloneNode(false));
		horni.lastChild.appendChild(pixel.cloneNode(false));
		horni.appendChild(margin_3.cloneNode(false));
		horni.lastChild.appendChild(margin_2.cloneNode(false));
		horni.lastChild.lastChild.appendChild(pixel.cloneNode(false));
		horni.appendChild(margin_2.cloneNode(false));
		horni.lastChild.appendChild(margin_1.cloneNode(false));
		horni.lastChild.lastChild.appendChild(pixel.cloneNode(false));
		horni.appendChild(margin_1.cloneNode(false));
		horni.lastChild.appendChild(margin_1.cloneNode(false));
		horni.lastChild.lastChild.appendChild(pixel.cloneNode(false));
		horni.appendChild(margin_1.cloneNode(false));
		horni.lastChild.appendChild(margin_1.cloneNode(false));
		horni.lastChild.lastChild.appendChild(pixel.cloneNode(false));
	tooltip.appendChild(stred);
		stred.appendChild(vypln.cloneNode(false));
			stred.lastChild.appendChild(prazdny.cloneNode(false));
		stred.appendChild(ikona);
			ikona.appendChild(prazdny.cloneNode(false));
		stred.appendChild(nadpis);
			nadpis.appendChild(document.createTextNode(""));
		stred.appendChild(popis);
			popis.appendChild(document.createTextNode(""));
		stred.appendChild(vypln);
			stred.lastChild.appendChild(prazdny);
	tooltip.appendChild(spodni);
		spodni.appendChild(margin_1.cloneNode(false));
		spodni.lastChild.appendChild(margin_1.cloneNode(false));
		spodni.lastChild.lastChild.appendChild(pixel.cloneNode(false));
		spodni.appendChild(margin_1.cloneNode(false));
		spodni.lastChild.appendChild(margin_1.cloneNode(false));
		spodni.lastChild.lastChild.appendChild(pixel.cloneNode(false));
		spodni.appendChild(margin_2.cloneNode(false));
		spodni.lastChild.appendChild(margin_1);
		spodni.lastChild.lastChild.appendChild(pixel.cloneNode(false));
		spodni.appendChild(margin_3);
		spodni.lastChild.appendChild(margin_2);
		spodni.lastChild.lastChild.appendChild(pixel.cloneNode(false));
		spodni.appendChild(margin_5);
		spodni.lastChild.appendChild(pixel);

	// Některé zvláštní vlastnosti
	tooltip_hranice.element_ikona = ikona.firstChild;
	tooltip_hranice.element_nadpis = nadpis.firstChild;
	tooltip_hranice.element_popis = popis.firstChild;
	tooltip_hranice.element_tooltip = tooltip_hranice.firstChild;

	return tooltip_hranice;
}

// Nastav vlastnosti tooltipu
tvoric.obnov_tooltip = function (tooltip, ikona, nadpis, popis)
{
	if ( ! tooltip ) {
		return;
	}

	if ( !ikona ) { ikona = ""; }
	tooltip.element_ikona.className = ikona;

	if ( !nadpis ) { nadpis = ""; }
	tooltip.element_nadpis.nodeValue = nadpis;

	if ( !popis ) { popis = ""; }
	tooltip.element_popis.nodeValue = popis;

	// Nastav mezeru mezi nadpisem a popisem
	if ( nadpis.length > 0 && popis.length > 0 ) {
		tooltip.element_nadpis.parentNode.style.marginBottom = "1em";
	} else {
		tooltip.element_nadpis.parentNode.style.marginBottom = "0";
	}

	var margin = "0px";
	if ( ikona.length > 0 ) {
		var velikost = zjisti_velikost(tooltip.element_ikona);
		margin = (velikost.x+8)+"px";
	}
	tooltip.element_nadpis.parentNode.style.marginLeft = margin;
	tooltip.element_popis.parentNode.style.marginLeft = margin;
}
