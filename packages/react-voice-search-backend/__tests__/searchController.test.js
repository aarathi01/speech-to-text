import { jest } from '@jest/globals';
import { searchHandler } from '../controllers/searchController.js';

// Mock utils/db and utils/highlightUtils
import * as dbModule from '../utils/db.js';
import * as highlightUtils from '../utils/highlightUtils.js';

describe('searchHandler', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns 400 if query param q is missing or empty', async () => {
    const req = { query: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await searchHandler(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Query 'q' is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns empty results if no words extracted from query', async () => {
    const req = { query: { q: '  ' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Mock extractWords to return empty array
    jest.spyOn(highlightUtils, 'extractWords').mockReturnValue([]);

    await searchHandler(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ "error": "Query 'q' is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it('calls searchInDB and returns highlighted results', async () => {
    const req = { query: { q: 'iphone samsung' } };
    const res = {
      json: jest.fn(),
    };
    const next = jest.fn();

    // Mock extractWords to return words
    jest.spyOn(highlightUtils, 'extractWords').mockReturnValue(['iphone', 'samsung']);

    // Mock searchInDB to return dummy results
    jest.spyOn(dbModule, 'searchInDB').mockResolvedValue([
      {
        id: 1,
        name: 'iPhone 15 Pro Max',
        category: 'Mobile',
      },
      {
        id: 2,
        name: 'Samsung A51',
        category: 'Mobile',
      },
    ]);

    // Mock highlightField to just return the text passed
    jest.spyOn(highlightUtils, 'highlightField').mockImplementation((text) => text);

    await searchHandler(req, res, next);

    expect(dbModule.searchInDB).toHaveBeenCalledWith(['iphone', 'samsung']);

    expect(res.json).toHaveBeenCalledWith({
      results: [
        { id: 1, name: 'iPhone 15 Pro Max', category: 'Mobile', matchedWords: ['iphone', 'samsung'] },
        { id: 2, name: 'Samsung A51', category: 'Mobile', matchedWords: ['iphone', 'samsung'] },
      ],
    });

    expect(next).not.toHaveBeenCalled();
  });

  it('calls next with error if searchInDB throws', async () => {
    const req = { query: { q: 'iphone' } };
    const res = {
      json: jest.fn(),
    };
    const next = jest.fn();

    jest.spyOn(highlightUtils, 'extractWords').mockReturnValue(['iphone']);
    jest.spyOn(dbModule, 'searchInDB').mockRejectedValue(new Error('DB error'));

    await searchHandler(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
