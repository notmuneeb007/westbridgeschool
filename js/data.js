// ===== SCHOOL DATA =====

const SCHOOL = {
  name: "Westbridge Junior & Upper School",
  tagline: "Nurturing Minds, Building Futures",
  established: 1998,
  address: "Main Road, Lahore, Pakistan",
  phone: "+92 300 1234567",
  email: "info@westbridgeschool.edu",
  logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Open_book_01.svg/240px-Open_book_01.svg.png"
};

const TEACHERS = [
  {
    id: 1,
    name: "Sir Sabir",
    subjects: ["Physics", "Computer"],
    qualification: "M.Sc Physics",
    experience: "15 Years",
    emoji: "🔬",
    description: "Sir Sabir is a dedicated Physics and Computer Science teacher with 15 years of experience. He makes complex concepts easy to understand through practical demonstrations and real-world examples. His students consistently achieve top marks in board exams.",
    reviews: [
      { name: "Ahmed R.", text: "Best physics teacher! Makes learning fun and easy.", stars: 5 },
      { name: "Fatima K.", text: "Sir Sabir's computer classes are very practical and useful.", stars: 5 },
      { name: "Usman A.", text: "He explains everything so clearly. Highly recommended!", stars: 4 }
    ]
  },
  {
    id: 2,
    name: "Sir Tahir",
    subjects: ["Urdu", "Quran"],
    qualification: "M.A Urdu",
    experience: "20 Years",
    emoji: "📖",
    description: "Sir Tahir brings 20 years of expertise in Urdu literature and Quranic studies. His deep knowledge of classical and modern Urdu poetry inspires students to appreciate the language. He also leads the school's Quran recitation program.",
    reviews: [
      { name: "Zainab M.", text: "Sir Tahir's Urdu classes are incredibly engaging.", stars: 5 },
      { name: "Hassan J.", text: "He taught me proper Quran tajweed. Very patient teacher.", stars: 5 },
      { name: "Ayesha S.", text: "I love his poetry sessions. He makes Urdu come alive!", stars: 4 }
    ]
  },
  {
    id: 3,
    name: "Ma'am Nadia",
    subjects: ["Mathematics", "Statistics"],
    qualification: "M.Sc Mathematics",
    experience: "12 Years",
    emoji: "📐",
    description: "Ma'am Nadia is a Mathematics and Statistics expert with 12 years of teaching experience. She specializes in making math enjoyable through puzzles, logic games, and step-by-step problem solving. Her students have won numerous math competitions.",
    reviews: [
      { name: "Bilal T.", text: "Math used to be hard for me until Ma'am Nadia taught me.", stars: 5 },
      { name: "Sara W.", text: "She explains every formula in a simple way.", stars: 5 },
      { name: "Ali R.", text: "Best math teacher I've ever had!", stars: 5 }
    ]
  },
  {
    id: 4,
    name: "Sir Khalid",
    subjects: ["English", "Pakistan Studies"],
    qualification: "M.A English",
    experience: "18 Years",
    emoji: "📝",
    description: "Sir Khalid is an experienced English language and Pakistan Studies teacher with 18 years in the classroom. He focuses on building strong communication skills and a deep understanding of Pakistan's history and civics.",
    reviews: [
      { name: "Hira N.", text: "Sir Khalid improved my English speaking a lot.", stars: 5 },
      { name: "Omar F.", text: "His Pakistan Studies lessons are very interesting.", stars: 4 },
      { name: "Mahnoor Z.", text: "He is very supportive and encouraging.", stars: 5 }
    ]
  },
  {
    id: 5,
    name: "Ma'am Sana",
    subjects: ["Biology", "Chemistry"],
    qualification: "M.Sc Biology",
    experience: "10 Years",
    emoji: "🧬",
    description: "Ma'am Sana teaches Biology and Chemistry with 10 years of experience. She uses lab experiments and visual aids to make science fascinating. Her students excel in both theory and practical examinations.",
    reviews: [
      { name: "Dania L.", text: "I love the lab experiments Ma'am Sana arranges!", stars: 5 },
      { name: "Rayan P.", text: "She makes biology so interesting and easy to remember.", stars: 5 },
      { name: "Iman Q.", text: "Very knowledgeable and always ready to help.", stars: 4 }
    ]
  },
  {
    id: 6,
    name: "Sir Imran",
    subjects: ["Islamiyat", "Arabic"],
    qualification: "M.A Islamiyat",
    experience: "14 Years",
    emoji: "🕌",
    description: "Sir Imran is a knowledgeable Islamiyat and Arabic teacher with 14 years of experience. He provides deep insights into Islamic teachings and helps students develop a strong foundation in Arabic grammar and Quranic understanding.",
    reviews: [
      { name: "Saad K.", text: "Sir Imran's Arabic classes are very structured and effective.", stars: 5 },
      { name: "Noor F.", text: "He explains Islamic concepts in a way that's easy to understand.", stars: 5 },
      { name: "Taha M.", text: "I learned Arabic grammar so well because of him.", stars: 4 }
    ]
  },
  {
    id: 7,
    name: "Ma'am Rabia",
    subjects: ["Art & Drawing", "Home Economics"],
    qualification: "B.Ed Fine Arts",
    experience: "8 Years",
    emoji: "🎨",
    description: "Ma'am Rabia is a creative Fine Arts and Home Economics teacher with 8 years of experience. She nurtures artistic talent in students and teaches practical life skills. Her students have won awards in inter-school art competitions.",
    reviews: [
      { name: "Laraib S.", text: "Ma'am Rabia brings out the artist in everyone!", stars: 5 },
      { name: "Huma G.", text: "Her art classes are my favorite part of the week.", stars: 5 },
      { name: "Sania R.", text: "I learned so many useful skills in Home Economics.", stars: 4 }
    ]
  },
  {
    id: 8,
    name: "Sir Waqas",
    subjects: ["Physical Education", "Health"],
    qualification: "B.P.Ed",
    experience: "6 Years",
    emoji: "⚽",
    description: "Sir Waqas is a passionate Physical Education and Health teacher with 6 years of experience. He promotes fitness, teamwork, and sportsmanship. Under his guidance, the school teams have won several district-level tournaments.",
    reviews: [
      { name: "Hamza B.", text: "Sir Waqas is the best coach! Our team won because of him.", stars: 5 },
      { name: "Fahad N.", text: "He makes fitness fun and exciting.", stars: 5 },
      { name: "Raza A.", text: "Very motivating and energetic teacher!", stars: 5 }
    ]
  }
];

