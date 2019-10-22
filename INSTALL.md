# Building on MAC OSX

## Prerequisites:

Mac OS High Sierra (macOS >= 10.11.6)

[NodeJS, Current Version](https://nodejs.org/en/)


Yarn:
```
npm install -g yarn
```

RPM:
```
brew install rpm
```

## Build

Clone the repository:
```
git clone https://github.com/djali-foundation/djali-client.git
```

Install dependencies

During this proces, all required system dependencies determined by the packager will be downloaded automatically on demand on macOS 10.12+ (macOS Sierra).

```
cd djali-client
yarn install
npm run build:local:mac
```

## Run

Build files from previous steps can now be seen in the `dist/` folder. 
Install `djali-client Setup 0.1.0.dmg` to install the software on your device.

After installation, the software will be automatically launched.

---

# Building and Running on Linux

This guide has been tested on Ubuntu 18.04 LTS.

## Prerequisites

[GoLang](https://golang.org/doc/install)
```
sudo apt install software-properties-common
sudo add-apt-repository ppa:longsleep/golang-backports
sudo apt update
sudo apt install golang-go
```

[NodeJS](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions-enterprise-linux-fedora-and-snap-packages)
```
# Node.js v12.x:
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Serve
```
npm install -g serve
```

## Build and Run
For remote users, it may be helpful to use `screen` so that it'll be easier to create and switch to multiple terminals. You'll also get the benefit of running the processes, kind of in-background, even when the remote session is terminated.
```
sudo apt install screen

// Read guide on how to use screen
man screen
```

Clone the repositories
```
go get -v github.com/djali-foundation/djali-go

go get -v github.com/djali-foundation/djali-services

git clone https://github.com/djali-foundation/djali-client.git
```

Build Djali-Go
```
cd /GOPATH/src/github.com/djali-foundation/djali-go
go build openbazaard.go

./openbazaard start // <--- Run Djali GO
```

Build Djali-Services
```
cd /GOPATH/src/github.com/djali-foundation/djali-services
go build services.go

./services.go // <--- Run Djali Services
```

Build Client
```
cd /HOME/djali-client
npm run build

serve -s build -l 3000 // <--- Run Djali client
```

# Configuring Apache
This configuration is important for users who intend to run Djali on a remote host and who wish to point their host to a domain. This exposes the Djali ports and maps it to your intended domain.

> If you are OK to access your host via its IP address (eg. 1.2.3.4:3000) or you intend to run Djali locally (127.0.0.1:3000), then you may **skip** this step.

Install Apache2
```
sudo apt install apache2
```

Enable Apache2 modules
```
sudo a2enmod ssl
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_wstunnel
```

Sample apache2.conf
```
<VirtualHost *:80>
        ServerName djali.org // <--- change this, root domain.
        ServerAdmin djali@djali.com

        ProxyRequests Off
        ProxyPreserveHost Off
        <Proxy *>
                Require all granted
        </Proxy>

         ProxyPass        / http://localhost:80/ connectiontimeout=5 timeout=300
         ProxyPassReverse / http://localhost:80/

</VirtualHost>

<VirtualHost *:80>
        ServerName djali-api.djali.org // <--- change this, Djali services API.
        ServerAdmin djali-api@djali.com

        ProxyRequests Off
        ProxyPreserveHost Off
        <Proxy *>
                Require all granted
        </Proxy>

         ProxyPass        / http://localhost:8109/ connectiontimeout=5 timeout=300
         ProxyPassReverse / http://localhost:8109/

</VirtualHost>

<VirtualHost *:80>
        ServerName djali-ob.djali.org // <--- change this, OpenBazaar layer.
        ServerAdmin djali-ob@djali.com

        ProxyRequests Off
        ProxyPreserveHost Off
        <Proxy *>
                        Require all granted
        </Proxy>

         ProxyPass        / http://localhost:4002/ connectiontimeout=5 timeout=300
         ProxyPassReverse / http://localhost:4002/

</VirtualHost>

<VirtualHost *:80>
        ServerName test.djali.org // <--- change this, Djali client.
        ServerAdmin djali@djali.com

        ProxyRequests Off
        ProxyPreserveHost Off
        <Proxy *>
                Require all granted
        </Proxy>
        
         ProxyPass        / http://localhost:3000/ connectiontimeout=5 timeout=300
         ProxyPassReverse / http://localhost:3000/

        <Location "/ws">
                ProxyPass "ws://localhost:4002/ws"
        </Location>
</VirtualHost>
```

Restart Apache so that new configurations will take effect
```
sudo service apache2 restart
```

## Accessing
The Djali client can now be accessed on http://localhost:3000/.