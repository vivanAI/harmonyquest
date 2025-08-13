from app.database import engine
from app.models.models import Base, User, Lesson, TriviaChallenge, LessonType
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from typing import Dict, Any

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _generate_answer_key(content: Dict[str, Any]) -> Dict[str, Any]:
    """Generate answer key for lessons with parts structure"""
    if "parts" in content:
        # Multi-part lesson structure
        answer_key = {}
        for part_idx, part in enumerate(content["parts"]):
            part_key = f"part{part_idx + 1}"
            answer_key[part_key] = {}
            questions = part.get("questions", [])
            for i, question in enumerate(questions):
                if question.get("type") == "multiple-choice":
                    correct_index = None
                    for j, answer in enumerate(question.get("answers", [])):
                        if answer.get("correct"):
                            correct_index = j
                            break
                    answer_key[part_key][f"q{i}"] = correct_index
        return answer_key
    else:
        # Single lesson structure (fallback)
        answer_key = {}
        questions = content.get("questions", [])
    for i, question in enumerate(questions):
        if question.get("type") == "multiple-choice":
            correct_index = None
            for j, answer in enumerate(question.get("answers", [])):
                if answer.get("correct"):
                    correct_index = j
                    break
            answer_key[f"q{i}"] = correct_index
    return answer_key


def _coerce_lesson_type(t: Any) -> LessonType:
    if isinstance(t, LessonType):
        return t
    if isinstance(t, str):
        # Accept already-correct value or name
        try:
            return LessonType(t)
        except ValueError:
            return LessonType[t]
    # Fallback
    return LessonType.MCQ


