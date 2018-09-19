from karel import *
from browser import window, timer


def domu():
    while not domov():
        while not zed():
            krok()
        vlevo_vbok()

def odbarvi():
    while znacka():
        zvedni()

def vybarvi():
    odbarvi()
    for i in range(8):
        poloz()

def usecka(delka):
    for i in range(delka):
        vybarvi()
        krok()

def ctverec(delka):
    if delka == 1:
        vybarvi()
    for i in range(4):
        usecka(delka - 1)
        vlevo_vbok()

def ke_zdi():
    while not zed():
        krok()

def vpravo_vbok():
    for i in range(3):
        vlevo_vbok()

def celem_vzad():
    vlevo_vbok()
    vlevo_vbok()

def doleva_dolu():
    while not jih():
        vlevo_vbok()
    ke_zdi()
    vpravo_vbok()
    ke_zdi()
    celem_vzad()

def sachovnice():
    domu()
    for i in range(5):
        while not zed():
            vybarvi()
            chytry_krok()
            chytry_krok()
        vlevo_vbok()
        krok()
        vlevo_vbok()
        while not zed():
            vybarvi()
            chytry_krok()
            chytry_krok()
        vpravo_vbok()
        chytry_krok()
        vpravo_vbok()
    domu()

def posbirej():
    domu()
    for i in range(5):
        while not zed():
            odbarvi()
            krok()
        odbarvi()
        vlevo_vbok()
        krok()
        vlevo_vbok()
        while not zed():
            odbarvi()
            krok()
        odbarvi()
        vpravo_vbok()
        chytry_krok()
        vpravo_vbok()
    domu()

def na_sousedni_znacku():
    x = 0
    vpravo_vbok()
    for i in range(3):
        if not zed():
            krok()
            x = 1
            if znacka():
                return True
            else:
                if x:
                    vlevo_vbok()
                    vlevo_vbok()
                    krok()
                    x = 0
                    vlevo_vbok()
                    vlevo_vbok()
        vlevo_vbok()
    return False

def po_znackach():
    while na_sousedni_znacku():
        pass

def znacky():
    for i in range(10):
        poloz()
        chytry_krok()
        poloz()
        vlevo_vbok()
        chytry_krok()
        vpravo_vbok()

def pirueta(kolik=3, delay=0.2):
    for i in range(kolik * 4):
        vlevo_vbok()
        try:
            time.sleep(delay)
        except:
            pass

def chytry_krok():
    if not zed():
        krok()

