#!/bin/bash

ABSPATH=$(cd "$(dirname "$0")"; pwd -P)	
if [ "$1" != "" ]; then 
	echo "Building app $1"
	cd $ABSPATH/$1
	npm install
	npm install cordova-custom-config
	cordova platform add ios@6.1.0
	#cordova plugin rm cordova-plugin-local-notification
	#cordova plugin rm cordova-plugin-geofence
	#cordova plugin add https://github.com/jupesoftware/cordova-plugin-geofence
	#cordova plugin rm phonegap-plugin-push	
	#cordova plugin add phonegap-plugin-push
	#cordova build --device --release
	echo "build finished"
else
	echo "app name not provided. Please enter the app name:"
	response=
    	read response
	echo "Building app $response"
	folder="${response}"
	cd $ABSPATH/$folder
	echo "selected folder $folder"
	#cordova platform rm ios
	npm install
	npm install cordova-custom-config
	cordova platform add ios@6.1.0
	#cordova plugin rm cordova-plugin-add-swift-support	
	#cordova plugin add cordova-plugin-add-swift-support
	#cordova plugin rm cordova-plugin-local-notification
	#cordova plugin rm cordova-plugin-geofence
	#cordova plugin add https://github.com/jupesoftware/cordova-plugin-geofence
	#cordova plugin rm phonegap-plugin-push	
	#cordova plugin add phonegap-plugin-push
	#cordova plugin rm cordova-plugin-app-event

	cordova build --device --release
	echo "build $response finished"
fi