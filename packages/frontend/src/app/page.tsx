'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import LoadingScreen from '../components/LoadingScreen';

export default function Home() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <LoadingScreen />
      <div 
        className={styles.container} 
        style={{ opacity: showContent ? 1 : 0, transition: 'opacity 0.5s' }}
      >
        {/* Navigation */}
        <nav className={styles.nav}>
        <div className={styles.navContent}>
          <div className={styles.logo}>The Source HUB</div>
          <div className={styles.navLinks}>
            <a href="#features">Features</a>
            <a href="#workspaces">Workspaces</a>
            <a href="#membership">Membership</a>
            <a href="#community">Community</a>
            <button className={styles.ctaButton}>Get Started</button>
          </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Where African Innovators
            <span className={styles.gradient}> Build Without Limits</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Reliable 24/7 power, high-speed internet, and collaborative workspace.
            No more coding by candlelight or missing deadlines due to outages.
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.primaryButton}>Start Free Trial</button>
            <button className={styles.secondaryButton}>Take a Tour</button>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <div className={styles.statNumber}>99.5%</div>
              <div className={styles.statLabel}>Power Uptime</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>50+ Mbps</div>
              <div className={styles.statLabel}>Internet Speed</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>24/7</div>
              <div className={styles.statLabel}>Access</div>
            </div>
          </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Infrastructure That Matches Your Ambition</h2>
          <p className={styles.sectionSubtitle}>
            Everything you need to build, collaborate, and scale—without the barriers
          </p>
        </div>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>24/7 Reliable Power</h3>
            <p>Never lose work to power outages. Automatic failover keeps you running with 99.5% uptime guarantee.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🚀</div>
            <h3>High-Speed Internet</h3>
            <p>50+ Mbps dedicated bandwidth with automatic failover. Stream, deploy, and collaborate without lag.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💼</div>
            <h3>Flexible Workspaces</h3>
            <p>From hot desks to private offices. Book hourly, daily, or monthly—whatever fits your workflow.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎓</div>
            <h3>Learn & Grow</h3>
            <p>Monthly workshops, mentorship sessions, and technical training to level up your skills.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🤝</div>
            <h3>Community Network</h3>
            <p>Connect with developers, designers, and founders. Find collaborators, partners, and opportunities.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎬</div>
            <h3>Content Studios</h3>
            <p>Professional recording studios and production equipment for creating high-quality content.</p>
          </div>
          </div>
        </section>

        {/* Workspaces Section */}
        <section id="workspaces" className={styles.workspaces}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Spaces Designed for Creation</h2>
          <p className={styles.sectionSubtitle}>
            Professional environments for every type of work
          </p>
        </div>
        <div className={styles.workspaceGrid}>
          <div className={styles.workspaceCard}>
            <div className={styles.workspaceImage}>
              <div className={styles.workspacePlaceholder}>🖥️</div>
            </div>
            <div className={styles.workspaceContent}>
              <h3>Hot Desks</h3>
              <p>Flexible seating in collaborative spaces. Perfect for freelancers and remote workers.</p>
              <div className={styles.workspacePrice}>From $5/hour</div>
            </div>
          </div>
          <div className={styles.workspaceCard}>
            <div className={styles.workspaceImage}>
              <div className={styles.workspacePlaceholder}>👥</div>
            </div>
            <div className={styles.workspaceContent}>
              <h3>Meeting Rooms</h3>
              <p>Professional spaces for 4-20 people with presentation equipment and whiteboards.</p>
              <div className={styles.workspacePrice}>From $15/hour</div>
            </div>
          </div>
          <div className={styles.workspaceCard}>
            <div className={styles.workspaceImage}>
              <div className={styles.workspacePlaceholder}>🏢</div>
            </div>
            <div className={styles.workspaceContent}>
              <h3>Private Offices</h3>
              <p>Dedicated spaces for teams. Lockable, customizable, and always available.</p>
              <div className={styles.workspacePrice}>From $200/month</div>
            </div>
          </div>
          <div className={styles.workspaceCard}>
            <div className={styles.workspaceImage}>
              <div className={styles.workspacePlaceholder}>🎙️</div>
            </div>
            <div className={styles.workspaceContent}>
              <h3>Recording Studios</h3>
              <p>Soundproof studios with professional audio and video production equipment.</p>
              <div className={styles.workspacePrice}>From $25/hour</div>
            </div>
          </div>
          </div>
        </section>

        {/* Membership Tiers */}
        <section id="membership" className={styles.membership}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Choose Your Plan</h2>
          <p className={styles.sectionSubtitle}>
            Flexible pricing that grows with you
          </p>
        </div>
        <div className={styles.pricingGrid}>
          <div className={styles.pricingCard}>
            <div className={styles.pricingHeader}>
              <h3>Trial</h3>
              <div className={styles.price}>
                <span className={styles.priceAmount}>$0</span>
                <span className={styles.pricePeriod}>/7 days</span>
              </div>
            </div>
            <ul className={styles.featureList}>
              <li>✓ 4-hour workspace trial</li>
              <li>✓ High-speed internet</li>
              <li>✓ 24/7 power access</li>
              <li>✓ Community events</li>
              <li>✗ No booking priority</li>
            </ul>
            <button className={styles.pricingButton}>Start Free Trial</button>
          </div>
          <div className={styles.pricingCard}>
            <div className={styles.pricingHeader}>
              <h3>Basic</h3>
              <div className={styles.price}>
                <span className={styles.priceAmount}>$50</span>
                <span className={styles.pricePeriod}>/month</span>
              </div>
            </div>
            <ul className={styles.featureList}>
              <li>✓ 40 hours workspace/month</li>
              <li>✓ High-speed internet</li>
              <li>✓ 24/7 power & access</li>
              <li>✓ Workshop access</li>
              <li>✓ Community networking</li>
            </ul>
            <button className={styles.pricingButton}>Get Started</button>
          </div>
          <div className={`${styles.pricingCard} ${styles.featured}`}>
            <div className={styles.badge}>Most Popular</div>
            <div className={styles.pricingHeader}>
              <h3>Pro</h3>
              <div className={styles.price}>
                <span className={styles.priceAmount}>$100</span>
                <span className={styles.pricePeriod}>/month</span>
              </div>
            </div>
            <ul className={styles.featureList}>
              <li>✓ 100 hours workspace/month</li>
              <li>✓ Priority booking</li>
              <li>✓ Meeting room access</li>
              <li>✓ Cloud computing credits</li>
              <li>✓ Mentorship sessions</li>
            </ul>
            <button className={`${styles.pricingButton} ${styles.featuredButton}`}>Get Started</button>
          </div>
          <div className={styles.pricingCard}>
            <div className={styles.pricingHeader}>
              <h3>Enterprise</h3>
              <div className={styles.price}>
                <span className={styles.priceAmount}>$200</span>
                <span className={styles.pricePeriod}>/month</span>
              </div>
            </div>
            <ul className={styles.featureList}>
              <li>✓ Unlimited workspace access</li>
              <li>✓ Private office option</li>
              <li>✓ Dedicated support</li>
              <li>✓ API access & tools</li>
              <li>✓ Team collaboration</li>
            </ul>
            <button className={styles.pricingButton}>Contact Sales</button>
          </div>
        </div>
        <div className={styles.scholarshipNote}>
          <p>💡 <strong>Scholarship Program:</strong> Students and early-stage founders get 30% off all plans</p>
          </div>
        </section>

        {/* Community Section */}
        <section id="community" className={styles.community}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Join a Thriving Community</h2>
          <p className={styles.sectionSubtitle}>
            Connect, collaborate, and grow with fellow creators
          </p>
        </div>
        <div className={styles.communityGrid}>
          <div className={styles.communityCard}>
            <div className={styles.communityIcon}>📚</div>
            <h3>Monthly Workshops</h3>
            <p>4+ technical, business, and creative workshops every month. Learn from industry experts.</p>
          </div>
          <div className={styles.communityCard}>
            <div className={styles.communityIcon}>🎯</div>
            <h3>Mentorship Program</h3>
            <p>Get guidance from experienced professionals. One-on-one sessions tailored to your goals.</p>
          </div>
          <div className={styles.communityCard}>
            <div className={styles.communityIcon}>🌟</div>
            <h3>Project Showcase</h3>
            <p>Share your work, get feedback, and inspire others. Build your portfolio and reputation.</p>
          </div>
          <div className={styles.communityCard}>
            <div className={styles.communityIcon}>💬</div>
            <h3>Networking Events</h3>
            <p>Monthly meetups to connect with developers, designers, and founders. Find your next collaborator.</p>
          </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>Ready to Build Without Limits?</h2>
          <p>Start your free 7-day trial. No credit card required.</p>
          <div className={styles.ctaButtons}>
            <button className={styles.primaryButton}>Start Free Trial</button>
            <button className={styles.secondaryButton}>Schedule a Tour</button>
          </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>The Source HUB</h4>
            <p>Empowering African innovators with world-class infrastructure and community.</p>
          </div>
          <div className={styles.footerSection}>
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#workspaces">Workspaces</a>
            <a href="#membership">Pricing</a>
          </div>
          <div className={styles.footerSection}>
            <h4>Community</h4>
            <a href="#community">Events</a>
            <a href="#community">Workshops</a>
            <a href="#community">Mentorship</a>
          </div>
          <div className={styles.footerSection}>
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Careers</a>
          </div>
        </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2024 The Source HUB. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
