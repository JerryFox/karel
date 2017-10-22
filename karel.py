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
poloz = lambda :window.prikazy.jadro.POLOZ()
zvedni = lambda :window.prikazy.jadro.ZVEDNI()

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