def seed():
    Base.metadata.create_all(bind=engine)
    db = Session(bind=engine)

    # Seed user
    if not db.query(User).first():
        user = User(
            name="Test User",
            email="test@example.com",
            password_hash=pwd_context.hash("password123"),
            avatar="",
            xp=145,
            badges=[],
            streak_count=4,
            light_dark_mode="light",
            privacy_settings={},
        )
        db.add(user)

    # Seed lessons from frontend quiz-data
    lessons = [
        {
            "title": "Festivals of Faith",
            "topic": "Festivals",
            "type": "MCQ",
            "slug": "festivals-of-faith",
            "content": {
                "parts": [
                    {
                        "id": 1,
                        "title": "Quiz 1: Major Religious Festivals",
                        "description": "Learn about the main festivals across different religions including Buddhism, Islam, Hinduism, Christianity, Sikhism, Judaism, and Bahá'í Faith.",
            "questions": [
                {
                    "type": "multiple-choice",
                    "questionText": "Vesak Day commemorates which events in Buddhism?",
                    "answers": [
                                    {"text": "Conquest of darkness by Durga", "correct": False},
                                    {"text": "Christ's resurrection", "correct": False},
                        {"text": "Birth, enlightenment, and death of the Buddha", "correct": True},
                                    {"text": "Abraham's sacrifice", "correct": False},
                    ],
                                "explanation": "Vesak marks the Buddha's birth, enlightenment, and parinirvana. It is observed with deep reflection and compassion. In Singapore, Buddhists visit temples to make offerings and perform dana (acts of charity) like donating to the needy. Some devotees also symbolically release caged birds, representing liberation and compassion."
                },
                {
                    "type": "multiple-choice",
                                "questionText": "Eid al-Fitr in Islam marks the end of what?",
                    "answers": [
                                    {"text": "The pilgrimage to Mecca (Hajj)", "correct": False},
                                    {"text": "The month-long fasting of Ramadan", "correct": True},
                                    {"text": "The mourning period of Ashura", "correct": False},
                                    {"text": "The month of Muharram", "correct": False},
                                ],
                                "explanation": "Eid al-Fitr is the festival that marks the end of Ramadan – the month of dawn-to-dusk fasting. After a month of self-restraint, Muslims celebrate Eid al-Fitr with communal prayers, charity (zakât al-Fitr), and feasting."
                },
                {
                    "type": "multiple-choice",
                                "questionText": "Deepavali (Diwali) is celebrated as:",
                    "answers": [
                                    {"text": "A harvest festival for the rice crop", "correct": False},
                                    {"text": "The Buddhist new year", "correct": False},
                                    {"text": "A Sikh festival of sword-play", "correct": False},
                                    {"text": "A festival of lights symbolizing the triumph of good over evil", "correct": True},
                                ],
                                "explanation": "Deepavali is the Hindu Festival of Lights, celebrating the victory of light over darkness and good over evil. Homes are decorated with oil lamps (diyas) and rangoli patterns, and people share sweets and gifts. In Singapore, Deepavali is celebrated with dazzling street light-ups in Little India and homes brightly decorated to welcome prosperity."
                },
                {
                    "type": "multiple-choice",
                                "questionText": "Christmas commemorates:",
                    "answers": [
                                    {"text": "The birth of Jesus Christ", "correct": True},
                                    {"text": "A visit of the Magi to Mecca", "correct": False},
                                    {"text": "The Buddha's enlightenment", "correct": False},
                                    {"text": "The revelation of the Torah", "correct": False},
                                ],
                                "explanation": "Christmas is the Christian festival commemorating the birth of Jesus Christ. Though Christians are a minority in Singapore, Christmas is widely celebrated: Orchard Road is famous for its festive light displays, caroling events, and families exchange gifts in the Christmas spirit."
                },
                {
                    "type": "multiple-choice",
                                "questionText": "Vaisakhi (Baisakhi) is a major festival for Sikhs. What does it commemorate?",
                    "answers": [
                                    {"text": "The Buddha's first sermon at Sarnath", "correct": False},
                                    {"text": "The formation of the Khalsa (Sikh community) by Guru Gobind Singh", "correct": True},
                                    {"text": "The Prophet Muhammad's migration to Medina", "correct": False},
                                    {"text": "Moses receiving the Ten Commandments", "correct": False},
                                ],
                                "explanation": "Vaisakhi (celebrated in April) marks the birth of the Khalsa order by Guru Gobind Singh in 1699. It also coincides with spring harvest time. Sikhs observe Vaisakhi with processions, community prayers, and service (langar)."
                },
                {
                    "type": "multiple-choice",
                                "questionText": "Rosh Hashanah in Judaism is:",
                    "answers": [
                                    {"text": "The Jewish New Year, traditionally marking the creation of Adam and Eve", "correct": True},
                                    {"text": "The Jewish festival of lights in winter", "correct": False},
                                    {"text": "A harvest festival for the barley crop", "correct": False},
                                    {"text": "A fast day like Yom Kippur", "correct": False},
                                ],
                                "explanation": "Rosh Hashanah is the Jewish New Year, which tradition holds commemorates the creation of the first humans. It is celebrated with prayer services, blowing the shofar (ram's horn), and festive meals with symbolic foods like apples dipped in honey for a sweet new year."
                },
                {
                    "type": "multiple-choice",
                                "questionText": "What is Naw-Rúz in the Bahá'í Faith?",
                    "answers": [
                                    {"text": "The Bahá'í New Year, celebrated at the spring equinox", "correct": True},
                                    {"text": "A month of fasting for Bahá'ís in winter", "correct": False},
                                    {"text": "A festival commemorating the birth of Bahá'u'lláh", "correct": False},
                                    {"text": "The end of a pilgrimage to Haifa", "correct": False},
                                ],
                                "explanation": "Naw-Rúz is the Bahá'í New Year, occurring on the vernal equinox (around March 21). It follows their 19-day fast and is celebrated with joyous gatherings and prayers."
                },
                {
                    "type": "multiple-choice",
                                "questionText": "In Singapore, the Hindu festival of Thaipusam is known for:",
                    "answers": [
                                    {"text": "Devotees carrying kavadis (ornate structures) and offerings on pilgrimage", "correct": True},
                                    {"text": "Lighting thousands of oil lamps along the coast", "correct": False},
                                    {"text": "Releasing lanterns to honor ancestors", "correct": False},
                                    {"text": "Wearing dragon costumes in parades", "correct": False},
                                ],
                                "explanation": "Thaipusam is a Tamil Hindu festival honoring Lord Murugan. Devotees in Singapore carry elaborately decorated kavadis (often piercing their bodies or carrying milk pots) from Sri Srinivasa Perumal Temple to the Sri Thendayuthapani Temple. It's an act of devotion and thanks."
                },
                {
                    "type": "multiple-choice",
                                "questionText": "Which practice is common on Vesak Day in Singapore?",
                    "answers": [
                                    {"text": "Donating to the needy (dana) and visiting temples to make offerings", "correct": True},
                                    {"text": "Lighting fireworks and rockets all night", "correct": False},
                                    {"text": "Holding a morning egg hunt", "correct": False},
                                    {"text": "Gathering to beat drums at sunrise", "correct": False},
                                ],
                                "explanation": "On Vesak Day, Buddhists often visit temples to offer flowers, candles, and incense, and engage in dana (acts of charity) such as donating food, money, or blood. Many Singaporean devotees also observe a vegetarian diet for the day to honor all living beings."
                },
                {
                    "type": "multiple-choice",
                                "questionText": "How do Singaporeans commonly celebrate Deepavali?",
                    "answers": [
                                    {"text": "Little India is decorated with lights and there are street light-ups to welcome the Festival of Lights", "correct": True},
                                    {"text": "They parade dragons and burn incense in temples at dawn", "correct": False},
                                    {"text": "They set off firecrackers in the city center", "correct": False},
                                    {"text": "They fly kites on the beach at sunset", "correct": False},
                                ],
                                "explanation": "Deepavali in Singapore is marked by a \"Deepavali Light-Up\" in Little India, where streets (especially Serangoon Road) are adorned with colorful arches and lights. Homes are illuminated with oil lamps (diyas) and rangoli designs to invite good fortune."
                            }
                        ]
                    },
                    {
                        "id": 2,
                        "title": "Quiz 2: Religious Practices & Traditions",
                        "description": "Explore fasting practices, charity traditions, and cultural celebrations across different faiths.",
                        "questions": [
                            {
                                "type": "multiple-choice",
                                "questionText": "During Ramadan, what practice is obligatory for healthy adult Muslims?",
                                "answers": [
                                    {"text": "Fasting from dawn to sunset (sawm)", "correct": True},
                                    {"text": "Giving blood at a mosque", "correct": False},
                                    {"text": "Lighting candles each evening", "correct": False},
                                    {"text": "Eating only fish for the entire month", "correct": False},
                                ],
                                "explanation": "Fasting from dawn to sunset is obligatory for all adult Muslims during Ramadan. This fast (sawm) is one of the Five Pillars of Islam and is observed as a spiritual discipline. Each day starts with a pre-dawn meal (suhur) and ends with the evening meal (iftar) to break the fast."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "Eid al-Adha commemorates which event from Abrahamic tradition?",
                                "answers": [
                                    {"text": "Abraham's willingness to sacrifice his son in obedience to God", "correct": True},
                                    {"text": "Noah's Ark saving all creatures from the flood", "correct": False},
                                    {"text": "Joseph's reunion with his family in Egypt", "correct": False},
                                    {"text": "David's defeat of Goliath", "correct": False},
                                ],
                                "explanation": "Eid al-Adha honors the Prophet Abraham's obedience in being willing to sacrifice his son at God's command. In remembrance, Muslims perform animal sacrifices (qurbani) during Eid al-Adha and share the meat with family and the poor."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "Easter in Christianity celebrates:",
                                "answers": [
                                    {"text": "The birth of John the Baptist", "correct": False},
                                    {"text": "The Apostle Paul's conversion", "correct": False},
                                    {"text": "The resurrection of Jesus Christ from the dead", "correct": True},
                                    {"text": "The creation of the world", "correct": False},
                                ],
                                "explanation": "Easter is the festival celebrating Jesus Christ's resurrection on the third day after his crucifixion. It is the culmination of Lent (a 40-day fast) and is observed with church services, festive meals, and traditions like Easter eggs symbolizing new life."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "Mahavir Jayanti (Jainism) commemorates:",
                                "answers": [
                                    {"text": "The birth of Lord Mahavira, the 24th Tirthankara of Jainism", "correct": True},
                                    {"text": "The birth of Buddha under a Bodhi tree", "correct": False},
                                    {"text": "The day Lord Vishnu incarnated as Krishna", "correct": False},
                                    {"text": "The first sermon of Guru Nanak", "correct": False},
                                ],
                                "explanation": "Mahavir Jayanti celebrates the birth of Lord Mahavira, the last (24th) Tirthankara of Jainism. It is one of the most important Jain holidays, marked by temple visits, processions, and storytelling about Mahavira's life and teachings."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "In Singapore during Hari Raya Puasa (Eid al-Fitr), what is duit raya?",
                                "answers": [
                                    {"text": "Money packets given to children and elders as gifts during the festival", "correct": True},
                                    {"text": "Special lanterns lit on temple steps", "correct": False},
                                    {"text": "A sweet rice dish served at sunset", "correct": False},
                                    {"text": "Name of the Eid prayer in mosques", "correct": False},
                                ],
                                "explanation": "Duit raya (literally \"Raya money\") are green packets containing money that Malay/Muslim Singaporeans give to children and elders during Hari Raya Puasa. It is similar to the Chinese red packet tradition, meant as a token of blessings and goodwill."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "Which pair of festivals are both called \"Festivals of Lights\"?",
                                "answers": [
                                    {"text": "Deepavali (Diwali) and Hanukkah", "correct": True},
                                    {"text": "Easter and Christmas", "correct": False},
                                    {"text": "Eid al-Adha and Good Friday", "correct": False},
                                    {"text": "Ramadan and Passover", "correct": False},
                                ],
                                "explanation": "Both Deepavali (Diwali) in Hinduism and Hanukkah in Judaism are popularly known as Festivals of Lights. Diwali uses oil lamps to symbolize light over darkness, and Hanukkah uses a menorah to celebrate a miracle of light."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "In Arabic, Eid al-Fitr and Eid al-Adha literally mean:",
                                "answers": [
                                    {"text": "\"Festival of Breaking the Fast\" and \"Festival of Sacrifice\"", "correct": True},
                                    {"text": "\"Festival of Giving\" and \"Festival of Joy\"", "correct": False},
                                    {"text": "\"Festival of Freedom\" and \"Festival of Sharing\"", "correct": False},
                                    {"text": "\"Festival of New Light\" and \"Festival of Pilgrimage\"", "correct": False},
                                ],
                                "explanation": "Eid al-Fitr literally means \"Festival of Breaking the Fast,\" referring to the end of Ramadan. Eid al-Adha means \"Festival of Sacrifice,\" commemorating Abraham's sacrifice."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "In both Islam and Buddhism, giving charity during festivals is emphasized. What common value is highlighted by giving zakât at Eid al-Fitr and performing dana on Vesak?",
                                "answers": [
                                    {"text": "Compassion and support for the less fortunate", "correct": True},
                                    {"text": "Self-purification by abstaining from food", "correct": False},
                                    {"text": "Seeking personal recognition from the community", "correct": False},
                                    {"text": "Honoring political leaders", "correct": False},
                                ],
                                "explanation": "Both zakât al-Fitr and dana reflect the value of compassion and community support. Muslims give zakât (alms) on Eid to help those in need, and Buddhists perform dana as acts of kindness on Vesak. In both cases, charity is a way of caring for others and embodying religious compassion."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "Eid al-Fitr and Easter both:",
                                "answers": [
                                    {"text": "Mark the end of a period of fasting (Ramadan and Lent) with feasting and celebration", "correct": True},
                                    {"text": "Involve the sacrifice of an animal (cow or lamb)", "correct": False},
                                    {"text": "Always fall on the same date every year", "correct": False},
                                    {"text": "Are month-long festivals", "correct": False},
                                ],
                                "explanation": "Eid al-Fitr marks the end of Ramadan and Easter marks the end of Lent. Both festivals celebrate the conclusion of a period of fasting or penance, and are observed with communal prayers, feasting, and joy."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "Which of the following is a common way Singaporeans celebrate Deepavali?",
                                "answers": [
                                    {"text": "Decorating Little India with lights and illuminating homes with lamps", "correct": True},
                                    {"text": "Flying kites on the Padang", "correct": False},
                                    {"text": "Fasting all day with no food", "correct": False},
                                    {"text": "Wearing white at church", "correct": False},
                                ],
                                "explanation": "Deepavali in Singapore is marked by a spectacular street light-up in Little India. The area is lined with colorful arches and dazzling lights. Families also decorate homes with oil lamps (diyas) and rangoli patterns to welcome prosperity."
                            }
                        ]
                    },
                    {
                        "id": 3,
                        "title": "Quiz 3: Cultural Celebrations & Traditions",
                        "description": "Discover unique festivals, cultural practices, and traditions from various faiths around the world.",
                        "questions": [
                            {
                                "type": "multiple-choice",
                                "questionText": "Thai Pongal is a harvest festival celebrated by Tamil Hindus. It is dedicated to which deity?",
                                "answers": [
                                    {"text": "Surya, the Sun god", "correct": True},
                                    {"text": "Indra, the rain god", "correct": False},
                                    {"text": "Agni, the fire god", "correct": False},
                                    {"text": "Ganesh, the elephant deity", "correct": False},
                                ],
                                "explanation": "Thai Pongal is dedicated to Surya, the solar deity. The festival thanks the Sun for a good harvest and marks the start of the Sun's northward journey. Families cook sweet rice (pongal) and decorate cattle as part of the celebration."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "Guru Nanak Gurpurab (Sikhism) celebrates:",
                                "answers": [
                                    {"text": "The birth of Guru Nanak, the founder of Sikhism", "correct": True},
                                    {"text": "The day Guru Nanak compiled the Adi Granth", "correct": False},
                                    {"text": "Guru Nanak's passing into the next life", "correct": False},
                                    {"text": "The formation of the Akal Takht", "correct": False},
                                ],
                                "explanation": "Gurpurab (also known as Guru Nanak Jayanti) commemorates the birth anniversary of Guru Nanak Dev Ji, the first Sikh Guru and founder of Sikhism. Sikhs celebrate with prayer, hymn singing (kirtan), and a community meal (langar)."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "The Baha'i festival of Ridván is observed for 12 days every spring. What does it commemorate?",
                                "answers": [
                                    {"text": "Bahá'u'lláh's declaration of his mission in a garden (the founding of the Baha'i Faith)", "correct": True},
                                    {"text": "The birth of Bahá'u'lláh", "correct": False},
                                    {"text": "The completion of the first Baha'i House of Worship", "correct": False},
                                    {"text": "A pilgrimage to Jerusalem", "correct": False},
                                ],
                                "explanation": "Ridván commemorates when Bahá'u'lláh first declared his mission in a garden outside Baghdad in April 1863, effectively founding the Baha'i Faith. This 12-day festival is the holiest period in the Baha'i calendar, celebrated with prayers and community gatherings."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "Holi is a Hindu festival known as the Festival of Colors. It celebrates:",
                                "answers": [
                                    {"text": "The full moon in autumn", "correct": False},
                                    {"text": "The victory of Krishna over the demoness Holika and the arrival of spring", "correct": True},
                                    {"text": "The birth of Lord Rama", "correct": False},
                                    {"text": "The Buddha's attainment of enlightenment", "correct": False},
                                ],
                                "explanation": "Holi commemorates the legendary victory of Lord Krishna (and the burning of the demoness Holika) and the arrival of spring. People celebrate by throwing colored powders, singing, and dancing. Although not as common in Singapore, it is celebrated by Hindu communities worldwide with joy and color."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "During Eid al-Adha, many Muslims perform the qurbani sacrifice. This practice is best understood as:",
                                "answers": [
                                    {"text": "Honoring Abraham's faith by sacrificing an animal and sharing the meat with family, friends, and the poor", "correct": True},
                                    {"text": "A ritual to cleanse the body before prayer", "correct": False},
                                    {"text": "A symbolic act with no actual animal involved", "correct": False},
                                    {"text": "A regional food festival involving spices", "correct": False},
                                ],
                                "explanation": "The qurbani is the ritual sacrifice of a livestock animal at Eid al-Adha, remembering Abraham's obedience. The meat is traditionally split three ways: one part for the family, one for relatives/friends, and one for the poor, emphasizing charity and gratitude."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "Which of the following pairs of festivals BOTH involve lighting lamps or candles as a central ritual?",
                                "answers": [
                                    {"text": "Christmas (Advent wreath) and Vesak Day (temple lanterns)", "correct": False},
                                    {"text": "Eid al-Fitr and Passover", "correct": False},
                                    {"text": "Vesak Day and Diwali", "correct": True},
                                    {"text": "Easter and Rosh Hashanah", "correct": False},
                                ],
                                "explanation": "Both Vesak Day and Diwali involve lighting. On Vesak Day, Buddhists light lanterns and candles at temples to symbolize the Buddha's enlightenment. Diwali (Deepavali) is known as the Festival of Lights, where households light oil lamps and candles to symbolize light overcoming darkness."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "Which festival is celebrated by both Hindus and Sikhs in October/November each year?",
                                "answers": [
                                    {"text": "Diwali (Deepavali)", "correct": True},
                                    {"text": "Lent", "correct": False},
                                    {"text": "Ramadan", "correct": False},
                                    {"text": "Hanukkah", "correct": False},
                                ],
                                "explanation": "Diwali is observed by Hindus and Sikhs (and Jains) around the same time in autumn (usually Oct/Nov). In Sikhism, Diwali coincides with Bandi Chhor Divas, when Guru Hargobind was released from prison. For Hindus, it celebrates good over evil. Both communities light lamps and celebrate together."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "A common greeting on Ramadan and Hari Raya in Malay/Indonesian is:",
                                "answers": [
                                    {"text": "Selamat Hari Raya (\"Happy Eid\")", "correct": True},
                                    {"text": "Merry Christmas", "correct": False},
                                    {"text": "Joyeux Noël", "correct": False},
                                    {"text": "Happy Diwali", "correct": False},
                                ],
                                "explanation": "In Malay-speaking communities (including many Muslims in Singapore), \"Selamat Hari Raya\" is a common greeting during Eid al-Fitr (Hari Raya Puasa). It means \"Happy Celebration Day.\" Other greetings include Salam Ramadan for the fasting month."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "During Good Friday and Christmas in Singapore, one might see which of the following?",
                                "answers": [
                                    {"text": "Church services and nativity scenes on Christmas; solemn prayers or processions on Good Friday", "correct": True},
                                    {"text": "Animal sacrifices at temples", "correct": False},
                                    {"text": "Fasting from food and drink for three days", "correct": False},
                                    {"text": "Dragon and lion dances", "correct": False},
                                ],
                                "explanation": "Christmas is widely celebrated with church services, nativity scenes and decorations on December 25. Good Friday, two days before, is observed by Christians with solemn prayers, scripture readings, and meditations on Jesus' crucifixion."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "Which festival(s) involve(s) a special meal after sunset to break a fast?",
                                "answers": [
                                    {"text": "Ramadan (iftar) and the Christian Easter Vigil meal", "correct": True},
                                    {"text": "Christmas only", "correct": False},
                                    {"text": "Deepavali only", "correct": False},
                                    {"text": "Vesak Day only", "correct": False},
                                ],
                                "explanation": "During Ramadan, Muslims have the iftar meal to break the fast each night. In Christianity, although not a fast-breaking, Easter Vigil often includes a special meal after midnight mass. The most direct answer is Ramadan's iftar as a post-sunset feast."
                            }
                        ]
                    }
                ]
            },
            "answer_key": {
                "part1": {"q0": 2, "q1": 1, "q2": 3, "q3": 0, "q4": 1, "q5": 2, "q6": 3, "q7": 0, "q8": 1, "q9": 2},
                "part2": {"q0": 3, "q1": 2, "q2": 1, "q3": 0, "q4": 2, "q5": 1, "q6": 3, "q7": 0, "q8": 2, "q9": 1},
                "part3": {"q0": 1, "q1": 3, "q2": 0, "q3": 2, "q4": 3, "q5": 1, "q6": 2, "q7": 0, "q8": 3, "q9": 1}
            }
        },
        {
            "title": "Core Tenets & Beliefs",
            "topic": "Beliefs",
            "type": "MCQ",
            "slug": "core-tenets-beliefs",
            "content": {
                "parts": [
                    {
                        "id": 1,
                        "title": "Quiz 1: Fundamental Religious Beliefs",
                        "description": "Learn about the core teachings, principles, and beliefs that form the foundation of different world religions.",
            "questions": [
                {
                    "type": "multiple-choice",
                                "questionText": "In Buddhism, the Four Noble Truths teach about:",
                    "answers": [
                                    {"text": "How to prepare temple offerings", "correct": False},
                                    {"text": "Rules for political leadership", "correct": False},
                                    {"text": "The cause and end of suffering", "correct": True},
                                    {"text": "The creation of the world", "correct": False},
                                ],
                                "explanation": "The Four Noble Truths explain that life involves suffering, its cause is craving, it can end, and the Eightfold Path leads to that end."
                },
                {
                    "type": "multiple-choice",
                                "questionText": "In Christianity, the Trinity refers to:",
                    "answers": [
                                    {"text": "Faith, hope, and charity", "correct": False},
                                    {"text": "Father, Son, and Holy Spirit", "correct": True},
                                    {"text": "Jesus, Mary, and Joseph", "correct": False},
                                    {"text": "The Old, New, and Future Testaments", "correct": False},
                                ],
                                "explanation": "The Trinity is the belief that God exists as Father, Son, and Holy Spirit — three in one."
                },
                {
                    "type": "multiple-choice",
                                "questionText": "In Islam, the belief in one God is called:",
                    "answers": [
                                    {"text": "Jihad", "correct": False},
                                    {"text": "Salat", "correct": False},
                                    {"text": "Iman", "correct": False},
                                    {"text": "Tawhid", "correct": True},
                                ],
                                "explanation": "Tawhid is the belief in the oneness of God, central to Islam. Jihad refers to struggle or striving, not monotheism."
                },
                {
                    "type": "multiple-choice",
                                "questionText": "Hinduism teaches about dharma. This means:",
                    "answers": [
                                    {"text": "One's duty and moral responsibilities", "correct": True},
                                    {"text": "A type of prayer bead", "correct": False},
                                    {"text": "A holy river", "correct": False},
                                    {"text": "A seasonal festival", "correct": False},
                                ],
                                "explanation": "Dharma is one's duty and the right way of living according to moral law."
                },
                {
                    "type": "multiple-choice",
                                "questionText": "In Sikhism, seva means:",
                    "answers": [
                                    {"text": "Singing hymns in the temple", "correct": False},
                                    {"text": "Selfless service to others", "correct": True},
                                    {"text": "Reading the Guru Granth Sahib", "correct": False},
                                    {"text": "Offering food to the poor during Vaisakhi only", "correct": False},
                                ],
                                "explanation": "Seva is selfless service done without expecting reward."
                },
                {
                    "type": "multiple-choice",
                                "questionText": "Judaism's Ten Commandments are:",
                    "answers": [
                                    {"text": "Poems of King David", "correct": False},
                                    {"text": "Laws given to Moses", "correct": True},
                                    {"text": "The first ten chapters of the Torah", "correct": False},
                                    {"text": "Blessings for the Sabbath", "correct": False},
                                ],
                                "explanation": "The Ten Commandments are moral laws given to Moses on Mount Sinai."
                },
                {
                    "type": "multiple-choice",
                                "questionText": "Taoism's core idea of living in harmony with the Tao means:",
                    "answers": [
                                    {"text": "Following the natural way", "correct": True},
                                    {"text": "Strict fasting", "correct": False},
                                    {"text": "Worshiping many gods", "correct": False},
                                    {"text": "Always meditating indoors", "correct": False},
                                ],
                                "explanation": "Taoism teaches living simply and in balance with nature, the Tao."
                },
                {
                    "type": "multiple-choice",
                                "questionText": "In the Bahá'í Faith, the unity of humanity means:",
                    "answers": [
                                    {"text": "All must follow the same culture", "correct": False},
                                    {"text": "Only one language should be spoken", "correct": False},
                                    {"text": "All holidays should be the same", "correct": False},
                                    {"text": "All people are equal regardless of race or religion", "correct": True},
                                ],
                                "explanation": "The Bahá'í Faith teaches equality and unity of all people."
                },
                {
                    "type": "multiple-choice",
                                "questionText": "In Jainism, ahimsa means:",
                    "answers": [
                                    {"text": "Non-violence toward all living beings", "correct": True},
                                    {"text": "Prayer in the morning", "correct": False},
                                    {"text": "Eating only fruits", "correct": False},
                                    {"text": "Helping in the temple kitchen", "correct": False},
                                ],
                                "explanation": "Ahimsa is the principle of non-violence in thought, word, and action."
                },
                {
                    "type": "multiple-choice",
                                "questionText": "In Singapore, respect for all religions is encouraged through:",
                    "answers": [
                                    {"text": "Celebrating only one national festival", "correct": False},
                                    {"text": "The Maintenance of Religious Harmony Act", "correct": True},
                                    {"text": "Mandatory temple visits", "correct": False},
                                    {"text": "Praying in all languages daily", "correct": False},
                                ],
                                "explanation": "The Act helps prevent religious conflict and promotes respect."
                            }
                        ]
                    },
                    {
                        "id": 2,
                        "title": "Quiz 2: Comparative Religious Beliefs",
                        "description": "Explore how different religions compare and contrast in their core teachings and practices.",
                        "questions": [
                            {
                                "type": "multiple-choice",
                                "questionText": "Compare Buddhism and Jainism — both value ahimsa. In Jainism, this often means:",
                                "answers": [
                                    {"text": "Avoiding talking loudly", "correct": False},
                                    {"text": "Sweeping the ground before walking", "correct": True},
                                    {"text": "Wearing white clothes only", "correct": False},
                                    {"text": "Praying in silence", "correct": False},
                                ],
                                "explanation": "Many Jain monks sweep the ground to avoid harming insects."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "In Christianity and Islam, prophets are respected. Which prophet is honored in both?",
                                "answers": [
                                    {"text": "Abraham", "correct": True},
                                    {"text": "Peter", "correct": False},
                                    {"text": "Krishna", "correct": False},
                                    {"text": "Confucius", "correct": False},
                                ],
                                "explanation": "Abraham is an important figure in both Christianity and Islam."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "In Hinduism, the concept of moksha is closest to which in Buddhism?",
                                "answers": [
                                    {"text": "Zakat", "correct": False},
                                    {"text": "Nirvana", "correct": True},
                                    {"text": "Wu wei", "correct": False},
                                    {"text": "Sabbath", "correct": False},
                                ],
                                "explanation": "Moksha and Nirvana both mean liberation from the cycle of rebirth."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "In Sikhism, one core belief is equality. How is this shown in the langar?",
                                "answers": [
                                    {"text": "Only men cook the food", "correct": False},
                                    {"text": "Only Sikhs can join", "correct": False},
                                    {"text": "Everyone sits together to eat, regardless of status", "correct": True},
                                    {"text": "Guests must pay for meals", "correct": False},
                                ],
                                "explanation": "The langar is a free kitchen open to all, showing equality."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "Judaism teaches tikkun olam, which means:",
                                "answers": [
                                    {"text": "Studying the Torah daily", "correct": False},
                                    {"text": "Repairing the world through good deeds", "correct": True},
                                    {"text": "Keeping kosher", "correct": False},
                                    {"text": "Attending the synagogue weekly", "correct": False},
                                ],
                                "explanation": "It's about making the world better through moral action."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "Taoism and the Bahá'í Faith both value unity. In Taoism, unity is seen in:",
                                "answers": [
                                    {"text": "Only worshiping one god", "correct": False},
                                    {"text": "The balance of yin and yang", "correct": True},
                                    {"text": "Fasting at set times", "correct": False},
                                    {"text": "Building temples in mountains only", "correct": False},
                                ],
                                "explanation": "Yin and yang represent balance and harmony in all things."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "In Islam, the Shahada declares:",
                                "answers": [
                                    {"text": "Muhammad wrote the Qur'an himself", "correct": False},
                                    {"text": "There is no god but God, and Muhammad is His messenger", "correct": True},
                                    {"text": "Fasting is the greatest act", "correct": False},
                                    {"text": "All people must speak Arabic", "correct": False},
                                ],
                                "explanation": "The Shahada is the Islamic declaration of faith."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "In Buddhism, the concept of anatta means:",
                                "answers": [
                                    {"text": "The soul lives forever", "correct": False},
                                    {"text": "There is no permanent self", "correct": True},
                                    {"text": "All people are reincarnated", "correct": False},
                                    {"text": "Only monks can reach enlightenment", "correct": False},
                                ],
                                "explanation": "Anatta is the teaching that there's no unchanging self or soul."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "The Bahá'í teaching of independent investigation of truth means:",
                                "answers": [
                                    {"text": "Only priests can read holy books", "correct": False},
                                    {"text": "Children decide religion at age 15 without guidance", "correct": False},
                                    {"text": "People should seek truth for themselves, not just follow tradition", "correct": True},
                                    {"text": "All beliefs are equally correct without study", "correct": False},
                                ],
                                "explanation": "It encourages each person to study and decide their beliefs."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "In Singapore, why are religious harmony dialogues important?",
                                "answers": [
                                    {"text": "They decide which religion is \"best\"", "correct": False},
                                    {"text": "They help prevent misunderstandings between faith groups", "correct": True},
                                    {"text": "They are social events for food only", "correct": False},
                                    {"text": "They replace all religious festivals", "correct": False},
                                ],
                                "explanation": "Such dialogues build understanding and respect between communities."
                            }
                        ]
                    },
                    {
                        "id": 3,
                        "title": "Quiz 3: Advanced Religious Concepts",
                        "description": "Dive deeper into complex religious concepts and their practical applications in modern life.",
                        "questions": [
                            {
                                "type": "multiple-choice",
                                "questionText": "What is the concept of karma in Hinduism and Buddhism?",
                                "answers": [
                                    {"text": "Actions and their consequences", "correct": True},
                                    {"text": "A type of meditation", "correct": False},
                                    {"text": "A religious festival", "correct": False},
                                    {"text": "A sacred text", "correct": False},
                                ],
                                "explanation": "Karma refers to the law of cause and effect - our actions create consequences."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "In Christianity, what does 'grace' mean?",
                                "answers": [
                                    {"text": "A type of prayer", "correct": False},
                                    {"text": "Unmerited favor from God", "correct": True},
                                    {"text": "A religious law", "correct": False},
                                    {"text": "A church building", "correct": False},
                                ],
                                "explanation": "Grace is God's unmerited favor and love given freely to humanity."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "What is the Five Pillars of Islam?",
                                "answers": [
                                    {"text": "Five holy books", "correct": False},
                                    {"text": "Five prophets", "correct": False},
                                    {"text": "Core practices of the faith", "correct": True},
                                    {"text": "Five holy cities", "correct": False},
                                ],
                                "explanation": "The Five Pillars are the fundamental acts of worship in Islam."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "In Judaism, what is the concept of tzedakah?",
                                "answers": [
                                    {"text": "A type of prayer", "correct": False},
                                    {"text": "Charity and justice", "correct": True},
                                    {"text": "A religious holiday", "correct": False},
                                    {"text": "A sacred text", "correct": False},
                                ],
                                "explanation": "Tzedakah combines charity and justice and righteousness."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "What is the concept of ahimsa in Jainism and Hinduism?",
                                "answers": [
                                    {"text": "A type of meditation", "correct": False},
                                    {"text": "A religious ritual", "correct": False},
                                    {"text": "A sacred text", "correct": False},
                                    {"text": "Non-violence and respect for all life", "correct": True},
                                ],
                                "explanation": "Ahimsa is the principle of non-violence toward all living beings."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "In Sikhism, what is the concept of sangat?",
                                "answers": [
                                    {"text": "A type of prayer", "correct": False},
                                    {"text": "A religious text", "correct": False},
                                    {"text": "The community of believers", "correct": True},
                                    {"text": "A holy place", "correct": False},
                                ],
                                "explanation": "Sangat refers to the community of Sikhs who gather together."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "What is the concept of wu wei in Taoism?",
                                "answers": [
                                    {"text": "A type of meditation", "correct": False},
                                    {"text": "Effortless action and natural flow", "correct": True},
                                    {"text": "A religious law", "correct": False},
                                    {"text": "A sacred text", "correct": False},
                                ],
                                "explanation": "Wu wei means 'non-action' or acting in harmony with nature."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "In the Bahá'í Faith, what is progressive revelation?",
                                "answers": [
                                    {"text": "God's guidance revealed gradually through history", "correct": True},
                                    {"text": "A type of prayer", "correct": False},
                                    {"text": "A religious law", "correct": False},
                                    {"text": "A sacred text", "correct": False},
                                ],
                                "explanation": "Progressive revelation means God's guidance is revealed progressively through different messengers."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "What is the concept of dharma in Hinduism?",
                                "answers": [
                                    {"text": "A type of prayer", "correct": False},
                                    {"text": "A religious festival", "correct": False},
                                    {"text": "A sacred text", "correct": False},
                                    {"text": "Righteous duty and moral law", "correct": True},
                                ],
                                "explanation": "Dharma refers to one's duty and the right way of living."
                            },
                            {
                                "type": "multiple-choice",
                                "questionText": "In Singapore, how does the Maintenance of Religious Harmony Act work?",
                                "answers": [
                                    {"text": "It enforces one religion", "correct": False},
                                    {"text": "It bans religious practices", "correct": False},
                                    {"text": "It prevents religious conflict and promotes respect", "correct": True},
                                    {"text": "It requires religious conversion", "correct": False},
                                ],
                                "explanation": "The Act helps maintain peace and harmony between different religious communities."
                            }
                        ]
                    }
                ]
            },
            "answer_key": {
                "part1": {"q0": 2, "q1": 1, "q2": 3, "q3": 0, "q4": 1, "q5": 2, "q6": 0, "q7": 3, "q8": 0, "q9": 2},
                "part2": {"q0": 1, "q1": 0, "q2": 1, "q3": 2, "q4": 1, "q5": 1, "q6": 1, "q7": 1, "q8": 2, "q9": 1},
                "part3": {"q0": 0, "q1": 1, "q2": 2, "q3": 1, "q4": 3, "q5": 2, "q6": 1, "q7": 0, "q8": 3, "q9": 2}
            }
        },
        {
            "title": "Sacred Places",
            "topic": "Places",
            "type": "MCQ",
            "slug": "sacred-places",
            "questions": [
                {
                    "type": "multiple-choice",
                    "questionText": "What is the holiest site in Islam?",
                    "answers": [
                        {"text": "Mecca", "correct": True},
                        {"text": "Jerusalem", "correct": False},
                        {"text": "Makkah", "correct": False},
                        {"text": "Medina", "correct": False},
                    ],
                    "explanation": "Mecca is the holiest city in Islam, located in Saudi Arabia. It is the birthplace of the Prophet Muhammad and the site of the Kaaba, the most sacred building in Islam."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the holiest site in Hinduism?",
                    "answers": [
                        {"text": "Vishnu Temple, Puri", "correct": False},
                        {"text": "Golden Temple, Amritsar", "correct": False},
                        {"text": "Kailash Mansarovar", "correct": False},
                        {"text": "Tirupati", "correct": True},
                    ],
                    "explanation": "Tirupati is the holiest site in Hinduism, located in Andhra Pradesh, India. It is the abode of Lord Venkateswara, an incarnation of Lord Vishnu."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the holiest site in Buddhism?",
                    "answers": [
                        {"text": "Sarnath", "correct": False},
                        {"text": "Bodhgaya", "correct": False},
                        {"text": "Sukhothai", "correct": False},
                        {"text": "Buddha’s birthplace", "correct": True},
                    ],
                    "explanation": "Buddha’s birthplace is the holiest site in Buddhism, located in Lumbini, Nepal. It is the place where Siddhartha Gautama, the founder of Buddhism, was born."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the holiest site in Christianity?",
                    "answers": [
                        {"text": "Jerusalem", "correct": False},
                        {"text": "Rome", "correct": False},
                        {"text": "Jerusalem", "correct": False},
                        {"text": "Jerusalem", "correct": True},
                    ],
                    "explanation": "Jerusalem is the holiest site in Christianity, as it is the city where Jesus Christ was crucified, buried, and resurrected. It is also the site of the Church of the Holy Sepulcher."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the holiest site in Taoism?",
                    "answers": [
                        {"text": "Mount Tai", "correct": False},
                        {"text": "Mount Wutai", "correct": False},
                        {"text": "Mount Heng", "correct": False},
                        {"text": "Mount Penglai", "correct": True},
                    ],
                    "explanation": "Mount Penglai is the holiest site in Taoism, located in Shandong Province, China. It is a legendary island of immortality and is associated with the immortal Taoist immortals."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the holiest site in Jainism?",
                    "answers": [
                        {"text": "Ranakpur", "correct": False},
                        {"text": "Ujjain", "correct": False},
                        {"text": "Sri Lanka", "correct": False},
                        {"text": "Sri Lanka", "correct": True},
                    ],
                    "explanation": "Sri Lanka is the holiest site in Jainism, as it is the birthplace of Mahavira, the last Tirthankara (the perfect being) of Jainism."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the holiest site in Zoroastrianism?",
                    "answers": [
                        {"text": "Fire Temple, India", "correct": False},
                        {"text": "Fire Temple, Iran", "correct": True},
                        {"text": "Fire Temple, Iraq", "correct": False},
                        {"text": "Fire Temple, Turkey", "correct": False},
                    ],
                    "explanation": "Fire Temple, Iran is the holiest site in Zoroastrianism, as it is the place where the fire of Ahura Mazda is kept, symbolizing the eternal light of truth."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the holiest site in Christianity?",
                    "answers": [
                        {"text": "Jerusalem", "correct": False},
                        {"text": "Rome", "correct": False},
                        {"text": "Jerusalem", "correct": False},
                        {"text": "Jerusalem", "correct": True},
                    ],
                    "explanation": "Jerusalem is the holiest site in Christianity, as it is the city where Jesus Christ was crucified, buried, and resurrected. It is also the site of the Church of the Holy Sepulcher."
                },
            ]
        },
        {
            "title": "Daily Practices",
            "topic": "Practices",
            "type": "MCQ",
            "slug": "daily-practices",
            "questions": [
                {
                    "type": "multiple-choice",
                    "questionText": "What is the most important daily practice in Buddhism?",
                    "answers": [
                        {"text": "Meditation", "correct": True},
                        {"text": "Prayer", "correct": False},
                        {"text": "Charity", "correct": False},
                        {"text": "Fast", "correct": False},
                    ],
                    "explanation": "Meditation is the most important daily practice in Buddhism, as it is the path to enlightenment and liberation from suffering."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the most important daily practice in Hinduism?",
                    "answers": [
                        {"text": "Prayer", "correct": True},
                        {"text": "Charity", "correct": False},
                        {"text": "Fast", "correct": False},
                        {"text": "Meditation", "correct": False},
                    ],
                    "explanation": "Prayer is the most important daily practice in Hinduism, as it is the means to connect with the divine and achieve moksha."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the most important daily practice in Islam?",
                    "answers": [
                        {"text": "Prayer", "correct": True},
                        {"text": "Charity", "correct": False},
                        {"text": "Fast", "correct": False},
                        {"text": "Meditation", "correct": False},
                    ],
                    "explanation": "Prayer is the most important daily practice in Islam, as it is the means to connect with Allah and achieve closeness to Him."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the most important daily practice in Christianity?",
                    "answers": [
                        {"text": "Prayer", "correct": True},
                        {"text": "Charity", "correct": False},
                        {"text": "Fast", "correct": False},
                        {"text": "Meditation", "correct": False},
                    ],
                    "explanation": "Prayer is the most important daily practice in Christianity, as it is the means to connect with God and achieve salvation."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the most important daily practice in Taoism?",
                    "answers": [
                        {"text": "Meditation", "correct": True},
                        {"text": "Prayer", "correct": False},
                        {"text": "Charity", "correct": False},
                        {"text": "Fast", "correct": False},
                    ],
                    "explanation": "Meditation is the most important daily practice in Taoism, as it is the path to achieve harmony with the Tao and attain immortality."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the most important daily practice in Jainism?",
                    "answers": [
                        {"text": "Prayer", "correct": True},
                        {"text": "Charity", "correct": False},
                        {"text": "Fast", "correct": False},
                        {"text": "Meditation", "correct": False},
                    ],
                    "explanation": "Prayer is the most important daily practice in Jainism, as it is the means to achieve moksha by eliminating impurities."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the most important daily practice in Sikhism?",
                    "answers": [
                        {"text": "Prayer", "correct": True},
                        {"text": "Charity", "correct": False},
                        {"text": "Fast", "correct": False},
                        {"text": "Meditation", "correct": False},
                    ],
                    "explanation": "Prayer is the most important daily practice in Sikhism, as it is the means to connect with Waheguru and achieve salvation."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the most important daily practice in Judaism?",
                    "answers": [
                        {"text": "Prayer", "correct": True},
                        {"text": "Charity", "correct": False},
                        {"text": "Fast", "correct": False},
                        {"text": "Meditation", "correct": False},
                    ],
                    "explanation": "Prayer is the most important daily practice in Judaism, as it is the means to connect with God and achieve forgiveness."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the most important daily practice in Zoroastrianism?",
                    "answers": [
                        {"text": "Prayer", "correct": True},
                        {"text": "Charity", "correct": False},
                        {"text": "Fast", "correct": False},
                        {"text": "Meditation", "correct": False},
                    ],
                    "explanation": "Prayer is the most important daily practice in Zoroastrianism, as it is the means to connect with Ahura Mazda and achieve purity."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the most important daily practice in Christianity?",
                    "answers": [
                        {"text": "Prayer", "correct": True},
                        {"text": "Charity", "correct": False},
                        {"text": "Fast", "correct": False},
                        {"text": "Meditation", "correct": False},
                    ],
                    "explanation": "Prayer is the most important daily practice in Christianity, as it is the means to connect with God and achieve salvation."
                },
            ]
        },
        {
            "title": "Respectful Interactions",
            "topic": "Etiquette",
            "type": "MCQ",
            "slug": "respectful-interactions",
            "questions": [
                {
                    "type": "multiple-choice",
                    "questionText": "What is the most important aspect of respectful interaction in any religion?",
                    "answers": [
                        {"text": "Following religious rituals", "correct": False},
                        {"text": "Showing respect to all", "correct": True},
                        {"text": "Following strict rules", "correct": False},
                        {"text": "Only interacting with like-minded people", "correct": False},
                    ],
                    "explanation": "Respectful interaction is the foundation of all religious practices. It involves treating others with dignity, kindness, and understanding, regardless of their beliefs."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the most important aspect of respectful interaction in Buddhism?",
                    "answers": [
                        {"text": "Following strict rules", "correct": False},
                        {"text": "Showing respect to all", "correct": True},
                        {"text": "Only interacting with like-minded people", "correct": False},
                        {"text": "Following religious rituals", "correct": False},
                    ],
                    "explanation": "Respectful interaction in Buddhism emphasizes showing respect to all, regardless of their beliefs, and avoiding conflict or harm to others."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the most important aspect of respectful interaction in Hinduism?",
                    "answers": [
                        {"text": "Following strict rules", "correct": False},
                        {"text": "Showing respect to all", "correct": True},
                        {"text": "Only interacting with like-minded people", "correct": False},
                        {"text": "Following religious rituals", "correct": False},
                    ],
                    "explanation": "Respectful interaction in Hinduism emphasizes showing respect to all, regardless of their beliefs, and avoiding conflict or harm to others."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the most important aspect of respectful interaction in Islam?",
                    "answers": [
                        {"text": "Following strict rules", "correct": False},
                        {"text": "Showing respect to all", "correct": True},
                        {"text": "Only interacting with like-minded people", "correct": False},
                        {"text": "Following religious rituals", "correct": False},
                    ],
                    "explanation": "Respectful interaction in Islam emphasizes showing respect to all, regardless of their beliefs, and avoiding conflict or harm to others."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the most important aspect of respectful interaction in Christianity?",
                    "answers": [
                        {"text": "Following strict rules", "correct": False},
                        {"text": "Showing respect to all", "correct": True},
                        {"text": "Only interacting with like-minded people", "correct": False},
                        {"text": "Following religious rituals", "correct": False},
                    ],
                    "explanation": "Respectful interaction in Christianity emphasizes showing respect to all, regardless of their beliefs, and avoiding conflict or harm to others."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the most important aspect of respectful interaction in Taoism?",
                    "answers": [
                        {"text": "Following strict rules", "correct": False},
                        {"text": "Showing respect to all", "correct": True},
                        {"text": "Only interacting with like-minded people", "correct": False},
                        {"text": "Following religious rituals", "correct": False},
                    ],
                    "explanation": "Respectful interaction in Taoism emphasizes showing respect to all, regardless of their beliefs, and avoiding conflict or harm to others."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the most important aspect of respectful interaction in Jainism?",
                    "answers": [
                        {"text": "Following strict rules", "correct": False},
                        {"text": "Showing respect to all", "correct": True},
                        {"text": "Only interacting with like-minded people", "correct": False},
                        {"text": "Following religious rituals", "correct": False},
                    ],
                    "explanation": "Respectful interaction in Jainism emphasizes showing respect to all, regardless of their beliefs, and avoiding conflict or harm to others."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the most important aspect of respectful interaction in Sikhism?",
                    "answers": [
                        {"text": "Following strict rules", "correct": False},
                        {"text": "Showing respect to all", "correct": True},
                        {"text": "Only interacting with like-minded people", "correct": False},
                        {"text": "Following religious rituals", "correct": False},
                    ],
                    "explanation": "Respectful interaction in Sikhism emphasizes showing respect to all, regardless of their beliefs, and avoiding conflict or harm to others."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the most important aspect of respectful interaction in Judaism?",
                    "answers": [
                        {"text": "Following strict rules", "correct": False},
                        {"text": "Showing respect to all", "correct": True},
                        {"text": "Only interacting with like-minded people", "correct": False},
                        {"text": "Following religious rituals", "correct": False},
                    ],
                    "explanation": "Respectful interaction in Judaism emphasizes showing respect to all, regardless of their beliefs, and avoiding conflict or harm to others."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the most important aspect of respectful interaction in Zoroastrianism?",
                    "answers": [
                        {"text": "Following strict rules", "correct": False},
                        {"text": "Showing respect to all", "correct": True},
                        {"text": "Only interacting with like-minded people", "correct": False},
                        {"text": "Following religious rituals", "correct": False},
                    ],
                    "explanation": "Respectful interaction in Zoroastrianism emphasizes showing respect to all, regardless of their beliefs, and avoiding conflict or harm to others."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the most important aspect of respectful interaction in Christianity?",
                    "answers": [
                        {"text": "Following strict rules", "correct": False},
                        {"text": "Showing respect to all", "correct": True},
                        {"text": "Only interacting with like-minded people", "correct": False},
                        {"text": "Following religious rituals", "correct": False},
                    ],
                    "explanation": "Respectful interaction in Christianity emphasizes showing respect to all, regardless of their beliefs, and avoiding conflict or harm to others."
                },
            ]
        },
        {
            "title": "Culinary Traditions",
            "topic": "Cuisine",
            "type": "MCQ",
            "slug": "culinary-traditions",
            "questions": []
        }
    ]

    for lesson in lessons:
        # Ensure required fields
        title = lesson["title"].strip()
        slug = lesson["slug"].strip()
        topic = lesson["topic"].strip()
        lesson_type = _coerce_lesson_type(lesson["type"])
        content = lesson.get("content", {})

        # Generate answer key
        answer_key = _generate_answer_key(content)

        # Try find existing by slug, else by title
        existing = db.query(Lesson).filter(Lesson.slug == slug).first()
        if not existing:
            existing = db.query(Lesson).filter(Lesson.title == title).first()

        if existing:
            # Update in place to guarantee data presence
            existing.title = title
            existing.slug = slug
            existing.topic = topic
            existing.type = lesson_type
            existing.content = content
            existing.answer_key = answer_key
            if existing.xp_reward is None or existing.xp_reward <= 0:
                existing.xp_reward = 10
        else:
            db.add(
                Lesson(
                    title=title,
                    topic=topic,
                    type=lesson_type,
                    slug=slug,
                    content=content,
                    answer_key=answer_key,
                    xp_reward=10,
                )
            )

    # Seed trivia challenge (unchanged)
    if not db.query(TriviaChallenge).first():
        trivia = TriviaChallenge(
            week_id="2024-W01",
            theme="Cultural Basics",
            questions=[
                {
                    "q": "What is Singapore's main language?",
                    "options": ["English", "Mandarin", "Malay", "Tamil"],
                }
            ],
            correct_answers=["English"],
        )
        db.add(trivia)

    db.commit()
    db.close()


if __name__ == "__main__":
    seed() 