export const preprocess = [
  [
    "none",
    "None",
    "It does not apply any type of treatment to the text."
  ],
  [
    "normalize",
    "Normalize",
    "It converts all words to lower-case removing all characters that are not 'a',...,'z'."
  ],
  [
    "normalize_num",
    "Normalize & Numbers",
    "It converts all words to lower-case removing all characters that are not 'a',...,'z' or '1',..,'9'."
  ],
  [
    "lemmatize",
    "Normalize & Lemmatize",
    "It normalizes the text first and lemmatizes it later, returning the base (lemma) of each word."
  ],
  [
    "stem",
    "Normalize & Stemming",
    "It normalizes the text first and applies stemming later, reducing words to their stem."
  ]
]

export const collections_year_range = {
  'Encyclopaedia Britannica (1768-1860)': [1771, 1853],
  'Chapbooks printed in Scotland': [1671, 1893],
  'Ladies’ Edinburgh Debating Society': [1771, 1853]
}

const hit_count_eb = [
    [
        "word",
        "Word",
        "It counts the number of times a keyword/keysentece appears in a word."
    ],
    [
        "term",
        "Term",
        "It counts the number of times a keyword/keysentece appears in a term (article or topic)."
    ]
]

const hit_count_nls = [
  [
    "word",
    "Word",
    "It counts the number of times a keyword/keysentece appears in a word."
  ],
  [
    "page",
    "Page",
    "It counts the number of times a keyword/keysentece appears in a page."
  ]
]

export const queryMeta = {
  "EB": {
    "frequency_keysearch_by_year": {
      "description": "It counts the number of terms/words in which appear your selected kewyords/keysentences. It groups results by years.",
      "inputs": {
        "preprocess": true,
        "hit_count": hit_count_eb,
        "file": true,
        "filter": {
          "target_sentences": false,
          "target_filter": false,
          "start_year": false,
          "end_year": false
        }
      }
    },
    "publication_normalized": {
      "description": "It extracts the number of volumes (books), pages and words per year.",
      "inputs": {}
    },
    "uris_keysearch": {
      "description": "It extracts uris of terms in which appear your selected kewyords/keysentences. It groups results by uris.",
      "inputs": {
        "preprocess": true,
        "file": true,
        "filter": {
          "target_sentences": false,
          "target_filter": false,
          "start_year": false,
          "end_year": false
        }
      }
    },
    "terms_snippet_keysearch_by_year": {
      "description": "It extracts snippets of terms definitions in which appear your selected kewyords/keysentences groupping results by years.",
      "inputs": {
        "preprocess": true,
        "file": true,
        "filter": {
          "target_sentences": false,
          "target_filter": false,
          "start_year": false,
          "end_year": false,
          "window": false
        }
      }
    },
    "terms_fulltext_keysearch_by_year": {
      "description": "It extracts full text of terms definitions in which appear your selected kewyords/keysentences. It groups results by years.",
      "inputs": {
        "preprocess": true,
        "file": true,
        "filter": {
          "target_sentences": false,
          "target_filter": false,
          "start_year": false,
          "end_year": false
        }
      }
    }
  },
  "NLS": {
    "frequency_keysearch_by_year": {
      "description": "It counts the number of pages/words in which appear your selected kewyords/keysentences. It groups results by years.",
      "inputs": {
        "preprocess": true,
        "hit_count": hit_count_nls,
        "file": true,
        "filter": {
          "target_sentences": false,
          "target_filter": false,
          "start_year": false,
          "end_year": false
        }
      }
    },
    "publication_normalized": {
      "description": "It extracts the number of volumes (books), pages and words per year.",
      "inputs": {}
    },
    "uris_keysearch": {
      "description": "It extracts uris of terms in which appear your selected kewyords/keysentences. It groups results by uris.",
      "inputs": {
        "preprocess": true,
        "file": true,
        "filter": {
          "target_sentences": false,
          "target_filter": false,
          "start_year": false,
          "end_year": false
        }
      }
    },
    "terms_snippet_keysearch_by_year": {
      "description": "It extracts snippets of terms definitions in which appear your selected kewyords/keysentences groupping results by years.",
      "inputs": {
        "preprocess": true,
        "file": true,
        "filter": {
          "target_sentences": false,
          "target_filter": false,
          "start_year": false,
          "end_year": false,
          "window": false
        }
      }
    },
    "terms_fulltext_keysearch_by_year": {
      "description": "It extracts full text of terms definitions in which appear your selected kewyords/keysentences. It groups results by years.",
      "inputs": {
        "preprocess": true,
        "file": true,
        "filter": {
          "target_sentences": false,
          "target_filter": false,
          "start_year": false,
          "end_year": false
        }
      }
    }
  }
}