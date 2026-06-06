import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.weakArea.deleteMany();
  await prisma.revisionPlan.deleteMany();
  await prisma.streakHistory.deleteMany();
  await prisma.testResult.deleteMany();
  await prisma.studySession.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.chatHistory.deleteMany();
  await prisma.currentAffair.deleteMany();
  await prisma.syllabus.deleteMany();
  await prisma.mockTest.deleteMany();
  await prisma.note.deleteMany();
  await prisma.studyPlan.deleteMany();
  await prisma.job.deleteMany();

  // Seed Jobs
  const jobs = [
    { title: 'UPSC Civil Services 2026', organization: 'Union Public Service Commission', category: 'UPSC', subcategory: 'Civil Services', description: 'The Civil Services Examination is a nationwide competitive examination conducted by UPSC for recruitment to various civil services of the Government of India.', eligibility: 'Graduate in any discipline from a recognized university. Age: 21-32 years.', ageLimit: '21-32 years', salary: '₹56,100 - ₹2,50,000 per month', selectionProcess: 'Preliminary Exam, Main Exam, Personality Test (Interview)', examPattern: 'Prelims: 2 papers (GS + CSAT). Mains: 9 papers (Essay, GS I-IV, Optional I-II, Language). Interview.', vacancies: 'Approximately 900-1000 vacancies annually', officialWebsite: 'https://upsc.gov.in', applyLink: 'https://upsc.gov.in/examinations/civil-services-examination', examDate: new Date('2027-06-01'), lastDate: new Date('2027-03-01'), cutoffs: 'General: 96-100 marks (Prelims), 950-980 marks (Final)', previousYearTrends: 'Increasing competition with 5-8 lakh applicants annually. Success rate ~0.1%.' },
    { title: 'SSC CGL 2026', organization: 'Staff Selection Commission', category: 'SSC', subcategory: 'CGL', description: 'Combined Graduate Level Examination for recruitment to Group B and C posts in various ministries, departments, and organizations.', eligibility: 'Bachelor\'s Degree from a recognized university. Age: 18-32 years (varies by post).', ageLimit: '18-32 years', salary: '₹25,500 - ₹1,51,100 per month', selectionProcess: 'Tier I (Computer Based), Tier II (CBE), Tier III (Descriptive), Tier IV (Skill Test/Document Verification)', examPattern: 'Tier I: 4 sections (Reasoning, GK, Quant, English). Tier II: 3 papers (Quant, English, GK/Computer).', vacancies: 'Approximately 20,000-25,000 vacancies', officialWebsite: 'https://ssc.nic.in', applyLink: 'https://ssc.nic.in/registration', examDate: new Date('2026-11-01'), lastDate: new Date('2026-08-01'), cutoffs: 'General: 140-150 marks (Tier I), 300-320 marks (Final)', previousYearTrends: '40-50 lakh applicants. Cutoffs rising 2-5% annually.' },
    { title: 'IBPS PO 2026', organization: 'Institute of Banking Personnel Selection', category: 'Banking', subcategory: 'PO', description: 'Recruitment of Probationary Officers/Management Trainees in participating public sector banks.', eligibility: 'Graduate in any discipline. Age: 20-30 years.', ageLimit: '20-30 years', salary: '₹52,000 - ₹55,000 per month (including allowances)', selectionProcess: 'Preliminary Exam, Main Exam, Interview', examPattern: 'Prelims: 3 sections (Reasoning, Quant, English). Mains: 5 sections (Reasoning, Quant, English, GA, Computer) + Descriptive.', vacancies: 'Approximately 3,000-5,000 vacancies', officialWebsite: 'https://ibps.in', applyLink: 'https://ibps.in/crp-po', examDate: new Date('2026-10-01'), lastDate: new Date('2026-07-15'), cutoffs: 'General: 40-45 marks (Prelims), 100-120 marks (Mains)', previousYearTrends: '10-15 lakh applicants. Selection ratio ~0.5%.' },
    { title: 'IBPS Clerk 2026', organization: 'Institute of Banking Personnel Selection', category: 'Banking', subcategory: 'Clerk', description: 'Recruitment of Clerical Cadre in participating public sector banks across India.', eligibility: 'Graduate in any discipline. Age: 20-28 years.', ageLimit: '20-28 years', salary: '₹20,000 - ₹28,000 per month', selectionProcess: 'Preliminary Exam, Main Exam', examPattern: 'Prelims: 3 sections (Reasoning, Quant, English). Mains: 4 sections (Reasoning, Quant, English, GA) + Computer.', vacancies: 'Approximately 5,000-8,000 vacancies', officialWebsite: 'https://ibps.in', applyLink: 'https://ibps.in/crp-clerk', examDate: new Date('2026-12-01'), lastDate: new Date('2026-09-01'), cutoffs: 'General: 35-40 marks (Prelims), 90-110 marks (Mains)', previousYearTrends: '3-5 lakh applicants. Moderate competition.' },
    { title: 'RRB NTPC 2026', organization: 'Railway Recruitment Board', category: 'Railway', subcategory: 'NTPC', description: 'Non-Technical Popular Categories recruitment for undergraduate and graduate posts in Indian Railways.', eligibility: '12th pass or Graduate depending on post. Age: 18-33 years.', ageLimit: '18-33 years', salary: '₹19,900 - ₹35,400 per month (Grade Pay based)', selectionProcess: 'Stage I CBE, Stage II CBE, Document Verification/Medical', examPattern: 'Stage I: 100 questions (GA, Math, Reasoning). Stage II: 120 questions (same subjects).', vacancies: 'Approximately 35,000-50,000 vacancies', officialWebsite: 'https://indianrailways.gov.in', applyLink: 'https://rrbcdg.gov.in', examDate: new Date('2026-09-01'), lastDate: new Date('2026-06-15'), cutoffs: 'General: 70-85 marks (Stage I), 90-110 marks (Stage II)', previousYearTrends: '1-2 crore applicants. High competition for limited seats.' },
    { title: 'RRB ALP 2026', organization: 'Railway Recruitment Board', category: 'Railway', subcategory: 'ALP', description: 'Assistant Loco Pilot recruitment for Indian Railways. Technical role with excellent career growth.', eligibility: '10th pass + ITI/Certificate in relevant trade. Age: 18-30 years.', ageLimit: '18-30 years', salary: '₹30,000 - ₹40,000 per month', selectionProcess: 'Stage I CBE, Stage II CBE, Computer Based Aptitude Test, Document Verification', examPattern: 'Stage I: 75 questions (Math, Reasoning, GA). Stage II: 100 questions (Trade-specific).', vacancies: 'Approximately 15,000-20,000 vacancies', officialWebsite: 'https://indianrailways.gov.in', applyLink: 'https://rrbcdg.gov.in', examDate: new Date('2026-08-01'), lastDate: new Date('2026-05-01'), cutoffs: 'General: 65-80 marks (Stage I), 80-100 marks (Stage II)', previousYearTrends: 'Growing demand. Good career growth opportunities.' },
    { title: 'SSC CHSL 2026', organization: 'Staff Selection Commission', category: 'SSC', subcategory: 'CHSL', description: 'Combined Higher Secondary Level Examination for 12th pass students. Recruitment of lower division clerks, post assistants, and data entry operators.', eligibility: '12th pass from recognized board. Age: 18-27 years.', ageLimit: '18-27 years', salary: '₹19,900 - ₹63,200 per month', selectionProcess: 'Tier I (CBE), Tier II (Descriptive), Document Verification', examPattern: 'Tier I: 4 sections (Reasoning, GK, Quant, English). Tier II: Essay/Letter writing.', vacancies: 'Approximately 4,000-6,000 vacancies', officialWebsite: 'https://ssc.nic.in', applyLink: 'https://ssc.nic.in', examDate: new Date('2026-07-01'), lastDate: new Date('2026-04-15'), cutoffs: 'General: 140-150 marks (Tier I)', previousYearTrends: '30-35 lakh applicants. Key exam for 12th pass students.' },
    { title: 'NDA & NA 2026', organization: 'Union Public Service Commission', category: 'Defence', subcategory: 'NDA', description: 'National Defence Academy & Naval Academy examination for admission into Army, Navy, and Air Force wings.', eligibility: '12th pass (for Army). 12th with PCM (for Navy/Air Force). Age: 16.5-19.5 years.', ageLimit: '16.5 - 19.5 years', salary: '₹56,100 - ₹1,77,500 per month (as officer)', selectionProcess: 'Written Exam, SSB Interview (5 days), Medical Examination', examPattern: 'Mathematics (300 marks), General Ability Test (600 marks) - includes English, GK, Science.', vacancies: 'Approximately 400-450 vacancies', officialWebsite: 'https://upsc.gov.in', applyLink: 'https://upsc.gov.in/examinations/nda', examDate: new Date('2026-09-01'), lastDate: new Date('2026-06-15'), cutoffs: 'Varies by service. General: 290-310 marks (total 900)', previousYearTrends: '3-4 lakh applicants. Rigorous selection process.' },
    { title: 'CDS 2026', organization: 'Union Public Service Commission', category: 'Defence', subcategory: 'CDS', description: 'Combined Defence Services examination for recruitment into IMA, INA, AFA, and OTA.', eligibility: 'Graduate from recognized university. Age: 19-25 years (varies by academy).', ageLimit: '19-25 years', salary: '₹56,100 - ₹2,50,000 per month', selectionProcess: 'Written Exam, SSB Interview, Medical Examination', examPattern: 'English, GK, Elementary Mathematics (for IMA/INA/AFA). Only English + GK for OTA.', vacancies: 'Approximately 400-500 vacancies', officialWebsite: 'https://upsc.gov.in', applyLink: 'https://upsc.gov.in/examinations/cds', examDate: new Date('2026-11-01'), lastDate: new Date('2026-08-15'), cutoffs: 'General: 150-170 marks', previousYearTrends: '1-2 lakh applicants. Excellent career in defence forces.' },
    { title: 'CTET 2026', organization: 'Central Board of Secondary Education', category: 'Teaching', subcategory: 'CTET', description: 'Central Teacher Eligibility Test for recruitment of teachers in central government schools (KVS, NVS, etc.).', eligibility: 'Graduate with B.Ed or 12th with 50% + D.El.Ed (for Primary). Graduate + B.Ed (for Elementary). Age: No upper limit.', ageLimit: 'No upper age limit', salary: '₹35,000 - ₹80,000 per month', selectionProcess: 'Written Test (Paper I for Primary, Paper II for Elementary).', examPattern: 'Paper I: 5 sections (Child Development, Language I, Language II, Math, EVS). Paper II: 4 sections + specialized subjects.', vacancies: 'Ongoing recruitment through KVS/NVS/State Governments', officialWebsite: 'https://ctet.nic.in', applyLink: 'https://ctet.nic.in', examDate: new Date('2026-07-01'), lastDate: new Date('2026-04-30'), cutoffs: 'General: 60% (90 marks out of 150) | OBC/SC/ST: 55%', previousYearTrends: 'Essential certification for teaching jobs. Multiple attempts allowed.' },
    { title: 'UGC NET 2026', organization: 'National Testing Agency', category: 'Teaching', subcategory: 'UGC NET', description: 'National Eligibility Test for determining eligibility for Assistant Professor and Junior Research Fellowship (JRF) in Indian universities and colleges.', eligibility: 'Master\'s Degree with minimum 55% marks. Age: No limit for Assistant Professor. JRF: 30 years (relaxation available).', ageLimit: 'No limit (Assistant Professor), 30 years (JRF)', salary: '₹37,400 - ₹67,000 per month (Assistant Professor)', selectionProcess: 'Computer Based Test (2 papers)', examPattern: 'Paper I: Teaching & Research Aptitude. Paper II: Subject-specific (100 questions).', vacancies: 'Ongoing qualification exam', officialWebsite: 'https://ugcnet.nta.nic.in', applyLink: 'https://ugcnet.nta.nic.in', examDate: new Date('2026-06-15'), lastDate: new Date('2026-04-01'), cutoffs: 'General: 40% (Paper I), 50% (Paper II). Aggregated: 50%', previousYearTrends: '8-10 lakh applicants. Validity: Lifetime for Assistant Professor.' },
    { title: 'SSC GD Constable 2026', organization: 'Staff Selection Commission', category: 'Police', subcategory: 'GD Constable', description: 'General Duty Constable recruitment in various CAPFs like BSF, CRPF, CISF, ITBP, SSB, and Assam Rifles.', eligibility: '10th pass from recognized board. Age: 18-23 years.', ageLimit: '18-23 years', salary: '₹21,700 - ₹69,100 per month', selectionProcess: 'CBE, Physical Efficiency Test, Physical Standard Test, Document Verification, Medical', examPattern: 'CBE: 4 sections (Reasoning, GK, Math, Hindi/English). 100 questions, 90 mins.', vacancies: 'Approximately 50,000-80,000 vacancies', officialWebsite: 'https://ssc.nic.in', applyLink: 'https://ssc.nic.in', examDate: new Date('2026-02-01'), lastDate: new Date('2025-11-15'), cutoffs: 'General: 65-75 marks', previousYearTrends: 'Massive recruitment. 1-2 crore applicants.' },
    { title: 'State PCS 2026 (Various States)', organization: 'State Public Service Commissions', category: 'State Govt', subcategory: 'PCS', description: 'Provincial Civil Services examination conducted by individual State Public Service Commissions for state administrative posts.', eligibility: 'Graduate from recognized university. Age: 21-40 years (varies by state).', ageLimit: '21-40 years (state-dependent)', salary: '₹56,100 - ₹1,77,500 per month', selectionProcess: 'Preliminary Exam, Main Exam, Interview', examPattern: 'Similar to UPSC but state-specific. Includes state history, geography, culture.', vacancies: 'Varies by state (500-2000 per state annually)', officialWebsite: 'https://uppsc.up.nic.in', applyLink: 'Varies by state PSC', examDate: new Date('2026-08-01'), lastDate: new Date('2026-05-15'), cutoffs: 'Varies by state and category', previousYearTrends: 'State-level competition increasing. Better preparation required.' },
    { title: 'AFCAT 2026', organization: 'Indian Air Force', category: 'Defence', subcategory: 'AFCAT', description: 'Air Force Common Admission Test for recruitment of officers in Flying, Technical, and Ground Duty branches.', eligibility: 'Graduate with 60% marks (50% for technical). Age: 20-26 years.', ageLimit: '20-26 years', salary: '₹56,100 - ₹2,50,000 per month', selectionProcess: 'Written Test (AFCAT), AFSB Interview (5 days), Medical', examPattern: 'AFCAT: 100 questions (GK, Math, Reasoning, English, Military).', vacancies: 'Approximately 200-300 vacancies', officialWebsite: 'https://careerindianairforce.cdac.in', applyLink: 'https://afcat.cdac.in', examDate: new Date('2026-08-01'), lastDate: new Date('2026-06-01'), cutoffs: 'General: 150-180 marks', previousYearTrends: 'Prestigious career. Competitive selection.' },
    { title: 'PSU Recruitment 2026 (GAIL, ONGC, NTPC, etc.)', organization: 'Multiple PSUs', category: 'PSU', subcategory: 'PSU', description: 'Various Public Sector Undertakings recruitment for engineering, management, and technical positions.', eligibility: 'B.E/B.Tech with GATE score or MBA (depending on post). Age: 18-30 years.', ageLimit: '18-30 years', salary: '₹60,000 - ₹2,00,000 per month (including allowances)', selectionProcess: 'GATE Score / Written Test, Group Discussion, Personal Interview', examPattern: 'GATE-based shortlisting + Interview for most PSUs.', vacancies: 'Varies by PSU (500-2000 cumulatively annually)', officialWebsite: 'https://www.psuconnect.in', applyLink: 'Varies by PSU', examDate: new Date('2026-06-01'), lastDate: new Date('2026-03-01'), cutoffs: 'GATE cutoff varies by PSU and category', previousYearTrends: 'High salary packages attract top talent. GATE scores crucial.' },
    { title: 'ESIC 2026 (Various Posts)', organization: 'Employees State Insurance Corporation', category: 'Central Govt', subcategory: 'ESIC', description: 'Various recruitment for Upper Division Clerk, Stenographer, and other posts in ESIC.', eligibility: 'Graduate from recognized university. Age: 18-27 years.', ageLimit: '18-27 years', salary: '₹25,500 - ₹81,100 per month', selectionProcess: 'CBE, Skill Test, Document Verification', examPattern: 'Reasoning, GK, Quant, English. Similar to SSC pattern.', vacancies: 'Varies (1000-2000 annually)', officialWebsite: 'https://www.esic.gov.in', applyLink: 'https://www.esic.gov.in', examDate: new Date('2026-09-01'), lastDate: new Date('2026-06-01'), cutoffs: 'General: 130-145 marks', previousYearTrends: 'Stable recruitment cycle.' },
    { title: 'Indian Navy SSR/AA 2026', organization: 'Indian Navy', category: 'Defence', subcategory: 'Navy', description: 'Senior Secondary Recruit (SSR) and Artificer Apprentice (AA) recruitment for Indian Navy.', eligibility: '12th pass with PCM (for SSR/AA). Age: 17-21 years.', ageLimit: '17-21 years', salary: '₹21,700 - ₹69,100 per month', selectionProcess: 'CBE, Physical Fitness Test, Medical Exam', examPattern: 'English, Science, Math, GK. Total 100 questions.', vacancies: 'Approximately 2,000-3,000 vacancies', officialWebsite: 'https://www.joinindiannavy.gov.in', applyLink: 'https://www.joinindiannavy.gov.in', examDate: new Date('2026-07-01'), lastDate: new Date('2026-04-30'), cutoffs: 'Varies by entry', previousYearTrends: 'Noble career with adventure and service.' },
    { title: 'Delhi Police Constable 2026', organization: 'Delhi Police', category: 'Police', subcategory: 'Constable', description: 'Recruitment of constables in Delhi Police for maintaining law and order in the national capital.', eligibility: '12th pass from recognized board. Age: 18-25 years.', ageLimit: '18-25 years', salary: '₹21,700 - ₹69,100 per month', selectionProcess: 'CBE, Physical Endurance Test, Physical Measurement, Medical, Document Verification', examPattern: '4 sections (Reasoning, GK, Math, Hindi/English). 100 marks.', vacancies: 'Approximately 5,000-10,000 vacancies', officialWebsite: 'https://delhipolice.nic.in', applyLink: 'https://delhipolice.nic.in', examDate: new Date('2026-05-01'), lastDate: new Date('2026-02-01'), cutoffs: 'General: 70-85 marks', previousYearTrends: 'High demand for Delhi Police positions.' },
    { title: 'KVS PRT/TGT/PGT 2026', organization: 'Kendriya Vidyalaya Sangathan', category: 'Teaching', subcategory: 'KVS', description: 'Recruitment of teachers (Primary, Trained Graduate, Post Graduate) for Kendriya Vidyalayas across India.', eligibility: 'Varies by post: 12th + D.El.Ed for PRT, Graduate + B.Ed for TGT, PG + B.Ed for PGT.', ageLimit: '18-40 years (varies by post)', salary: '₹35,000 - ₹80,000 per month', selectionProcess: 'CBE, Interview, Document Verification', examPattern: 'Subject-specific + Teaching Aptitude + GK', vacancies: 'Approximately 4,000-8,000 vacancies', officialWebsite: 'https://www.kvsangathan.nic.in', applyLink: 'https://www.kvsangathan.nic.in', examDate: new Date('2026-08-01'), lastDate: new Date('2026-05-01'), cutoffs: 'General: 50-60% marks', previousYearTrends: 'Prestigious teaching positions. Good for education professionals.' },
    { title: 'LIC HFL/ADO 2026', organization: 'Life Insurance Corporation of India', category: 'Banking', subcategory: 'LIC', description: 'Recruitment of Apprentice Development Officers and other specialized posts in LIC of India.', eligibility: 'Graduate from recognized university. Age: 21-30 years.', ageLimit: '21-30 years', salary: '₹35,000 - ₹60,000 per month', selectionProcess: 'Prelims, Mains, Interview', examPattern: 'Reasoning, Quant, English, GK, Insurance Awareness', vacancies: 'Approximately 5,000-8,000 vacancies', officialWebsite: 'https://www.licindia.in', applyLink: 'https://www.licindia.in', examDate: new Date('2026-10-01'), lastDate: new Date('2026-07-01'), cutoffs: 'General: 50-55% marks', previousYearTrends: 'Stable recruitment with good benefits.' },
  ];

  for (const job of jobs) {
    await prisma.job.create({ data: job });
  }

  // Seed Mock Tests
  const mockTests = [
    {
      title: 'UPSC Prelims Full Mock Test 1',
      subject: 'General Studies',
      category: 'UPSC',
      duration: 120,
      totalMarks: 200,
      totalQuestions: 100,
      isSectional: false,
      isPreviousYear: false,
      difficulty: 'hard',
      questions: generateMockQuestions('General Awareness', 50).concat(generateMockQuestions('Quantitative Aptitude', 25)).concat(generateMockQuestions('Reasoning', 25)),
    },
    {
      title: 'SSC CGL Tier I Mock Test 1',
      subject: 'General',
      category: 'SSC',
      duration: 60,
      totalMarks: 200,
      totalQuestions: 100,
      isSectional: false,
      isPreviousYear: false,
      difficulty: 'medium',
      questions: generateMockQuestions('General Awareness', 25).concat(generateMockQuestions('Quantitative Aptitude', 25)).concat(generateMockQuestions('Reasoning', 25)).concat(generateMockQuestions('English', 25)),
    },
    {
      title: 'IBPS PO Prelims Mock Test 1',
      subject: 'General',
      category: 'Banking',
      duration: 60,
      totalMarks: 100,
      totalQuestions: 100,
      isSectional: false,
      isPreviousYear: false,
      difficulty: 'medium',
      questions: generateMockQuestions('Quantitative Aptitude', 35).concat(generateMockQuestions('Reasoning', 35)).concat(generateMockQuestions('English', 30)),
    },
    {
      title: 'Quantitative Aptitude - Sectional Test',
      subject: 'Quantitative Aptitude',
      category: 'SSC',
      duration: 45,
      totalMarks: 50,
      totalQuestions: 25,
      isSectional: true,
      isPreviousYear: false,
      difficulty: 'medium',
      questions: generateMockQuestions('Quantitative Aptitude', 25),
    },
    {
      title: 'Reasoning Ability - Sectional Test',
      subject: 'Reasoning',
      category: 'Banking',
      duration: 45,
      totalMarks: 50,
      totalQuestions: 25,
      isSectional: true,
      isPreviousYear: false,
      difficulty: 'medium',
      questions: generateMockQuestions('Reasoning', 25),
    },
    {
      title: 'General Awareness - Sectional Test',
      subject: 'General Awareness',
      category: 'UPSC',
      duration: 30,
      totalMarks: 50,
      totalQuestions: 25,
      isSectional: true,
      isPreviousYear: false,
      difficulty: 'medium',
      questions: generateMockQuestions('General Awareness', 25),
    },
    {
      title: 'English Comprehension - Sectional Test',
      subject: 'English',
      category: 'SSC',
      duration: 30,
      totalMarks: 50,
      totalQuestions: 25,
      isSectional: true,
      isPreviousYear: false,
      difficulty: 'easy',
      questions: generateMockQuestions('English', 25),
    },
    {
      title: 'RRB NTPC Stage I Mock Test 1',
      subject: 'General',
      category: 'Railway',
      duration: 90,
      totalMarks: 100,
      totalQuestions: 100,
      isSectional: false,
      isPreviousYear: true,
      difficulty: 'medium',
      questions: generateMockQuestions('General Awareness', 40).concat(generateMockQuestions('Quantitative Aptitude', 30)).concat(generateMockQuestions('Reasoning', 30)),
    },
    {
      title: 'UPSC Previous Year Paper 2025',
      subject: 'General Studies',
      category: 'UPSC',
      duration: 120,
      totalMarks: 200,
      totalQuestions: 100,
      isSectional: false,
      isPreviousYear: true,
      difficulty: 'hard',
      questions: generateMockQuestions('General Awareness', 100),
    },
    {
      title: 'SSC CGL Previous Year Paper 2025',
      subject: 'General',
      category: 'SSC',
      duration: 60,
      totalMarks: 200,
      totalQuestions: 100,
      isSectional: false,
      isPreviousYear: true,
      difficulty: 'medium',
      questions: generateMockQuestions('Quantitative Aptitude', 25).concat(generateMockQuestions('General Awareness', 25)).concat(generateMockQuestions('Reasoning', 25)).concat(generateMockQuestions('English', 25)),
    },
  ];

  for (const test of mockTests) {
    await prisma.mockTest.create({ data: test });
  }

  console.log('Database seeded successfully!');
  console.log(`Created ${jobs.length} jobs`);
  console.log(`Created ${mockTests.length} mock tests`);
}

