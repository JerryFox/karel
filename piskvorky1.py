from karel import * 

karel_skryj()
domov_skryj()

window.mesto.obrazky[1] = "krizek"
window.mesto.obrazky[2] = "kolecko"

def krizek(x, y): 
    window.mesto.pole[x][y] = 1
    window.mesto.prekresli_pole({"x": x, "y": y})
    
def kolecko(x, y): 
    window.mesto.pole[x][y] = 2
    window.mesto.prekresli_pole({"x": x, "y": y})
    
def nic(x, y): 
    window.mesto.pole[x][y] = 0
    window.mesto.prekresli_pole({"x": x, "y": y})

"""    
for radek in range(10): 
    for sloupec in range(10): 
        tvar = nic if not (radek + sloupec) % 3 else krizek if (radek + sloupec) % 2 else kolecko
        tvar(radek, sloupec)
"""

tl = document.get(selector=".tlacitko-maska")
# save attributes for karel and home
tlacitka = {}
for i in range(2): 
    tlacitka[i] = {}
    for a in tl[i].attributes: 
        tlacitka[i][a.name] = a.value
      
# remove onmouse... atributes
for i in range(2): 
    tl[i].removeAttribute("onmouseover")
    tl[i].removeAttribute("onmouseout")
    tl[i].removeAttribute("onmousedown")
    tl[i].removeAttribute("onmouseup")

document["nastroje-karel"].id = "nastroje-krizek"
document["nastroje-domov"].id = "nastroje-kolecko"

# maska krizku
# print(document["nastroje-krizek"].parentElement.nextSibling.attributes[0].value)
# tlacitko s krizkem - mouseover, mouseout
def na_tlacitko(t): 
    if t.attributes[0].value == "tlacitko-nastroj": 
        t.attributes[0].value = "tlacitko-nahore"

def z_tlacitka(t): 
    if t.attributes[0].value == "tlacitko-nahore": 
        t.attributes[0].value = "tlacitko-nastroj"

"""
document["nastroje-krizek"].parentElement.nextSibling.bind("mouseover", \
    lambda ev: na_tlacitko(document["nastroje-krizek"].parentElement))

document["nastroje-krizek"].parentElement.nextSibling.bind("mouseout", \
    lambda ev: z_tlacitka(document["nastroje-krizek"].parentElement))

document["nastroje-kolecko"].parentElement.nextSibling.bind("mouseover", \
    lambda ev: na_tlacitko(document["nastroje-kolecko"].parentElement))

document["nastroje-kolecko"].parentElement.nextSibling.bind("mouseout", \
    lambda ev: z_tlacitka(document["nastroje-kolecko"].parentElement))

"""
symbol = "nastroje-krizek"
document["nastroje-krizek"].parentElement.nextSibling.bind("mouseover", \
    lambda ev: na_tlacitko(document[symbol].parentElement))

document["nastroje-krizek"].parentElement.nextSibling.bind("mouseout", \
    lambda ev: z_tlacitka(document[symbol].parentElement))

symbol = "nastroje-kolecko"
document["nastroje-kolecko"].parentElement.nextSibling.bind("mouseover", \
    lambda ev: na_tlacitko(document[symbol].parentElement))

document["nastroje-kolecko"].parentElement.nextSibling.bind("mouseout", \
    lambda ev: z_tlacitka(document[symbol].parentElement))

