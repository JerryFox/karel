from karel import *
from karel_ext import *
from browser import timer, document as doc

def rect():
    for side in range(4):
        for pix in range(4):
            krok()
            vybarvi()
        vlevo_vbok()

def rect1(strana=4):
    for s in range(4):
        usecka(strana-1)
        vlevo_vbok()

def usecka(delka=3):
    for i in range(delka):
        krok()
        vybarvi()

def usecka_gen(delka=3):
    for i in range(delka):
        krok()
        yield
        vybarvi()
        yield

def rect1_gen(strana=4):
    for s in range(4):
        for p in usecka_gen(strana-1):
            yield
        vlevo_vbok()
        yield


def rect_gen():
    for side in range(4):
        for pix in range(4):
            krok()
            yield
            vybarvi()
            yield
        vlevo_vbok()
        yield

def pokus_gen(strana=4):
    for s in range(4):
        for i in usecka_gen(strana-1):
            yield
        vlevo_vbok()
        yield


def foo():
    next(doc.gen)
    timer.set_timeout(foo, doc.timeout)

domu()
posbirej()
domu()
doc.gen = rect1_gen()
doc.timeout = 500
foo()

