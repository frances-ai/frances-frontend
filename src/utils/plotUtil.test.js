import {get_plot_frequency} from "./plotUtil";

let query_results = {};

beforeAll(() => {
    query_results = {
        1771: [
            ["cat", 2],
            ["dog", 11],
            ["puppy",1]
        ],
        1773: [
            ["parrot", 1],
            ["cat", 1],
            ["dog", 6],
            ["puppy",1]
        ],
        1778: [
            ["parrot", 4],
            ["cat", 8],
            ["dog", 53],
            ["puppy",1]
        ]
    }
})

test("Get frequency count from query result", () => {
    get_plot_frequency(query_results)
})