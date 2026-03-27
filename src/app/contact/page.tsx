'use client';

import Image from 'next/image';
import PageAnimations from '@/components/PageAnimations';

const contactInfo = [
  {
    label: 'Phone',
    value: '(+555) 555-1234',
    icon: '📞',
  },
  {
    label: 'Email Address',
    value: 'info@bitebase.com',
    icon: '✉️',
  },
  {
    label: 'Location',
    value: '123 Culinary Street, Foodieville, CO 12345',
    icon: '📍',
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <PageAnimations />

      {/* ─── Hero Banner ─── */}
      <section className="bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{ background: '#F8F5F0', minHeight: '200px' }}
          >
            <div className="relative z-10 flex flex-col justify-center h-full px-10 py-12 max-w-sm">
              <h1 data-gsap="hero" className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                Get in Touch<br />
                <span className="text-amber-500">with</span> Us
              </h1>
            </div>
            <div className="absolute inset-y-0 right-0 w-1/2 lg:w-3/5">
              <Image
                src="/images/home/hero-food.jpg"
                alt="Food"
                fill
                className="object-cover object-left"
                priority
              />
              <div className="absolute inset-y-0 left-0 w-2/5 bg-linear-to-r from-[#F8F5F0] to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Contact Block ─── */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* LEFT: Dark editorial panel */}
            <div
              data-gsap="slide-left"
              className="relative rounded-3xl overflow-hidden flex flex-col justify-between p-10"
              style={{ background: '#1A1A1A', minHeight: '520px' }}
            >
              {/* Background image — subtle overlay */}
              <div className="absolute inset-0">
                <Image
                  src="/images/home/step-cutting.jpg"
                  alt="Kitchen"
                  fill
                  className="object-cover opacity-20"
                />
              </div>

              {/* Content on top */}
              <div className="relative z-10">
                <p className="text-amber-500 text-xs font-bold tracking-widest uppercase mb-4">Contact Us</p>
                <h2 className="text-3xl font-black text-white leading-tight mb-4">
                  Let&rsquo;s Start a<br />
                  <span className="text-amber-500">Conversation</span>
                </h2>
                <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                  Whether you have a burning question about a recipe or want to share your cooking triumphs, our team is here for you.
                </p>
              </div>

              {/* Contact info items */}
              <div className="relative z-10 space-y-5 mt-10">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-base shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-white/40 text-xs mb-0.5">{item.label}</p>
                      <p className="text-white font-bold text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Decorative amber circle */}
              <div
                className="absolute bottom-[-60px] right-[-60px] w-48 h-48 rounded-full opacity-10"
                style={{ background: '#F59E0B' }}
              />
            </div>

            {/* RIGHT: Form panel */}
            <div
              data-gsap="slide-right"
              className="bg-gray-50 rounded-3xl p-10 flex flex-col justify-center"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-2">Send a Message</h2>
              <p className="text-gray-400 text-sm mb-8">
                Fill in the form and we&apos;ll get back to you within 24 hours.
              </p>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                    <input
                      type="email"
                      placeholder="you@email.com"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Subject</label>
                  <input
                    type="text"
                    placeholder="What's this about?"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-400 transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-between bg-gray-900 hover:bg-amber-500 text-white font-bold py-4 px-6 rounded-full transition text-sm"
                >
                  <span>Send Message</span>
                  <span className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-xs">→</span>
                </button>
              </form>

              {/* Socials */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex items-center gap-4">
                <p className="text-xs text-gray-400 font-semibold">Follow us:</p>
                {['Instagram', 'Facebook', 'Pinterest', 'YouTube'].map((s) => (
                  <a key={s} href="#" className="text-xs font-semibold text-gray-500 hover:text-amber-500 transition">
                    {s}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
