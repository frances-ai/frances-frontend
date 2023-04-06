function check_status() {
    console.log('status: ' + status);
    if (status === 1) {
        console.log('done');
        clearInterval(timeID);
    }
    status =+ 1;
}

let status = 0;
const timeID = setInterval(check_status, 2000);

check_status();


function switchConditionStr(obj) {
    console.log("Testing switch with string type:....");

    switch (obj) {
        case "typeA":
            console.log("Here in test A!");
            break;
        case "typeB":
            console.log("Here in test B!");
            break;
        case "typeC":
            console.log("Here in test C!");
            break;
        case "typeD":
            console.log("Here in test D!");
        default:
            console.log("Here in default");
    }
}

switchConditionStr("typeD")


const results = {
    "1771": [
        ['cat', 5],
        ['dog', 10]
    ],
    "1773":[
        ['cat', 5],
        ['dog', 10]
    ]
}

function listResults() {
    Object.keys(results).map((value) => {
        console.log(value);
        results[value].map((result, index) => {
            console.log(result);
        })
    })
}

listResults();