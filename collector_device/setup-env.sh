#!/bin/bash

echo "Creating dependencies..."
python3 -m venv venv
. ./venv/bin/activate
python3 -m pip install --upgrade pip
python3 -m pip install -r ./requirements-esp-dev.txt

echo "Creating hidden files..."
cp ./src/config.tmpl.py ./src/config.py