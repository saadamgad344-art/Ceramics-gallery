# ElkafrawyFE

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.4.

## Development server

This frontend connects to an ASP.NET Core API that should be running locally (by default on port 5151). Start the backend first with:

```bash
cd ../YourApiProjectFolder
dotnet run --urls http://localhost:5151
```

Then in this directory launch the Angular development server:

```bash
npm install       # first time only
ng serve --port 4300
```

Open your browser to `http://localhost:4300/` (or another port if prompted). The app will reload when source files change.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
