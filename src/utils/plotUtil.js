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

export function get_plot_lexicon_diversity_year(query_results) {
    /*
    query_results: {
     year: [unique words, words, ttr, maas, mtld]
    }
     */
    let data = [];
    const trace_names = ["Unique Words", "Words", "TTR", "Maas", "MTLD"]
    let trace_values = {}
    trace_names.forEach(trace_name => {
        trace_values[trace_name] = []
    })

    for (const year in query_results) {
        const row = query_results[year][0]
        console.log(row)
        for (let i = 0; i < trace_names.length; i++) {
            const trace_name = trace_names[i]
            trace_values[trace_name].push(row[i])
        }
    }
    console.log(trace_values)
    const years = Object.keys(query_results)
    trace_names.forEach(trace_name => {
        const trace = {
            x: years,
            y: trace_values[trace_name],
            type: 'scatter',
            name: trace_name
        }
        data.push(trace);
    })

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


function get_normalize_freq(publication_normalized_result, query_results, hit_count) {
    const freq_count = get_frequency_count(query_results);
    let normalized_freq_count = {};
    for (const term in freq_count) {
        let term_year_norm_freq = {};
        for (const year in freq_count[term]) {
            let base_number = publication_normalized_result[year][2];
            if (hit_count === "page") {
                base_number = publication_normalized_result[year][1];
            }
            term_year_norm_freq[year] = (freq_count[term][year] * (term.split().length)) / parseFloat(base_number);
        }
        normalized_freq_count[term] = term_year_norm_freq;
    }
    return normalized_freq_count;
}

export function get_plot_normalized_frequency_count_data(publication_normalized_result, query_results, hit_count) {
    const normalized_freq_count = get_normalize_freq(publication_normalized_result, query_results, hit_count);
    let data = [];
    for (const term in normalized_freq_count) {
        const count = normalized_freq_count[term];
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
