#!/bin/bash

HOME_DIR=/home/vagrant
VENV_NAME=virtualenv
VENV_DIR=${HOME_DIR}/${VENV_NAME}
APP_ROOT_DIR=${HOME_DIR}/serpisori

OS_DISTRIBUTION_CODENAME=$(lsb_release -cs)
SERVER_IP=$(/sbin/ip -o -4 addr list eth1 | awk '{print $4}' | cut -d/ -f1)
SERVER_PORT=80


function checkpoint {
    printf "\n* $1 \n"
    if [ "--pause" = "$2" ]; then
        read -p "Press any key to continue ..." -n1 -s
    fi
}

function add_nginx_custom_repo {
    checkpoint "Adding nginx custom repo ..."
    if [ 0 = $(apt-key list | grep nginx | wc -c) ]; then
        apt-key add /vagrant/nginx/nginx_signing.key
        echo "deb http://nginx.org/packages/ubuntu/ $OS_DISTRIBUTION_CODENAME nginx" | sudo tee -a /etc/apt/sources.list
        echo "deb-src http://nginx.org/packages/ubuntu/ $OS_DISTRIBUTION_CODENAME nginx" | sudo tee -a /etc/apt/sources.list
    else
        echo "Nginx repo was already added."
    fi
}
function disable_interactivity {
    export DEBIAN_FRONTEND=noninteractive
}

function enable_interactivity {
    export DEBIAN_FRONTEND=dialog
}
function set_locale {
    locale-gen en_US.UTF-8
}

function install_packages {
    checkpoint "Installing packages ..."
    add_nginx_custom_repo
    apt-get update
    apt-get -q -y install supervisor
    apt-get -q -y install nginx
    apt-get -q -y install virtualenvwrapper
    apt-get -q -y install python-dev
    apt-get -q -y install git
    apt-get -q -y install vim
}

function config_nginx {
    checkpoint "Configuring Nginx ..."
    cp /vagrant/nginx/nginx.conf /etc/nginx/
    cp /vagrant/nginx/serpisori.conf /etc/nginx/conf.d/
    mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf_disabled
    rm /etc/nginx/sites-enabled/default
    service nginx restart
}

function config_supervisor {
    checkpoint "Configuring Supervisor ..."
    cp /vagrant/supervisor/serpisori.conf /etc/supervisor/conf.d/
    supervisorctl reread
    supervisorctl update
}

function restart_tornado {
    checkpoint "Restarting tornado with supervisor ..."
    supervisorctl restart serpisori
}

function setup_virtualenv {
    checkpoint "Setup virtualenv ..."
    if [ ! -d "${VENV_DIR}" ]; then
        virtualenv ${VENV_NAME}
        echo "source ${VENV_DIR}/bin/activate" >> ~/.bashrc
        source ${VENV_DIR}/bin/activate
        pip install --upgrade pip
    else
        source ${VENV_DIR}/bin/activate
    fi

    pip install -r ${APP_ROOT_DIR}/requirements.txt
}

# Initiate Vagrant
disable_interactivity

#set_locale
install_packages

setup_virtualenv
config_supervisor
config_nginx

restart_tornado

checkpoint "Setup completed."
checkpoint "Your app is available via tornado and nginx."
checkpoint "Open http://$SERVER_IP:$SERVER_PORT in your browser"
