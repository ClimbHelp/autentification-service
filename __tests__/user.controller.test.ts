import { Request, Response } from 'express';
import { getProfile } from '../src/controllers/user.controller';

describe('User Controller', () => {
  let mockRequest: any;
  let mockResponse: any;
  let responseJson: jest.Mock;
  let responseRedirect: jest.Mock;
  let mockNext: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn();
    responseRedirect = jest.fn();
    mockNext = jest.fn();
    mockRequest = {
      isAuthenticated: jest.fn(() => false),
      user: { id: 1, username: 'testuser', email: 'test@example.com' }
    };
    mockResponse = {
      json: responseJson,
      redirect: responseRedirect,
    };
  });

  describe('getProfile', () => {
    it('should return user data when authenticated', () => {
      mockRequest.isAuthenticated = jest.fn(() => true);

      getProfile(mockRequest, mockResponse, mockNext);

      expect(responseJson).toHaveBeenCalledWith(mockRequest.user);
      expect(responseRedirect).not.toHaveBeenCalled();
    });

    it('should redirect to home when not authenticated', () => {
      mockRequest.isAuthenticated = jest.fn(() => false);

      getProfile(mockRequest, mockResponse, mockNext);

      expect(responseRedirect).toHaveBeenCalledWith('/');
      expect(responseJson).not.toHaveBeenCalled();
    });

    it('should handle undefined user data', () => {
      mockRequest.isAuthenticated = jest.fn(() => true);
      mockRequest.user = undefined;

      getProfile(mockRequest, mockResponse, mockNext);

      expect(responseJson).toHaveBeenCalledWith(undefined);
    });
  });
});
