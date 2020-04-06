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

## Development

### Project Structure

Main directory **crime-visualization**

### Tasks

This projects ships with a [taskfile](https://medium.com/@adrian_cooney/introducing-the-taskfile-5ddfe7ed83bd) in order to help with some tasks used during development and- in a regular project- deployments. 


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

* `NODE_APP_PORT`
* `NODE_REPL_PORT`

## Docker

NOTE: Ensure that the ports you have specified in the **docker-compose.yml** file, the **Dockerfile**, and `.envset` are the same.

### Dockerfile

### Docker Compose

```
version: '3'

services:
  server:
    build: .
    image: goliatone/svelte-front-end-template
    hostname: Svelte Front End Template-{{NODE_ENV}}
    command: dumb-init node index.js
    ports:
      - "{{NODE_APP_PORT}}:{{NODE_APP_PORT}}"
      - "{{NODE_REPL_PORT}}:{{NODE_REPL_PORT}}"
    environment:
      - DEBUG=svelte-front-end-template
      - NODE_ENV={{NODE_ENV}}
      - NODE_APP_ID={{NODE_APP_ID}}
      - NODE_APP_PORT={{NODE_APP_PORT}}
      - NODE_REPL_PORT={{NODE_REPL_PORT}}
      - NODE_REPL_ENABLED={{NODE_REPL_ENABLED}}
    restart: always
    logging:
      options:
        max-size: "50m"
        max-file: "3"
```

## License
® License MIT 2017 by goliatone
