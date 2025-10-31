const Minio = require('minio');

// Mock do MinIO
jest.mock('minio', () => ({
    Client: jest.fn().mockImplementation(() => ({
        putObject: jest.fn().mockResolvedValue({}),
        removeObject: jest.fn().mockResolvedValue({}),
        getObject: jest.fn().mockResolvedValue({
            on: jest.fn(),
            pipe: jest.fn(),
        }),
    })),
}));

// Mock do minioConnect
jest.mock('./src/config/minioConnect.js', () => ({
    default: {
        putObject: jest.fn().mockResolvedValue({}),
        removeObject: jest.fn().mockResolvedValue({}),
        getObject: jest.fn().mockResolvedValue({
            on: jest.fn(),
            pipe: jest.fn(),
        }),
    },
}));

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    jest.spyOn(console, 'log').mockImplementation(() => { });
});

afterAll(() => {
    if (console.error.mockRestore) {
        console.error.mockRestore();
    }
    if (console.log.mockRestore) {
        console.log.mockRestore();
    }
});
