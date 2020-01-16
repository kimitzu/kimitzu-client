#! /bin/bash

if [ $GOPATH == "" ]
then
    echo "GOPATH not set"
    exit
fi

# TARGETS=${1:-windows/386,windows/amd64,darwin/amd64,linux/386,linux/amd64,linux/arm}
TARGETS=${1:-windows/amd64,linux/amd64}

export CGO_ENABLED=1
CLIENT_DIRECTORY=$(pwd)
echo $CLIENT_DIRECTORY

go get github.com/karalabe/xgo
cd $GOPATH/src/github.com/kimitzu/kimitzu-go
rm -rfv dist
mkdir -p dist && cd dist/
GOPATH=$GOPATH xgo --v --go=1.12 --targets=$TARGETS ../
cp kimitzu-go-linux-amd64 $CLIENT_DIRECTORY/lib/openbazaard
cp kimitzu-go-windows-4.0-amd64.exe $CLIENT_DIRECTORY/lib/openbazaard.exe

cd $GOPATH/src/github.com/kimitzu/kimitzu-services
rm -rfv dist
mkdir -p dist && cd dist/
GOPATH=$GOPATH xgo --v --go=1.12 --targets=$TARGETS ../
cp kimitzu-services-linux-amd64 $CLIENT_DIRECTORY/lib/services
cp kimitzu-services-windows-4.0-amd64.exe $CLIENT_DIRECTORY/lib/services.exe

cd $CLIENT_DIRECTORY
npm run build:local:mainnet -- --windows --publish=always
npm run build:local:mainnet -- --linux --publish=always