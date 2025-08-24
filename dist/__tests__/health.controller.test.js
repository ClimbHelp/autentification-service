"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const health_controller_1 = require("../src/controllers/health.controller");
describe('Health Controller', () => {
    let mockRequest;
    let mockResponse;
    let responseJson;
    beforeEach(() => {
        responseJson = jest.fn();
        mockRequest = {};
        mockResponse = {
            json: responseJson,
        };
    });
    describe('healthCheck', () => {
        it('should return health status OK', () => {
            const mockNext = jest.fn();
            (0, health_controller_1.healthCheck)(mockRequest, mockResponse, mockNext);
            expect(responseJson).toHaveBeenCalledWith({
                status: 'OK',
                service: 'autentication-service'
            });
        });
        it('should return correct service name', () => {
            const mockNext = jest.fn();
            (0, health_controller_1.healthCheck)(mockRequest, mockResponse, mockNext);
            const responseData = responseJson.mock.calls[0][0];
            expect(responseData.service).toBe('autentication-service');
        });
        it('should return status OK', () => {
            const mockNext = jest.fn();
            (0, health_controller_1.healthCheck)(mockRequest, mockResponse, mockNext);
            const responseData = responseJson.mock.calls[0][0];
            expect(responseData.status).toBe('OK');
        });
    });
});
