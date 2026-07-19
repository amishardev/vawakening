
"use client"; 

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, Target, Users, Lightbulb, Leaf, HandHelping, Users2 } from 'lucide-react';
import { MandalaSymbol } from '@/components/shared/MandalaSymbol';
import { useEffect } from 'react'; 
import { useLanguage } from '@/context/LanguageContext'; // Import useLanguage

export default function AboutPage() {
  const { t, language } = useLanguage(); // Get language context

  useEffect(() => {
    document.title = t('page_title_about');
  }, [t, language]);

  const timelineEvents = [
    { year: "2025", event: t('about_timeline_event_2025', {defaultValue: "Foundation established."}), icon: <Landmark className="h-6 w-6 text-primary" /> },
    // Add more events here and their translations in LanguageContext
  ];

  const values = [
    { nameKey: "about_value_holistic_growth_name", descriptionKey: "about_value_holistic_growth_desc", icon: <MandalaSymbol className="h-8 w-8 text-accent" /> },
    { nameKey: "about_value_inclusiveness_name", descriptionKey: "about_value_inclusiveness_desc", icon: <Users className="h-8 w-8 text-accent" /> },
    { nameKey: "about_value_empowerment_name", descriptionKey: "about_value_empowerment_desc", icon: <Lightbulb className="h-8 w-8 text-accent" /> },
    { nameKey: "about_value_sustainability_name", descriptionKey: "about_value_sustainability_desc", icon: <Leaf className="h-8 w-8 text-accent" /> },
    { nameKey: "about_value_compassion_name", descriptionKey: "about_value_compassion_desc", icon: <HandHelping className="h-8 w-8 text-accent" /> },
    { nameKey: "about_value_collaboration_name", descriptionKey: "about_value_collaboration_desc", icon: <Users2 className="h-8 w-8 text-accent" /> },
  ];
  
  // Add these keys to LanguageContext.tsx
  // For 'en':
  // "about_value_holistic_growth_name": "Holistic Growth",
  // "about_value_holistic_growth_desc": "We believe in nurturing the mind, body, and spirit through a balanced blend of modern science and timeless spiritual wisdom to enable complete human development.",
  // "about_value_inclusiveness_name": "Inclusiveness & Unity",
  // "about_value_inclusiveness_desc": "We are committed to fostering inclusive progress by engaging all sections of society—urban and rural, young and old, men and women—ensuring no one is left behind.",
  // "about_value_empowerment_name": "Empowerment Through Knowledge",
  // "about_value_empowerment_desc": "We champion education, skill-building, and entrepreneurship as powerful tools to help individuals become confident, self-reliant, and capable of shaping their own futures.",
  // "about_value_sustainability_name": "Sustainability & Stewardship",
  // "about_value_sustainability_desc": "We honor our responsibility to protect the environment and promote sustainable practices that secure a healthy, balanced world for future generations.",
  // "about_value_compassion_name": "Compassion & Community Service",
  // "about_value_compassion_desc": "We are guided by empathy, kindness, and a deep sense of service, working selflessly to uplift others and strengthen communities.",
  // "about_value_collaboration_name": "Collaboration & Shared Progress",
  // "about_value_collaboration_desc": "We value partnerships—with governments, NGOs, and communities—to create lasting impact through shared vision, innovation, and collective action."
  // "about_timeline_event_2025": "Foundation established."
  // "about_mission_p1": "At The Vivekananda Awakening Foundation, our mission is to inspire and empower individuals and communities across India through holistic development rooted in timeless Indian values and modern scientific understanding. We are committed to working on a nonprofit basis, collaborating with government and non-government organizations, and uniting all sections of society to bring about sustainable and meaningful change.",
  // "about_mission_p2": "We focus on education, mental well-being, social and economic empowerment, environmental sustainability, and gender equality. Our aim is to promote positive behavioral change that uplifts both urban and rural communities, fostering self-reliance, resilience, and a sense of shared purpose. We are dedicated to enhancing opportunities for women, youth, artisans, and marginalized groups through skill development, vocational training, entrepreneurship support, and mentoring—helping them create financially independent and confident futures.",
  // "about_mission_p3": "Our work includes facilitating workshops, capacity-building programs, forums, and research studies that encourage good living habits, moral values, self-confidence, and civic responsibility. We actively engage in creating awareness on critical social issues, preserving the environment, and promoting sustainable development to maintain ecological balance. We believe true empowerment lies in enabling individuals to realize their potential, and we strive to provide the tools, resources, and support systems necessary for this transformation. Through collaboration, joint ventures, and participation in national development schemes, we seek to build an inclusive, compassionate, and progressive society. Together, let us create a future where knowledge, compassion, and action come together to awaken the spirit of service and self-improvement across the nation.",
  // "about_vision_p1": "The Vivekananda Awakening Foundation envisions a future where every individual, regardless of background or circumstance, is empowered to lead a life of dignity, purpose, and self-reliance. Rooted in the timeless spiritual and moral values of India and strengthened by modern scientific knowledge, we aspire to build a compassionate, inclusive, and progressive society that nurtures both personal growth and collective well-being.",
  // "about_vision_p2": "We see an India where mental well-being, education, environmental sustainability, and social and economic empowerment are accessible to all—where rural and urban communities alike thrive in harmony, and every person has the opportunity to realize their full potential. Our vision is to inspire positive behavioral change that promotes harmony, equity, and ethical living, ensuring that development does not come at the cost of human values or ecological balance.",
  // "about_vision_p3": "We strive for a society where women, youth, artisans, and marginalized groups are not only uplifted but are recognized as key contributors to the nation’s progress. We imagine a future where collaboration between individuals, organizations, and institutions sparks innovative solutions to social challenges, and where community-driven action becomes the foundation for lasting change. Through skill development, entrepreneurship support, mentoring, advocacy, and awareness campaigns, we aim to foster a culture of continuous learning, resilience, and service. We envision creating centers of excellence across the country that promote good living habits, moral strength, and mental wellness, while preserving our natural environment for future generations. In all that we do, we are guided by the ideal of selfless service and the belief that true progress is measured by how we uplift the weakest among us. Together, we work towards an awakened India—a nation where compassion and knowledge illuminate the path to sustainable and inclusive development."


  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-secondary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4 animate-fade-in">{t('about_hero_title')}</h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto animate-slide-in-up delay-200">
            {t('about_hero_subtitle')}
          </p>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <Card className="animate-fade-in shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-10 w-10 text-primary" />
                  <CardTitle className="font-headline text-2xl md:text-3xl text-primary">{t('about_mission_title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-4">{t('about_mission_p1')}</p>
                <p className="text-lg mb-4">{t('about_mission_p2')}</p>
                <p className="text-lg">{t('about_mission_p3')}</p>
              </CardContent>
            </Card>
            <Card className="animate-fade-in delay-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Landmark className="h-10 w-10 text-primary" />
                  <CardTitle className="font-headline text-2xl md:text-3xl text-primary">{t('about_vision_title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-4">{t('about_vision_p1')}</p>
                <p className="text-lg mb-4">{t('about_vision_p2')}</p>
                 <p className="text-lg">{t('about_vision_p3')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Timeline Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-semibold text-primary text-center mb-12">
            {t('about_journey_title')}
          </h2>
          <div className="relative">
            {/* Desktop Timeline Line */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-1 bg-border rounded-full transform -translate-x-1/2"></div>
            
            {/* Mobile Timeline: Items stack with a line and dot to the left */}
            <div className="md:hidden">
              {timelineEvents.map((item, index) => (
                <div key={`mobile-${item.year}`} className="flex mb-8">
                  <div className="flex flex-col items-center mr-4 pt-1"> {/* pt-1 to align dot with card header text a bit better */}
                    <div className="flex-shrink-0 w-4 h-4 bg-primary rounded-full border-2 border-background"></div>
                    {index < timelineEvents.length - 1 && (
                      <div className="w-px flex-grow bg-border my-1"></div>
                    )}
                  </div>
                  <Card className="flex-grow shadow-md animate-slide-in-up" style={{animationDelay: `${index * 200}ms`}}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <CardTitle className="font-headline text-xl text-primary">{item.year}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p>{item.event}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Desktop Timeline: Alternating items */}
            <div className="hidden md:block">
              {timelineEvents.map((item, index) => (
                <div key={`desktop-${item.year}`} className={`mb-8 flex items-start w-full group relative ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Desktop Dot on the center line */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-background z-10"></div>
                  
                  {/* Spacer Half */}
                  <div className="md:w-[calc(50%_-_0.5rem)]"></div>
                  
                  {/* Content Half */}
                  <div className={`md:w-[calc(50%_-_0.5rem)] ${index % 2 === 0 ? 'md:pr-4' : 'md:pl-4'}`}>
                    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 animate-slide-in-up" style={{animationDelay: `${index * 200}ms`}}>
                      <CardHeader className={`${index % 2 === 0 ? 'md:items-end md:text-right' : 'md:items-start md:text-left'}`}>
                        <div className={`flex items-center gap-3 ${index % 2 === 0 ? 'md:flex-row-reverse' : 'flex-row'}`}>
                          {item.icon}
                          <CardTitle className="font-headline text-xl sm:text-2xl text-primary">{item.year}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p>{item.event}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-semibold text-primary text-center mb-12">
            {t('about_values_title')}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={value.nameKey} className="text-center bg-card shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in" style={{animationDelay: `${index * 150}ms`}}>
                <CardHeader className="items-center">
                  <div className="p-3 rounded-full bg-accent/10 mb-3">
                    {value.icon}
                  </div>
                  <CardTitle className="font-headline text-xl md:text-2xl text-primary">{t(value.nameKey)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{t(value.descriptionKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
           <p className="mt-12 text-center text-lg text-foreground">
            {t('about_non_commercial')}
          </p>
        </div>
      </section>

      {/* Founder's Inspiration / Philosophy (Optional Placeholder) */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-semibold text-primary mb-6">{t('about_inspired_title')}</h2>
            <Image
                src="https://raw.githubusercontent.com/amishsharmadevapp/vivekafound/main/Untitled%20design%20(7).png"
                alt={t('about_inspired_alt_text') || "Meditating person representing timeless wisdom"}
                width={150}
                height={150}
                className="rounded-full mx-auto mb-6 shadow-lg object-cover"
                data-ai-hint="meditation serene"
              />
            <blockquote className="text-lg sm:text-xl italic text-foreground max-w-3xl mx-auto">
              {t('about_vivekananda_quote')}
            </blockquote>
            <p className="mt-6 text-md sm:text-lg text-foreground max-w-3xl mx-auto">
             {t('about_philosophy')}
            </p>
        </div>
      </section>
    </div>
  );
}

// Add to LanguageContext.tsx in 'en':
// "about_inspired_alt_text": "Meditating person representing timeless wisdom",

