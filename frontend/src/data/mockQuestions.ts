export interface Question {
  id: number;
  type: 'mcq' | 'fill-blank';
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
}

export const MATH_QUESTIONS: Question[] = [
  { id: 101, type: 'mcq', prompt: 'What is 5 + 7?', options: ['10', '11', '12', '13'], correctAnswer: '12', hint: 'Count on your fingers from 5.' },
  { id: 102, type: 'mcq', prompt: 'What is 8 x 3?', options: ['24', '21', '27', '18'], correctAnswer: '24', hint: 'Think of three groups of eight.' },
  { id: 103, type: 'mcq', prompt: '100 / 4 = ?', options: ['20', '25', '50', '30'], correctAnswer: '25', hint: 'Think of a dollar split into 4 quarters.' },
  { id: 104, type: 'fill-blank', prompt: 'If you have 15 apples and eat 6, how many are left?', options: [], correctAnswer: '9', hint: '15 minus 6.' },
  { id: 105, type: 'mcq', prompt: 'What is 9 x 9?', options: ['81', '72', '90', '99'], correctAnswer: '81', hint: 'Nine groups of nine.' },
  { id: 106, type: 'mcq', prompt: 'What is 45 + 55?', options: ['90', '100', '110', '105'], correctAnswer: '100', hint: 'Add the tens, then the fives.' },
  { id: 107, type: 'fill-blank', prompt: 'What is half of 50?', options: [], correctAnswer: '25', hint: 'Divide by 2.' },
  { id: 108, type: 'mcq', prompt: 'What is 144 / 12?', options: ['10', '11', '12', '14'], correctAnswer: '12', hint: 'Think of the 12 times tables.' },
  { id: 109, type: 'mcq', prompt: 'How many degrees in a right angle?', options: ['45', '90', '180', '360'], correctAnswer: '90', hint: 'The corner of a square.' },
  { id: 110, type: 'mcq', prompt: 'What is 7 x 6?', options: ['42', '46', '36', '48'], correctAnswer: '42', hint: 'Six groups of seven.' },
  { id: 111, type: 'fill-blank', prompt: 'What is 20% of 100?', options: [], correctAnswer: '20', hint: 'Percent means per hundred.' },
  { id: 112, type: 'mcq', prompt: 'Which number is prime?', options: ['4', '6', '9', '7'], correctAnswer: '7', hint: 'Only divisible by 1 and itself.' },
  { id: 113, type: 'mcq', prompt: 'What is 3 squared?', options: ['6', '9', '12', '27'], correctAnswer: '9', hint: 'Multiply the number by itself.' },
  { id: 114, type: 'mcq', prompt: 'What is 1000 - 450?', options: ['550', '650', '450', '600'], correctAnswer: '550', hint: 'Subtract 400, then 50.' },
  { id: 115, type: 'fill-blank', prompt: 'If x = 5, what is 2x + 3?', options: [], correctAnswer: '13', hint: 'Multiply by 2, then add 3.' }
];

