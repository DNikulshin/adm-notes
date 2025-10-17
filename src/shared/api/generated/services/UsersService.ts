/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserDto } from '../models/CreateUserDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Register a new user
     * Creates a new user account and automatically logs in the user. Returns an access token and sets a refresh token in an HttpOnly cookie.
     * @param requestBody
     * @returns any User successfully registered and logged in. Returns access token and sets refresh token in HttpOnly cookie.
     * @throws ApiError
     */
    public static usersControllerRegister(
        requestBody: CreateUserDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request - Validation failed`,
                409: `Conflict - Email already exists`,
            },
        });
    }
    /**
     * Get all users (Admin only)
     * Retrieves a list of all users. This endpoint is restricted to administrators. Requires a valid access token in the Authorization header.
     * @returns any Return all users.
     * @throws ApiError
     */
    public static usersControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users',
            errors: {
                401: `Unauthorized - No valid access token provided`,
                403: `Forbidden - Insufficient permissions`,
            },
        });
    }
    /**
     * Get current user profile
     * Retrieves the profile information of the currently authenticated user. Requires a valid access token in the Authorization header.
     * @returns any Return user profile.
     * @throws ApiError
     */
    public static usersControllerGetProfile(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/profile',
            errors: {
                401: `Unauthorized - No valid access token provided`,
            },
        });
    }
}
