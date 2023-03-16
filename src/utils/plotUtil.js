export function get_plot_frequency_count_data(query_results) {
    const freq_count = get_frequency_count(query_results);
    let data = [];
    for (const term in freq_count) {
        const count = freq_count[term];
        const trace = {
            x: Object.keys(count),
            y: Object.values(count),
            type: 'scatter',
            name: term
        }
        data.push(trace);
    }
    return data;
}


function get_frequency_count(query_results) {
    let freq_count={};
    for (const year in query_results) {
        for (const record of query_results[year]){
            const term = record[0];
            const freq = record[1];
            if (term in freq_count) {
                if (year in freq_count[term]) {
                    freq_count[term][year] += freq;
                } else {
                    freq_count[term][year]= freq;
                }
            } else {
                freq_count[term]={};
                freq_count[term][year]= freq;
            }
        }
    }
    return freq_count
}
