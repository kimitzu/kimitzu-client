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
git clone https://github.com/kimitzu/kimitzu-client.git
```

Install dependencies

During this proces, all required system dependencies determined by the packager will be downloaded automatically on demand on macOS 10.12+ (macOS Sierra).

```
cd kimitzu-client
yarn install
npm run build:local:mac
```

## Run

Build files from previous steps can now be seen in the `dist/` folder. 
Install `kimitzu-client Setup 0.1.0.dmg` to install the software on your device.

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
go get -v github.com/kimitzu/kimitzu-go

go get -v github.com/kimitzu/kimitzu-services

git clone https://github.com/kimitzu/kimitzu-client.git
```

Build Kimitzu-Go
```
cd /GOPATH/src/github.com/kimitzu/kimitzu-go
go build openbazaard.go

./openbazaard start // <--- Run Kimitzu GO
```

Build Kimitzu-Services
```
cd /GOPATH/src/github.com/kimitzu/kimitzu-services
go build services.go

./services.go // <--- Run Kimitzu Services
```

Build Client
```
cd /HOME/kimitzu-client
npm run build

serve -s build -l 3000 // <--- Run Kimitzu client
```

# Configuring Apache
This configuration is important for users who intend to run Kimitzu on a remote host and who wish to point their host to a domain. This exposes the Kimitzu ports and maps it to your intended domain.

> If you are OK to access your host via its IP address (eg. 1.2.3.4:3000) or you intend to run Kimitzu locally (127.0.0.1:3000), then you may **skip** this step.

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
        ServerName kimitzu.ch // <--- change this, root domain.
        ServerAdmin kimitzu@kimitzu.com

        ProxyRequests Off
        ProxyPreserveHost Off
        <Proxy *>
                Require all granted
        </Proxy>

         ProxyPass        / http://localhost:80/ connectiontimeout=5 timeout=300
         ProxyPassReverse / http://localhost:80/

</VirtualHost>

<VirtualHost *:80>
        ServerName kimitzu-api.kimitzu.ch // <--- change this, Kimitzu services API.
        ServerAdmin kimitzu-api@kimitzu.com

        ProxyRequests Off
        ProxyPreserveHost Off
        <Proxy *>
                Require all granted
        </Proxy>

         ProxyPass        / http://localhost:8109/ connectiontimeout=5 timeout=300
         ProxyPassReverse / http://localhost:8109/

</VirtualHost>

<VirtualHost *:80>
        ServerName kimitzu-ob.kimitzu.ch // <--- change this, OpenBazaar layer.
        ServerAdmin kimitzu-ob@kimitzu.com

        ProxyRequests Off
        ProxyPreserveHost Off
        <Proxy *>
                        Require all granted
        </Proxy>

         ProxyPass        / http://localhost:8100/ connectiontimeout=5 timeout=300
         ProxyPassReverse / http://localhost:8100/

</VirtualHost>

<VirtualHost *:80>
        ServerName test.kimitzu.ch // <--- change this, Kimitzu client.
        ServerAdmin kimitzu@kimitzu.com

        ProxyRequests Off
        ProxyPreserveHost Off
        <Proxy *>
                Require all granted
        </Proxy>
        
         ProxyPass        / http://localhost:3000/ connectiontimeout=5 timeout=300
         ProxyPassReverse / http://localhost:3000/

        <Location "/ws">
                ProxyPass "ws://localhost:8100/ws"
        </Location>
</VirtualHost>
```

Restart Apache so that new configurations will take effect
```
sudo service apache2 restart
```

## Accessing
The Kimitzu client can now be accessed on http://localhost:3000/.