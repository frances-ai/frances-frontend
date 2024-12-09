import {is_active_path, hto_uri_to_path} from './stringUtil'


describe('hto_uri_to_path function', () => {
    test("hto term record uri to term record path", () => {
        const term_uri = "https://w3id.org/hto/ArticleTermRecord/9922270543804340_192200899_6364534740_0"
        const expected_path = "/hto/ArticleTermRecord/9922270543804340_192200899_6364534740_0"
        expect(hto_uri_to_path(term_uri)).toBe(expected_path)
    })

    test("keep the original uri when it is not a hto uri", () => {
        const nls_uri = "https://www.google.com"
        expect(hto_uri_to_path(nls_uri)).toBe(nls_uri)
    })
})


describe('is_active_path function', () => {
    test("Article Term Record path is valid", () => {
        const term_record_path = "hto/ArticleTermRecord/9922270543804340_192200899_6364534740_0"
        expect(is_active_path(term_record_path)).toBeTruthy()
    })
    test("home page is valid", () => {
        const home_page_path = ""
        expect(is_active_path(home_page_path)).toBeTruthy()
    })
    test("Information Resource path is not valid", () => {
        const information_resource_path = "/hto/InformationResource/__data_EB_1_3_clean_cut_txt"
        expect(is_active_path(information_resource_path)).toBeFalsy()
    })
})
