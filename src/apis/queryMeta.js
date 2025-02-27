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

export const eb_levels = {
  "collection": ["Collection", "Apply this query to collection level"],
  "volume": ["Volume", "Apply this query to volume level"],
  "edition": ["Edition", "Apply this query to edition level"],
  "year": ["Year", "Apply this query to year level"]
}

export const nls_levels = {
  "collection": ["Collection", "Apply this query to collection level"],
  "volume": ["Volume", "Apply this query to volume level"],
  "series": ["Series", "Apply this query to series level"],
  "year": ["Year", "Apply this query to year level"]
}

export const sourceProvidersInfo = {
  "NLS": ["All data from National Library of Scotland"],
  "HQ": ["Data from several sources with high quality text"],
  "NeuSpell": ["Spell Corrected data using the NeuSpell tool"]
}

export const gazetteer =[
    [
        "os",
        "OS",
        "A detailed gazetteer of UK places,derived from the Ordnance Survey 1:50,000 scale gazetteer, under the OS Open Data initiative. The geoparser code adds GeoNames entries for large populated places around the globe when using this option to allow resolution of place names outside the UK."
    ],
    [
      "geonames",
      "Geonames",
      "A world-wide gazetteer of over eight million placenames, made available free of charge."
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
        "It counts the number of times a keyword/keysentece appears in text."
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
    "It counts the number of times a keyword/keysentece appears in text."
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
      "description": "It extracts the number of volumes (books), pages, terms and words per year.",
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
    "snippet_keysearch_by_year": {
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
    "fulltext_keysearch_by_year": {
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
    },
    "frequency_distribution": {
      "description": "It calculates the frequency of the most ‘N’ common tokens in the collection",
      "inputs": {
        "preprocess": true,
        "level": true,
        "filter": {
          "exclude_words": false,
          "start_year": false,
          "end_year": false
        }
      }
    },
    "lexicon_diversity": {
      "description": "It computes the lexical diversity metric, which is the ratio of the vocabulary size to the total number of words in the text",
      "inputs": {
        "preprocess": true,
        "level": true,
        "filter": {
          "start_year": false,
          "end_year": false
        }
      }
    },
    "person_entity_recognition": {
      "description": "It identifies people mentioned in text and estimates the gender distribution",
      "inputs": {
        "level": true,
        "filter": {
          "exclude_words": false,
          "start_year": false,
          "end_year": false
        }
      }
    }
  },
  "NLS": {
    "geoparser_by_year": {
      "description": "It geo-locates locations in pages and geo-resolves them using the Edinburgh Geoparser. It groups results by years.",
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
      "description": "It extracts uris of pages in which appear your selected kewyords/keysentences. It groups results by uris.",
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
    "snippet_keysearch_by_year": {
      "description": "It extracts snippets of pages in which appear your selected kewyords/keysentences groupping results by years.",
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
    "fulltext_keysearch_by_year": {
      "description": "It extracts full text of pages in which appear your selected kewyords/keysentences. It groups results by years.",
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
    "frequency_distribution": {
      "description": "It calculates the frequency of the most ‘N’ common tokens in the collection",
      "inputs": {
        "preprocess": true,
        "level": true,
        "filter": {
          "exclude_words": false,
          "start_year": false,
          "end_year": false
        }
      }
    },
    "lexicon_diversity": {
      "description": "It computes the lexical diversity metric, which is the ratio of the vocabulary size to the total number of words in the text",
      "inputs": {
        "preprocess": true,
        "level": true,
        "filter": {
          "start_year": false,
          "end_year": false
        }
      }
    },
    "person_entity_recognition": {
      "description": "It identifies people mentioned in text and estimates the gender distribution",
      "inputs": {
        "level": true,
        "filter": {
          "exclude_words": false,
          "start_year": false,
          "end_year": false
        }
      }
    }
  }
}