import React from "react";

const items = [
  {
    q: "How do I reserve a locker?",
    a: "Browse available locations from the Locations page, pick a locker that suits you, and confirm your reservation online. You'll need to be logged in to complete the booking.",
  },
  {
    q: "Can I change or cancel my reservation?",
    a: "Yes. Go to My Reservations, find the reservation you want to manage, and click Edit to update the dates or Cancel to remove it.",
  },
  {
    q: "How do I access my locker?",
    a: "Once your reservation is confirmed and payment is processed, your locker will be linked to your smart device automatically through our IoT system.",
  },
  {
    q: "What security features do the lockers have?",
    a: "All SmartSecureLockers are equipped with smart sensors and connected to a central monitoring system that tracks activity in real time, 24/7.",
  },
  {
    q: "How does payment work?",
    a: "After confirming your reservation, you'll be redirected to the payment page. We accept Visa, MasterCard, and Bank Transfer.",
  },
  {
    q: "What subscription plans are available?",
    a: "We offer Starter, Standard, and Business plans with different locker access limits, durations, and discount rates. Visit the Plans page to compare and subscribe.",
  },
  {
    q: "Can I set my subscription to auto-renew?",
    a: "Yes. When subscribing, simply check the Auto Renew option and your plan will renew automatically at the end of each period.",
  },
  {
    q: "What happens if a locker needs maintenance?",
    a: "Our system flags lockers that require maintenance and notifies you in advance. You can check locker status from the Lockers page at any time.",
  },
];

export default function FAQ() {
  return (
    <div className="bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-slate-600">
          Answers to the most common questions about SmartSecureLockers.
        </p>

        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <details
              key={item.q}
              className="bg-white rounded-2xl border border-slate-200 p-4 group"
            >
              <summary className="cursor-pointer font-semibold text-slate-900 list-none flex justify-between items-center">
                {item.q}
                <span className="text-indigo-600 text-lg group-open:rotate-45 transition-transform duration-200">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}