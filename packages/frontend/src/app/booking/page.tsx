'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './booking.module.css';

export default function BookingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    plan: '',
    date: '',
    time: '',
    hours: '1',
    name: '',
    email: '',
    phone: '',
  });

  const plans = [
    { value: 'newbie', label: 'Newbie - ₦300/hour', price: 300 },
    { value: 'code-ninja', label: 'Code Ninja - ₦9,900/month', price: 9900 },
    { value: 'big-dev', label: 'Big Dev - ₦24,900/month', price: 24900 },
    { value: 'tech-titan', label: 'Tech Titan - ₦49,900/month', price: 49900 },
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', formData);
    // Here you would typically send the data to your backend
    alert('Booking request submitted! We will contact you shortly.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => router.push('/')} className={styles.backButton}>
          ← Back to Home
        </button>
      </div>

      <div className={styles.bookingWrapper}>
        <div className={styles.bookingCard}>
          <h1 className={styles.title}>Book Your Space</h1>
          <p className={styles.subtitle}>
            Reserve your workspace at The Source HUB
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="plan" className={styles.label}>
                Select Plan *
              </label>
              <select
                id="plan"
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="">Choose a plan...</option>
                {plans.map((plan) => (
                  <option key={plan.value} value={plan.value}>
                    {plan.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="date" className={styles.label}>
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="time" className={styles.label}>
                  Start Time *
                </label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className={styles.select}
                >
                  <option value="">Select time...</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {formData.plan === 'newbie' && (
              <div className={styles.formGroup}>
                <label htmlFor="hours" className={styles.label}>
                  Number of Hours *
                </label>
                <input
                  type="number"
                  id="hours"
                  name="hours"
                  value={formData.hours}
                  onChange={handleChange}
                  required
                  min="1"
                  max="12"
                  className={styles.input}
                />
                <p className={styles.priceNote}>
                  Total: ₦{parseInt(formData.hours) * 300}
                </p>
              </div>
            )}

            <div className={styles.divider} />

            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className={styles.input}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+234 800 000 0000"
                  className={styles.input}
                />
              </div>
            </div>

            <button type="submit" className={styles.submitButton}>
              Confirm Booking
            </button>
          </form>
        </div>

        <div className={styles.infoCard}>
          <h3 className={styles.infoTitle}>What to Expect</h3>
          <ul className={styles.infoList}>
            <li>✓ Confirmation email within 1 hour</li>
            <li>✓ 24/7 power backup guaranteed</li>
            <li>✓ High-speed internet (50+ Mbps)</li>
            <li>✓ Professional workspace environment</li>
            <li>✓ Access to community events</li>
            <li>✓ Free coffee and refreshments</li>
          </ul>

          <div className={styles.contactInfo}>
            <h4>Need Help?</h4>
            <p>Contact us:</p>
            <p>📧 hello@sourcehub.ng</p>
            <p>📱 +234 800 SOURCE HUB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
