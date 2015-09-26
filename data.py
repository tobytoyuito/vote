import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Ellipse
import operator

import csv

questions = []
social_index = []
economic_index = []
with open('questions.csv', 'rb') as csvfile:
    reader = csv.reader(csvfile.read().splitlines())
    reader.next()
    index=0
    for row in reader:
        questions.append({"Question": row[0],
                          "Y": float(row[1]),
                          "RY": float(row[2]),
                          "RN": float(row[3]),
                          "N": float(row[4]),
                          "N/A": float(row[5]),
                          "Type": row[6]})
        if row[6]=="Social": 
            social_index.append(index)
        elif row[6]=="Economic":
            economic_index.append(index)
        index+=1

parties = []
with open('parties.csv', 'rb') as csvfile:
    reader = csv.reader(csvfile.read().splitlines())
    reader.next()
    for row in reader:
        parties.append({"Question": row[0],
                          "DAB": row[1],
                          "CP": row[2],
                          "LP": row[3],
                          "IND": row[4],
                          "TYPE": row[5]})
        
party_names = ["DAB", "CP", "LP", "IND"]
colors_party = {"DAB":"blue", "CP":"purple", "LP":"green", "IND":"red", "you":"grey"}

you = np.random.choice(['Y','RY','RN','N', 'N/A'], 50, p=[0.24, 0.24, 0.24, 0.24, 0.04])
your_weight = np.random.choice([3,2,1], 30, p=[1./3,1./3,1./3])

def calculate_position(choices, weight=np.ones(50)):
    eco_weight = [weight[i-1] for i in economic_index]
    soc_weight = [weight[i-1] for i in social_index]
    
    position_e = np.average([questions[i][choices[i]] for i in economic_index] , weights=eco_weight)
    position_s = np.average([questions[i][choices[i]] for i in social_index], weights=soc_weight)
    
    return position_e, position_s

def party_position():
    positions = {}
    
    for party in party_names:
        position_e = np.average([questions[i][parties[i][party]] for i in economic_index])
        position_s = np.average([questions[i][parties[i][party]] for i in social_index])
        positions[party] = [position_e, position_s]
        
    return positions

def score(choices, party_p, weight=np.ones(50), score="Euclidean"):
    if score not in ["Euclidean", "Norm1", "Agreement"]:
        raise ValueError("Please choose one score from [Euclidean, Norm1, Agreement]")
    eco_weight = [weight[i-1] for i in economic_index]
    soc_weight = [weight[i-1] for i in social_index]
    
    my_position = calculate_position(choices, weight)
    party_scores = {}
    
    if score=="Euclidean":
        for party in party_names:
            party_score = np.mean((np.array(party_p[party])-np.array(my_position))**2)**.5
            party_scores[party] = max(1-party_score, 0)
            
    elif score=="Norm1":
        for party in party_names:
            party_score = \
                np.average([abs(questions[i][parties[i][party]]-questions[i][choices[i]]) for i in range(50)], weights=weight)
            party_scores[party] = 1-party_score
            
    else:
        for party in party_names:
            party_score = np.average(\
                [abs(questions[i][parties[i][party]]-questions[i][choices[i]])/ \
                 (0.5+abs(questions[i][choices[i]]-0.5)) for i in range(50)],
                                     weights=weight)
            party_scores[party] = 1-party_score
            
    return party_scores



print "Vote:", you
print "Vote weight:", your_weight
print "Positions of party", party_position()
print "Scores1:", score(you, party_position(), score="Norm1")
print "Scores2:", score(you, party_position(), score="Euclidean")
print "Scores3:", score(you, party_position(), score="Agreement")
