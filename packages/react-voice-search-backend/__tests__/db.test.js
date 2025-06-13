import * as dbModule from '../utils/db.js'; // adjust path as needed
import sampleData from '../sampleData.js';

// Increase timeout if your tests take longer (optional)
jest.setTimeout(10000);

describe('searchInDB', () => {
  beforeAll(() => {
    // Mock the Item.aggregate method used inside searchInDB
    dbModule.Item.aggregate = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns results with highlighting for name and category', async () => {
    // Mock the aggregate method to return a sample result with highlights
    dbModule.Item.aggregate.mockResolvedValue([
      {
        id: sampleData[1].id,
        name: sampleData[1].name,
        category: sampleData[1].category,
        highlights: [
          {
            path: 'name',
            texts: [
              { type: 'hit', value: 'Samsung' },
              { type: 'text', value: ' A51' }
            ]
          },
          {
            path: 'category',
            texts: [
              { type: 'text', value: 'Mobile' }
            ]
          }
        ],
        score: 1
      }
    ]);

    const filteredQuery = "Samsung";
    const queryWords = ["Samsung"];

    const result = await dbModule.searchInDB(filteredQuery, queryWords);

    expect(dbModule.Item.aggregate).toHaveBeenCalledTimes(1);

    expect(result).toEqual([
      {
        id: 2,
        name: "Samsung A51",
        category: "Mobile",
        matchedWords: queryWords
      }
    ]);
  });

  it('returns empty array when no matches found', async () => {
    dbModule.Item.aggregate.mockResolvedValue([]);

    const result = await dbModule.searchInDB("noresult", ["noresult"]);

    expect(result).toEqual([]);
  });
});
