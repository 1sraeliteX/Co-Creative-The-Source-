'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import LoadingScreen from '../components/LoadingScreen';
import EtherealShadow from '../components/EtherealShadow';
import MobileMenu from '../components/MobileMenu';
import CardStack from '../components/CardStack';
import TestimonialSlider from '../components/TestimonialSlider';
import SpeedCounter from '../components/SpeedCounter';

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <LoadingScreen />
      <div 
        className={styles.container} 
        style={{ opacity: showContent ? 1 : 0, transition: 'opacity 0.5s' }}
      >
        {/* Mobile Menu */}
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        />

        {/* Navigation */}
        <nav className={styles.nav}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <img src="/logo2.png" alt="The Source HUB" className={styles.logoImage} />
          </div>
          <div className={styles.navLinks}>
            <a href="#features">Features</a>
            <a href="#workspaces">Workspaces</a>
            <a href="#membership">Membership</a>
            <a href="#community">Community</a>
            <a href="/booking">
              <button className={styles.ctaButton}>Book a Space</button>
            </a>
          </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className={styles.hero}>
          <EtherealShadow>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Where African Innovators
                <span className={styles.gradient}> Build Without Limits</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Reliable 24/7 power, high-speed internet, and collaborative workspace.
                No more coding by candlelight or missing deadlines due to outages.
              </p>
              <CardStack />
              <div className={styles.heroStats}>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>99.5%</div>
                  <div className={styles.statLabel}>Power Uptime</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>
                    <SpeedCounter />
                  </div>
                  <div className={styles.statLabel}>Internet Speed</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>24/7</div>
                  <div className={styles.statLabel}>Access</div>
                </div>
              </div>
            </div>
          </EtherealShadow>
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
          <a href="/workspaces/hot-desks" className={styles.workspaceLink}>
            <div className={styles.workspaceCard}>
              <div className={styles.workspaceImage}>
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" 
                  alt="Hot Desks"
                  className={styles.workspaceImg}
                />
              </div>
              <div className={styles.workspaceContent}>
                <h3>Hot Desks</h3>
                <p>Flexible seating in collaborative spaces. Perfect for freelancers and remote workers.</p>
                <div className={styles.workspacePrice}>From ₦1,500/hour</div>
              </div>
            </div>
          </a>
          <a href="/workspaces/meeting-rooms" className={styles.workspaceLink}>
            <div className={styles.workspaceCard}>
              <div className={styles.workspaceImage}>
                <img 
                  src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80" 
                  alt="Meeting Rooms"
                  className={styles.workspaceImg}
                />
              </div>
              <div className={styles.workspaceContent}>
                <h3>Meeting Rooms</h3>
                <p>Professional spaces for 4-20 people with presentation equipment and whiteboards.</p>
                <div className={styles.workspacePrice}>From ₦4,500/hour</div>
              </div>
            </div>
          </a>
          <a href="/workspaces/recording-studios" className={styles.workspaceLink}>
            <div className={styles.workspaceCard}>
              <div className={styles.workspaceImage}>
                <img 
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80" 
                  alt="Recording Studios"
                  className={styles.workspaceImg}
                />
              </div>
              <div className={styles.workspaceContent}>
                <h3>Recording Studios</h3>
                <p>Soundproof studios with professional audio and video production equipment.</p>
                <div className={styles.workspacePrice}>From ₦7,500/hour</div>
              </div>
            </div>
          </a>
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
              <h3>Newbie</h3>
              <div className={styles.price}>
                <span className={styles.priceAmount}>₦300</span>
                <span className={styles.pricePeriod}>/hour</span>
              </div>
              <div className={styles.priceNote}>Pay As You Go • No Commitment</div>
            </div>
            <ul className={styles.featureList}>
              <li>✓ Pay only for hours used</li>
              <li>✓ High-speed internet</li>
              <li>✓ 24/7 power backup</li>
              <li>✓ Community events</li>
              <li>✗ No priority booking</li>
              <li>✗ No monthly discounts</li>
            </ul>
            <a href="/booking">
              <button className={styles.pricingButton}>Book a Space</button>
            </a>
          </div>
          <div className={styles.pricingCard}>
            <div className={styles.pricingHeader}>
              <h3>Code Ninja</h3>
              <div className={styles.price}>
                <span className={styles.priceAmount}>₦9,900</span>
                <span className={styles.pricePeriod}>/month</span>
              </div>
              <div className={styles.priceNote}>
                <span className={styles.strikethrough}>₦12,000</span> Save ₦2,100 • ₦248/hr
              </div>
            </div>
            <ul className={styles.featureList}>
              <li>✓ 40 hours/month (₦248/hr)</li>
              <li>✓ High-speed internet</li>
              <li>✓ 24/7 power & access</li>
              <li>✓ Workshop access</li>
              <li>✓ Community networking</li>
              <li>✓ 17% cheaper than pay-as-you-go</li>
            </ul>
            <a href="/booking">
              <button className={styles.pricingButton}>Book a Space</button>
            </a>
          </div>
          <div className={`${styles.pricingCard} ${styles.featured}`}>
            <div className={styles.badge}>Best Value - Save 17%</div>
            <div className={styles.pricingHeader}>
              <h3>Big Dev</h3>
              <div className={styles.price}>
                <span className={styles.priceAmount}>₦24,900</span>
                <span className={styles.pricePeriod}>/month</span>
              </div>
              <div className={styles.priceNote}>
                <span className={styles.strikethrough}>₦30,000</span> Save ₦5,100 • ₦249/hr
              </div>
            </div>
            <ul className={styles.featureList}>
              <li>✓ 100 hours/month (₦249/hr)</li>
              <li>✓ Priority booking guaranteed</li>
              <li>✓ Meeting room access (4hrs free)</li>
              <li>✓ ₦5,000 cloud credits</li>
              <li>✓ 2 mentorship sessions/month</li>
              <li>✓ Recording studio discount</li>
            </ul>
            <a href="/booking">
              <button className={`${styles.pricingButton} ${styles.featuredButton}`}>Book a Space</button>
            </a>
          </div>
          <div className={styles.pricingCard}>
            <div className={styles.pricingHeader}>
              <h3>Tech Titan</h3>
              <div className={styles.price}>
                <span className={styles.priceAmount}>₦49,900</span>
                <span className={styles.pricePeriod}>/month</span>
              </div>
              <div className={styles.priceNote}>Unlimited Access • Best for Teams</div>
            </div>
            <ul className={styles.featureList}>
              <li>✓ Unlimited workspace hours</li>
              <li>✓ Private office (8hrs/week)</li>
              <li>✓ Dedicated support 24/7</li>
              <li>✓ ₦15,000 cloud credits</li>
              <li>✓ Unlimited mentorship</li>
              <li>✓ Team collaboration tools</li>
            </ul>
            <a href="/booking">
              <button className={styles.pricingButton}>Book a Space</button>
            </a>
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
          <TestimonialSlider />
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
