import request from  'supertest';
import ExpressApp from '../app';

describe('express app tests', () => {
    let app: ExpressApp = new ExpressApp();

    const initSpy = jest.spyOn(ExpressApp.prototype, 'init');
    const expressSpy = jest.spyOn(ExpressApp.prototype, 'initializeExpress');
    const configureLoggingSpy = jest.spyOn(ExpressApp.prototype, 'configureLogging');
    const middlewaresSpy = jest.spyOn(ExpressApp.prototype, 'middlewares');
    const initializeDatabaseSpy = jest.spyOn(ExpressApp.prototype, 'initializeDatabase');
    const configureRoutesSpy = jest.spyOn(ExpressApp.prototype, 'configureRoutes');

    beforeEach(() => {
        app = new ExpressApp();
    });

    beforeAll(() => {
        initializeDatabaseSpy.mockImplementation(() => Promise.resolve());
        configureRoutesSpy.mockImplementation(() => {});
    })


    it('should run express.js server in port 3000', async() => { 
        expect(initSpy).toHaveBeenCalled();
        expect(expressSpy).toHaveBeenCalled();
        expect(configureLoggingSpy).toHaveBeenCalled();
        expect(middlewaresSpy).toHaveBeenCalled();
        expect(configureRoutesSpy).toHaveBeenCalled();
        expect(initializeDatabaseSpy).toHaveBeenCalled();
        expect(app.port).toBe(3000);
        console.log(app.routes)
    });
})