import request from 'supertest';
import app, { startServer } from '../src/server';
import { Server } from 'http'

describe('Certificate Controller', (): void => {
	let server: Server;
	beforeAll(async (): Promise<void> => {
	  server = await startServer();
	});	
	afterAll((done): void => {
	  server.close(done);
	});
	let certificateId: number;

	it('should create a certificate successfully', async (): Promise<void> => {
	 	const response = await request(app)
	 	  .post('/api/v1/certificates/create')
	 	  .set('Content-Type', 'multipart/form-data')
	 	  .field('certificateData', JSON.stringify({
	 	    name: 'Test Cert',
	 	    provider: 'Test Provider',
	 	    issued_at: '2025-03-01T00:00:00.000Z',
	 	    expires_at: '2025-04-01T00:00:00.000Z',
	 	  }))
	 	  .attach('file', '__tests__/sample.pdf');	
	 	expect(response.status).toBe(201);
	 	expect(response.body.name).toBe('Test Cert');	
	 	certificateId = response.body.id; 
	});

	it('should return 400 for missing fields', async (): Promise<void> => {
	  const response = await request(app)
	    .post('/api/v1/certificates/create')
	    .send({});	
	  expect(response.status).toBe(400);
	  expect(response.body.error).toBe('Missing certificate data');
	});

	it('should retrieve all certificates', async (): Promise<void> => {
	  const response = await request(app)
	    .get('/api/v1/certificates/getall');	
	  expect(response.status).toBe(200);
	  expect(Array.isArray(response.body)).toBe(true);
	  expect(response.body.length).toBeGreaterThan(0);
	});	

	it('should delete a certificate successfully', async (): Promise<void> => {
	  const response = await request(app)
	    .delete('/api/v1/certificates/delete')
	    .set('certificate-id', certificateId.toString());
	  expect(response.status).toBe(200);
	  expect(response.body.message).toBe('Certificate deleted successfully');
	});

	it('should return 404 when deleting a non-existent certificate', async (): Promise<void> => {
	  const response = await request(app)
	    .delete('/api/v1/certificates/delete')
	    .set('certificate-id', '999999');	
	  expect(response.status).toBe(404);
	  expect(response.body.error).toBe('Certificate not found');
	});	
});
