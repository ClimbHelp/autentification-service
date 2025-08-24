"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../src/controllers/user.controller");
describe('User Controller', () => {
    let mockRequest;
    let mockResponse;
    let responseJson;
    let responseRedirect;
    let mockNext;
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
            (0, user_controller_1.getProfile)(mockRequest, mockResponse, mockNext);
            expect(responseJson).toHaveBeenCalledWith(mockRequest.user);
            expect(responseRedirect).not.toHaveBeenCalled();
        });
        it('should redirect to home when not authenticated', () => {
            mockRequest.isAuthenticated = jest.fn(() => false);
            (0, user_controller_1.getProfile)(mockRequest, mockResponse, mockNext);
            expect(responseRedirect).toHaveBeenCalledWith('/');
            expect(responseJson).not.toHaveBeenCalled();
        });
        it('should handle undefined user data', () => {
            mockRequest.isAuthenticated = jest.fn(() => true);
            mockRequest.user = undefined;
            (0, user_controller_1.getProfile)(mockRequest, mockResponse, mockNext);
            expect(responseJson).toHaveBeenCalledWith(undefined);
        });
    });
});
