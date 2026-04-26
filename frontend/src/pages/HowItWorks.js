import React from "react";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Create an Account",
      desc: "Sign up in seconds. All you need is your name, email, and phone number to get started with SmartSecureLockers.",
    },
    {
      number: "2",
      title: "Browse Locations & Lockers",
      desc: "Explore locker locations across Egypt. Filter by city, check availability, and view locker details including smart device info and maintenance status.",
    },
    {
      number: "3",
      title: "Make a Reservation",
      desc: "Pick your locker, choose your start and end dates, and confirm your reservation online in just a few clicks.",
    },
    {
      number: "4",
      title: "Complete Payment",
      desc: "Pay securely using Visa, MasterCard, or Bank Transfer. Your total is calculated automatically based on your reservation period.",
    },
    {
      number: "5",
      title: "Access Your Locker",
      desc: "Once payment is confirmed, your locker is linked to your smart device. Access it anytime — no keys, no hassle.",
    },
    {
      number: "6",
      title: "Manage Everything Online",
      desc: "Track your reservations, subscriptions, payments, and notifications all from your account dashboard.",
    },
  ];

  return (
    <div className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-slate-900 text-center">
          How SmartSecureLockers Works
        </h1>

        <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto text-center">
          Reserving a smart, secure locker has never been easier. Follow these
          simple steps and you'll be up and running in minutes.
        </p>

        {/* STEPS */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl shadow-sm p-8 border border-slate-200 text-center"
            >
              <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-2xl font-bold">
                {step.number}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* EXTRA INFO */}
        <div className="mt-16 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 grid md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-indigo-600">24/7</p>
            <p className="mt-1 text-sm text-slate-600">
              Locker access, any time of day
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-indigo-600">100%</p>
            <p className="mt-1 text-sm text-slate-600">
              Online — no paperwork needed
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-indigo-600">IoT</p>
            <p className="mt-1 text-sm text-slate-600">
              Smart sensors on every locker
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            to="/lockers"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700"
          >
            Browse Lockers
          </Link>
        </div>
      </div>
    </div>
  );
}