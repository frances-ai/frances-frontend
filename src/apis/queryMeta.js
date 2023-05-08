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

export const gazetteer =[
    [
        "geonames",
        "Geonames",
        "A world-wide gazetteer of over eight million placenames, made available free of charge."
    ],
    [
        "os",
        "OS",
        "A detailed gazetteer of UK places,derived from the Ordnance Survey 1:50,000 scale gazetteer, under the OS Open Data initiative. The geoparser code adds GeoNames entries for large populated places around the globe when using this option to allow resolution of place names outside the UK."
    ],
    [
        "naturalearth",
        "Natural Earth",
        "A public domain vector and raster map collection of small scale (1:10m, 1:50m, 1:110m) mapping, built by the Natural Earth project."
    ],
    [
        "unlockgeonames",
        "Geonames through Unlock",
        "Access to GeoNames via Unlock."
    ],
    [
        "unlock",
        "Unlock",
        "A comprehensive gazetteer mainly for the UK, using all of OS, Natural Earth and GeoNames resources. This is the default option on the Unlock Places service and combines all their gazetteers except DEEP."
    ],
    [
        "deep",
        "DEEP",
        "A gazetteer of historical placenames in England, built by the DEEP project (Digital Exposure of English Placenames)."
    ],
    [
        "plplus",
        "Pleiades+",
        "A gazetteer of the ancient Greek and Roman world, based on the Pleiades dataset and augmented with links to Geonames."
    ]
]

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
    "geoparser_by_year": {
      "description": "It geo-locates locations in terms definitions and geo-resolves them using the Edinburgh Geoparser. It groups results by years.",
      "inputs": {
        "preprocess": true,
        "file": true,
        "gazetteer": true,
        "filter": {
          "target_sentences": false,
          "target_filter": false,
          "start_year": false,
          "end_year": false,
          "bounding_box": false
        }
      }
    },
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
    "geoparser_by_year": {
      "description": "It geo-locates locations in terms definitions and geo-resolves them using the Edinburgh Geoparser. It groups results by years.",
      "inputs": {
        "preprocess": true,
        "file": true,
        "gazetteer": true,
        "filter": {
          "target_sentences": false,
          "target_filter": false,
          "start_year": false,
          "end_year": false,
          "bounding_box": false
        }
      }
    },
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