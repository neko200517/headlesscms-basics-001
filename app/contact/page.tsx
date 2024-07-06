import SiteHeader from '@/components/SiteHeader';
import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contact Us',
  description: 'Contact us to know more details',
};

export default function Contact() {
  return (
    <>
      <section className='bg-slate-700'>
        <SiteHeader className='header-contact' />
      </section>
      <ContactForm />
    </>
  );
}
