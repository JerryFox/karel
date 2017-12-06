from browser import window, timer, document

domov = lambda :window.mesto.JE_DOMOV()
zed = lambda :window.mesto.JE_ZED()
znacka = lambda :window.mesto.JE_ZNACKA()
sever = lambda :window.mesto.JE_SEVER()
vychod = lambda :window.mesto.JE_VYCHOD()
jih = lambda :window.mesto.JE_JIH()
zapad = lambda :window.mesto.JE_ZAPAD()
prodleva = lambda :window.nastaveni.prodleva

def krok():
    if not zed(): 
        r = window.prikazy.jadro.KROK()
    else: 
        raise Exception("Zed - Karel nemuze udelat krok")

"""
kr = lambda :window.prikazy.jadro.KROK()

def krok(): 
    timer.set_timeout(kr, prodleva())
"""
vlevo_vbok = lambda :window.prikazy.jadro.VLEVO_VBOK()
zvedni = lambda :window.prikazy.jadro.ZVEDNI()

def poloz(): 
    # polozit znacku je-li misto
    if pocet_znacek() < 8: 
        r = window.prikazy.jadro.POLOZ()
    else: 
        raise Exception("Neni mozne polozit vic nez 8 znacek")

def zvedni(): 
    # zvednout znacku je-li nejaka
    if pocet_znacek() > 0: 
        r = window.prikazy.jadro.ZVEDNI()
    else: 
        raise Exception("Kde nic neni, ani smrt nebere (zadna znacka).")


def postav(): 
    pozice = {}
    pozice["x"] = window.karel.pozice.x
    pozice["y"] = window.karel.pozice.y
    smer = window.karel.smer
    dx = 0 if smer % 2 else -1 if smer // 2 else 1
    dy = 0 if not smer % 2 else -1 if smer // 2 else 1
    pozice["x"] += dx
    pozice["y"] += dy     
    if pozice["x"] in range(10) and pozice["y"] in range(10): 
        window.mesto.pole[pozice["x"]][pozice["y"]] = -1
        window.mesto.prekresli_pole({"x":pozice["x"], "y":pozice["y"]})
        
def bourej(): 
    pozice = {}
    pozice["x"] = window.karel.pozice.x
    pozice["y"] = window.karel.pozice.y
    smer = window.karel.smer
    dx = 0 if smer % 2 else -1 if smer // 2 else 1
    dy = 0 if not smer % 2 else -1 if smer // 2 else 1
    pozice["x"] += dx
    pozice["y"] += dy     
    if pozice["x"] in range(10) and pozice["y"] in range(10): 
        window.mesto.pole[pozice["x"]][pozice["y"]] = 0
        window.mesto.prekresli_pole({"x":pozice["x"], "y":pozice["y"]})
        
def pocet_znacek(x=None, y=None): 
    if x is None: 
        x = window.karel.pozice.x
    if y is None: 
        y = window.karel.pozice.y
    field_class = document["pozice_{x}_{y}".format(x=x, y=y)].getAttribute("class")
    if field_class is None: 
        pocet = 0
    elif "znacka-" in field_class: 
        pocet = int(field_class[field_class.index("znacka-") + len("znacka-")])
    else: 
        pocet = 0
    return pocet
        

def karel_skryj(): 
    k = document.getElementById('pozice_karel')
    k.style.visibility = "hidden" 
    
def karel_zobraz(): 
    k = document.getElementById('pozice_karel')
    k.style.visibility = "" 

def domov_skryj(): 
    d = document.getElementById('pozice_domov')
    d.style.visibility = "hidden" 
    
def domov_zobraz(): 
    d = document.getElementById('pozice_domov')
    d.style.visibility = "" 