const SUBJECTS = [
  { name: "Mathematics", icon: "📐", color: "#1a6b3c" },
  { name: "Physics", icon: "⚛️", color: "#0f4526" },
  { name: "Chemistry", icon: "🧪", color: "#1a6b3c" },
  { name: "Biology", icon: "🧬", color: "#0f4526" },
  { name: "Computer", icon: "💻", color: "#1a6b3c" },
  { name: "English", icon: "📝", color: "#0f4526" },
  { name: "Urdu", icon: "✒️", color: "#1a6b3c" },
  { name: "Islamiyat", icon: "🕌", color: "#0f4526" },
  { name: "Quran", icon: "📖", color: "#1a6b3c" },
  { name: "Pakistan Studies", icon: "🇵🇰", color: "#0f4526" },
  { name: "Arabic", icon: "🌙", color: "#1a6b3c" },
  { name: "Art & Drawing", icon: "🎨", color: "#0f4526" }
];

const NOTICES = [
  {
    date: "Jun 2025",
    title: "Annual Sports Day",
    text: "Annual Sports Day will be held on June 20, 2025. All students must participate."
  },
  {
    date: "Jun 2025",
    title: "Parent-Teacher Meeting",
    text: "PTM scheduled for June 15. Parents are requested to attend without fail."
  },
  {
    date: "May 2025",
    title: "Result Cards Distribution",
    text: "Second term result cards will be distributed on June 10, 2025."
  },
  {
    date: "May 2025",
    title: "Summer Vacation Notice",
    text: "School will remain closed from July 1 to July 31 for summer vacations."
  }
];
