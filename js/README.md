# CREATE DATA
loadtest http://localhost:3000/create -c 1 -t 30 -p load.js -T application/json
loadtest http://localhost:3000/create -c 10000 -t 30 -p load.js -T application/json

# list data
loadtest http://localhost:3000/list -c 10000 -t 30 -T application/json