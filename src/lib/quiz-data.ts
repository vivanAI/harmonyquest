
export type Answer = {
  text: string;
  correct: boolean;
};

export type Question = {
  type: 'multiple-choice' | 'fill-in-the-blank';
  questionText: string;
  answers: Answer[];
  explanation: string;
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
      {
        type: "multiple-choice",
        questionText: "Thaipusam is a festival observed by Singaporean Hindus primarily to honor which deity?",
        answers: [
          { text: "Krishna", correct: false },
          { text: "Shiva", correct: false },
          { text: "Ganesha", correct: false },
          { text: "Lord Murugan (Karttikeya)", correct: true },
        ],
        explanation: "Thaipusam venerates Lord Murugan (the Hindu god of war), celebrated especially by the Tamil Hindu community in Singapore."
      },
      {
        type: "multiple-choice",
        questionText: "What does the Jewish festival Yom Kippur commemorate?",
        answers: [
          { text: "The creation of the world.", correct: false },
          { text: "Forgiveness and atonement (Day of Atonement)", correct: true },
          { text: "Exodus from Egypt.", correct: false },
          { text: "The dedication of the Second Temple.", correct: false },
        ],
        explanation: "Yom Kippur is the Jewish Day of Atonement, a solemn day of fasting and repentance."
      },
      {
        type: "multiple-choice",
        questionText: "Vaisakhi is a major festival for which religion?",
        answers: [
          { text: "Hinduism", correct: false },
          { text: "Buddhism", correct: false },
          { text: "Sikhism", correct: true },
          { text: "Jainism", correct: false },
        ],
        explanation: "Vaisakhi is a significant festival in Sikhism, celebrating the formation of the Khalsa panth of warriors under Guru Gobind Singh in 1699."
      },
      {
        type: "multiple-choice",
        questionText: "Rosh Hashanah and Yom Kippur are observed by:",
        answers: [
          { text: "Buddhists", correct: false },
          { text: "Jews", correct: true },
          { text: "Jains", correct: false },
          { text: "Sikhs", correct: false },
        ],
        explanation: "These are the Jewish High Holy Days, marking the New Year (Rosh Hashanah) and the Day of Atonement (Yom Kippur)."
      },
      {
        type: "multiple-choice",
        questionText: "Deepavali is also celebrated by which other faith community in Singapore, though they may call it by a different name?",
        answers: [
          { text: "Buddhists", correct: false },
          { text: "Sikhs (as Bandi Chhor Divas)", correct: true },
          { text: "Christians", correct: false },
          { text: "Taoists", correct: false },
        ],
        explanation: "Sikhs celebrate Bandi Chhor Divas at the same time as Deepavali, marking the day Guru Hargobind was freed from prison."
      },
      {
        type: "multiple-choice",
        questionText: "Christmas celebrates the birth of Jesus Christ. Which holiday celebrates his resurrection?",
        answers: [
          { text: "Good Friday", correct: false },
          { text: "Pentecost", correct: false },
          { text: "Easter", correct: true },
          { text: "Advent", correct: false },
        ],
        explanation: "Easter is the principal festival of Christianity, celebrating the resurrection of Jesus Christ on the third day after his crucifixion."
      },
      {
        type: "multiple-choice",
        questionText: "The Nine Emperor Gods Festival is primarily associated with which religion in Singapore?",
        answers: [
          { text: "Buddhism", correct: false },
          { text: "Hinduism", correct: false },
          { text: "Taoism", correct: true },
          { text: "Islam", correct: false },
        ],
        explanation: "The Nine Emperor Gods Festival is a nine-day Taoist celebration beginning on the eve of the ninth lunar month of the Chinese calendar."
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
      {
        type: "multiple-choice",
        questionText: "In Hinduism, ‘dharma’ refers to:",
        answers: [
          { text: "The cosmic order and righteous duty", correct: true },
          { text: "The cycle of reincarnation", correct: false },
          { text: "The Five Pillars", correct: false },
          { text: "The worship of Shiva", correct: false },
        ],
        explanation: "Dharma in Hindu thought is ethical duty, moral order, and living according to one’s role in life and society."
      },
      {
        type: "multiple-choice",
        questionText: "Which of these is a core Sikh belief?",
        answers: [
          { text: "Karma and Moksha as in Hinduism", correct: false },
          { text: "One eternal God (Ik Onkar) and equality for all", correct: true },
          { text: "The Four Noble Truths", correct: false },
          { text: "The Trinity", correct: false },
        ],
        explanation: "Sikhism preaches belief in one God (Ik Onkar) and the equal status of all humans, rejecting caste distinctions."
      },
      {
        type: "multiple-choice",
        questionText: "Jainism uniquely teaches:",
        answers: [
          { text: "One God with multiple forms.", correct: false },
          { text: "Ahimsa (non-violence toward all beings) as supreme virtue", correct: true },
          { text: "Ritual sacrifice to deities.", correct: false },
          { text: "Faith alone without action.", correct: false },
        ],
        explanation: "Jainism is built on ahimsa – complete nonviolence toward every living soul (even insects)."
      },
      {
        type: "multiple-choice",
        questionText: "In Christianity, the concept of the Holy Trinity refers to:",
        answers: [
          { text: "Three books of the Bible.", correct: false },
          { text: "The Father, Son, and Holy Spirit as one Godhead", correct: true },
          { text: "Baptism, communion, and confirmation.", correct: false },
          { text: "Three saints of the Church.", correct: false },
        ],
        explanation: "Most Christian denominations hold that God exists as a Trinity (three Persons in one essence)."
      },
      {
        type: "multiple-choice",
        questionText: "The Torah is the holy scripture of:",
        answers: [
          { text: "Hinduism", correct: false },
          { text: "Christianity", correct: false },
          { text: "Islam", correct: false },
          { text: "Judaism", correct: true },
        ],
        explanation: "Judaism’s foundational text is the Torah (the first five books of the Hebrew Bible)."
      },
      {
        type: "multiple-choice",
        questionText: "Which religion emphasizes the Eightfold Path and Four Noble Truths?",
        answers: [
          { text: "Islam", correct: false },
          { text: "Christianity", correct: false },
          { text: "Buddhism", correct: true },
          { text: "Sikhism", correct: false },
        ],
        explanation: "Buddhism’s core teachings are summarized as the Four Noble Truths and the Noble Eightfold Path."
      },
      {
        type: "multiple-choice",
        questionText: "The Bhagavad Gita is a sacred scripture in:",
        answers: [
          { text: "Christianity", correct: false },
          { text: "Hinduism", correct: true },
          { text: "Jainism", correct: false },
          { text: "Taoism", correct: false },
        ],
        explanation: "The Bhagavad Gita is a 700-verse Hindu scripture (part of the Mahabharata) featuring a conversation between Prince Arjuna and Lord Krishna."
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
      },
      {
        type: "multiple-choice",
        questionText: "The Golden Temple (Harmandir Sahib) is the most sacred site of:",
        answers: [
          { text: "Buddhism", correct: false },
          { text: "Islam", correct: false },
          { text: "Sikhism", correct: true },
          { text: "Jainism", correct: false },
        ],
        explanation: "The Golden Temple in Amritsar is the holiest gurdwara in Sikhism, symbolizing human equality and devotion."
      },
      {
        type: "multiple-choice",
        questionText: "The Yin-Yang symbol is central to which philosophy/religion?",
        answers: [
          { text: "Good versus evil", correct: false },
          { text: "Taoism, representing balance", correct: true },
          { text: "The Five Pillars of Islam", correct: false },
          { text: "The union of Buddha and Bodhisattva", correct: false },
        ],
        explanation: "Yin and Yang represent complementary energies (dark/light, passive/active) central in Chinese philosophical traditions including Taoism."
      },
      {
        type: "multiple-choice",
        questionText: "Which place is NOT among Buddhism’s Four Holy Sites?",
        answers: [
          { text: "Lumbini (birth of Buddha)", correct: false },
          { text: "Bodh Gaya (enlightenment)", correct: false },
          { text: "Mecca (Muslim pilgrimage)", correct: true },
          { text: "Sarnath (first sermon)", correct: false },
        ],
        explanation: "Mecca is an Islamic pilgrimage site, not Buddhist. Buddhism’s four holy sites are all in South Asia."
      },
      {
        type: "multiple-choice",
        questionText: "St. Peter's Basilica, a major pilgrimage site for Catholics, is located in which city?",
        answers: [
            { text: "Jerusalem", correct: false },
            { text: "Vatican City", correct: true },
            { text: "Constantinople (Istanbul)", correct: false },
            { text: "Bethlehem", correct: false },
        ],
        explanation: "St. Peter's Basilica is in Vatican City, Rome, and is one of the holiest sites in Christendom."
      },
      {
        type: "multiple-choice",
        questionText: "The Western Wall in Jerusalem is a sacred place of prayer for which religion?",
        answers: [
            { text: "Christianity", correct: false },
            { text: "Islam", correct: false },
            { text: "Judaism", correct: true },
            { text: "Baha'i Faith", correct: false },
        ],
        explanation: "The Western Wall (or Kotel) is the most sacred site in Judaism, believed to be the last remnant of the Second Temple."
      },
      {
        type: "multiple-choice",
        questionText: "In Singapore, the oldest Hindu temple is:",
        answers: [
            { text: "Sri Veeramakaliamman Temple", correct: false },
            { text: "Sri Srinivasa Perumal Temple", correct: false },
            { text: "Sri Mariamman Temple", correct: true },
            { text: "Sri Thendayuthapani Temple", correct: false },
        ],
        explanation: "The Sri Mariamman Temple, located in Chinatown, was founded in 1827 and is the oldest Hindu temple in Singapore."
      },
       {
        type: "multiple-choice",
        questionText: "The Lotus Temple, notable for its flowerlike shape, is a House of Worship for which faith?",
        answers: [
            { text: "Hinduism", correct: false },
            { text: "Baha'i Faith", correct: true },
            { text: "Buddhism", correct: false },
            { text: "Jainism", correct: false },
        ],
        explanation: "The Lotus Temple in Delhi, India, is one of the most prominent Baha'i Houses of Worship, open to all regardless of religion."
      },
      {
        type: "multiple-choice",
        questionText: "Which of these is a prominent mosque in Singapore, known for its golden domes?",
        answers: [
            { text: "Masjid Hajjah Fatimah", correct: false },
            { text: "Masjid Jamae", correct: false },
            { text: "Sultan Mosque (Masjid Sultan)", correct: true },
            { text: "Al-Abrar Mosque", correct: false },
        ],
        explanation: "Sultan Mosque, located in Kampong Glam, is a national monument and one of the most important mosques in Singapore."
      },
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
          answers: [{ text: 'bindi', correct: true }, { text: 'tilak', correct: true }],
          explanation: 'Many Hindus apply a bindi or tilak on the forehead during rituals or daily as a symbol of the “third eye” or blessing.'
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
        },
        {
          type: 'multiple-choice',
          questionText: 'During Ramadan, Muslims in Singapore typically break their fast with what meal?',
          answers: [
            { text: 'Suhoor', correct: false },
            { text: 'Iftar', correct: true },
            { text: 'Brunch', correct: false },
            { text: 'Sahur', correct: false },
          ],
          explanation: '“Iftar” is the evening meal after sunset when Muslims break their fast each day of Ramadan. The pre-dawn meal is “Suhoor/Sahur.”'
        },
        {
          type: "multiple-choice",
          questionText: "The Sabbath, a day of rest, is a central weekly observance in which religion?",
          answers: [
            { text: "Christianity", correct: false },
            { text: "Judaism", correct: true },
            { text: "Islam", correct: false },
            { text: "Hinduism", correct: false },
          ],
          explanation: "In Judaism, the Sabbath (Shabbat) is observed from Friday evening to Saturday evening as a day of rest and spiritual enrichment."
        },
        {
          type: "multiple-choice",
          questionText: "The 'Langar' or free community kitchen is a hallmark practice of which faith?",
          answers: [
            { text: "Jainism", correct: false },
            { text: "Hinduism", correct: false },
            { text: "Sikhism", correct: true },
            { text: "Buddhism", correct: false },
          ],
          explanation: "Langar is a tradition in Sikhism where a free, vegetarian meal is served to all visitors, regardless of their background, to emphasize equality."
        },
        {
          type: "multiple-choice",
          questionText: "How many times a day are observant Muslims required to pray?",
          answers: [
            { text: "Three times", correct: false },
            { text: "Once a week", correct: false },
            { text: "Five times", correct: true },
            { text: "Twice a day", correct: false },
          ],
          explanation: "Observant Muslims perform Salat (prayer) five times a day, facing the direction of the Kaaba in Mecca."
        },
        {
          type: "multiple-choice",
          questionText: "The act of 'puja' in Hinduism involves:",
          answers: [
            { text: "A pilgrimage to a sacred river", correct: false },
            { text: "Ritual worship and offering to a deity", correct: true },
            { text: "A month of fasting", correct: false },
            { text: "Reading from the holy book", correct: false },
          ],
          explanation: "Puja is a prayer ritual performed by Hindus to host, honour and worship one or more deities, or to spiritually celebrate an event."
        },
        {
          type: "multiple-choice",
          questionText: "Which color is traditionally avoided by many Hindus during auspicious occasions because it can be associated with mourning?",
          answers: [
            { text: "White", correct: false },
            { text: "Yellow", correct: false },
            { text: "Black", correct: true },
            { text: "Red", correct: false },
          ],
          explanation: "Black is often considered inauspicious in Hindu culture, so people tend to wear bright colors like red and yellow during festivals."
        },
        {
          type: "multiple-choice",
          questionText: "The 'Sign of the Cross' is a ritual gesture performed by members of which faith?",
          answers: [
            { text: "Judaism", correct: false },
            { text: "Islam", correct: false },
            { text: "Christianity", correct: true },
            { text: "Sikhism", correct: false },
          ],
          explanation: "The Sign of the Cross is a common practice in many branches of Christianity as a form of blessing or prayer."
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
          questionText: 'In Jewish tradition, what are men in a synagogue expected to wear on their heads?',
          answers: [
              { text: 'A yarmulke (skullcap)', correct: true },
              { text: 'A turban', correct: false },
              { text: 'A fedora', correct: false },
              { text: 'Nothing', correct: false },
          ],
          explanation: 'Jewish men customarily cover their heads with a kippah/yarmulke in the synagogue as a sign of reverence.'
        },
        {
          type: 'multiple-choice',
          questionText: 'When eating with many Indian friends in Singapore, it’s polite to:',
          answers: [
            { text: 'Use only your left hand.', correct: false },
            { text: 'Always split the bill equally.', correct: false },
            { text: 'Avoid passing salt directly.', correct: false },
            { text: 'Use the right hand when handling food or passing items.', correct: true },
          ],
          explanation: 'In many South Asian cultures, the right hand is considered clean and used for eating and interacting, while the left hand is considered unclean.'
        },
        {
          type: "multiple-choice",
          questionText: "In Buddhist temples, one should never:",
          answers: [
            { text: "Speak in a whisper.", correct: false },
            { text: "Offer flowers.", correct: false },
            { text: "Point one’s feet at a Buddha statue or another person.", correct: true },
            { text: "Remove shoes.", correct: false },
          ],
          explanation: "In many Asian cultures, the feet are considered the lowest part of the body, so one should avoid showing the soles or pointing them at others or sacred objects."
        },
        {
          type: "multiple-choice",
          questionText: "If entering a mosque in Singapore, you should:",
          answers: [
            { text: "Remove your shoes and cover your head if required", correct: true },
            { text: "Keep your hat on in respect.", correct: false },
            { text: "Bring a non-halal dish to share.", correct: false },
            { text: "Ring the prayer bell thrice.", correct: false },
          ],
          explanation: "Visitors must remove shoes and dress modestly. Women are often required to cover their heads."
        },
        {
          type: 'fill-in-the-blank',
          questionText: 'A respectful greeting in Hindu culture is ______, performed with folded palms at the chest.',
          answers: [{ text: 'Namaste', correct: true }],
          explanation: '“Namaste” (or Vanakkam in Tamil) with folded palms at the chest is a respectful Hindu greeting.'
        },
        {
          type: 'multiple-choice',
          questionText: "When gifting to a Muslim host, you should ensure the gift is:",
          answers: [
            { text: 'Wrapped in red paper', correct: false },
            { text: 'An even number of items', correct: false },
            { text: 'Halal (does not contain pork or alcohol)', correct: true },
            { text: 'Something very expensive', correct: false },
          ],
          explanation: "It is important to ensure any food items are Halal, and to avoid gifting alcohol, as they are forbidden in Islam."
        },
        {
          type: "multiple-choice",
          questionText: "In many East Asian cultures, it is considered impolite to stick your chopsticks upright in a bowl of rice because:",
          answers: [
              { text: "It is difficult for others to grab them", correct: false },
              { text: "It resembles incense sticks burned for the dead", correct: true },
              { text: "It can scratch the bowl", correct: false },
              { text: "It means you are challenging the host to a duel", correct: false },
          ],
          explanation: "This action mimics a ritual offering to the deceased and is considered a serious breach of etiquette at the dinner table."
        },
        {
          type: "multiple-choice",
          questionText: "When addressing an elder in many Asian cultures, it's common to use:",
          answers: [
            { text: "Their first name only", correct: false },
            { text: "A general honorific title like 'Uncle' or 'Auntie'", correct: true },
            { text: "A loud, commanding voice to show respect", correct: false },
            { text: "Their last name without any title", correct: false },
          ],
          explanation: "Using titles like 'Uncle' or 'Auntie' (even for non-relatives) is a common sign of respect for elders in many Asian societies, including Singapore."
        },
        {
          type: "multiple-choice",
          questionText: "Receiving a business card in Japan or Korea, what is the respectful way to accept it?",
          answers: [
            { text: "With one hand and immediately put it in your pocket", correct: false },
            { text: "With both hands and take a moment to read it", correct: true },
            { text: "Nod and have your assistant take it", correct: false },
            { text: "Write notes on it immediately", correct: false },
          ],
          explanation: "Accepting a business card with both hands and studying it for a moment shows respect for the person and their position."
        }
      ]
  },
  {
    title: "Culinary Traditions",
    slug: "culinary-traditions",
    questions: [],
  }
];

    