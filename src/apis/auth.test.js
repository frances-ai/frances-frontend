import AuthAPI from './auth'

describe("login", () => {
    describe("when login call is successful", () => {
        test("should return status code 200 and users info",  () => {
            const email = "damonyu@gmail.com"
            const password = "damon97"
            return AuthAPI.login(email, password).then( response => {
                expect(response.status).toBe(200)
                expect(response.data).toEqual({
                    user: {
                        first_name: "Damon",
                        last_name: "Yu",
                        email: email
                    }
                })
            })
        });
    });

    describe("when login call is unsuccessful", () => {
        test("should return status code 401 and error info",  () => {
            const email = "wrongemail@wrong.com"
            const password = "damon97"
            return AuthAPI.login(email, password).catch( e => {
                expect(e.response.status).toBe(401)
                expect(e.response.data).toEqual({
                    error: "wrong credential"
                })
            })
        });
    });
});

describe("check if email has been registered", () => {
    describe("when email is valid", () => {
        test("should return status code 200 and true if it's not registered",  () => {
            const email = "noone@gmail.com"
            return AuthAPI.emailRegistered(email).then( response => {
                expect(response.status).toBe(200)
                expect(response.data.registered).toBe(false)
            })
        });

        test("should return status code 200 and true if it's registered",  () => {
            const email = "damonyu@gmail.com"
            return AuthAPI.emailRegistered(email).then( response => {
                expect(response.status).toBe(200)
                expect(response.data.registered).toBe(true)
            })
        });
    });

    describe("when email is not valid", () => {
        test("should return status code 400 and error message",  () => {
            const email = "wrong"
            return AuthAPI.emailRegistered(email).catch( e => {
                expect(e.response.status).toBe(400)
                expect(e.response.data).toEqual({
                    error: "Email is not valid"
                })
            })
        });
    });
});