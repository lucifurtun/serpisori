Multiplayer snake game - experiment.
------------------------------------

`șerpișori - from Romanian, means "little snakes"`

1. Use a desktop/laptop browser to watch the game board at http://serpisori.sensidev.com/spectator
1. Use your mobile phone's browser to join at http://serpisori.sensidev.com
2. Use your phone's gyro to control your dot.

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

## TODO

- Implement colision mecanics
- Player names
- Scoring and gameification
- Fancy animation to make it look better


