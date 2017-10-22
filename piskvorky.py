from karel import karel_skryj, domov_skryj
from browser import document, window


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


no = ["karel", "domov", "zed"]
nn = ["krizek", "kolecko", "nic"]
for i in range(len(no)):
    for a in tl[i].attributes: 
        a.value = a.value.replace(no[i], nn[i])
    tl[i].previousSibling.html = tl[i].previousSibling.html.replace(no[i], nn[i])


m = document.get(selector=".mesto .maska")[0]
# v polickach vymazat atributy onmousedow a onmouseup
for elem in m.childNodes: 
    elem.childNodes[0].removeAttribute("onmousedown")
    elem.childNodes[0].removeAttribute("onmouseup")

def piskvorky_click(ev): 
    x = int(document["pozice_vyber"].style.left[:-2]) // 32
    y = 9 - int(document["pozice_vyber"].style.top[:-2]) // 32
    # print(x, y)
    is_krizek = document["nastroje-krizek"].parentNode.attributes[0].value == 'tlacitko-dole'
    is_kolecko = document["nastroje-kolecko"].parentNode.attributes[0].value == 'tlacitko-dole'
    if is_krizek: 
        krizek(x, y)
    elif is_kolecko: 
        kolecko(x, y)
    else: 
        nic(x, y)

m.bind("click", piskvorky_click)