export const ENGLISH_QUESTIONS: Question[] = [
  { id: 201, type: 'fill-blank', prompt: 'The opposite of Hot is ___?', options: [], correctAnswer: 'Cold', hint: 'Think about ice.' },
  { id: 202, type: 'mcq', prompt: 'Which of these is a noun?', options: ['Run', 'Beautiful', 'Dog', 'Quickly'], correctAnswer: 'Dog', hint: 'A person, place, or thing.' },
  { id: 203, type: 'mcq', prompt: 'What is the past tense of "Go"?', options: ['Goes', 'Going', 'Went', 'Gone'], correctAnswer: 'Went', hint: 'Yesterday, I ___ to the store.' },
  { id: 204, type: 'fill-blank', prompt: 'A word that describes a noun is called an ___?', options: [], correctAnswer: 'Adjective', hint: 'It starts with A.' },
  { id: 205, type: 'mcq', prompt: 'Which word is a synonym for "happy"?', options: ['Sad', 'Angry', 'Joyful', 'Tired'], correctAnswer: 'Joyful', hint: 'Full of joy.' },
  { id: 206, type: 'mcq', prompt: 'What is the plural of "Child"?', options: ['Childs', 'Children', 'Childrens', 'Childes'], correctAnswer: 'Children', hint: 'It does not end with S.' },
  { id: 207, type: 'fill-blank', prompt: 'I ___ to the park tomorrow.', options: [], correctAnswer: 'will go', hint: 'Future tense of go.' },
  { id: 208, type: 'mcq', prompt: 'Which is a correctly spelled word?', options: ['Definately', 'Definitely', 'Definitly', 'Definatly'], correctAnswer: 'Definitely', hint: 'Contains the word "finite".' },
  { id: 209, type: 'mcq', prompt: 'Identify the verb: "The quick brown fox jumps."', options: ['quick', 'brown', 'fox', 'jumps'], correctAnswer: 'jumps', hint: 'An action word.' },
  { id: 210, type: 'mcq', prompt: 'Which punctuation mark ends a question?', options: ['.', ',', '!', '?'], correctAnswer: '?', hint: 'A question mark.' },
  { id: 211, type: 'fill-blank', prompt: 'What is the opposite of "Start"?', options: [], correctAnswer: 'Finish', hint: 'End or F___' },
  { id: 212, type: 'mcq', prompt: 'Which word is an adverb?', options: ['Slow', 'Slowly', 'Slowness', 'Slowed'], correctAnswer: 'Slowly', hint: 'Usually ends in -ly.' },
  { id: 213, type: 'mcq', prompt: 'Choose the correct pronoun: "___ is going to the store."', options: ['Her', 'Him', 'She', 'Us'], correctAnswer: 'She', hint: 'Subject pronoun.' },
  { id: 214, type: 'mcq', prompt: 'What is the comparative form of "big"?', options: ['Bigger', 'Biggest', 'More big', 'Most big'], correctAnswer: 'Bigger', hint: 'Comparing two things.' },
  { id: 215, type: 'fill-blank', prompt: 'A story that is not true is called ___?', options: [], correctAnswer: 'Fiction', hint: 'Starts with F.' }
];

