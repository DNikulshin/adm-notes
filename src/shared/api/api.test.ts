import { DefaultService } from './generated';
import { describe, it, expect } from 'vitest';

describe('API Health Check', () => {
    it('should return a successful health check', async () => {
        const response = await DefaultService.healthControllerCheck();
        expect(response.status).toBe('ok');
    });
});
