import CollectionAPI from './collection'

describe("list collections", () => {
    test("return all collections",  () => {
        return CollectionAPI.get_collections().then( response => {
            console.log(response.data)
            expect(response.status).toBe(200)
        })
    });
});