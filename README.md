# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

```
cd nodejs2025Q2-service
```

## Running the application with docker compose
```
docker-compose up --build
```

### Note: docker-compose will also run Prisma migrations automatically

## To start the container:

```
docker-compose up -d
```

## To stop the container:

```
docker-compose down
```

## To pull the image

```
docker pull shahkar1001/home-library:dev
```

and 

```
docker image ls
```

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
