import ExpressApp from '../app';

describe('express app tests', () => {
    let app: ExpressApp = new ExpressApp();

    const initSpy = jest.spyOn(ExpressApp.prototype, 'init');
    const expressSpy = jest.spyOn(ExpressApp.prototype, 'initializeExpress');
    const configureLoggingSpy = jest.spyOn(ExpressApp.prototype, 'configureLogging');
    const middlewaresSpy = jest.spyOn(ExpressApp.prototype, 'middlewares');
    const initializeDatabaseSpy = jest.spyOn(ExpressApp.prototype, 'initializeDatabase');
    const configureRoutesSpy = jest.spyOn(ExpressApp.prototype, 'configureRoutes');
    const startSpy = jest.spyOn(ExpressApp.prototype, 'start');

    beforeEach(() => {
        app = new ExpressApp();
        app.app.listen = jest.fn();
        app.start();
        app.app.set('db', () => {
            return {
                createConnection: jest.fn(),
                getRepository: jest.fn(),
            }
        });
    });

    it('should run all methods in expressapp class', () => {
        expect(initSpy).toHaveBeenCalled();
        expect(expressSpy).toHaveBeenCalled();
        expect(configureLoggingSpy).toHaveBeenCalled();
        expect(middlewaresSpy).toHaveBeenCalled();
        expect(configureRoutesSpy).toHaveBeenCalled();
        expect(initializeDatabaseSpy).toHaveBeenCalled();
        expect(startSpy).toHaveBeenCalled();
    });

    it('should define database object', () => {
        expect(app.app.get('db')).toBeDefined();
    });

    it('should run express.js server in port 3000', () => {
        expect(app.port).toBe(3000);
    });
})