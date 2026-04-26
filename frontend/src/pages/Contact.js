import React from "react";

export default function Contact() {
  return (
    <div className="bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-slate-900">Contact us</h1>
        <p className="mt-2 text-slate-600">
          Have a question about your locker, reservation, or subscription?
          Reach out to us through any of the channels below.
        </p>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900">📧 Email</h3>
            <p className="mt-2 text-sm text-slate-600">
              Send us an email and we'll get back to you within 24 hours.
            </p>
            <p className="mt-3 text-sm font-semibold text-indigo-600">
              support@smartsecurelockers.com
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900">📞 Phone</h3>
            <p className="mt-2 text-sm text-slate-600">
              Available Sunday to Thursday, 9am to 5pm Cairo time.
            </p>
            <p className="mt-3 text-sm font-semibold text-indigo-600">
              +20 100 000 0000
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900">📍 Location</h3>
            <p className="mt-2 text-sm text-slate-600">
              Our headquarters are based in Cairo, Egypt.
            </p>
            <p className="mt-3 text-sm font-semibold text-indigo-600">
              Cairo, Egypt
            </p>
          </div>
        </div>

        <div className="mt-10 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-semibold text-slate-900 mb-1">
            Frequently asked questions
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Before reaching out, you may find your answer here.
          </p>

          <div className="space-y-4 text-sm text-slate-600">
            <div>
              <p className="font-semibold text-slate-700">
                How do I cancel a reservation?
              </p>
              <p className="mt-1">
                Go to My Reservations, find the reservation and click Cancel.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-700">
                How do I access my locker?
              </p>
              <p className="mt-1">
                Once your reservation is confirmed, your smart device will be
                linked to your locker automatically.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-700">
                Can I change my subscription plan?
              </p>
              <p className="mt-1">
                Yes, go to My Subscriptions and cancel your current plan, then
                choose a new one from the Plans page.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-700">
                What payment methods are accepted?
              </p>
              <p className="mt-1">
                We accept Visa, MasterCard, and Bank Transfer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}