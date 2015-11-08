# serpisori
Multiplayer snake game - experiment.

Join at:

# serpisori.sensidev.com



# Vagrant environment

We decided to use vagrant here to be able to quickly install a production like environment with tornado and nginx as a proof of concept.

## Prerequisites

- VirtualBox 4.3.20 (or later)
- Vagrant 1.7.1 (or later)

## Setup

1. Clone the repository.
2. `cd ./vagrant`
3. `vagrant up`
4. Choose the appropriate network interface to give vagrant internet access. (usually option 1)
6. `vagrant ssh`
7. `sudo /vagrant/bin/install_vagrant.sh`
8. That's it :)




