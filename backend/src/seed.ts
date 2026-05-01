import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from './models/User';
import { Question } from './models/Question';

dotenv.config();

const MOCK_QUESTIONS = [
  // Math (15)
  { subject: 'math', grade: 1, difficulty: 'easy', type: 'mcq', prompt: 'What is 1 + 1?', options: ['1', '2', '3', '4'], correctAnswer: '2', hint: 'Count one more after one.' },
  { subject: 'math', grade: 1, difficulty: 'easy', type: 'mcq', prompt: 'What is 5 - 2?', options: ['1', '2', '3', '4'], correctAnswer: '3', hint: 'Count back two from five.' },
  { subject: 'math', grade: 2, difficulty: 'medium', type: 'mcq', prompt: 'What is 10 + 15?', options: ['20', '25', '30', '35'], correctAnswer: '25', hint: 'Add the tens, then the ones.' },
  { subject: 'math', grade: 2, difficulty: 'medium', type: 'fill-blank', prompt: '20 - ___ = 10', correctAnswer: '10', hint: 'Half of 20 is 10.' },
  { subject: 'math', grade: 3, difficulty: 'medium', type: 'mcq', prompt: 'What is 3 x 4?', options: ['7', '12', '15', '16'], correctAnswer: '12', hint: 'Add 4 three times.' },
  { subject: 'math', grade: 3, difficulty: 'hard', type: 'mcq', prompt: 'What is 24 / 4?', options: ['4', '5', '6', '8'], correctAnswer: '6', hint: 'What times 4 equals 24?' },
  { subject: 'math', grade: 4, difficulty: 'medium', type: 'fill-blank', prompt: 'What is 5 x 5?', correctAnswer: '25', hint: 'Count by 5s five times.' },
  { subject: 'math', grade: 4, difficulty: 'hard', type: 'mcq', prompt: 'What is 100 / 10?', options: ['1', '10', '100', '1000'], correctAnswer: '10', hint: 'Remove one zero.' },
  { subject: 'math', grade: 5, difficulty: 'hard', type: 'mcq', prompt: 'What is 1/2 + 1/4?', options: ['3/4', '1/3', '2/6', '1'], correctAnswer: '3/4', hint: 'Convert 1/2 to 2/4 first.' },
  { subject: 'math', grade: 5, difficulty: 'hard', type: 'fill-blank', prompt: '10% of 100 is ___', correctAnswer: '10', hint: 'Divide by 10.' },
  { subject: 'math', grade: 1, difficulty: 'easy', type: 'fill-blank', prompt: 'What comes after 9?', correctAnswer: '10', hint: 'Two digits.' },
  { subject: 'math', grade: 2, difficulty: 'medium', type: 'mcq', prompt: 'Which is bigger?', options: ['45', '54', '44', '50'], correctAnswer: '54', hint: 'Look at the tens place.' },
  { subject: 'math', grade: 3, difficulty: 'hard', type: 'mcq', prompt: 'What is 9 x 9?', options: ['72', '81', '90', '99'], correctAnswer: '81', hint: 'One less than 90.' },
  { subject: 'math', grade: 4, difficulty: 'medium', type: 'mcq', prompt: 'What is 1/2 of 50?', options: ['20', '25', '30', '50'], correctAnswer: '25', hint: 'Divide 50 by 2.' },
  { subject: 'math', grade: 5, difficulty: 'hard', type: 'mcq', prompt: 'What is the square root of 64?', options: ['6', '7', '8', '9'], correctAnswer: '8', hint: 'What number times itself is 64?' },

  // English (15)
  { subject: 'english', grade: 1, difficulty: 'easy', type: 'fill-blank', prompt: 'The opposite of UP is ___', correctAnswer: 'down', hint: 'Look below.' },
  { subject: 'english', grade: 1, difficulty: 'easy', type: 'mcq', prompt: 'Which is a color?', options: ['Dog', 'Run', 'Blue', 'Happy'], correctAnswer: 'Blue', hint: 'The sky is this color.' },
  { subject: 'english', grade: 2, difficulty: 'medium', type: 'mcq', prompt: 'Which word is a noun?', options: ['Run', 'Apple', 'Quickly', 'Blue'], correctAnswer: 'Apple', hint: 'A person, place, or thing.' },
  { subject: 'english', grade: 2, difficulty: 'medium', type: 'fill-blank', prompt: 'Plural of Cat is ___', correctAnswer: 'cats', hint: 'Add an s.' },
  { subject: 'english', grade: 3, difficulty: 'hard', type: 'mcq', prompt: 'Which word is a verb?', options: ['Jump', 'Table', 'Beautiful', 'Slowly'], correctAnswer: 'Jump', hint: 'An action word.' },
  { subject: 'english', grade: 3, difficulty: 'medium', type: 'mcq', prompt: 'What is a synonym for happy?', options: ['Sad', 'Angry', 'Joyful', 'Tired'], correctAnswer: 'Joyful', hint: 'Means the same thing.' },
  { subject: 'english', grade: 4, difficulty: 'hard', type: 'fill-blank', prompt: 'The past tense of "run" is ___', correctAnswer: 'ran', hint: 'Rhymes with pan.' },
  { subject: 'english', grade: 4, difficulty: 'hard', type: 'mcq', prompt: 'Which is an adjective?', options: ['Boy', 'Run', 'Quickly', 'Tall'], correctAnswer: 'Tall', hint: 'A describing word.' },
  { subject: 'english', grade: 5, difficulty: 'hard', type: 'mcq', prompt: 'Which is an adverb?', options: ['Beautiful', 'Quickly', 'House', 'Sing'], correctAnswer: 'Quickly', hint: 'Usually ends in -ly.' },
  { subject: 'english', grade: 5, difficulty: 'hard', type: 'fill-blank', prompt: 'Plural of Mouse is ___', correctAnswer: 'mice', hint: 'It is an irregular plural.' },
  { subject: 'english', grade: 1, difficulty: 'easy', type: 'mcq', prompt: 'Which animal says Meow?', options: ['Dog', 'Cow', 'Cat', 'Pig'], correctAnswer: 'Cat', hint: 'It purrs.' },
  { subject: 'english', grade: 2, difficulty: 'medium', type: 'mcq', prompt: 'Which is the correct spelling?', options: ['Becuse', 'Because', 'Becuz', 'Bcause'], correctAnswer: 'Because', hint: 'B-E-C-A-U-S-E' },
  { subject: 'english', grade: 3, difficulty: 'medium', type: 'fill-blank', prompt: 'A baby dog is called a ___', correctAnswer: 'puppy', hint: 'Rhymes with guppy.' },
  { subject: 'english', grade: 4, difficulty: 'hard', type: 'mcq', prompt: 'What is the antonym of giant?', options: ['Huge', 'Tiny', 'Big', 'Large'], correctAnswer: 'Tiny', hint: 'Means very small.' },
  { subject: 'english', grade: 5, difficulty: 'hard', type: 'mcq', prompt: 'Which is a pronoun?', options: ['They', 'House', 'Run', 'Beautiful'], correctAnswer: 'They', hint: 'Takes the place of a noun.' },

  // Science (15)
  { subject: 'science', grade: 1, difficulty: 'easy', type: 'mcq', prompt: 'What do humans breathe?', options: ['Water', 'Air', 'Fire', 'Earth'], correctAnswer: 'Air', hint: 'It is all around us.' },
  { subject: 'science', grade: 1, difficulty: 'easy', type: 'fill-blank', prompt: 'The sun is a big ___', correctAnswer: 'star', hint: 'Twinkle twinkle.' },
  { subject: 'science', grade: 2, difficulty: 'medium', type: 'mcq', prompt: 'Which part of the plant absorbs water?', options: ['Leaves', 'Stem', 'Roots', 'Flower'], correctAnswer: 'Roots', hint: 'They are underground.' },
  { subject: 'science', grade: 2, difficulty: 'medium', type: 'mcq', prompt: 'What do bees make?', options: ['Milk', 'Honey', 'Water', 'Juice'], correctAnswer: 'Honey', hint: 'It is sweet and yellow.' },
  { subject: 'science', grade: 3, difficulty: 'hard', type: 'mcq', prompt: 'What is the boiling point of water (C)?', options: ['0', '50', '100', '200'], correctAnswer: '100', hint: 'One hundred degrees.' },
  { subject: 'science', grade: 3, difficulty: 'medium', type: 'fill-blank', prompt: 'Caterpillars turn into ___', correctAnswer: 'butterflies', hint: 'They have colorful wings.' },
  { subject: 'science', grade: 4, difficulty: 'hard', type: 'mcq', prompt: 'Which planet is known as the Red Planet?', options: ['Venus', 'Earth', 'Mars', 'Jupiter'], correctAnswer: 'Mars', hint: 'Named after Roman god of war.' },
  { subject: 'science', grade: 4, difficulty: 'hard', type: 'mcq', prompt: 'What gas do plants absorb?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Helium'], correctAnswer: 'Carbon Dioxide', hint: 'We breathe this out.' },
  { subject: 'science', grade: 5, difficulty: 'hard', type: 'mcq', prompt: 'What is the center of an atom called?', options: ['Proton', 'Electron', 'Nucleus', 'Neutron'], correctAnswer: 'Nucleus', hint: 'Same name as the center of a cell.' },
  { subject: 'science', grade: 5, difficulty: 'hard', type: 'fill-blank', prompt: 'H2O is the chemical formula for ___', correctAnswer: 'water', hint: 'We drink it.' },
  { subject: 'science', grade: 1, difficulty: 'easy', type: 'mcq', prompt: 'What covers the Earth?', options: ['Mostly Land', 'Mostly Water', 'All Ice', 'All Sand'], correctAnswer: 'Mostly Water', hint: 'Oceans are huge.' },
  { subject: 'science', grade: 2, difficulty: 'medium', type: 'mcq', prompt: 'What animal lives in water?', options: ['Dog', 'Cat', 'Fish', 'Bird'], correctAnswer: 'Fish', hint: 'It has gills.' },
  { subject: 'science', grade: 3, difficulty: 'hard', type: 'mcq', prompt: 'How many planets are in our solar system?', options: ['7', '8', '9', '10'], correctAnswer: '8', hint: 'Sorry Pluto.' },
  { subject: 'science', grade: 4, difficulty: 'medium', type: 'mcq', prompt: 'What is a baby frog called?', options: ['Tadpole', 'Puppy', 'Kitten', 'Cub'], correctAnswer: 'Tadpole', hint: 'It has a tail.' },
  { subject: 'science', grade: 5, difficulty: 'hard', type: 'mcq', prompt: 'What force keeps us on the ground?', options: ['Magnetism', 'Gravity', 'Friction', 'Tension'], correctAnswer: 'Gravity', hint: 'Isaac Newton and the apple.' },

  // History (15)
  { subject: 'history', grade: 1, difficulty: 'easy', type: 'mcq', prompt: 'Who was the first US President?', options: ['Lincoln', 'Washington', 'Jefferson', 'Adams'], correctAnswer: 'Washington', hint: 'He is on the dollar bill.' },
  { subject: 'history', grade: 1, difficulty: 'easy', type: 'fill-blank', prompt: 'The shape of the Egyptian tombs is a ___', correctAnswer: 'pyramid', hint: 'It is a 3D triangle.' },
  { subject: 'history', grade: 2, difficulty: 'medium', type: 'mcq', prompt: 'Who discovered America?', options: ['Columbus', 'Washington', 'Magellan', 'Cook'], correctAnswer: 'Columbus', hint: 'Sailed in 1492.' },
  { subject: 'history', grade: 2, difficulty: 'medium', type: 'mcq', prompt: 'What did the Wright Brothers invent?', options: ['Car', 'Airplane', 'Boat', 'Train'], correctAnswer: 'Airplane', hint: 'It flies.' },
  { subject: 'history', grade: 3, difficulty: 'hard', type: 'mcq', prompt: 'Who was the 16th US President?', options: ['Washington', 'Lincoln', 'Jefferson', 'Adams'], correctAnswer: 'Lincoln', hint: 'He wore a tall hat.' },
  { subject: 'history', grade: 3, difficulty: 'medium', type: 'fill-blank', prompt: 'The ancient civilization in Egypt was ruled by a ___', correctAnswer: 'pharaoh', hint: 'Starts with P.' },
  { subject: 'history', grade: 4, difficulty: 'hard', type: 'mcq', prompt: 'In what year did the Titanic sink?', options: ['1912', '1920', '1905', '1899'], correctAnswer: '1912', hint: 'Early 1900s.' },
  { subject: 'history', grade: 4, difficulty: 'hard', type: 'mcq', prompt: 'Who painted the Mona Lisa?', options: ['Van Gogh', 'Da Vinci', 'Picasso', 'Michelangelo'], correctAnswer: 'Da Vinci', hint: 'Famous Italian polymath.' },
  { subject: 'history', grade: 5, difficulty: 'hard', type: 'mcq', prompt: 'When did WWII end?', options: ['1945', '1918', '1939', '1950'], correctAnswer: '1945', hint: 'Mid 20th century.' },
  { subject: 'history', grade: 5, difficulty: 'hard', type: 'fill-blank', prompt: 'The first person on the moon was Neil ___', correctAnswer: 'Armstrong', hint: 'Strong arm.' },
  { subject: 'history', grade: 1, difficulty: 'easy', type: 'mcq', prompt: 'What colors are on the US flag?', options: ['Red, White, Blue', 'Green, Yellow, Blue', 'Black, White, Red', 'Orange, White, Green'], correctAnswer: 'Red, White, Blue', hint: 'Stars and stripes.' },
  { subject: 'history', grade: 2, difficulty: 'medium', type: 'mcq', prompt: 'Which country gifted the Statue of Liberty to the US?', options: ['Spain', 'France', 'England', 'Italy'], correctAnswer: 'France', hint: 'They speak French.' },
  { subject: 'history', grade: 3, difficulty: 'hard', type: 'mcq', prompt: 'Who was the first female pilot to fly solo across the Atlantic?', options: ['Amelia Earhart', 'Sally Ride', 'Rosa Parks', 'Marie Curie'], correctAnswer: 'Amelia Earhart', hint: 'Her last name starts with E.' },
  { subject: 'history', grade: 4, difficulty: 'medium', type: 'mcq', prompt: 'What was the civil rights leader Martin Luther King Jr.\'s famous speech?', options: ['I Have a Dream', 'Gettysburg Address', 'Give me Liberty', 'Four Score'], correctAnswer: 'I Have a Dream', hint: 'Dream.' },
  { subject: 'history', grade: 5, difficulty: 'hard', type: 'mcq', prompt: 'What ancient civilization built the Colosseum?', options: ['Greeks', 'Romans', 'Egyptians', 'Mayans'], correctAnswer: 'Romans', hint: 'In Italy.' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/elearning');
    console.log('MongoDB Connected for Seeding');

    // Clear existing data
    await User.deleteMany({});
    await Question.deleteMany({});
    
    console.log('Cleared existing users and questions');

    // Create Admin
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);
    await User.create({
      name: 'Admin User',
      email: 'admin@e-learning.com',
      passwordHash,
      role: 'admin'
    });
    console.log('Admin user created');

    // Create Teacher
    const tSalt = await bcrypt.genSalt(10);
    const tHash = await bcrypt.hash('teacher123', tSalt);
    await User.create({
      name: 'Teacher User',
      email: 'teacher@e-learning.com',
      passwordHash: tHash,
      role: 'teacher'
    });
    console.log('Teacher user created');

    // Insert Questions
    await Question.insertMany(MOCK_QUESTIONS);
    console.log(`Inserted ${MOCK_QUESTIONS.length} questions`);

    console.log('Seeding Complete! You can now login with: admin@e-learning.com / admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();
