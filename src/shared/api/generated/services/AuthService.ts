/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginDto } from '../models/LoginDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Login a user
     * Authenticates a user and returns an access token. A refresh token is automatically set in an HttpOnly cookie.
     * @param requestBody
     * @returns any Returns the access token. Refresh token is set in HttpOnly cookie.
     * @throws ApiError
     */
    public static authControllerLogin(
        requestBody: LoginDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request - Validation failed`,
                401: `Unauthorized - Invalid credentials`,
            },
        });
    }
    /**
     * Refresh the access token
     * Uses the refresh token stored in HttpOnly cookie to generate a new access token. A new refresh token is set in the HttpOnly cookie.
     * @returns any Returns a new access token. A new refresh token is set in HttpOnly cookie.
     * @throws ApiError
     */
    public static authControllerRefresh(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh',
            errors: {
                400: `Bad Request - Validation failed`,
                401: `Unauthorized - Invalid or expired refresh token`,
                403: `Forbidden - Refresh token missing or invalid`,
            },
        });
    }
    /**
     * Logout a user
     * Clears the refresh token cookie and invalidates the session.
     * @returns any User successfully logged out. Refresh token cookie is cleared.
     * @throws ApiError
     */
    public static authControllerLogout(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
            errors: {
                401: `Unauthorized - No valid access token provided`,
            },
        });
    }
}
