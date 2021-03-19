#!/usr/bin/env python3

"""
"""

# import os
import sys
import logging
import argparse
import pprint
import csv

csv_file = open("example.csv", "r")
csv_content = csv.reader(csv_file)

i = 0
headers_to_keep = ['DatenstandTag', 'Datum', 'IdLandkreis', 'Landkreis', 'AnzahlFall', 'AnzahlFallNeu', 'InzidenzFallNeu', 'Kontaktrisiko']

indices_to_keep = []

writer = csv.writer(open("filtered.csv", "w"))
for entry in csv_content:
    i += 1

    # parse headers (may be useful in the future)
    if i == 1:
        for index, column_header in enumerate(entry):
            if column_header in headers_to_keep:
                indices_to_keep.append(index)
        if len(headers_to_keep) != len(indices_to_keep):
            raise RuntimeError("Could not find all desired headers. Aborting")

    items_to_keep = []
    for index in indices_to_keep:
        items_to_keep.append(entry[index])

    # for the moment only for whole of germany
    if entry[3] not in ['Landkreis', 'Deutschland']:
        break

    # dump to file
    writer.writerow(items_to_keep)

