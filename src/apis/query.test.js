import QueryAPI from './query'
import AuthAPI from "./auth";

describe("list all defoe query tasks", () => {
    describe("when user is authenticated", () => {
        test("should return status code 200 and tasks info for this user",  () => {
            const email = "damonyu97@hotmail.com"
            const password = "shenyang"
            return AuthAPI.login(email, password).then( response => {
                console.log(response)
                return QueryAPI.getAllDefoeQueryTasks().then( response => {
                    expect(response.status).toBe(200)
                    console.log(response.data)
                })
            })

        });
    });
});
