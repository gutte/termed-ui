# Termed UI

Termed is a web-based vocabulary and metadata editor. 

Termed UI provides the front-end (Javascript-based user interface) of the editor.

## Running

First install and start [Termed API](https://github.com/THLfi/termed-api).

If `npm` and `grunt` are already installed in the system, run:
```
npm install
grunt dev
```
UI should respond at port `http://localhost:8000`.

One can also use `npm` and `grunt` installed by maven front-end plugin by running in the *client*
directory:
```
mvn install
./node_modules/grunt-cli/bin/grunt dev
```
