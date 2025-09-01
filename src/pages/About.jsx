import React from 'react';

const About = () => {
  const teamMembers = [
    {
      name: 'Alex Johnson',
      role: 'Founder & CEO',
      bio: 'Passionate about sustainable trading and community building.',
      image: 'https://via.placeholder.com/150x150?text=AJ'
    },
    {
      name: 'Sarah Chen',
      role: 'CTO',
      bio: 'Tech enthusiast with 10+ years of experience in platform development.',
      image: 'https://via.placeholder.com/150x150?text=SC'
    },
    {
      name: 'Mike Rodriguez',
      role: 'Head of Community',
      bio: 'Building safe and trusted trading communities worldwide.',
      image: 'https://via.placeholder.com/150x150?text=MR'
    }
  ];

  const milestones = [
    {
      year: '2023',
      title: 'BaterX Founded',
      description: 'Started with a simple idea: make trading accessible to everyone.'
    },
    {
      year: '2024',
      title: 'Beta Launch',
      description: 'Launched our beta platform with 1,000 early adopters.'
    },
    {
      year: '2024',
      title: '10K Users',
      description: 'Reached 10,000 registered users and 5,000 successful trades.'
    },
    {
      year: '2025',
      title: 'Global Expansion',
      description: 'Expanding to serve trading communities worldwide.'
    }
  ];

  const stats = [
    { number: '25,000+', label: 'Active Users' },
    { number: '50,000+', label: 'Items Traded' },
    { number: '100+', label: 'Cities' },
    { number: '4.8/5', label: 'User Rating' }
  ];

  const features = [
    {
      icon: '🔒',
      title: 'Secure Trading',
      description: 'End-to-end secure transactions with verified user profiles and rating systems.'
    },
    {
      icon: '🌍',
      title: 'Global Community',
      description: 'Connect with traders from around the world or find local trading partners.'
    },
    {
      icon: '💡',
      title: 'Smart Matching',
      description: 'AI-powered recommendations to help you find the perfect trading opportunities.'
    },
    {
      icon: '📱',
      title: 'Mobile First',
      description: 'Designed for mobile with a responsive web interface that works everywhere.'
    },
    {
      icon: '🤝',
      title: 'Trust & Safety',
      description: 'Comprehensive verification, reporting, and dispute resolution systems.'
    },
    {
      icon: '♻️',
      title: 'Sustainable',
      description: 'Promoting circular economy by extending the life cycle of products.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About BaterX
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              The future of peer-to-peer trading is here
            </p>
            <p className="text-lg max-w-3xl mx-auto text-blue-100">
              BaterX is revolutionizing how people trade items, creating a sustainable 
              marketplace where everything has value and everyone can participate.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sustainability</h3>
              <p className="text-gray-600">
                Reducing waste by giving items a second life through trading, 
                contributing to a more sustainable future.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community</h3>
              <p className="text-gray-600">
                Building strong local and global communities where people can 
                connect, trade, and support each other.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600">
                Leveraging technology to make trading simple, safe, and 
                accessible to everyone, everywhere.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">BaterX by the Numbers</h2>
            <p className="text-blue-100">
              See the impact we're making together
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose BaterX?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We've built a platform that prioritizes security, community, and sustainability.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Journey</h2>
            <p className="text-gray-600">
              From a simple idea to a global trading community
            </p>
          </div>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {milestone.year}
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-600">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Meet Our Team</h2>
          <p className="text-gray-600">
            The passionate people behind BaterX
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {member.name}
              </h3>
              <p className="text-blue-600 font-medium mb-3">
                {member.role}
              </p>
              <p className="text-gray-600 text-sm">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-blue-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Transparency</h3>
              <p className="text-gray-600">
                We believe in open communication, clear policies, and honest dealing 
                in all our interactions with users and partners.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Trust</h3>
              <p className="text-gray-600">
                Building and maintaining trust through verified profiles, secure 
                transactions, and reliable dispute resolution.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Inclusivity</h3>
              <p className="text-gray-600">
                Creating a welcoming platform for everyone, regardless of background, 
                location, or the value of items they want to trade.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600">
                Continuously improving our platform with new features, better security, 
                and enhanced user experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Have questions, suggestions, or want to partner with us? 
            We'd love to hear from you!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">General Inquiries</h3>
              <p className="text-gray-600">hello@baterx.com</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
              <p className="text-gray-600">support@baterx.com</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Partnerships</h3>
              <p className="text-gray-600">partners@baterx.com</p>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <a
              href="/feedback"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Send Feedback
            </a>
            <a
              href="mailto:hello@baterx.com"
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
