require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    console.log('Cleared existing data');

    // Create starter profile for Haris Shah's portfolio
    const user = await User.create({
      name: 'Haris Shah',
      email: 'haris@example.com',
      password: 'portfolio123',
      bio: 'Undergraduate CS student at AWKUM, learning MERN stack development and building practical web projects.',
      location: 'Peshawar, Pakistan',
      website: 'https://www.linkedin.com/in/harisshah-/',
    });
    console.log(`Created user: ${user.email}`);

    // Create starter projects from Haris Shah's GitHub repositories
    const projects = [
      {
        title: 'navttc-course',
        description: 'Training course materials and learning projects related to web development and software skills.',
        technologies: ['HTML', 'CSS', 'JavaScript'],
        category: 'web-app',
        githubUrl: 'https://github.com/harisshah133560/navttc-course',
        liveUrl: '',
        imageUrl: 'https://picsum.photos/seed/navttc/600/400',
        status: 'completed',
        featured: true,
        user: user._id,
      },
      {
        title: 'backend-course',
        description: 'Backend development practice with JavaScript-based server and API concepts.',
        technologies: ['JavaScript', 'Node.js', 'Express'],
        category: 'api',
        githubUrl: 'https://github.com/harisshah133560/backend-course',
        liveUrl: '',
        imageUrl: 'https://picsum.photos/seed/backend-course/600/400',
        status: 'in-progress',
        featured: true,
        user: user._id,
      },
      {
        title: 'FYP',
        description: 'Final year project work showcasing practical application of full-stack or web development skills.',
        technologies: ['React', 'Node.js', 'MongoDB'],
        category: 'web-app',
        githubUrl: 'https://github.com/harisshah133560/FYP',
        liveUrl: '',
        imageUrl: 'https://picsum.photos/seed/fyp/600/400',
        status: 'in-progress',
        featured: false,
        user: user._id,
      },
    ];

    await Project.insertMany(projects);
    console.log(`Created ${projects.length} projects`);

    console.log('\nSeed data created successfully!');
    console.log('Demo credentials: haris@example.com / portfolio123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();