import { Request, Response } from 'express';
import { healthCheck } from '../src/controllers/health.controller';

describe('Health Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;

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
      healthCheck(mockRequest as Request, mockResponse as Response, mockNext);

      expect(responseJson).toHaveBeenCalledWith({
        status: 'OK',
        service: 'autentication-service'
      });
    });

    it('should return correct service name', () => {
      const mockNext = jest.fn();
      healthCheck(mockRequest as Request, mockResponse as Response, mockNext);

      const responseData = responseJson.mock.calls[0][0];
      expect(responseData.service).toBe('autentication-service');
    });

    it('should return status OK', () => {
      const mockNext = jest.fn();
      healthCheck(mockRequest as Request, mockResponse as Response, mockNext);

      const responseData = responseJson.mock.calls[0][0];
      expect(responseData.status).toBe('OK');
    });
  });
});