function generateMockQuestions(subject: string, count: number): any[] {
  const subjectQuestions: Record<string, { q: string; opts: string[]; ans: number }[]> = {
    'General Awareness': [
      { q: 'Which article of the Indian Constitution deals with the Right to Equality?', opts: ['Article 14', 'Article 19', 'Article 21', 'Article 32'], ans: 0 },
      { q: 'Who is known as the "Father of the Indian Constitution"?', opts: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'B.R. Ambedkar', 'Sardar Patel'], ans: 2 },
      { q: 'What is the capital of Australia?', opts: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], ans: 2 },
      { q: 'The chemical formula of water is?', opts: ['H2O', 'CO2', 'NaCl', 'H2SO4'], ans: 0 },
      { q: 'Which is the largest planet in our solar system?', opts: ['Earth', 'Mars', 'Jupiter', 'Saturn'], ans: 2 },
      { q: 'Who wrote "The Discovery of India"?', opts: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'B.R. Ambedkar', 'Rabindranath Tagore'], ans: 1 },
      { q: 'What is the currency of Japan?', opts: ['Yuan', 'Yen', 'Won', 'Dollar'], ans: 1 },
      { q: 'Which country hosted the 2024 Olympics?', opts: ['Tokyo', 'Paris', 'London', 'Beijing'], ans: 1 },
      { q: 'Where is the headquarters of ISRO located?', opts: ['New Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad'], ans: 2 },
      { q: 'Which is the longest river in India?', opts: ['Ganga', 'Yamuna', 'Godavari', 'Brahmaputra'], ans: 0 },
    ],
    'Quantitative Aptitude': [
      { q: 'What is 15% of 200?', opts: ['25', '30', '35', '20'], ans: 1 },
      { q: 'If a train travels 360 km in 6 hours, what is its speed?', opts: ['50 km/h', '60 km/h', '70 km/h', '80 km/h'], ans: 1 },
      { q: 'What is the square root of 144?', opts: ['10', '11', '12', '13'], ans: 2 },
      { q: 'What is the LCM of 12 and 18?', opts: ['24', '36', '48', '72'], ans: 1 },
      { q: 'If 3x + 5 = 20, what is x?', opts: ['3', '4', '5', '6'], ans: 2 },
      { q: 'What is the area of a circle with radius 7 cm? (π=22/7)', opts: ['144 cm²', '154 cm²', '164 cm²', '174 cm²'], ans: 1 },
      { q: 'What is the average of 10, 20, 30, 40, 50?', opts: ['25', '30', '35', '40'], ans: 1 },
      { q: 'A sum of Rs.1000 becomes Rs.1100 in 2 years. What is simple interest rate?', opts: ['3%', '5%', '7%', '10%'], ans: 1 },
      { q: 'If a:b = 2:3 and b:c = 4:5, find a:c', opts: ['8:15', '15:8', '2:5', '5:2'], ans: 0 },
      { q: 'A shopkeeper sells at 20% profit. If CP is Rs.500, what is SP?', opts: ['550', '600', '650', '700'], ans: 1 },
    ],
    'Reasoning': [
      { q: 'Find the next number: 2, 6, 18, 54, ?', opts: ['108', '162', '216', '270'], ans: 1 },
      { q: 'If ROSE is coded as 6841, how is SOUR coded?', opts: ['6418', '6841', '4186', '1468'], ans: 0 },
      { q: 'Find the odd one out: Apple, Mango, Potato, Orange', opts: ['Apple', 'Mango', 'Potato', 'Orange'], ans: 2 },
      { q: 'If Monday is coded as 1, what is 5?', opts: ['Friday', 'Thursday', 'Wednesday', 'Saturday'], ans: 0 },
      { q: 'Complete: AB, DEF, HIJK, ?', opts: ['MNOPQ', 'LMNOP', 'NOPQR', 'OPQRS'], ans: 2 },
      { q: 'Which is different? 121, 144, 169, 180', opts: ['121', '144', '169', '180'], ans: 3 },
      { q: 'What comes next? Z, X, V, T, ?', opts: ['R', 'S', 'Q', 'P'], ans: 0 },
      { q: 'In a row of 40 students, A is 15th from left. Rank from right?', opts: ['25', '26', '24', '15'], ans: 1 },
      { q: 'A is father of B. B is sister of C. C is mother of D. A is D\'s?', opts: ['Grandfather', 'Father', 'Uncle', 'Brother'], ans: 0 },
      { q: 'Statement: All cats are dogs. Some dogs are birds. Conclusion: Some cats are birds.', opts: ['True', 'False', 'Uncertain', 'None'], ans: 1 },
    ],
    'English': [
      { q: 'Choose the correct spelling:', opts: ['Accommodation', 'Acommodation', 'Accomodation', 'Acomodation'], ans: 0 },
      { q: 'Synonym of "Abundant"?', opts: ['Scarce', 'Plentiful', 'Limited', 'Rare'], ans: 1 },
      { q: 'Fill: He _____ to school every day.', opts: ['go', 'goes', 'going', 'gone'], ans: 1 },
      { q: 'Antonym of "Generous"?', opts: ['Kind', 'Selfish', 'Helpful', 'Charitable'], ans: 1 },
      { q: 'Passive voice: "She writes a letter."', opts: ['A letter is written by her', 'A letter was written by her', 'A letter has been written', 'None'], ans: 0 },
      { q: 'Meaning of "Break the ice"?', opts: ['Break something', 'Start a conversation', 'Cold weather', 'Destroy ice'], ans: 1 },
      { q: 'Correct article: _____ sun rises in the east.', opts: ['A', 'An', 'The', 'None'], ans: 2 },
      { q: '"Beautifully" is which part of speech?', opts: ['Adjective', 'Adverb', 'Verb', 'Noun'], ans: 1 },
      { q: 'Correct: "Me and my friend went to the park."', opts: ['My friend and I went to the park', 'Me and my friend went to park', 'I and my friend went', 'None'], ans: 0 },
      { q: 'Which is a compound word?', opts: ['Sunshine', 'Happiness', 'Beautiful', 'Quickly'], ans: 0 },
    ],
  };

  const questionBank = subjectQuestions[subject] || subjectQuestions['General Awareness'];
  const questions = [];
  for (let i = 0; i < count; i++) {
    const base = questionBank[i % questionBank.length];
    questions.push({
      question: base.q,
      options: base.opts,
      answer: base.ans,
      subject: subject,
      id: `q_${subject.toLowerCase().replace(/\s+/g, '_')}_${i}`,
    });
  }
  return questions;
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
