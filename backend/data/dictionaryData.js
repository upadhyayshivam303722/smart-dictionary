/**
 * Built-in Collegiate Lexicon Fallback
 * Used by backend/server.js when the upstream Free Dictionary API is slow, rate-limited, or timing out.
 * Matches Free Dictionary API JSON schema exactly:
 * [ { word, phonetic, phonetics: [...], meanings: [...] } ]
 */

const DICTIONARY_FALLBACK = {
  "happy": [
    {
      "word": "happy",
      "phonetic": "/ˈhæpiː/",
      "phonetics": [
        {
          "text": "/ˈhæpiː/",
          "audio": "https://api.dictionaryapi.dev/media/pronunciations/en/happy-us.mp3"
        }
      ],
      "meanings": [
        {
          "partOfSpeech": "adjective",
          "definitions": [
            {
              "definition": "Feeling or showing pleasure or contentment; fortunate and convenient.",
              "synonyms": ["cheerful", "joyful", "delighted", "content", "elated"],
              "antonyms": ["sad", "unhappy", "sorrowful"],
              "example": "She had a happy childhood surrounded by supportive mentors."
            }
          ],
          "synonyms": ["cheerful", "content", "delighted", "elated", "exultant", "gleeful"],
          "antonyms": ["sad", "unhappy", "depressed"]
        }
      ]
    }
  ],
  "beautiful": [
    {
      "word": "beautiful",
      "phonetic": "/ˈbjuːtɪfəl/",
      "phonetics": [
        {
          "text": "/ˈbjuːtɪfəl/",
          "audio": "https://api.dictionaryapi.dev/media/pronunciations/en/beautiful-us.mp3"
        }
      ],
      "meanings": [
        {
          "partOfSpeech": "adjective",
          "definitions": [
            {
              "definition": "Pleasing the senses or mind aesthetically; having qualities of beauty.",
              "synonyms": ["attractive", "gorgeous", "stunning", "lovely", "exquisite"],
              "antonyms": ["ugly", "unattractive", "plain"],
              "example": "The university campus is located in a beautiful historical district."
            }
          ],
          "synonyms": ["attractive", "gorgeous", "lovely", "splendid", "handsome"],
          "antonyms": ["ugly", "hideous", "plain"]
        }
      ]
    }
  ],
  "computer": [
    {
      "word": "computer",
      "phonetic": "/kəmˈpjuːtə/",
      "phonetics": [
        {
          "text": "/kəmˈpjuːtə/",
          "audio": "https://api.dictionaryapi.dev/media/pronunciations/en/computer-uk.mp3"
        }
      ],
      "meanings": [
        {
          "partOfSpeech": "noun",
          "definitions": [
            {
              "definition": "An electronic device for storing and processing data, typically in binary form, according to instructions given to it in a variable program.",
              "synonyms": ["processor", "machine", "workstation", "mainframe", "PC"],
              "antonyms": [],
              "example": "Modern computer architectures facilitate high-performance parallel processing."
            }
          ],
          "synonyms": ["workstation", "PC", "laptop", "server", "processor"],
          "antonyms": []
        }
      ]
    }
  ],
  "student": [
    {
      "word": "student",
      "phonetic": "/ˈstjuː.dənt/",
      "phonetics": [
        {
          "text": "/ˈstjuː.dənt/",
          "audio": "https://api.dictionaryapi.dev/media/pronunciations/en/student-us.mp3"
        }
      ],
      "meanings": [
        {
          "partOfSpeech": "noun",
          "definitions": [
            {
              "definition": "A person who is studying at a school, college, or university.",
              "synonyms": ["pupil", "scholar", "undergraduate", "learner", "academic"],
              "antonyms": ["teacher", "instructor", "professor"],
              "example": "The graduate student presented compelling empirical evidence at the symposium."
            }
          ],
          "synonyms": ["scholar", "learner", "undergraduate", "disciple", "apprentice"],
          "antonyms": ["teacher", "instructor"]
        }
      ]
    }
  ],
  "apple": [
    {
      "word": "apple",
      "phonetic": "/ˈæp.əl/",
      "phonetics": [
        {
          "text": "/ˈæp.əl/",
          "audio": "https://api.dictionaryapi.dev/media/pronunciations/en/apple-us.mp3"
        }
      ],
      "meanings": [
        {
          "partOfSpeech": "noun",
          "definitions": [
            {
              "definition": "The round fruit of a tree of the rose family, which typically has thin red or green skin and crisp flesh.",
              "synonyms": ["pome", "fruit"],
              "antonyms": [],
              "example": "He picked a crisp red apple from the collegiate orchard."
            }
          ],
          "synonyms": ["fruit", "pome"],
          "antonyms": []
        }
      ]
    }
  ],
  "eloquent": [
    {
      "word": "eloquent",
      "phonetic": "/ˈɛl.əˌkwənt/",
      "phonetics": [
        {
          "text": "/ˈɛl.əˌkwənt/",
          "audio": "https://api.dictionaryapi.dev/media/pronunciations/en/eloquent-us.mp3"
        }
      ],
      "meanings": [
        {
          "partOfSpeech": "adjective",
          "definitions": [
            {
              "definition": "Fluent or persuasive in speaking or writing; clearly expressing or indicating something.",
              "synonyms": ["articulate", "fluent", "persuasive", "expressive", "silver-tongued"],
              "antonyms": ["inarticulate", "hesitant", "stammering"],
              "example": "Her eloquent thesis defense captivated the faculty examination panel."
            }
          ],
          "synonyms": ["articulate", "expressive", "persuasive", "fluent", "well-spoken"],
          "antonyms": ["inarticulate", "incoherent"]
        }
      ]
    }
  ],
  "dictionary": [
    {
      "word": "dictionary",
      "phonetic": "/ˈdɪkʃəˌnɛɹi/",
      "phonetics": [
        {
          "text": "/ˈdɪkʃəˌnɛɹi/",
          "audio": "https://api.dictionaryapi.dev/media/pronunciations/en/dictionary-us.mp3"
        }
      ],
      "meanings": [
        {
          "partOfSpeech": "noun",
          "definitions": [
            {
              "definition": "A book or electronic resource that lists the words of a language and gives their meaning, or gives the equivalent words in a different language.",
              "synonyms": ["lexicon", "wordbook", "glossary", "vocabulary", "thesaurus"],
              "antonyms": [],
              "example": "The scholar consulted an unabridged dictionary to verify the etymology of the term."
            }
          ],
          "synonyms": ["lexicon", "glossary", "vocabulary", "wordbook"],
          "antonyms": []
        }
      ]
    }
  ],
  "serene": [
    {
      "word": "serene",
      "phonetic": "/səˈɹiːn/",
      "phonetics": [
        {
          "text": "/səˈɹiːn/",
          "audio": "https://api.dictionaryapi.dev/media/pronunciations/en/serene-us.mp3"
        }
      ],
      "meanings": [
        {
          "partOfSpeech": "adjective",
          "definitions": [
            {
              "definition": "Calm, peaceful, and untroubled; tranquil.",
              "synonyms": ["tranquil", "peaceful", "calm", "placid", "composed"],
              "antonyms": ["turbulent", "agitated", "stormy", "anxious"],
              "example": "She looked at her students with joviality and a serene mentality."
            }
          ],
          "synonyms": ["calm", "tranquil", "peaceful", "placid", "unruffled"],
          "antonyms": ["troubled", "anxious", "agitated"]
        }
      ]
    }
  ],
  "ephemeral": [
    {
      "word": "ephemeral",
      "phonetic": "/ɪˈfem.ər.əl/",
      "phonetics": [
        {
          "text": "/ɪˈfem.ər.əl/",
          "audio": "https://api.dictionaryapi.dev/media/pronunciations/en/ephemeral-us.mp3"
        }
      ],
      "meanings": [
        {
          "partOfSpeech": "adjective",
          "definitions": [
            {
              "definition": "Lasting for a very short time; transitory; fleeting.",
              "synonyms": ["transient", "fleeting", "short-lived", "momentary", "evanescent"],
              "antonyms": ["permanent", "eternal", "enduring", "everlasting"],
              "example": "Fame in the digital era can be intoxicatingly rapid, yet entirely ephemeral."
            }
          ],
          "synonyms": ["fleeting", "transient", "evanescent", "brief", "fugitive"],
          "antonyms": ["permanent", "enduring"]
        }
      ]
    }
  ],
  "serendipity": [
    {
      "word": "serendipity",
      "phonetic": "/ˌser.ənˈdɪp.ə.ti/",
      "phonetics": [
        {
          "text": "/ˌser.ənˈdɪp.ə.ti/",
          "audio": "https://api.dictionaryapi.dev/media/pronunciations/en/serendipity-us.mp3"
        }
      ],
      "meanings": [
        {
          "partOfSpeech": "noun",
          "definitions": [
            {
              "definition": "The occurrence and development of events by chance in a happy or beneficial way.",
              "synonyms": ["chance", "happy accident", "fortuity", "fluke", "providence"],
              "antonyms": ["misfortune", "bad luck"],
              "example": "A serendipity of scientific discovery led to the groundbreaking medical cure."
            }
          ],
          "synonyms": ["fortuity", "providence", "luck", "happy chance"],
          "antonyms": ["misfortune"]
        }
      ]
    }
  ],
  "pragmatic": [
    {
      "word": "pragmatic",
      "phonetic": "/ˈpræɡˈmæt.ɪk/",
      "phonetics": [
        {
          "text": "/ˈpræɡˈmæt.ɪk/",
          "audio": "https://api.dictionaryapi.dev/media/pronunciations/en/pragmatic-us.mp3"
        }
      ],
      "meanings": [
        {
          "partOfSpeech": "adjective",
          "definitions": [
            {
              "definition": "Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.",
              "synonyms": ["practical", "sensible", "matter-of-fact", "realistic", "down-to-earth"],
              "antonyms": ["idealistic", "impractical", "unrealistic"],
              "example": "We need a pragmatic approach to tackling the academic budget deficit this term."
            }
          ],
          "synonyms": ["practical", "realistic", "rational", "logical"],
          "antonyms": ["impractical", "idealistic"]
        }
      ]
    }
  ],
  "resilient": [
    {
      "word": "resilient",
      "phonetic": "/rɪˈzɪl.jənt/",
      "phonetics": [
        {
          "text": "/rɪˈzɪl.jənt/",
          "audio": "https://api.dictionaryapi.dev/media/pronunciations/en/resilient-us.mp3"
        }
      ],
      "meanings": [
        {
          "partOfSpeech": "adjective",
          "definitions": [
            {
              "definition": "Able to withstand or recover quickly from difficult conditions; buoyant.",
              "synonyms": ["tough", "hardy", "buoyant", "adaptable", "flexible"],
              "antonyms": ["vulnerable", "fragile", "sensitive"],
              "example": "Collegiate scholars proved resilient despite demanding examination schedules."
            }
          ],
          "synonyms": ["durable", "tough", "strong", "adaptable"],
          "antonyms": ["fragile", "weak"]
        }
      ]
    }
  ],
  "mellifluous": [
    {
      "word": "mellifluous",
      "phonetic": "/ˈmel.ɪf.lu.əs/",
      "phonetics": [
        {
          "text": "/ˈmel.ɪf.lu.əs/",
          "audio": "https://api.dictionaryapi.dev/media/pronunciations/en/mellifluous-us.mp3"
        }
      ],
      "meanings": [
        {
          "partOfSpeech": "adjective",
          "definitions": [
            {
              "definition": "(of a voice or words) sweet or musical; pleasant to hear; resembling honey.",
              "synonyms": ["dulcet", "honeyed", "mellifluent", "harmonious", "sweet-sounding"],
              "antonyms": ["cacophonous", "harsh", "strident", "grating"],
              "example": "Her mellifluous lecture engaged the entire auditorium."
            }
          ],
          "synonyms": ["dulcet", "melodious", "musical", "honeyed"],
          "antonyms": ["cacophonous", "harsh"]
        }
      ]
    }
  ],
  "ubiquitous": [
    {
      "word": "ubiquitous",
      "phonetic": "/juːˈbɪk.wɪ.təs/",
      "phonetics": [
        {
          "text": "/juːˈbɪk.wɪ.təs/",
          "audio": "https://api.dictionaryapi.dev/media/pronunciations/en/ubiquitous-us.mp3"
        }
      ],
      "meanings": [
        {
          "partOfSpeech": "adjective",
          "definitions": [
            {
              "definition": "Present, appearing, or found everywhere at once; omnipresent.",
              "synonyms": ["omnipresent", "everywhere", "pervasive", "universal", "all-over"],
              "antonyms": ["rare", "scarce", "uncommon"],
              "example": "Digital technology has become ubiquitous in modern academic research."
            }
          ],
          "synonyms": ["omnipresent", "universal", "pervasive", "widespread"],
          "antonyms": ["rare", "isolated"]
        }
      ]
    }
  ],
  "equanimity": [
    {
      "word": "equanimity",
      "phonetic": "/ˌek.wəˈnɪm.ə.ti/",
      "phonetics": [
        {
          "text": "/ˌek.wəˈnɪm.ə.ti/",
          "audio": "https://api.dictionaryapi.dev/media/pronunciations/en/equanimity-us.mp3"
        }
      ],
      "meanings": [
        {
          "partOfSpeech": "noun",
          "definitions": [
            {
              "definition": "Mental calmness, composure, and evenness of temper, especially in a difficult situation.",
              "synonyms": ["composure", "calmness", "serenity", "self-control", "poise"],
              "antonyms": ["anxiety", "agitation", "nervousness", "hysteria"],
              "example": "She accepted both praise and critique with equal equanimity."
            }
          ],
          "synonyms": ["poise", "composure", "tranquility", "coolness"],
          "antonyms": ["agitation", "excitement"]
        }
      ]
    }
  ],
  "catalyst": [
    {
      "word": "catalyst",
      "phonetic": "/ˈkæt.əl.ɪst/",
      "phonetics": [
        {
          "text": "/ˈkæt.əl.ɪst/",
          "audio": "https://api.dictionaryapi.dev/media/pronunciations/en/catalyst-us.mp3"
        }
      ],
      "meanings": [
        {
          "partOfSpeech": "noun",
          "definitions": [
            {
              "definition": "A person or thing that precipitates an event or change; in chemistry, a substance that increases the rate of a chemical reaction without undergoing permanent change.",
              "synonyms": ["stimulus", "spark", "impetus", "incentive", "prime mover"],
              "antonyms": ["inhibitor", "deterrent", "obstacle"],
              "example": "The groundbreaking discovery served as a catalyst for educational reform."
            }
          ],
          "synonyms": ["impetus", "stimulus", "spark", "agent"],
          "antonyms": ["hindrance", "inhibitor"]
        }
      ]
    }
  ]
};

module.exports = { DICTIONARY_FALLBACK };
