export type Answer = {
  text: string;
  correct: boolean;
};

export type Question = {
  type: 'multiple-choice' | 'match' | 'drag-and-drop' | 'fill-in-the-blank';
  questionText: string;
  answers: Answer[];
  explanation: string;
  matchPairs?: { item: string; match: string }[];
};

export type Lesson = {
  title: string;
  slug: string;
  questions: Question[];
};

export const quizData: Lesson[] = [
  {
    title: "Festivals of Faith",
    slug: "festivals-of-faith",
    questions: [
      {
        type: "multiple-choice",
        questionText: "Vesak Day commemorates which events in Buddhism?",
        answers: [
          { text: "Birth, enlightenment, and death of the Buddha", correct: true },
          { text: "Victory of Rama over Ravana", correct: false },
          { text: "Christ’s resurrection", correct: false },
          { text: "Abraham’s sacrifice", correct: false },
        ],
        explanation: "Vesak marks the Buddha’s birth, enlightenment, and parinirvana. Buddhists celebrate it with lanterns, prayers, and acts of compassion.",
      },
      {
        type: "multiple-choice",
        questionText: "Eid ul-Fitr in Islam celebrates the end of:",
        answers: [
          { text: "The Hajj pilgrimage", correct: false },
          { text: "Ramadan, the month of fasting", correct: true },
          { text: "The Islamic New Year", correct: false },
          { text: "The birth of Muhammad", correct: false },
        ],
        explanation: "Eid al-Fitr (Hari Raya Puasa) comes right after Ramadan’s fast. It’s a day of communal prayer, feasting and charity.",
      },
      {
        type: 'multiple-choice',
        questionText: "Deepavali is also known as the festival of what?",
        answers: [
            { text: 'Lights', correct: true },
            { text: 'Colors', correct: false },
            { text: 'Harvest', correct: false },
            { text: 'Brothers and Sisters', correct: false },
        ],
        explanation: 'Deepavali, the Hindu festival, is known as the Festival of Lights, symbolizing the victory of light over darkness and good over evil.'
      },
    ],
  },
  {
    title: "Core Tenets & Beliefs",
    slug: "core-tenets-beliefs",
    questions: [
      {
        type: "multiple-choice",
        questionText: "Which of these is not one of Buddhism’s Four Noble Truths?",
        answers: [
          { text: "Life has suffering (dukkha)", correct: false },
          { text: "Suffering is caused by desire", correct: false },
          { text: "Nirvana cannot be achieved by humans", correct: true },
          { text: "The Eightfold Path ends suffering", correct: false },
        ],
        explanation: "Buddhism teaches that suffering can end by following the Noble Eightfold Path. It does not say humans can’t attain nirvana; quite the opposite.",
      },
      {
        type: "multiple-choice",
        questionText: "In Islam, which practice is not one of the Five Pillars?",
        answers: [
          { text: "Shahada (declaration of faith)", correct: false },
          { text: "Salah (prayer)", correct: false },
          { text: "Karma (moral action)", correct: true },
          { text: "Zakat (charity)", correct: false },
        ],
        explanation: "The Five Pillars are obligatory acts for Muslims: faith, prayer, charity, fasting (Ramadan), pilgrimage to Mecca. “Karma” is a Hindu/Buddhist concept, not an Islamic pillar.",
      },
      {
        type: "multiple-choice",
        questionText: "The Guru Granth Sahib is the holy scripture of which faith?",
        answers: [
          { text: "Hinduism", correct: false },
          { text: "Sikhism", correct: true },
          { text: "Christianity", correct: false },
          { text: "Jainism", correct: false },
        ],
        explanation: "Sikhism’s central text is the Guru Granth Sahib, treated as the eternal living Guru. It contains teachings of the Sikh Gurus and others.",
      },
    ],
  },
  {
    title: "Sacred Places",
    slug: "sacred-places",
    questions: [
        {
            type: 'multiple-choice',
            questionText: 'What is Islam’s holiest site?',
            answers: [
                { text: 'Mount Sinai', correct: false },
                { text: 'The Kaaba in Mecca', correct: true },
                { text: 'Jerusalem’s Western Wall', correct: false },
                { text: 'Amritsar’s Golden Temple', correct: false },
            ],
            explanation: 'Muslims worldwide face the Kaaba (in Mecca) for prayer. Hajj pilgrims gather there.'
        },
        {
            type: 'multiple-choice',
            questionText: 'Which river is considered sacred in Hinduism?',
            answers: [
                { text: 'Ganges (Ganga)', correct: true },
                { text: 'Nile', correct: false },
                { text: 'Yangtze', correct: false },
                { text: 'Amazon', correct: false },
            ],
            explanation: 'The Ganges is the holiest river to Hindus. Many cleanse themselves in its waters, especially during pilgrimages like Kumbh Mela.'
        }
    ]
  },
  {
      title: 'Daily Practices',
      slug: 'daily-practices',
      questions: [
          {
              type: 'multiple-choice',
              questionText: 'Which greeting is common among Muslims?',
              answers: [
                  { text: 'Assalamu alaikum (“Peace be upon you”)', correct: true },
                  { text: 'Shalom', correct: false },
                  { text: 'Namaste', correct: false },
                  { text: 'Selamat pagi', correct: false },
              ],
              explanation: 'Muslims greet each other with “Assalamu alaikum”; the reply is “Wa alaikum as-salam” (“and peace upon you”).'
          },
          {
              type: 'fill-in-the-blank',
              questionText: 'Hindus often wear a ______ (a mark on the forehead) during worship to indicate devotion.',
              answers: [{ text: 'bindi', correct: true }],
              explanation: 'Many Hindus apply a bindi (often red) on the forehead during rituals or daily as a symbol of the “third eye” or blessing.'
          },
          {
              type: 'multiple-choice',
              questionText: 'When visiting a Buddhist temple, it’s courteous to:',
              answers: [
                  { text: 'Remove your shoes and cover shoulders', correct: true },
                  { text: 'Shout loudly with joy', correct: false },
                  { text: 'Point your feet toward the Buddha statue', correct: false },
                  { text: 'Wear only black', correct: false },
              ],
              explanation: 'Buddhist temples require modest dress. One removes hats/shoes and sits quietly. Pointing feet at Buddha images is considered disrespectful.'
          }
      ]
  },
  {
      title: 'Respectful Interactions',
      slug: 'respectful-interactions',
      questions: [
          {
              type: 'multiple-choice',
              questionText: 'Upon entering a Sikh gurdwara (temple), a visitor should:',
              answers: [
                  { text: 'Remove shoes and cover their head', correct: true },
                  { text: 'Sit down immediately', correct: false },
                  { text: 'Offer a monetary donation first', correct: false },
                  { text: 'Sing a hymn', correct: false },
              ],
              explanation: 'All visitors to a gurdwara must remove their shoes and cover their head (men and women) as a sign of respect.'
          },
          {
              type: 'multiple-choice',
              questionText: 'In Jewish tradition, what is a man in a synagogue expected to wear?',
              answers: [
                  { text: 'A yarmulke (skullcap)', correct: true },
                  { text: 'Sit on the floor', correct: false },
                  { text: 'Fast until sunset', correct: false },
                  { text: 'Recite the Quran', correct: false },
              ],
              explanation: 'Jewish men customarily cover their heads (with a kippah) in the synagogue as a sign of reverence; going bareheaded is often considered disrespectful.'
          },
      ]
  },
  {
    title: "Culinary Traditions",
    slug: "culinary-traditions",
    questions: [],
  }
];
