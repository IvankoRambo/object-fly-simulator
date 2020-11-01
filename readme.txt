1. Project installation
a) Go to the root in the project and in CLI type command npm install. It will install node_modules folder from package.json
b) In CLI type npm run start. It will compile js files and launch server. For test the 12th version of NodeJS was used. If do not have NodeJS
you can use env_setup script to install nvm and 12th version of NodeJS.
d) After server launch you can access the project by typing in browser address bar http://127.0.0.1:3000/ URL.
If 3000 port is already occupied by another process: find server.js file in root folder and change port to the free one in following line
app.listen({{portNumber}}, '127.0.0.1'); where portNumber is your custom free port.

2. Interface overview
There are two approaches to throw a flying object (red div element with black circle in the center):
a) Define parameters in the informational bar in the upper part of a page and press "Start animation button".
b) Drag flying object from top to botton to define height of fly start and press on black circle and drag to define an angle and start speed
of object (object will start to fly when you leave keeping mouse to be clamped).