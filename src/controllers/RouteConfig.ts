import express from 'express';

abstract class RouteConfig {
    app: express.Application;
    name: string;
    protected readonly prefix: string;

    constructor(app: express.Application, name: string) {
        this.app = app;
        this.name = name;
        this.configureRoutes();
        console.log(`configuring route -> ${this.name}`);
    }

    getName() {
        return this.name;
    }

    getPrefix() {
        return this.prefix;
    }

    abstract configureRoutes(): express.Application;
}

export default RouteConfig;
