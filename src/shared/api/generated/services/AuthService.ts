/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginDto } from '../models/LoginDto';
import type { RefreshTokenDto } from '../models/RefreshTokenDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Login a user
     * @param requestBody
     * @returns any Returns the access and refresh tokens.
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
                401: `Invalid credentials.`,
            },
        });
    }
    /**
     * Refresh the access token
     * @param requestBody
     * @returns any Returns a new access token.
     * @throws ApiError
     */
    public static authControllerRefreshToken(
        requestBody: RefreshTokenDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh-token',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Invalid refresh token.`,
            },
        });
    }
    /**
     * Logout a user
     * @returns any User successfully logged out.
     * @throws ApiError
     */
    public static authControllerLogout(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
            errors: {
                401: `Unauthorized.`,
            },
        });
    }
}
