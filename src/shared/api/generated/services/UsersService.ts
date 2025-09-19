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
     * @param requestBody
     * @returns any User successfully registered.
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
                400: `Bad request.`,
            },
        });
    }
    /**
     * Get all users (Admin only)
     * Retrieves a list of all users. This endpoint is restricted to administrators.
     * @returns any Return all users.
     * @throws ApiError
     */
    public static usersControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users',
            errors: {
                401: `Unauthorized.`,
                403: `Forbidden.`,
            },
        });
    }
    /**
     * Get current user profile
     * @returns any Return user profile.
     * @throws ApiError
     */
    public static usersControllerGetProfile(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/profile',
            errors: {
                401: `Unauthorized.`,
            },
        });
    }
}
