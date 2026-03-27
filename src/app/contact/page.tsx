'use client';

import Link from 'next/link';

export default function Contact() {
  return (
    <div className="min-h-screen" style={{ background: '#FFFBF5' }}>

      {/* ─── Hero Banner ─── */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold tracking-widest text-amber-500 uppercase mb-4">Reach Out</p>
              <h1 className="text-5xl font-black text-gray-900 leading-tight">
                Get in Touch<br />
                with <span className="text-amber-500">Us</span>
              </h1>
            </div>
            <div className="bg-amber-50 rounded-3xl h-44 flex items-center justify-center text-7xl">🥦</div>
          </div>
        </div>
      </section>

      {/* ─── Contact Content ─── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

            {/* Left: Image + about */}
            <div>
              <div className="bg-amber-400 rounded-3xl h-64 flex items-center justify-center relative mb-8">
                <div className="text-center">
                  <div className="text-7xl mb-2">👨‍🍳</div>
                </div>
                <div className="absolute bottom-6 left-6 bg-white/90 rounded-xl px-4 py-2">
                  <p className="text-sm font-bold text-gray-900">Contact Information</p>
                </div>
              </div>

              <p className="text-gray-500 leading-relaxed mb-8">
                Connect with culinary excellence effortlessly. Whether you have a burning question about a recipe or want to share your cooking triumphs, our dedicated team is just a message away for our food-loving community.
              </p>

              {/* Contact info cards */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Phone</p>
                  <p className="font-bold text-gray-900">(+555) 555-1234</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Email Address</p>
                  <p className="font-bold text-gray-900">info@bitebase.com</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Location</p>
                  <p className="font-bold text-gray-900">123 Culinary Street, Foodieville, Any State CO 12345</p>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="bg-gray-100 rounded-2xl h-48 flex items-center justify-center border border-gray-200">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">🗺️</div>
                  <p className="text-sm font-medium">Map — New York, NY</p>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-black text-gray-900 mb-2">Send Us a Message</h2>
              <p className="text-gray-500 text-sm mb-8">
                Have questions, suggestions, or recipes to share? We&apos;d love to hear from you.
              </p>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Your name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-semibold text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    placeholder="What's this about?"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-gray-700 mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Your message..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 px-6 rounded-full transition text-sm"
                >
                  Send Message →
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-900 mb-4">Follow us on social media:</p>
                <div className="flex gap-3">
                  {['Facebook', 'Instagram', 'Pinterest', 'YouTube'].map((s) => (
                    <a
                      key={s}
                      href="#"
                      className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                    >
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
