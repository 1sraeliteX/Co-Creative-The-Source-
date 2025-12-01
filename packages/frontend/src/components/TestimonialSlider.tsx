'use client';

import { useEffect, useRef } from 'react';
import styles from './TestimonialSlider.module.css';

interface Testimonial {
  id: number;
  text: string;
  name: string;
  location: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "The Source HUB transformed my productivity. No more power outages interrupting my work. I've shipped more projects in 3 months than I did all last year.",
    name: "Chioma Okafor",
    location: "Lagos, Nigeria",
    image: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: 2,
    text: "Finally, a workspace that understands African developers. Reliable internet, 24/7 power, and an amazing community. This is what we've been waiting for.",
    name: "Kwame Mensah",
    location: "Accra, Ghana",
    image: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: 3,
    text: "I met my co-founder at The Source HUB. The networking events and collaborative environment made it easy to connect with like-minded innovators.",
    name: "Amara Nwosu",
    location: "Abuja, Nigeria",
    image: "https://i.pravatar.cc/150?img=5"
  },
  {
    id: 4,
    text: "The mentorship program is incredible. I learned more in 2 months here than in a year of online courses. Plus, the recording studio helped me launch my tech YouTube channel.",
    name: "Youssef El-Amin",
    location: "Cairo, Egypt",
    image: "https://i.pravatar.cc/150?img=13"
  },
  {
    id: 5,
    text: "As a freelancer, the flexible workspace options are perfect. I can book a desk when I need focus, or work in the collaborative area when I want energy.",
    name: "Fatima Hassan",
    location: "Nairobi, Kenya",
    image: "https://i.pravatar.cc/150?img=9"
  },
  {
    id: 6,
    text: "The infrastructure is world-class. Fast internet, backup power, and professional meeting rooms. I can confidently take client calls without worrying about connectivity.",
    name: "Tunde Adebayo",
    location: "Ibadan, Nigeria",
    image: "https://i.pravatar.cc/150?img=14"
  },
  {
    id: 7,
    text: "Best decision I made this year. The community alone is worth it, but add reliable power and internet? Game changer for my freelance business.",
    name: "Aisha Mohammed",
    location: "Kano, Nigeria",
    image: "https://i.pravatar.cc/150?img=10"
  },
  {
    id: 8,
    text: "I can finally take international client calls without worrying about my connection dropping. The professional environment gives me credibility.",
    name: "David Kamau",
    location: "Nairobi, Kenya",
    image: "https://i.pravatar.cc/150?img=15"
  },
  {
    id: 9,
    text: "The workshops and mentorship helped me land my first major contract. This place is an investment in your future.",
    name: "Zainab Osman",
    location: "Khartoum, Sudan",
    image: "https://i.pravatar.cc/150?img=20"
  }
];

export default function TestimonialSlider() {
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);
  const scrollRef3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createScroll = (ref: React.RefObject<HTMLDivElement>, speed: number) => {
      const scrollContainer = ref.current;
      if (!scrollContainer) return;

      const scroll = () => {
        if (scrollContainer.scrollTop >= scrollContainer.scrollHeight / 2) {
          scrollContainer.scrollTop = 0;
        } else {
          scrollContainer.scrollTop += speed;
        }
      };

      return setInterval(scroll, 30);
    };

    const interval1 = createScroll(scrollRef1, 1);
    const interval2 = createScroll(scrollRef2, 0.8);
    const interval3 = createScroll(scrollRef3, 1.2);

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
      clearInterval(interval3);
    };
  }, []);

  const column1 = [testimonials[0], testimonials[3], testimonials[6]];
  const column2 = [testimonials[1], testimonials[4], testimonials[7]];
  const column3 = [testimonials[2], testimonials[5], testimonials[8]];

  const duplicateColumn = (col: Testimonial[]) => [...col, ...col];

  return (
    <div className={styles.container}>
      <div className={styles.columnsWrapper}>
        <div className={styles.column}>
          <div className={styles.scrollWrapper} ref={scrollRef1}>
            <div className={styles.scrollContent}>
              {duplicateColumn(column1).map((testimonial, index) => (
                <div key={`col1-${testimonial.id}-${index}`} className={styles.testimonialCard}>
                  <p className={styles.testimonialText}>"{testimonial.text}"</p>
                  <div className={styles.testimonialAuthor}>
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className={styles.authorImage}
                    />
                    <div className={styles.authorInfo}>
                      <div className={styles.authorName}>{testimonial.name}</div>
                      <div className={styles.authorLocation}>{testimonial.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.scrollWrapper} ref={scrollRef2}>
            <div className={styles.scrollContent}>
              {duplicateColumn(column2).map((testimonial, index) => (
                <div key={`col2-${testimonial.id}-${index}`} className={styles.testimonialCard}>
                  <p className={styles.testimonialText}>"{testimonial.text}"</p>
                  <div className={styles.testimonialAuthor}>
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className={styles.authorImage}
                    />
                    <div className={styles.authorInfo}>
                      <div className={styles.authorName}>{testimonial.name}</div>
                      <div className={styles.authorLocation}>{testimonial.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.scrollWrapper} ref={scrollRef3}>
            <div className={styles.scrollContent}>
              {duplicateColumn(column3).map((testimonial, index) => (
                <div key={`col3-${testimonial.id}-${index}`} className={styles.testimonialCard}>
                  <p className={styles.testimonialText}>"{testimonial.text}"</p>
                  <div className={styles.testimonialAuthor}>
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className={styles.authorImage}
                    />
                    <div className={styles.authorInfo}>
                      <div className={styles.authorName}>{testimonial.name}</div>
                      <div className={styles.authorLocation}>{testimonial.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
