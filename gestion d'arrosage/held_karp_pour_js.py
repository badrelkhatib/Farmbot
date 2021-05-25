#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Jan 12 16:15:28 2021

@author: josephcourcelle
"""

import math
import sys
import json






def retourner(ch):
    l=strenli(ch)
    l.reverse()
    return lienstr(l)


#la fonction suivante créé le dico representant l'ens dont le code est donné
#en paramètre en initialisant les g(k,S) et p(k,S) à -1

def creer_ens(code):
    res={}
    for i in range(len(code)):
        if code[i]=='1':
            res[i+1]=[-1,-1]
    return res


#fonctions de conversion liste/string pour les codes

def strenli(ch):
    res=[]
    for c in ch:
        res.append(int(c))
    return res

def lienstr(li):
    res=""
    for e in li:
        res=res+str(e)
    return res



#la fct suivante donne l'ecriture binaire d'un entier naturel sous forme d'une string de taille n

def binaire(i,n):
    l=''
    if i==0:
        l='0'*n
    else:
        while i>0:
            if i%2==0:
                l+='0'
            else:
                l+='1'
            i=i//2
    return l+(n-len(l))*'0'

#la fct suivante compte le nb de '1' dans une string

def compter_un(l):
    res=0
    for e in l:
        if e=='1':
            res+=1
    return res


#la fonction suivante renvoie la liste de tous les codes correspondant aux ens
#de cardinal s ne contenant pas 1 pour un travail sur n points

def liste_codes(s,n):
    res=[]
    for i in range(2**(n-1)):
        ch=binaire(i,n)
        if compter_un(ch)==s:
            res.append(retourner(ch))
    return res


#la fonction suivante prend en entrée un code(str) représentant S et un entier k
#et renvoie le code correspondant à S\{k} ainsi que p(k,S) sous la forme
#d'un couple (str,int)

def enlever_elt(code,k):
    res_code=strenli(code).copy()
    res_code[k-1]=0
    d=D[code][k][1]
    return (lienstr(res_code),d)

#la fonction suivante est la fonction gp : k,S -> g(k,s),p(k,S)
#g(k,S)=coût minimum d'un chemin de 1 à x passant par tous les sommets de S
#exactement une fois (ici S est un code(str))


def gp(k,S):
    ssansk=enlever_elt(S,k)[0]
    clef1=list(D[ssansk].keys())[0]
    min=D[ssansk][clef1][0]+C[1][k-1]+1000
    for m in D[ssansk].keys():
        val=D[ssansk][m][0]+C[m-1][k-1]
        if val<min:
            min=val
            m0=m
    return[min,m0]

#dictionnaire contenant les ensembles
D={}



#matrice des distances
C=[]
    
def main():
    # Store the data as an array in 'data_input'
    data_input = read_in()
    
    #nb de points en comptant le point de depart(0,0)
    n=len(data_input)+1


    #liste des coordonnees des points
    li_coor=[(0,0)]

    for e in range(1,n):
        lii=strenli(data_input[e])
        x=lii[0]
        y=lii[2]
        li_coor.append((x,y))



    

    for i in range(n):
        l=[0]*n
        C.append(l)

    for i in range(n):
        for j in range(n):
            d=math.sqrt(((li_coor[i][0]-li_coor[j][0])**2)+((li_coor[i][1]-li_coor[j][1])**2))
            C[i][j]=d



    #initialisation du dictionnaire D

    ens_vide=[0]*n
    ens_vide_str=lienstr(ens_vide)
    D[ens_vide_str]=creer_ens(ens_vide_str)

    for k in range(2,n+1):
        D[ens_vide_str][k-1]=[C[0][k-1],1]

    #corps de l'algo

    for s in range(1,n):
        ens_a_traiter=liste_codes(s,n)
        for ch in ens_a_traiter:
            D[ch]=creer_ens(ch)
            for k in D[ch].keys():
                couple=gp(k,ch)
                D[ch][k]=couple
            
    #chemin solution
    chemin=[]


    tout_sauf_un='0'+(n-1)*'1'

    min=D[tout_sauf_un][2][0]+C[1][0]+1000
    for m in range(2,n+1):
        val=D[tout_sauf_un][m][0]+C[m-1][0]
        if val<min:
            min=val
            m0=m

    chemin.append(m0-1)

    p=-1
    m=m0
    code=tout_sauf_un
    while m!=1:
        newcode=enlever_elt(code, m)[0]
        m=enlever_elt(code, m)[1]
        chemin.append(m-1)
        code=newcode
    
    chemin[n-1]=chemin[n]
    chemin.pop(n)


    # Return the sum
    sys.stdout.write(lienstr(chemin))


# Read data from the Writable Stream
def read_in():
    return sys.stdin.readlines()
    


# Start the process
if __name__ == '__main__':
    main()
