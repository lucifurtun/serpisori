#!/bin/bash

NAME="Serpisori"
PORT=8888
USER=www-data

HOME_DIR=/home/vagrant

VENV_NAME=virtualenv
VENV_DIR=${HOME_DIR}/${VENV_NAME}
APP_ROOT_DIR=${HOME_DIR}/serpisori/app

MODULE=index.py

echo "Starting $NAME as `whoami`"

# Activate the virtual environment
source ${VENV_DIR}/bin/activate

# Start tornado
exec ${VENV_DIR}/bin/python ${APP_ROOT_DIR}/${MODULE} --port=${PORT}
