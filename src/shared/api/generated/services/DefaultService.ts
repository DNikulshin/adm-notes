/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTodoDto } from '../models/CreateTodoDto';
import type { UpdateTodoDto } from '../models/UpdateTodoDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * @returns any
     * @throws ApiError
     */
    public static appControllerGetHello(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
        });
    }
    /**
     * Create a new todo
     * @param requestBody
     * @returns any The todo has been successfully created.
     * @throws ApiError
     */
    public static todosControllerCreate(
        requestBody: CreateTodoDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/todos',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request - Validation failed`,
                401: `Unauthorized - No valid access token provided`,
            },
        });
    }
    /**
     * Find all todos for the current user, or all todos if the user is an admin.
     * @returns any Return all todos.
     * @throws ApiError
     */
    public static todosControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/todos',
            errors: {
                401: `Unauthorized - No valid access token provided`,
            },
        });
    }
    /**
     * Find a single todo by its ID. Users can only access their own todos. Admins can access any todo.
     * @param id Todo ID
     * @returns any Return a single todo.
     * @throws ApiError
     */
    public static todosControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/todos/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized - No valid access token provided`,
                403: `Forbidden - User does not own this todo`,
                404: `Not Found - Todo with specified ID does not exist`,
            },
        });
    }
    /**
     * Update a todo. Users can only update their own todos.
     * @param id Todo ID
     * @param requestBody
     * @returns any The todo has been successfully updated.
     * @throws ApiError
     */
    public static todosControllerUpdate(
        id: string,
        requestBody: UpdateTodoDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/todos/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request - Validation failed`,
                401: `Unauthorized - No valid access token provided`,
                403: `Forbidden - User does not own this todo`,
                404: `Not Found - Todo with specified ID does not exist`,
            },
        });
    }
    /**
     * Delete a todo. Users can only delete their own todos.
     * @param id Todo ID
     * @returns any The todo has been successfully deleted.
     * @throws ApiError
     */
    public static todosControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/todos/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized - No valid access token provided`,
                403: `Forbidden - User does not own this todo`,
                404: `Not Found - Todo with specified ID does not exist`,
            },
        });
    }
    /**
     * Delete all todos (admin only).
     * @returns any All todos have been successfully deleted.
     * @throws ApiError
     */
    public static todosControllerDeleteAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/todos/admin/delete-all',
            errors: {
                401: `Unauthorized - No valid access token provided`,
                403: `Forbidden - User is not an admin`,
            },
        });
    }
    /**
     * @returns any The Health Check is successful
     * @throws ApiError
     */
    public static healthControllerCheck(): CancelablePromise<{
        status?: string;
        info?: Record<string, Record<string, any>> | null;
        error?: Record<string, Record<string, any>> | null;
        details?: Record<string, Record<string, any>>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
            errors: {
                503: `The Health Check is not successful`,
            },
        });
    }
}
