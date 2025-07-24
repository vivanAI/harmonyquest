from app.database import engine
from app.models.models import Base, User, Lesson, TriviaChallenge
from sqlalchemy.orm import Session
from passlib.context import CryptContext

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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
            "questions": [
                {
                    "type": "multiple-choice",
                    "questionText": "Vesak Day commemorates which events in Buddhism?",
                    "answers": [
                        {"text": "Birth, enlightenment, and death of the Buddha", "correct": True},
                        {"text": "Victory of Rama over Ravana", "correct": False},
                        {"text": "Christ’s resurrection", "correct": False},
                        {"text": "Abraham’s sacrifice", "correct": False},
                    ],
                    "explanation": "Vesak marks the Buddha’s birth, enlightenment, and parinirvana. Buddhists celebrate it with lanterns, prayers, and acts of compassion.",
                },
                {
                    "type": "multiple-choice",
                    "questionText": "Eid ul-Fitr in Islam celebrates the end of:",
                    "answers": [
                        {"text": "The Hajj pilgrimage", "correct": False},
                        {"text": "Ramadan, the month of fasting", "correct": True},
                        {"text": "The Islamic New Year", "correct": False},
                        {"text": "The birth of Muhammad", "correct": False},
                    ],
                    "explanation": "Eid al-Fitr (Hari Raya Puasa) comes right after Ramadan’s fast. It’s a day of communal prayer, feasting and charity.",
                },
                {
                    "type": "multiple-choice",
                    "questionText": "Deepavali is also known as the festival of what?",
                    "answers": [
                        {"text": "Lights", "correct": True},
                        {"text": "Colors", "correct": False},
                        {"text": "Harvest", "correct": False},
                        {"text": "Brothers and Sisters", "correct": False},
                    ],
                    "explanation": "Deepavali, the Hindu festival, is known as the Festival of Lights, symbolizing the victory of light over darkness and good over evil."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "Thaipusam is a festival observed by Singaporean Hindus primarily to honor which deity?",
                    "answers": [
                        {"text": "Krishna", "correct": False},
                        {"text": "Shiva", "correct": False},
                        {"text": "Ganesha", "correct": False},
                        {"text": "Lord Murugan (Karttikeya)", "correct": True},
                    ],
                    "explanation": "Thaipusam venerates Lord Murugan (the Hindu god of war), celebrated especially by the Tamil Hindu community in Singapore."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What does the Jewish festival Yom Kippur commemorate?",
                    "answers": [
                        {"text": "The creation of the world.", "correct": False},
                        {"text": "Forgiveness and atonement (Day of Atonement)", "correct": True},
                        {"text": "Exodus from Egypt.", "correct": False},
                        {"text": "The dedication of the Second Temple.", "correct": False},
                    ],
                    "explanation": "Yom Kippur is the Jewish Day of Atonement, a solemn day of fasting and repentance."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "Vaisakhi is a major festival for which religion?",
                    "answers": [
                        {"text": "Hinduism", "correct": False},
                        {"text": "Buddhism", "correct": False},
                        {"text": "Sikhism", "correct": True},
                        {"text": "Jainism", "correct": False},
                    ],
                    "explanation": "Vaisakhi is a significant festival in Sikhism, celebrating the formation of the Khalsa panth of warriors under Guru Gobind Singh in 1699."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "Rosh Hashanah and Yom Kippur are observed by:",
                    "answers": [
                        {"text": "Buddhists", "correct": False},
                        {"text": "Jews", "correct": True},
                        {"text": "Jains", "correct": False},
                        {"text": "Sikhs", "correct": False},
                    ],
                    "explanation": "These are the Jewish High Holy Days, marking the New Year (Rosh Hashanah) and the Day of Atonement (Yom Kippur)."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "Deepavali is also celebrated by which other faith community in Singapore, though they may call it by a different name?",
                    "answers": [
                        {"text": "Buddhists", "correct": False},
                        {"text": "Sikhs (as Bandi Chhor Divas)", "correct": True},
                        {"text": "Christians", "correct": False},
                        {"text": "Taoists", "correct": False},
                    ],
                    "explanation": "Sikhs celebrate Bandi Chhor Divas at the same time as Deepavali, marking the day Guru Hargobind was freed from prison."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "Christmas celebrates the birth of Jesus Christ. Which holiday celebrates his resurrection?",
                    "answers": [
                        {"text": "Good Friday", "correct": False},
                        {"text": "Pentecost", "correct": False},
                        {"text": "Easter", "correct": True},
                        {"text": "Advent", "correct": False},
                    ],
                    "explanation": "Easter is the principal festival of Christianity, celebrating the resurrection of Jesus Christ on the third day after his crucifixion."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "The Nine Emperor Gods Festival is primarily associated with which religion in Singapore?",
                    "answers": [
                        {"text": "Buddhism", "correct": False},
                        {"text": "Hinduism", "correct": False},
                        {"text": "Taoism", "correct": True},
                        {"text": "Islam", "correct": False},
                    ],
                    "explanation": "The Nine Emperor Gods Festival is a nine-day Taoist celebration beginning on the eve of the ninth lunar month of the Chinese calendar."
                },
            ]
        },
        {
            "title": "Core Tenets & Beliefs",
            "topic": "Beliefs",
            "type": "MCQ",
            "slug": "core-tenets-beliefs",
            "questions": [
                {
                    "type": "multiple-choice",
                    "questionText": "What is the main belief of Buddhism?",
                    "answers": [
                        {"text": "The existence of a supreme deity", "correct": False},
                        {"text": "The belief in reincarnation", "correct": True},
                        {"text": "The belief in a single god", "correct": False},
                        {"text": "The belief in a single soul", "correct": False},
                    ],
                    "explanation": "Buddhism is a religion based on the teachings of Siddhartha Gautama, who taught that suffering is inherent in life and that the way to end suffering is through enlightenment."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the main belief of Hinduism?",
                    "answers": [
                        {"text": "The belief in reincarnation", "correct": True},
                        {"text": "The belief in a single god", "correct": False},
                        {"text": "The belief in a single soul", "correct": False},
                        {"text": "The belief in a supreme deity", "correct": False},
                    ],
                    "explanation": "Hinduism is a polytheistic religion with many gods and goddesses, and the belief in reincarnation (samsara) is central to its teachings."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the main belief of Islam?",
                    "answers": [
                        {"text": "The belief in reincarnation", "correct": False},
                        {"text": "The belief in a single god", "correct": True},
                        {"text": "The belief in a single soul", "correct": False},
                        {"text": "The belief in a supreme deity", "correct": False},
                    ],
                    "explanation": "Islam is a monotheistic religion that believes in one God (Allah) and the belief in a single soul (iman) is central to its teachings."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the main belief of Christianity?",
                    "answers": [
                        {"text": "The belief in reincarnation", "correct": False},
                        {"text": "The belief in a single god", "correct": False},
                        {"text": "The belief in a single soul", "correct": True},
                        {"text": "The belief in a supreme deity", "correct": False},
                    ],
                    "explanation": "Christianity is a monotheistic religion that believes in one God (Father, Son, and Holy Spirit) and the belief in a single soul (iman) is central to its teachings."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the main belief of Taoism?",
                    "answers": [
                        {"text": "The belief in reincarnation", "correct": False},
                        {"text": "The belief in a single god", "correct": False},
                        {"text": "The belief in a single soul", "correct": False},
                        {"text": "The belief in a supreme deity", "correct": True},
                    ],
                    "explanation": "Taoism is a religion based on the teachings of Lao Tzu, who taught that the universe is governed by a supreme deity (Tao) and that the goal is to return to this state of harmony."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the main belief of Jainism?",
                    "answers": [
                        {"text": "The belief in reincarnation", "correct": False},
                        {"text": "The belief in a single god", "correct": False},
                        {"text": "The belief in a single soul", "correct": True},
                        {"text": "The belief in a supreme deity", "correct": False},
                    ],
                    "explanation": "Jainism is a religion based on the teachings of Mahavira, who taught that the soul (jiva) is eternal and that the goal is to achieve moksha (liberation) by eliminating impurities."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the main belief of Sikhism?",
                    "answers": [
                        {"text": "The belief in reincarnation", "correct": False},
                        {"text": "The belief in a single god", "correct": False},
                        {"text": "The belief in a single soul", "correct": False},
                        {"text": "The belief in a supreme deity", "correct": False},
                    ],
                    "explanation": "Sikhism is a monotheistic religion that believes in one God (Waheguru) and the belief in a single soul (iman) is central to its teachings."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the main belief of Judaism?",
                    "answers": [
                        {"text": "The belief in reincarnation", "correct": False},
                        {"text": "The belief in a single god", "correct": True},
                        {"text": "The belief in a single soul", "correct": False},
                        {"text": "The belief in a supreme deity", "correct": False},
                    ],
                    "explanation": "Judaism is a monotheistic religion that believes in one God (YHWH) and the belief in a single soul (iman) is central to its teachings."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the main belief of Zoroastrianism?",
                    "answers": [
                        {"text": "The belief in reincarnation", "correct": False},
                        {"text": "The belief in a single god", "correct": True},
                        {"text": "The belief in a single soul", "correct": False},
                        {"text": "The belief in a supreme deity", "correct": False},
                    ],
                    "explanation": "Zoroastrianism is a monotheistic religion that believes in one God (Ahura Mazda) and the belief in a single soul (iman) is central to its teachings."
                },
                {
                    "type": "multiple-choice",
                    "questionText": "What is the main belief of Christianity?",
                    "answers": [
                        {"text": "The belief in reincarnation", "correct": False},
                        {"text": "The belief in a single god", "correct": False},
                        {"text": "The belief in a single soul", "correct": True},
                        {"text": "The belief in a supreme deity", "correct": False},
                    ],
                    "explanation": "Christianity is a monotheistic religion that believes in one God (Father, Son, and Holy Spirit) and the belief in a single soul (iman) is central to its teachings."
                },
            ]
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
        if not db.query(Lesson).filter_by(title=lesson["title"]).first():
            db.add(Lesson(
                title=lesson["title"],
                topic=lesson["topic"],
                type=lesson["type"],
                content={"questions": lesson["questions"]},
                answer_key={},
            xp_reward=10
            ))

    # Seed trivia challenge (unchanged)
    if not db.query(TriviaChallenge).first():
        trivia = TriviaChallenge(
            week_id="2024-W01",
            theme="Cultural Basics",
            questions=[{"q": "What is Singapore's main language?", "options": ["English", "Mandarin", "Malay", "Tamil"]}],
            correct_answers=["English"]
        )
        db.add(trivia)

    db.commit()
    db.close()

if __name__ == "__main__":
    seed() 