export const SCIENCE_QUESTIONS: Question[] = [
  { id: 301, type: 'mcq', prompt: 'Which planet is known as the Red Planet?', options: ['Earth', 'Mars', 'Jupiter', 'Venus'], correctAnswer: 'Mars', hint: 'It shares its name with the Roman god of war.' },
  { id: 302, type: 'mcq', prompt: 'What is the boiling point of water?', options: ['90°C', '100°C', '120°C', '80°C'], correctAnswer: '100°C', hint: 'A nice round three-digit number.' },
  { id: 303, type: 'mcq', prompt: 'Which gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correctAnswer: 'Carbon Dioxide', hint: 'The gas we exhale.' },
  { id: 304, type: 'fill-blank', prompt: 'What is the chemical symbol for water?', options: [], correctAnswer: 'H2O', hint: 'Two Hydrogen, One Oxygen.' },
  { id: 305, type: 'mcq', prompt: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi Body'], correctAnswer: 'Mitochondria', hint: 'Produces energy.' },
  { id: 306, type: 'mcq', prompt: 'What is the hardest natural substance on Earth?', options: ['Gold', 'Iron', 'Diamond', 'Quartz'], correctAnswer: 'Diamond', hint: 'Made of pure carbon.' },
  { id: 307, type: 'fill-blank', prompt: 'The force that pulls objects toward Earth is called ___?', options: [], correctAnswer: 'Gravity', hint: 'What makes apples fall.' },
  { id: 308, type: 'mcq', prompt: 'What part of the plant conducts photosynthesis?', options: ['Roots', 'Stem', 'Leaves', 'Flowers'], correctAnswer: 'Leaves', hint: 'Usually green and flat.' },
  { id: 309, type: 'mcq', prompt: 'How many planets are in our solar system?', options: ['7', '8', '9', '10'], correctAnswer: '8', hint: 'Pluto is a dwarf planet.' },
  { id: 310, type: 'mcq', prompt: 'Which of these is a mammal?', options: ['Shark', 'Dolphin', 'Penguin', 'Crocodile'], correctAnswer: 'Dolphin', hint: 'It breathes air and gives live birth.' },
  { id: 311, type: 'fill-blank', prompt: 'Water turns into ___ when it freezes.', options: [], correctAnswer: 'Ice', hint: 'Solid water.' },
  { id: 312, type: 'mcq', prompt: 'What is the primary source of energy for Earth?', options: ['The Moon', 'The Sun', 'Geothermal', 'Wind'], correctAnswer: 'The Sun', hint: 'A star at the center of our solar system.' },
  { id: 313, type: 'mcq', prompt: 'Which organ pumps blood throughout the body?', options: ['Brain', 'Lungs', 'Heart', 'Liver'], correctAnswer: 'Heart', hint: 'It beats continuously.' },
  { id: 314, type: 'mcq', prompt: 'What kind of animal is a frog?', options: ['Reptile', 'Amphibian', 'Mammal', 'Fish'], correctAnswer: 'Amphibian', hint: 'Lives in water and on land.' },
  { id: 315, type: 'fill-blank', prompt: 'The center of an atom is called the ___?', options: [], correctAnswer: 'Nucleus', hint: 'Starts with N.' }
];

export const HISTORY_QUESTIONS: Question[] = [
  { id: 401, type: 'mcq', prompt: 'Who was the first President of the United States?', options: ['Abraham Lincoln', 'George Washington', 'Thomas Jefferson', 'John Adams'], correctAnswer: 'George Washington', hint: 'He is on the one-dollar bill.' },
  { id: 402, type: 'mcq', prompt: 'In what year did the Titanic sink?', options: ['1912', '1905', '1920', '1898'], correctAnswer: '1912', hint: 'Early 20th century.' },
  { id: 403, type: 'mcq', prompt: 'Who painted the Mona Lisa?', options: ['Vincent van Gogh', 'Leonardo da Vinci', 'Pablo Picasso', 'Claude Monet'], correctAnswer: 'Leonardo da Vinci', hint: 'An Italian Renaissance polymath.' },
  { id: 404, type: 'fill-blank', prompt: 'Which ancient civilization built the pyramids?', options: [], correctAnswer: 'Egyptians', hint: 'They lived along the Nile River.' },
  { id: 405, type: 'mcq', prompt: 'Which war ended in 1945?', options: ['World War I', 'World War II', 'Vietnam War', 'Cold War'], correctAnswer: 'World War II', hint: 'Global conflict involving the Allies and Axis.' },
  { id: 406, type: 'mcq', prompt: 'Who was the first person to walk on the moon?', options: ['Buzz Aldrin', 'Yuri Gagarin', 'Neil Armstrong', 'Michael Collins'], correctAnswer: 'Neil Armstrong', hint: '"That\'s one small step for man..."' },
  { id: 407, type: 'fill-blank', prompt: 'The Great Wall was built in which country?', options: [], correctAnswer: 'China', hint: 'Asian country.' },
  { id: 408, type: 'mcq', prompt: 'Which empire was ruled by Julius Caesar?', options: ['Greek', 'Roman', 'Ottoman', 'Persian'], correctAnswer: 'Roman', hint: 'Based in Italy.' },
  { id: 409, type: 'mcq', prompt: 'Who discovered penicillin?', options: ['Marie Curie', 'Alexander Fleming', 'Louis Pasteur', 'Isaac Newton'], correctAnswer: 'Alexander Fleming', hint: 'Discovered in 1928.' },
  { id: 410, type: 'mcq', prompt: 'What ship carried the Pilgrims to America in 1620?', options: ['Santa Maria', 'Mayflower', 'Endeavour', 'Beagle'], correctAnswer: 'Mayflower', hint: 'A flower that blooms in spring.' },
  { id: 411, type: 'fill-blank', prompt: 'The Cold War was primarily between the USA and the ___?', options: [], correctAnswer: 'Soviet Union', hint: 'USSR.' },
  { id: 412, type: 'mcq', prompt: 'Who was the Queen of Ancient Egypt known for her relationship with Mark Antony?', options: ['Nefertiti', 'Hatshepsut', 'Cleopatra', 'Isis'], correctAnswer: 'Cleopatra', hint: 'Last active ruler of the Ptolemaic Kingdom.' },
  { id: 413, type: 'mcq', prompt: 'The Declaration of Independence was signed in what year?', options: ['1776', '1789', '1812', '1492'], correctAnswer: '1776', hint: 'American Revolution era.' },
  { id: 414, type: 'mcq', prompt: 'Who wrote "Romeo and Juliet"?', options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'], correctAnswer: 'William Shakespeare', hint: 'The Bard of Avon.' },
  { id: 415, type: 'fill-blank', prompt: 'Nelson Mandela was the first black president of which country?', options: [], correctAnswer: 'South Africa', hint: 'Located at the southern tip of Africa.' }
];

const usedQuestionIds = new Set<number>();

export const getRandomQuestion = (pool: Question[]): Question => {
  let available = pool.filter(q => !usedQuestionIds.has(q.id));
  if (available.length === 0) {
    // Reset if all questions are used
    pool.forEach(q => usedQuestionIds.delete(q.id));
    available = pool;
  }
  const randomIndex = Math.floor(Math.random() * available.length);
  const selected = available[randomIndex];
  usedQuestionIds.add(selected.id);
  return selected;
};
