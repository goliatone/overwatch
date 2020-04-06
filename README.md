## Crime Visualization

To run the project you need Docker installed and available from your terminal.

Build Docker image:

```
$ ./taskfile release:docker
```

Run Docker container:

```
$ ./taskfile release:run
```

The application should be available in the [following url](http://localhost:1981):

```
http://localhost:1981
```

If your docker uses an IP then replace `localhost` by your docker's IP e.g. `http://191.168.99.100:1981` 

## Project Structure

The project consists of a backend application and a frontend client.

## Development 

For local development you need to have Node.js **v9.2.0** or higher installed.

### Backend

The **./backend** directory contains all server related project files.

#### Tests

To run tests you need to start the server first:

```
$ npm start
```

You can then run tests with the command:

```
$ npm test 
```

#### Frontend


### Tasks

This projects ships with a [taskfile](https://medium.com/@adrian_cooney/introducing-the-taskfile-5ddfe7ed83bd) in order to help with some tasks used during development and- in a regular project- deployments. 

```
Tasks:
     1  data:json
     2  dev:certs:create
     3  dev:certs:keychain
     4  dev:clean
     5  dev:docker
     6  dev:frontend
     7  dev:install
     8  dev:run
     9  dev:test
    10  help
    11  release:bundle
    12  release:docker
    13  release:run
```    


### Data

We use a data set provided for this exercise as a Google spreadsheet. In order to make use of the data we export it from the Google Spreadsheets application as a CSV file. 
Once we have the CSV file we want to convert it to a different format, JSON in this case.

<!-- We need to further process our JSON data for our needs  -->

The following are the CSV headers and the inferred meaning of each:

* **cddatetime**: Crime date time `M/D/YY H:MM`
* **address**: Address of reported incident
* **crimedescr**: Normalized description of each incident consisting of a code and a short label
* **latitude**: Latitude
* **longitude**: Longitue
* **district**: Patrol district code
* **beat**: Patrol beat code
* **grid**: Patrol grid code
* **ucr_ncic_code**: *Incident reference code

[City of Sacramento](https://www.cityofsacramento.org/Police/Crime/Data-Extracts/Public-Record-Data-Extracts) police records.

<!-- 
NOTE: data format wrong, downloaded from here
https://support.spatialkey.com/spatialkey-sample-csv-data/
-->

### Environment variables

* `NODE_APP_PORT`: 1981
* `NODE_REPL_PORT`: 9090
* `NODE_APP_HOST`: http://localhost:1981



## License
® License MIT 2017 by goliatone
