
'use client';

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
  t: (key: string, replacements?: Record<string, string | number | undefined>, defaultValue?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Basic translations dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    header_home: 'Home',
    header_about: 'About Us',
    header_programs: 'Programs',
    header_resources: 'Resources',
    header_blog: 'Blog',
    header_store: 'Store',
    header_toggle_to_hindi: 'हिंदी',
    header_toggle_to_english: 'English',

    // Footer
    footer_description: 'Vivekananda Awakening Foundation — Bridging Science and Spiritualism for holistic well-being.',
    footer_quick_links: 'Quick Links',
    footer_connect_with_us: 'Connect With Us',
    footer_address: 'Vivekananda Awakening Foundation<br />Head Office<br />Agra, India',
    footer_email_prompt: 'Email:',
    footer_copyright: '© {year} Vivekananda Awakening Foundation — A nonprofit organization.',
    footer_sitemap: 'Sitemap',
    footer_admin: 'Admin',
    footer_vivekananda_foundation_logo_alt: 'Vivekananda Awakening Foundation Logo',
    footer_webapp_credit: 'Web app solely created by <a href="https://www.linkedin.com/in/amish-sharma-301040313/" target="_blank" rel="noopener noreferrer" class="hover:text-primary">Amish Sharma</a>.',


    // Page Titles (used by individual pages to set document.title)
    page_title_default: 'Vivekananda Awakening Foundation',
    page_title_home: 'Vivekananda Awakening Foundation',
    page_title_about: 'About Us - Vivekananda Awakening Foundation',
    page_title_programs: 'Our Programs - Vivekananda Awakening Foundation',
    page_title_mythology_meditation: 'Mythology & Meditation Resources - Vivekananda Awakening Foundation',
    page_title_blog: 'Vivekananda Awakening Foundation Blog',
    page_title_blog_post: '{postTitle} - Blog - Vivekananda Awakening Foundation',
    page_title_sitemap: 'Sitemap - Vivekananda Awakening Foundation',
    page_title_store: 'Store - Vivekananda Awakening Foundation',

    // Home Page
    home_hero_title: 'Find Your Inner Peace',
    home_hero_title_line1: 'Find Your Inner Peace',
    home_hero_title_line2: 'with Vivekananda Awakening Foundation',
    home_hero_subtitle: 'Embark on a journey of self-discovery and spiritual growth with our guided meditations, well-being practices, and insights from ancient Indian mythology.',
    home_explore_button: 'Explore',
    home_welcome_title: 'Welcome to the Vivekananda Awakening Foundation',
    home_welcome_tagline: 'उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत', 
    home_welcome_p1: 'The Vivekananda Awakening Foundation is a nonprofit organization dedicated to promoting holistic development by blending modern scientific knowledge with the timeless wisdom of Indian spiritual traditions. We work in partnership with government bodies, non-government organizations, and all sections of society to foster inclusive progress across urban and rural areas.',
    home_welcome_p2: 'Our initiatives span education, mental well-being, social and economic empowerment, environmental sustainability, and the promotion of self-reliance through skill development and entrepreneurship, with a strong focus on women’s development and youth upliftment. We aim to inspire positive behavioral change, strengthen communities, and support individuals in leading resilient, confident, and fulfilling lives. Through training programs, workshops, research, advocacy, and collaborations, we strive to create a more equitable, compassionate, and sustainable future.',
    home_learn_more_button: 'Learn More About Us',
    home_featured_articles_title: 'Featured Articles',
    home_no_featured_articles: 'No featured articles available at the moment.',
    home_view_all_articles_button: 'View All Articles',
    home_discover_programs_title: 'Discover Our Transformative Programs',
    home_discover_programs_subtitle: "Dive deeper into our initiatives and see how we're making a difference. Each program is designed to uplift, educate, and empower.",
    home_explore_programs_button: 'Explore Programs',

    // Home Page - Redesign additions
    home_hero_tag_left: 'Step into stillness',
    home_hero_tag_right: 'Begin with awareness',
    home_stat1_title: 'Guided with Care',
    home_stat1_desc: 'Personalized practices for your unique journey.',
    home_stat2_title: 'Rooted in Wisdom',
    home_stat2_desc: 'Teachings drawn from timeless Indian traditions.',
    home_stat3_title: 'Growing Together',
    home_stat3_desc: 'A widening community across urban and rural India.',

    home_services_eyebrow: 'Our Focus Areas',
    home_services_title: 'Our Path to Holistic Growth',
    home_services_subtitle: 'We blend modern scientific knowledge with timeless Indian wisdom to support well-being, empowerment, and sustainable living.',
    home_service1_title: 'Mindful Living & Meditation',
    home_service1_desc: 'Cultivate inner peace and emotional resilience through guided meditation and mental wellness workshops.',
    home_service2_title: "Nari Shakti: Women's Empowerment",
    home_service2_desc: 'Empowering women through skill development, entrepreneurship, and leadership training.',
    home_service3_title: 'Education & Skill Development',
    home_service3_desc: 'Vocational training, mentoring, and entrepreneurship support that build confident, self-reliant futures.',
    home_service4_title: 'Environmental Sustainability',
    home_service4_desc: 'Promoting sustainable practices that protect a healthy, balanced world for future generations.',
    home_service_more_details: 'Learn More',

    home_how_it_works_eyebrow: 'How It Works',
    home_how_it_works_title: 'We Guide You Through Your Journey of Growth',
    home_step1_number: '01',
    home_step1_title: 'Explore Our Programs',
    home_step1_desc: 'Discover initiatives in meditation, education, empowerment, and sustainability suited to you.',
    home_step2_number: '02',
    home_step2_title: 'Join a Session or Workshop',
    home_step2_desc: 'Participate in guided meditations, training programs, and community workshops led by our team.',
    home_step3_number: '03',
    home_step3_title: 'Grow With Our Community',
    home_step3_desc: 'Continue your journey with ongoing support and resources from our community.',
    home_how_it_works_button: 'Get Involved',

    home_why_eyebrow: 'Why Choose Us',
    home_why_learn_more: 'Learn More',

    home_quote_eyebrow: 'Our Inspiration',

    home_articles_eyebrow: 'From Our Blog',

    // About Page
    about_hero_title: 'About Vivekananda Awakening Foundation',
    about_hero_subtitle: 'Understanding our journey, mission, and the values that drive us to create a better world.',
    about_mission_title: 'Our Mission',
    about_mission_p1: "At The Vivekananda Awakening Foundation, our mission is to inspire and empower individuals and communities across India through holistic development rooted in timeless Indian values and modern scientific understanding. We are committed to working on a nonprofit basis, collaborating with government and non-government organizations, and uniting all sections of society to bring about sustainable and meaningful change.",
    about_mission_p2: "We focus on education, mental well-being, social and economic empowerment, environmental sustainability, and gender equality. Our aim is to promote positive behavioral change that uplifts both urban and rural communities, fostering self-reliance, resilience, and a sense of shared purpose. We are dedicated to enhancing opportunities for women, youth, artisans, and marginalized groups through skill development, vocational training, entrepreneurship support, and mentoring—helping them create financially independent and confident futures.",
    about_mission_p3: "Our work includes facilitating workshops, capacity-building programs, forums, and research studies that encourage good living habits, moral values, self-confidence, and civic responsibility. We actively engage in creating awareness on critical social issues, preserving the environment, and promoting sustainable development to maintain ecological balance. We believe true empowerment lies in enabling individuals to realize their potential, and we strive to provide the tools, resources, and support systems necessary for this transformation. Through collaboration, joint ventures, and participation in national development schemes, we seek to build an inclusive, compassionate, and progressive society. Together, let us create a future where knowledge, compassion, and action come together to awaken the spirit of service and self-improvement across the nation.",
    about_vision_title: 'Our Vision',
    about_vision_p1: "The Vivekananda Awakening Foundation envisions a future where every individual, regardless of background or circumstance, is empowered to lead a life of dignity, purpose, and self-reliance. Rooted in the timeless spiritual and moral values of India and strengthened by modern scientific knowledge, we aspire to build a compassionate, inclusive, and progressive society that nurtures both personal growth and collective well-being.",
    about_vision_p2: "We see an India where mental well-being, education, environmental sustainability, and social and economic empowerment are accessible to all—where rural and urban communities alike thrive in harmony, and every person has the opportunity to realize their full potential. Our vision is to inspire positive behavioral change that promotes harmony, equity, and ethical living, ensuring that development does not come at the cost of human values or ecological balance.",
    about_vision_p3: "We strive for a society where women, youth, artisans, and marginalized groups are not only uplifted but are recognized as key contributors to the nation’s progress. We imagine a future where collaboration between individuals, organizations, and institutions sparks innovative solutions to social challenges, and where community-driven action becomes the foundation for lasting change. Through skill development, entrepreneurship support, mentoring, advocacy, and awareness campaigns, we aim to foster a culture of continuous learning, resilience, and service. We envision creating centers of excellence across the country that promote good living habits, moral strength, and mental wellness, while preserving our natural environment for future generations. In all that we do, we are guided by the ideal of selfless service and the belief that true progress is measured by how we uplift the weakest among us. Together, we work towards an awakened India—a nation where compassion and knowledge illuminate the path to sustainable and inclusive development.",
    about_journey_title: 'Our Journey So Far',
    about_timeline_event_2025: "Foundation established.",
    about_values_title: 'Our Core Values',
    "about_value_holistic_growth_name": "Holistic Growth",
    "about_value_holistic_growth_desc": "We believe in nurturing the mind, body, and spirit through a balanced blend of modern science and timeless spiritual wisdom to enable complete human development.",
    "about_value_inclusiveness_name": "Inclusiveness & Unity",
    "about_value_inclusiveness_desc": "We are committed to fostering inclusive progress by engaging all sections of society—urban and rural, young and old, men and women—ensuring no one is left behind.",
    "about_value_empowerment_name": "Empowerment Through Knowledge",
    "about_value_empowerment_desc": "We champion education, skill-building, and entrepreneurship as powerful tools to help individuals become confident, self-reliant, and capable of shaping their own futures.",
    "about_value_sustainability_name": "Sustainability & Stewardship",
    "about_value_sustainability_desc": "We honor our responsibility to protect the environment and promote sustainable practices that secure a healthy, balanced world for future generations.",
    "about_value_compassion_name": "Compassion & Community Service",
    "about_value_compassion_desc": "We are guided by empathy, kindness, and a deep sense of service, working selflessly to uplift others and strengthen communities.",
    "about_value_collaboration_name": "Collaboration & Shared Progress",
    "about_value_collaboration_desc": "We value partnerships—with governments, NGOs, and communities—to create lasting impact through shared vision, innovation, and collective action.",
    about_non_commercial: 'As a non-commercial organization, our primary focus is service and societal upliftment, ensuring all our resources are dedicated to our mission.',
    about_inspired_title: 'Inspired by Timeless Wisdom',
    about_inspired_alt_text: "Meditating person representing timeless wisdom",
    about_vivekananda_quote: '"Arise, awake, and stop not till the goal is reached." - Swami Vivekananda',
    about_philosophy: 'Our work is deeply rooted in the universal teachings of Vedanta and the inspiring life of Swami Vivekananda, emphasizing selfless service, strength, and the inherent divinity within each individual.',

    // Programs Page
    programs_hero_title: "Our Programs",
    programs_hero_subtitle: "Dedicated initiatives for holistic well-being and societal upliftment. Explore how we make a difference.",
    programs_get_involved_button: "Get Involved",
    programs_cta_title: "Ready to Make an Impact?",
    programs_cta_subtitle: "Your support can help us expand these programs and reach more individuals in need. Learn how you can contribute or volunteer.",
    programs_cta_button: "Support Our Work",
    programs_loading: "Loading programs...",
    programs_no_programs_in_category: "No programs currently listed under {category}.",
    programs_no_programs_available: "No programs available at the moment. Please check back soon.",

    // Mythology & Meditation Page (Resources)
    mythology_hero_alt_icon: "Mythology & Meditation Icon",
    mythology_hero_title: "Mythology & Meditation Resources",
    mythology_hero_subtitle: "Explore the confluence of ancient wisdom and modern understanding for spiritual growth and mental clarity.",
    mythology_intro_title: "The Path to Inner Wisdom",
    mythology_intro_p1: "Delve into a curated collection of resources that bridge the timeless teachings of the Vedas, Upanishads, and Indian mythology with contemporary scientific insights on meditation and mindfulness. Our aim is to provide accessible knowledge that inspires personal growth, peace, and a deeper understanding of life.",
    mythology_tab_all: "All Resources",
    mythology_tab_articles: "Articles",
    mythology_tab_videos: "Videos",
    mythology_tab_podcasts: "Podcasts",
    mythology_no_articles_message: "No articles available at the moment. Check back soon!",
    mythology_no_videos_message: "No videos available at the moment. Check back soon!",
    mythology_no_podcasts_message: "No podcasts available at the moment. Check back soon!",
    mythology_no_resources_message: "No resources available yet. Check back soon!",
    mythology_read_article_button: "Read Article",
    mythology_watch_video_button: "Watch Video",
    mythology_listen_podcast_button: "Listen to Podcast",
    mythology_view_resource_button: "View Resource",

    // Blog Page
    blog_hero_alt_icon: "Vivekananda Awakening Foundation Blog Icon",
    blog_hero_title: "Vivekananda Awakening Foundation Blog",
    blog_hero_subtitle: "Insights on well-being, spiritual growth, social impact, and the confluence of science and tradition.",
    blog_search_placeholder: "Search articles...",
    blog_search_button: "Search",
    blog_no_posts_title: "No Posts Found",
    blog_no_posts_query_message: "Sorry, we couldn't find any posts matching \"{query}\". Try a different search term.",
    blog_no_posts_default_message: "There are no blog posts yet. Please check back later!",
    blog_post_back_button: "Back to All Articles",
    blog_read_more_button: "Read More",
    blog_loading_post: "Loading post...",

    // Store Page
    store_hero_title: "Foundation Store",
    store_hero_subtitle: "Support our mission by purchasing meaningful items. All proceeds help fund our programs.",
    store_loading_products: "Loading products...",
    store_no_products_title: "Store Coming Soon",
    store_no_products_message: "Our store is under development. Please check back later for inspiring products!",
    store_in_stock: "In Stock",
    store_out_of_stock: "Out of Stock",
    store_no_description: "No description available.",
    store_add_to_cart_button: "Add to Cart (Coming Soon)",
    store_notify_me_button: "Notify Me When Available",
    store_notify_me_dialog_title: "Get Notified",
    store_notify_me_dialog_desc: "This product is currently out of stock. Enter your email below to be notified when it's back.",
    store_notify_me_email_label: "Email",
    store_notify_me_cancel_button: "Cancel",
    store_notify_me_submit_button: "Notify Me",
    store_notify_me_submitting_button: "Submitting...",
    store_notify_me_success_title: "Notification Requested",
    store_notify_me_success_desc: "You'll be notified when this product is back in stock.",
    store_notify_me_error_title: "Request Failed",
    store_notify_me_error_desc: "Could not submit your notification request. Please try again.",

  },
  hi: {
    // Header
    header_home: 'होम',
    header_about: 'हमारे बारे में',
    header_programs: 'कार्यक्रम',
    header_resources: 'संसाधन',
    header_blog: 'ब्लॉग',
    header_store: 'स्टोर',
    header_toggle_to_hindi: 'हिंदी',
    header_toggle_to_english: 'English',

    // Footer
    footer_description: 'विवेकानंद अवेकनिंग फाउंडेशन — समग्र कल्याण के लिए विज्ञान और आध्यात्मिकता को जोड़ना।',
    footer_quick_links: 'त्वरित लिंक्स',
    footer_connect_with_us: 'हमसे जुड़ें',
    footer_address: 'विवेकानंद अवेकनिंग फाउंडेशन<br />मुख्य कार्यालय<br />आगरा, भारत',
    footer_email_prompt: 'ईमेल:',
    footer_copyright: '© {year} विवेकानंद अवेकनिंग फाउंडेशन — एक गैर-लाभकारी संगठन।',
    footer_sitemap: 'साइटमैप',
    footer_admin: 'एडमिन',
    footer_vivekananda_foundation_logo_alt: 'विवेकानंद अवेकनिंग फाउंडेशन लोगो',
    footer_webapp_credit: 'वेब ऐप केवल <a href="https://www.linkedin.com/in/amish-sharma-301040313/" target="_blank" rel="noopener noreferrer" class="hover:text-primary">अमिश शर्मा</a> द्वारा बनाया गया है।',


    // Page Titles
    page_title_default: 'विवेकानंद अवेकनिंग फाउंडेशन',
    page_title_home: 'विवेकानंद अवेकनिंग फाउंडेशन',
    page_title_about: 'हमारे बारे में - विवेकानंद अवेकनिंग फाउंडेशन',
    page_title_programs: 'हमारे कार्यक्रम - विवेकानंद अवेकनिंग फाउंडेशन',
    page_title_mythology_meditation: 'पौराणिक कथाएं और ध्यान संसाधन - विवेकानंद अवेकनिंग फाउंडेशन',
    page_title_blog: 'विवेकानंद अवेकनिंग फाउंडेशन ब्लॉग',
    page_title_blog_post: '{postTitle} - ब्लॉग - विवेकानंद अवेकनिंग फाउंडेशन',
    page_title_sitemap: 'साइटमैप - विवेकानंद अवेकनिंग फाउंडेशन',
    page_title_store: 'स्टोर - विवेकानंद अवेकनिंग फाउंडेशन',

    // Home Page
    home_hero_title: 'अपनी आंतरिक शांति पाएं',
    home_hero_title_line1: 'अपनी आंतरिक शांति पाएं',
    home_hero_title_line2: 'विवेकानंद अवेकनिंग फाउंडेशन के साथ',
    home_hero_subtitle: 'हमारे निर्देशित ध्यान, कल्याण प्रथाओं और प्राचीन भारतीय पौराणिक कथाओं से अंतर्दृष्टि के साथ आत्म-खोज और आध्यात्मिक विकास की यात्रा शुरू करें।',
    home_explore_button: 'अन्वेषण करें',
    home_welcome_title: 'विवेकानंद अवेकनिंग फाउंडेशन में आपका स्वागत है',
    home_welcome_tagline: 'उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत', 
    home_welcome_p1: 'विवेकानंद अवेकनिंग फाउंडेशन एक गैर-लाभकारी संगठन है जो आधुनिक वैज्ञानिक ज्ञान को भारतीय आध्यात्मिक परंपराओं के शाश्वत ज्ञान के साथ मिलाकर समग्र विकास को बढ़ावा देने के लिए समर्पित है। हम शहरी और ग्रामीण क्षेत्रों में समावेशी प्रगति को बढ़ावा देने के लिए सरकारी निकायों, गैर-सरकारी संगठनों और समाज के सभी वर्गों के साथ साझेदारी में काम करते हैं।',
    home_welcome_p2: 'हमारी पहलें शिक्षा, मानसिक कल्याण, सामाजिक और आर्थिक सशक्तिकरण, पर्यावरणीय स्थिरता और कौशल विकास और उद्यमिता के माध्यम से आत्मनिर्भरता को बढ़ावा देने पर केंद्रित हैं, जिसमें महिलाओं के विकास और युवाओं के उत्थान पर विशेष ध्यान दिया गया है। हमारा लक्ष्य सकारात्मक व्यवहार परिवर्तन को प्रेरित करना, समुदायों को मजबूत करना और व्यक्तियों को लचीला, आत्मविश्वासी और पूर्ण जीवन जीने में सहायता करना है। प्रशिक्षण कार्यक्रमों, कार्यशालाओं, अनुसंधान, वकालत और सहयोग के माध्यम से, हम एक अधिक न्यायसंगत, दयालु और टिकाऊ भविष्य बनाने का प्रयास करते हैं।',
    home_learn_more_button: 'हमारे बारे में और जानें',
    home_featured_articles_title: 'विशेष रुप से प्रदर्शित लेख',
    home_no_featured_articles: 'फ़िलहाल कोई विशेष लेख उपलब्ध नहीं है।',
    home_view_all_articles_button: 'सभी लेख देखें',
    home_discover_programs_title: 'हमारे परिवर्तनकारी कार्यक्रमों की खोज करें',
    home_discover_programs_subtitle: "हमारी पहलों में गहराई से उतरें और देखें कि हम कैसे बदलाव ला रहे हैं। प्रत्येक कार्यक्रम उत्थान, शिक्षित और सशक्त बनाने के लिए डिज़ाइन किया गया है।",
    home_explore_programs_button: 'कार्यक्रमों का अन्वेषण करें',

    // Home Page - Redesign additions
    home_hero_tag_left: 'शांति की ओर कदम',
    home_hero_tag_right: 'जागरूकता से आरंभ करें',
    home_stat1_title: 'सहानुभूतिपूर्ण मार्गदर्शन',
    home_stat1_desc: 'आपकी अनूठी यात्रा के लिए व्यक्तिगत अभ्यास।',
    home_stat2_title: 'ज्ञान में निहित',
    home_stat2_desc: 'शाश्वत भारतीय परंपराओं से प्राप्त शिक्षाएं।',
    home_stat3_title: 'साथ मिलकर आगे बढ़ते हुए',
    home_stat3_desc: 'शहरी और ग्रामीण भारत में फैलता हुआ एक समुदाय।',

    home_services_eyebrow: 'हमारे कार्यक्षेत्र',
    home_services_title: 'समग्र विकास की ओर हमारा मार्ग',
    home_services_subtitle: 'हम कल्याण, सशक्तिकरण और टिकाऊ जीवन शैली को बढ़ावा देने के लिए आधुनिक वैज्ञानिक ज्ञान को शाश्वत भारतीय ज्ञान के साथ जोड़ते हैं।',
    home_service1_title: 'सचेत जीवन और ध्यान',
    home_service1_desc: 'निर्देशित ध्यान और मानसिक कल्याण कार्यशालाओं के माध्यम से आंतरिक शांति और भावनात्मक लचीलापन विकसित करें।',
    home_service2_title: 'नारी शक्ति: महिला सशक्तिकरण',
    home_service2_desc: 'कौशल विकास, उद्यमिता और नेतृत्व प्रशिक्षण के माध्यम से महिलाओं को सशक्त बनाना।',
    home_service3_title: 'शिक्षा और कौशल विकास',
    home_service3_desc: 'व्यावसायिक प्रशिक्षण, सलाह और उद्यमिता सहायता जो आत्मविश्वासी, आत्मनिर्भर भविष्य का निर्माण करती है।',
    home_service4_title: 'पर्यावरणीय स्थिरता',
    home_service4_desc: 'भावी पीढ़ियों के लिए एक स्वस्थ, संतुलित दुनिया की रक्षा करने वाली टिकाऊ प्रथाओं को बढ़ावा देना।',
    home_service_more_details: 'और जानें',

    home_how_it_works_eyebrow: 'यह कैसे काम करता है',
    home_how_it_works_title: 'हम आपकी विकास यात्रा में आपका मार्गदर्शन करते हैं',
    home_step1_number: '०१',
    home_step1_title: 'हमारे कार्यक्रमों का अन्वेषण करें',
    home_step1_desc: 'ध्यान, शिक्षा, सशक्तिकरण और स्थिरता से जुड़ी पहलों की खोज करें जो आपके अनुकूल हों।',
    home_step2_number: '०२',
    home_step2_title: 'किसी सत्र या कार्यशाला में शामिल हों',
    home_step2_desc: 'हमारी टीम द्वारा संचालित निर्देशित ध्यान, प्रशिक्षण कार्यक्रमों और सामुदायिक कार्यशालाओं में भाग लें।',
    home_step3_number: '०३',
    home_step3_title: 'हमारे समुदाय के साथ आगे बढ़ें',
    home_step3_desc: 'हमारे समुदाय के निरंतर समर्थन और संसाधनों के साथ अपनी यात्रा जारी रखें।',
    home_how_it_works_button: 'जुड़ें',

    home_why_eyebrow: 'हमें क्यों चुनें',
    home_why_learn_more: 'और जानें',

    home_quote_eyebrow: 'हमारी प्रेरणा',

    home_articles_eyebrow: 'हमारे ब्लॉग से',

    // About Page
    about_hero_title: 'विवेकानंद अवेकनिंग फाउंडेशन के बारे में',
    about_hero_subtitle: 'हमारी यात्रा, मिशन और उन मूल्यों को समझना जो हमें एक बेहतर दुनिया बनाने के लिए प्रेरित करते हैं।',
    about_mission_title: 'हमारा मिशन',
    about_mission_p1: "विवेकानंद अवेकनिंग फाउंडेशन में, हमारा मिशन कालातीत भारतीय मूल्यों और आधुनिक वैज्ञानिक समझ में निहित समग्र विकास के माध्यम से पूरे भारत में व्यक्तियों और समुदायों को प्रेरित और सशक्त बनाना है। हम एक गैर-लाभकारी आधार पर काम करने, सरकारी और गैर-सरकारी संगठनों के साथ सहयोग करने और स्थायी और सार्थक बदलाव लाने के लिए समाज के सभी वर्गों को एकजुट करने के लिए प्रतिबद्ध हैं।",
    about_mission_p2: "हम शिक्षा, मानसिक कल्याण, सामाजिक और आर्थिक सशक्तिकरण, पर्यावरणीय स्थिरता और लैंगिक समानता पर ध्यान केंद्रित करते हैं। हमारा उद्देश्य सकारात्मक व्यवहार परिवर्तन को बढ़ावा देना है जो शहरी और ग्रामीण दोनों समुदायों को ऊपर उठाए, आत्मनिर्भरता, लचीलापन और साझा उद्देश्य की भावना को बढ़ावा दे। हम कौशल विकास, व्यावसायिक प्रशिक्षण, उद्यमिता सहायता और सलाह के माध्यम से महिलाओं, युवाओं, कारीगरों और हाशिए पर पड़े समूहों के लिए अवसरों को बढ़ाने के लिए समर्पित हैं - उन्हें आर्थिक रूप से स्वतंत्र और आत्मविश्वासी भविष्य बनाने में मदद करते हैं।",
    about_mission_p3: "हमारे काम में कार्यशालाओं, क्षमता-निर्माण कार्यक्रमों, मंचों और अनुसंधान अध्ययनों की सुविधा शामिल है जो अच्छी जीवन शैली, नैतिक मूल्यों, आत्मविश्वास और नागरिक जिम्मेदारी को प्रोत्साहित करते हैं। हम महत्वपूर्ण सामाजिक मुद्दों पर जागरूकता पैदा करने, पर्यावरण के संरक्षण और पारिस्थितिक संतुलन बनाए रखने के लिए सतत विकास को बढ़ावा देने में सक्रिय रूप से संलग्न हैं। हमारा मानना ​​है कि सच्ची सशक्तिकरण व्यक्तियों को उनकी क्षमता का एहसास कराने में सक्षम बनाने में निहित है, और हम इस परिवर्तन के लिए आवश्यक उपकरण, संसाधन और सहायता प्रणाली प्रदान करने का प्रयास करते हैं। सहयोग, संयुक्त उद्यमों और राष्ट्रीय विकास योजनाओं में भागीदारी के माध्यम से, हम एक समावेशी, दयालु और प्रगतिशील समाज का निर्माण करना चाहते हैं। आइए, मिलकर एक ऐसा भविष्य बनाएं जहां ज्ञान, करुणा और कार्रवाई पूरे देश में सेवा और आत्म-सुधार की भावना को जगाने के लिए एक साथ आएं।",
    about_vision_title: 'हमारी दृष्टि',
    about_vision_p1: "विवेकानंद अवेकनिंग फाउंडेशन एक ऐसे भविष्य की कल्पना करता है जहां प्रत्येक व्यक्ति, पृष्ठभूमि या परिस्थिति की परवाह किए बिना, गरिमा, उद्देश्य और आत्मनिर्भरता का जीवन जीने के लिए सशक्त हो। भारत के कालातीत आध्यात्मिक और नैतिक मूल्यों में निहित और आधुनिक वैज्ञानिक ज्ञान से मजबूत होकर, हम एक दयालु, समावेशी और प्रगतिशील समाज का निर्माण करने की आकांक्षा रखते हैं जो व्यक्तिगत विकास और सामूहिक कल्याण दोनों का पोषण करे।",
    about_vision_p2: "हम एक ऐसा भारत देखते हैं जहां मानसिक कल्याण, शिक्षा, पर्यावरणीय स्थिरता और सामाजिक और आर्थिक सशक्तिकरण सभी के लिए सुलभ हो - जहां ग्रामीण और शहरी समुदाय समान रूप से सद्भाव में पनपें, और प्रत्येक व्यक्ति को अपनी पूरी क्षमता का एहसास करने का अवसर मिले। हमारी दृष्टि सकारात्मक व्यवहार परिवर्तन को प्रेरित करना है जो सद्भाव, समानता और नैतिक जीवन को बढ़ावा दे, यह सुनिश्चित करते हुए कि विकास मानवीय मूल्यों या पारिस्थितिक संतुलन की कीमत पर न हो।",
    about_vision_p3: "हम एक ऐसे समाज के लिए प्रयास करते हैं जहां महिलाएं, युवा, कारीगर और हाशिए पर पड़े समूह न केवल ऊपर उठें बल्कि राष्ट्र की प्रगति में प्रमुख योगदानकर्ताओं के रूप में पहचाने जाएं। हम एक ऐसे भविष्य की कल्पना करते हैं जहां व्यक्तियों, संगठनों और संस्थानों के बीच सहयोग सामाजिक चुनौतियों के लिए नवीन समाधानों को जन्म दे, और जहां समुदाय-संचालित कार्रवाई स्थायी परिवर्तन की नींव बने। कौशल विकास, उद्यमिता सहायता, सलाह, वकालत और जागरूकता अभियानों के माध्यम से, हमारा लक्ष्य निरंतर सीखने, लचीलापन और सेवा की संस्कृति को बढ़ावा देना है। हम देश भर में उत्कृष्टता के केंद्र बनाने की कल्पना करते हैं जो अच्छी जीवन शैली, नैतिक शक्ति और मानसिक कल्याण को बढ़ावा दें, साथ ही हमारी भावी पीढ़ियों के लिए हमारे प्राकृतिक पर्यावरण का संरक्षण करें। हम जो कुछ भी करते हैं, उसमें हम निःस्वार्थ सेवा के आदर्श और इस विश्वास से निर्देशित होते हैं कि सच्ची प्रगति इस बात से मापी जाती है कि हम अपने बीच के सबसे कमजोर लोगों को कैसे ऊपर उठाते हैं। साथ मिलकर, हम एक जाग्रत भारत की दिशा में काम करते हैं - एक ऐसा राष्ट्र जहां करुणा और ज्ञान सतत और समावेशी विकास का मार्ग रोशन करते हैं।",
    about_journey_title: 'हमारी अब तक की यात्रा',
    about_timeline_event_2025: "फाउंडेशन की स्थापना हुई।",
    about_values_title: 'हमारे मूल मूल्य',
    "about_value_holistic_growth_name": "समग्र विकास",
    "about_value_holistic_growth_desc": "हम संपूर्ण मानव विकास को सक्षम करने के लिए आधुनिक विज्ञान और कालातीत आध्यात्मिक ज्ञान के संतुलित मिश्रण के माध्यम से मन, शरीर और आत्मा का पोषण करने में विश्वास करते हैं।",
    "about_value_inclusiveness_name": "समावेशिता और एकता",
    "about_value_inclusiveness_desc": "हम समाज के सभी वर्गों - शहरी और ग्रामीण, युवा और वृद्ध, पुरुष और महिलाएं - को शामिल करके समावेशी प्रगति को बढ़ावा देने के लिए प्रतिबद्ध हैं - यह सुनिश्चित करते हुए कि कोई भी पीछे न रहे।",
    "about_value_empowerment_name": "ज्ञान के माध्यम से सशक्तिकरण",
    "about_value_empowerment_desc": "हम शिक्षा, कौशल-निर्माण और उद्यमिता को शक्तिशाली उपकरणों के रूप में बढ़ावा देते हैं ताकि व्यक्तियों को आत्मविश्वासी, आत्मनिर्भर और अपने भविष्य को स्वयं आकार देने में सक्षम बनाया जा सके।",
    "about_value_sustainability_name": "स्थिरता और प्रबंधन",
    "about_value_sustainability_desc": "हम पर्यावरण की रक्षा करने और स्थायी प्रथाओं को बढ़ावा देने की अपनी जिम्मेदारी का सम्मान करते हैं जो भावी पीढ़ियों के लिए एक स्वस्थ, संतुलित दुनिया सुनिश्चित करती हैं।",
    "about_value_compassion_name": "करुणा और सामुदायिक सेवा",
    "about_value_compassion_desc": "हम सहानुभूति, दया और सेवा की गहरी भावना से निर्देशित होते हैं, दूसरों को ऊपर उठाने और समुदायों को मजबूत करने के लिए निःस्वार्थ रूप से काम करते हैं।",
    "about_value_collaboration_name": "सहयोग और साझा प्रगति",
    "about_value_collaboration_desc": "हम साझा दृष्टि, नवाचार और सामूहिक कार्रवाई के माध्यम से स्थायी प्रभाव पैदा करने के लिए सरकारों, गैर सरकारी संगठनों और समुदायों के साथ साझेदारी को महत्व देते हैं।",
    about_non_commercial: 'एक गैर-वाणिज्यिक संगठन के रूप में, हमारा प्राथमिक ध्यान सेवा और सामाजिक उत्थान है, यह सुनिश्चित करते हुए कि हमारे सभी संसाधन हमारे मिशन के लिए समर्पित हैं।',
    about_inspired_title: 'शाश्वत ज्ञान से प्रेरित',
    about_inspired_alt_text: "शाश्वत ज्ञान का प्रतिनिधित्व करने वाला ध्यानमग्न व्यक्ति",
    about_vivekananda_quote: '"उठो, जागो और तब तक मत रुको जब तक लक्ष्य प्राप्त न हो जाए।" - स्वामी विवेकानन्द',
    about_philosophy: 'हमारा काम वेदांत की सार्वभौमिक शिक्षाओं और स्वामी विवेकानंद के प्रेरक जीवन में गहराई से निहित है, जो निःस्वार्थ सेवा, शक्ति और प्रत्येक व्यक्ति के भीतर निहित देवत्व पर जोर देता है।',

    // Programs Page
    programs_hero_title: "हमारे कार्यक्रम",
    programs_hero_subtitle: "समग्र कल्याण और सामाजिक उत्थान के लिए समर्पित पहल। जानें कि हम कैसे बदलाव लाते हैं।",
    programs_get_involved_button: "शामिल हों",
    programs_cta_title: "क्या आप प्रभाव डालने के लिए तैयार हैं?",
    programs_cta_subtitle: "आपका समर्थन हमें इन कार्यक्रमों का विस्तार करने और अधिक जरूरतमंद व्यक्तियों तक पहुंचने में मदद कर सकता है। जानें कि आप कैसे योगदान या स्वयंसेवा कर सकते हैं।",
    programs_cta_button: "हमारे काम का समर्थन करें",
    programs_loading: "कार्यक्रम लोड हो रहे हैं...",
    programs_no_programs_in_category: "{category} के अंतर्गत फ़िलहाल कोई कार्यक्रम सूचीबद्ध नहीं है।",
    programs_no_programs_available: "फ़िलहाल कोई कार्यक्रम उपलब्ध नहीं है। कृपया बाद में पुनः देखें।",

    // Mythology & Meditation Page
    mythology_hero_alt_icon: "पौराणिक कथाएं और ध्यान चिह्न",
    mythology_hero_title: "पौराणिक कथाएं और ध्यान संसाधन",
    mythology_hero_subtitle: "आध्यात्मिक विकास और मानसिक स्पष्टता के लिए प्राचीन ज्ञान और आधुनिक समझ के संगम का अन्वेषण करें।",
    mythology_intro_title: "आंतरिक ज्ञान का मार्ग",
    mythology_intro_p1: "उन संसाधनों के एक क्यूरेटेड संग्रह में तल्लीन हों जो वेदों, उपनिषदों और भारतीय पौराणिक कथाओं की कालातीत शिक्षाओं को ध्यान और सचेतनता पर समकालीन वैज्ञानिक अंतर्दृष्टि के साथ जोड़ते हैं। हमारा उद्देश्य सुलभ ज्ञान प्रदान करना है जो व्यक्तिगत विकास, शांति और जीवन की गहरी समझ को प्रेरित करता है।",
    mythology_tab_all: "सभी संसाधन",
    mythology_tab_articles: "लेख",
    mythology_tab_videos: "वीडियो",
    mythology_tab_podcasts: "पॉडकास्ट",
    mythology_no_articles_message: "फिलहाल कोई लेख उपलब्ध नहीं है। जल्द ही वापस देखें!",
    mythology_no_videos_message: "फिलहाल कोई वीडियो उपलब्ध नहीं है। जल्द ही वापस देखें!",
    mythology_no_podcasts_message: "फिलहाल कोई पॉडकास्ट उपलब्ध नहीं है। जल्द ही वापस देखें!",
    mythology_no_resources_message: "अभी तक कोई संसाधन उपलब्ध नहीं है। कृपया बाद में पुनः देखें!",
    mythology_read_article_button: "लेख पढ़ें",
    mythology_watch_video_button: "वीडियो देखें",
    mythology_listen_podcast_button: "पॉडकास्ट सुनें",
    mythology_view_resource_button: "संसाधन देखें",

    // Blog Page
    blog_hero_alt_icon: "विवेकानंद अवेकनिंग फाउंडेशन ब्लॉग चिह्न",
    blog_hero_title: "विवेकानंद अवेकनिंग फाउंडेशन ब्लॉग",
    blog_hero_subtitle: "कल्याण, आध्यात्मिक विकास, सामाजिक प्रभाव और विज्ञान और परंपरा के संगम पर अंतर्दृष्टि।",
    blog_search_placeholder: "लेख खोजें...",
    blog_search_button: "खोजें",
    blog_no_posts_title: "कोई पोस्ट नहीं मिली",
    blog_no_posts_query_message: "क्षमा करें, हमें \"{query}\" से मेल खाने वाली कोई पोस्ट नहीं मिली। कोई दूसरा खोज शब्द आज़माएँ।",
    blog_no_posts_default_message: "अभी तक कोई ब्लॉग पोस्ट नहीं है। कृपया बाद में वापस देखें!",
    blog_post_back_button: "सभी लेखों पर वापस जाएं",
    blog_read_more_button: "और पढ़ें",
    blog_loading_post: "पोस्ट लोड हो रही है...",

    // Store Page
    store_hero_title: "फाउंडेशन स्टोर",
    store_hero_subtitle: "सार्थक वस्तुओं की खरीद कर हमारे मिशन का समर्थन करें। सभी आय हमारे कार्यक्रमों को निधि देने में मदद करती है।",
    store_loading_products: "उत्पाद लोड हो रहे हैं...",
    store_no_products_title: "स्टोर जल्द ही आ रहा है",
    store_no_products_message: "हमारा स्टोर निर्माणाधीन है। प्रेरणादायक उत्पादों के लिए कृपया बाद में वापस देखें!",
    store_in_stock: "स्टॉक में है",
    store_out_of_stock: "स्टॉक में नहीं है",
    store_no_description: "कोई विवरण उपलब्ध नहीं है।",
    store_add_to_cart_button: "कार्ट में डालें (जल्द आ रहा है)",
    store_notify_me_button: "उपलब्ध होने पर सूचित करें",
    store_notify_me_dialog_title: "सूचित हों",
    store_notify_me_dialog_desc: "यह उत्पाद वर्तमान में स्टॉक में नहीं है। वापस आने पर सूचित होने के लिए नीचे अपना ईमेल दर्ज करें।",
    store_notify_me_email_label: "ईमेल",
    store_notify_me_cancel_button: "रद्द करें",
    store_notify_me_submit_button: "मुझे सूचित करें",
    store_notify_me_submitting_button: "सबमिट हो रहा है...",
    store_notify_me_success_title: "अधिसूचना का अनुरोध किया गया",
    store_notify_me_success_desc: "यह उत्पाद स्टॉक में वापस आने पर आपको सूचित किया जाएगा।",
    store_notify_me_error_title: "अनुरोध विफल",
    store_notify_me_error_desc: "आपकी अधिसूचना अनुरोध सबमिट नहीं किया जा सका। कृपया पुनः प्रयास करें।",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('vivekawell-lang') as Language | null;
    if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'hi')) {
      setLanguage(storedLanguage);
    }
    document.documentElement.lang = storedLanguage || 'en';
  }, []);

  useEffect(() => {
    localStorage.setItem('vivekawell-lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, replacements?: Record<string, string | number | undefined>, defaultValue?: string): string => {
    let translation = translations[language]?.[key] || translations['en']?.[key] || defaultValue || key;
    if (replacements) {
      Object.keys(replacements).forEach((placeholder) => {
        const replacementValue = replacements[placeholder];
        if (replacementValue !== undefined) {
          translation = translation.replace(new RegExp(`{${placeholder}}`, 'g'), String(replacementValue));
        }
      });
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
