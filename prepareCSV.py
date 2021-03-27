#!/usr/bin/env python3

"""
"""

# import os
import sys
import logging
import argparse
import pprint
import csv

csv_file = open("all-series.csv", "r")
csv_content = csv.reader(csv_file)

i = 0
headers_to_keep = {
    'DatenstandTag': {'type': int, 'default': None,  'index': None},
    'Datum': {'type': str, 'default': None,  'index': None},
    'IdLandkreis': {'type': int, 'default': None,  'index': None},
    'Landkreis': {'type': str, 'default': None,  'index': None},
    'AnzahlFall': {'type': int, 'default': 0,  'index': None},
    'AnzahlFallNeu': {'type': int, 'default': 0,  'index': None},
    'AnzahlTodesfallNeu': {'type': int, 'default': 0,  'index': None},
    'AnzahlGenesenNeu': {'type': int, 'default': 0,  'index': None},
    'InzidenzFallNeu_7TageSumme': {'type': float, 'default': 0.0,  'index': None},
    'Kontaktrisiko': {'type': float, 'default': 100.000,  'index': None},
    'InzidenzFallNeu_7TageSumme_R': {'type': float, 'default': 0.0,  'index': None}
}

indices_to_keep = []

writer = csv.writer(open("filtered.csv", "w"))
for entry in csv_content:
    i += 1

    # parse headers
    if i == 1:
        header_row = []
        for index, column_header in enumerate(entry):
            if column_header in headers_to_keep:
                headers_to_keep[column_header]['index'] = index
                header_row.append(column_header)

        # check if all required columns are found
        if not len(header_row) == len(headers_to_keep):
            raise RuntimeError("Could not find all desired headers. Aborting")
        writer.writerow(header_row)
        continue

    # for the moment only for bundeslaender
    if entry[4] not in ["BL", "BR"]:
        continue

    # # testing
    # if entry[2] != '1':
    #     continue

    # if int(entry[0]) < 38:
    #     continue

    # check compatibility
    items_to_keep = []
    for name, column in headers_to_keep.items():
        index = column['index']
        val = entry[index]

        if val == "inf":
            val = column['default']

        # check type
        try:
            parsed = column['type'](val)
        except:
            val = column['default']
        # append
        items_to_keep.append(val)

    # dump to file
    writer.writerow(items_to_keep)
