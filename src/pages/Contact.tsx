const Contact = () => {
  const phoneNumber = '01148820088';
  const whatsappLink = `https://wa.me/2${phoneNumber}`;

  return (
    <section className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-right">تواصل معنا</h1>
      
      <div className="space-y-6 text-right">
        <div className="bg-white/60 dark:bg-white/5 border rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-primary-600 mb-4">📞 معلومات التواصل</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">واتساب:</h3>
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2 my-2"
              >
                <span>01148820088</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.96.6 3.77 1.63 5.28L2 22l4.72-1.63A9.95 9.95 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.66 0-3.21-.51-4.5-1.38l-.3-.18-3.12.82.83-3.04-.2-.31A7.95 7.95 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.5-12h-9v1.5h9v-1.5zm-9 4h6v1.5h-6v-1.5z" />
                </svg>
              </a>
              <p className="text-black/80 dark:text-white/80 mt-1">فريق خدمة العملاء متاح للرد على استفساراتك</p>
            </div>

           
          </div>
        </div>

        <div className="bg-white/60 dark:bg-white/5 border rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-primary-600 mb-4">📧 أرسل لنا رسالة</h2>
          <p className="text-black/80 dark:text-white/80 mb-4">يمكنك مراسلتنا عبر الواتساب وسنرد عليك في أسرع وقت ممكن</p>
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.96.6 3.77 1.63 5.28L2 22l4.72-1.63A9.95 9.95 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.66 0-3.21-.51-4.5-1.38l-.3-.18-3.12.82.83-3.04-.2-.31A7.95 7.95 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.5-12h-9v1.5h9v-1.5zm-9 4h6v1.5h-6v-1.5z" />
            </svg>
            تواصل معنا على واتساب
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
