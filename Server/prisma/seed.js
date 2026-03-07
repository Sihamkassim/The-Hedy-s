const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('Clearing existing data...');
  await Promise.all([
    prisma.challengeProgress.deleteMany(),
    prisma.message.deleteMany(),
    prisma.appointment.deleteMany(),
    prisma.challenge.deleteMany(),
    prisma.supportResource.deleteMany(),
    prisma.therapist.deleteMany(),
    prisma.spiritualLeader.deleteMany(),
    prisma.user.deleteMany()
  ]);

  // Create Users
  console.log('Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 12);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Selamawit Tadesse',
        email: 'selam@example.com',
        password: hashedPassword,
        role: 'patient',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Hiwot Kebede',
        email: 'hiwot@example.com',
        password: hashedPassword,
        role: 'patient',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@herspace.com',
        password: hashedPassword,
        role: 'admin',
      },
    }),
  ]);

  console.log(`✓ Created ${users.length} users`);

  // Create Therapists
  console.log('Creating therapists...');
  const therapists = await Promise.all([
    prisma.therapist.create({
      data: {
        name: 'Dr. Tigist Assefa',
        email: 'tigist.assefa@herspace.com',
        specialization: 'Anxiety & Depression',
        experience: 12,
        rating: 4.9,
        sessionPrice: 1500,
        isFreeSupport: false,
        availability: ['Mon 9-5', 'Wed 9-5', 'Fri 9-3'],
        bio: 'Experienced therapist specializing in cognitive behavioral therapy for anxiety and depression. Passionate about helping Ethiopian women navigate life transitions.',
      },
    }),
    prisma.therapist.create({
      data: {
        name: 'Dr. Dawit Mekonnen',
        email: 'dawit.mekonnen@herspace.com',
        specialization: 'Trauma & PTSD',
        experience: 15,
        rating: 4.8,
        sessionPrice: 1750,
        isFreeSupport: false,
        availability: ['Tue 10-6', 'Thu 10-6', 'Sat 10-2'],
        bio: 'Specialized in trauma-focused therapy with extensive experience in EMDR and somatic approaches. Dedicated to creating safe healing spaces.',
      },
    }),
    prisma.therapist.create({
      data: {
        name: 'Dr. Bethlehem Alemu',
        email: 'bethlehem.alemu@herspace.com',
        specialization: 'Relationship & Family',
        experience: 10,
        rating: 4.7,
        sessionPrice: 1400,
        isFreeSupport: false,
        availability: ['Mon 2-8', 'Wed 2-8', 'Thu 2-8'],
        bio: 'Expert in couples therapy and Ethiopian family dynamics. Helping individuals and families build stronger, healthier relationships.',
      },
    }),
    prisma.therapist.create({
      data: {
        name: 'Dr. Kalkidan Bekele',
        email: 'kalkidan.bekele@herspace.com',
        specialization: 'Free Support Counselor',
        experience: 6,
        rating: 4.5,
        sessionPrice: 0,
        isFreeSupport: true,
        availability: ['Mon 6-9', 'Wed 6-9', 'Sat 1-5'],
        bio: 'Passionate about making mental health accessible. Offering free support sessions for those in need. Specialized in crisis intervention.',
      },
    }),
  ]);

  console.log(`✓ Created ${therapists.length} therapists`);

  // Create Spiritual Leaders
  console.log('Creating spiritual leaders...');
  const spiritualLeaders = await Promise.all([
    prisma.spiritualLeader.create({
      data: {
        name: 'Aba Yohannes',
        email: 'aba.yohannes@herspace.com',
        religion: 'Orthodox Christianity',
        specialization: 'Spiritual Counseling & Guidance',
        experience: 20,
        rating: 4.9,
        sessionPrice: 500,
        availability: ['Mon 8-12', 'Wed 8-12', 'Sat 8-12'],
        bio: 'Dedicated Ethiopian Orthodox priest offering spiritual guidance, prayer sessions, and counseling for achieving inner peace and clarity.',
      },
    }),
    prisma.spiritualLeader.create({
      data: {
        name: 'Ustaz Mohammed',
        email: 'ustaz.mohammed@herspace.com',
        religion: 'Islam',
        specialization: 'Family & Marriage Counseling',
        experience: 15,
        rating: 4.8,
        sessionPrice: 400,
        availability: ['Tue 10-2', 'Thu 10-2', 'Fri 2-5'],
        bio: 'Respected Islamic scholar focused on guiding families and individuals through life’s challenges using Islamic teachings and wisdom.',
      },
    }),
    prisma.spiritualLeader.create({
      data: {
        name: 'Pastor Daniel',
        email: 'pastor.daniel@herspace.com',
        religion: 'Protestantism',
        specialization: 'Youth & Empowerment',
        experience: 12,
        rating: 4.7,
        sessionPrice: 300,
        availability: ['Mon 2-6', 'Thu 2-6', 'Sun 2-6'],
        bio: 'Passionate Protestant pastor specializing in youth empowerment, relationship building, and offering spiritual counseling to navigate modern challenges.',
      },
    }),
  ]);

  console.log(`✓ Created ${spiritualLeaders.length} spiritual leaders`);

  // Create Challenges
  console.log('Creating wellness challenges...');
  const challenges = await Promise.all([
    prisma.challenge.create({
      data: {
        title: '30-Day Mindfulness Journey',
        description:
          'Practice daily mindfulness meditation to reduce stress and increase awareness. Each day includes a guided meditation session and reflection prompt.',
        duration: 30,
      },
    }),
    prisma.challenge.create({
      data: {
        title: '21-Day Gratitude Practice',
        description:
          'Cultivate a positive mindset by writing down three things you\'re grateful for each day. Research shows gratitude practices improve mental well-being.',
        duration: 21,
      },
    }),
    prisma.challenge.create({
      data: {
        title: '14-Day Self-Care Reset',
        description:
          'Prioritize yourself with daily self-care activities. From bubble baths to nature walks, rediscover what makes you feel refreshed and renewed.',
        duration: 14,
      },
    }),
    prisma.challenge.create({
      data: {
        title: '7-Day Digital Detox',
        description:
          'Reduce screen time and social media usage to improve sleep, focus, and mental clarity. Includes alternative activities and healthy habits.',
        duration: 7,
      },
    }),
  ]);

  console.log(`✓ Created ${challenges.length} challenges`);

  // Create Support Resources
  console.log('Creating support resources...');
  const resources = await Promise.all([
    prisma.supportResource.create({
      data: {
        name: 'Ethiopian Toll-Free Crisis Line',
        phone: '8149',
        category: 'Crisis',
      },
    }),
    prisma.supportResource.create({
      data: {
        name: 'Sefere Selam Help Center',
        phone: '+251 11 123 4567',
        category: 'Domestic Violence',
      },
    }),
    prisma.supportResource.create({
      data: {
        name: 'Fikir Women\'s Support Network',
        phone: '+251 911 00 00 00',
        category: 'Women Empowerment',
      },
    }),
    prisma.supportResource.create({
      data: {
        name: 'Addis Healing Center',
        phone: '+251 11 555 1234',
        category: 'Mental Health Counseling',
      },
    }),
  ]);

  console.log(`✓ Created ${resources.length} support resources`);

  // Create Sample Appointments
  console.log('Creating sample appointments...');
  const appointments = await Promise.all([
    prisma.appointment.create({
      data: {
        userId: users[0].id,
        therapistId: therapists[0].id,
        date: new Date('2026-03-15'),
        time: '10:00 AM',
        status: 'confirmed',
      },
    }),
    prisma.appointment.create({
      data: {
        userId: users[1].id,
        spiritualId: spiritualLeaders[0].id,
        date: new Date('2026-03-18'),
        time: '2:00 PM',
        status: 'pending',
      },
    }),
  ]);

  console.log(`✓ Created ${appointments.length} appointments`);

  // Create Challenge Progress
  console.log('Creating challenge progress...');
  const progress = await Promise.all([
    prisma.challengeProgress.create({
      data: {
        userId: users[0].id,
        challengeId: challenges[0].id,
        completedDays: 15,
        progress: 50,
      },
    }),
    prisma.challengeProgress.create({
      data: {
        userId: users[0].id,
        challengeId: challenges[1].id,
        completedDays: 21,
        progress: 100,
      },
    }),
    prisma.challengeProgress.create({
      data: {
        userId: users[1].id,
        challengeId: challenges[2].id,
        completedDays: 7,
        progress: 50,
      },
    }),
  ]);

  console.log(`✓ Created ${progress.length} challenge progress records`);

  console.log('\n✅ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - ${users.length} users`);
  console.log(`   - ${therapists.length} therapists`);
  console.log(`   - ${spiritualLeaders.length} spiritual leaders`);
  console.log(`   - ${challenges.length} challenges`);
  console.log(`   - ${resources.length} support resources`);
  console.log(`   - ${appointments.length} appointments`);
  console.log(`   - ${progress.length} challenge progress records`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
