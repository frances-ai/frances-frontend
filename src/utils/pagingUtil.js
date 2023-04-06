export function countTotalYearRecords(result) {
    if (result instanceof Array) {
        let sum = 0;
        for (const records of result) {
            sum += records[1].length;
        }
        return sum;
    }
    if (result instanceof Object) {
        let sum = 0;
        for (const year in result) {
            sum += result[year].length;
        }
        return sum;
    }
    return null;
}

export function getPagingYearResult(page, rowsPerPage, result) {
    console.log(result);
    const num_previous_records = page * rowsPerPage;
    let start_year_index = 0;
    let num_previous_years_records = 0;

    if (result instanceof Array) {
        console.log("here")
        let paged_result = [];
        while (num_previous_records > num_previous_years_records)  {
            const next_year_records_length = result[start_year_index][1].length;
            if (num_previous_years_records + next_year_records_length > num_previous_records) {
                break;
            }
            num_previous_years_records += next_year_records_length;
            start_year_index++;
        }
        let start_year_record_index = num_previous_records - num_previous_years_records;

        let remaining_records = rowsPerPage;
        while (remaining_records !== 0) {
            const current_year_records = result[start_year_index][1];
            console.log(current_year_records);
            paged_result[start_year_index] = [];
            if (remaining_records > current_year_records.length - start_year_record_index) {
                paged_result[start_year_index][0] = result[start_year_index][0];
                paged_result[start_year_index][1] = current_year_records
                    .slice(start_year_record_index);
                start_year_index++;
                remaining_records -= current_year_records.length - start_year_record_index;
                start_year_record_index = 0;
                if (start_year_index >= result.length) {
                    break;
                }
            } else {
                paged_result[start_year_index][0] = result[start_year_index][0];
                paged_result[start_year_index][1] = current_year_records
                    .slice(start_year_record_index, start_year_record_index + remaining_records);
                remaining_records = 0;
                break;
            }

        }
        console.log(paged_result);
        return paged_result;
    }

    if (result instanceof Object) {
        let paged_result = {};
        const years = Object.keys(result);
        while (num_previous_records > num_previous_years_records)  {
            const next_year_records_length = result[years[start_year_index]].length;
            if (num_previous_years_records + next_year_records_length > num_previous_records) {
                break;
            }
            num_previous_years_records += next_year_records_length;
            start_year_index++;
        }
        let start_year_record_index = num_previous_records - num_previous_years_records;

        let remaining_records = rowsPerPage;
        while (remaining_records !== 0) {
            const current_year_records = result[years[start_year_index]];
            if (remaining_records > current_year_records.length - start_year_record_index) {
                paged_result[years[start_year_index]] = current_year_records
                    .slice(start_year_record_index);
                start_year_index++;
                remaining_records -= current_year_records.length - start_year_record_index;
                start_year_record_index = 0;
                if (start_year_index >= years.length) {
                    break;
                }
            } else {
                paged_result[years[start_year_index]] = current_year_records
                    .slice(start_year_record_index, start_year_record_index + remaining_records);
                remaining_records = 0;
                break;
            }
        }
        return paged_result;
    }


    return null;

}