import { useLanguage } from '../i18n/LanguageContext';
import './AboutMe.css';

export function AboutMe() {
  const { t, tList } = useLanguage();

  return (
    <section id="about-me">
      <div className="about-container">
        <h2>{t('about.heading')}</h2>
        <p>{t('about.paragraph1')}</p>
        <p>{t('about.paragraph2')}</p>
        <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
          {tList('about.listItems').map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p style={{ marginTop: '1.5rem' }}>{t('about.closing')}</p>
      </div>
    </section>
  );
}
