import React from "react";

export default function About() {
  return (
    <div className="bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-slate-900">
          About SmartSecureLockers
        </h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          SmartSecureLockers is an innovative locker management platform
          designed to give individuals and businesses instant access to secure,
          smart lockers across Egypt. Whether you need to store your belongings
          for a few hours or several months, our network of IoT-enabled lockers
          makes it effortless — reserve online, access with a smart device, and
          manage everything from your account.
        </p>

        <p className="mt-4 text-slate-600 leading-relaxed">
          Every locker in our network is equipped with smart sensors and
          connected to a central monitoring system, ensuring your belongings are
          protected around the clock. Our platform bridges the gap between
          physical security and digital convenience, giving you real-time
          visibility and full control over your reservations.
        </p>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border shadow-sm p-5">
            <h3 className="font-semibold text-slate-900">Our mission</h3>
            <p className="mt-2 text-sm text-slate-600">
              To make secure storage as simple as a tap on your phone — smart,
              seamless, and accessible to everyone across Egypt.
            </p>
          </div>
          <div className="bg-white rounded-2xl border shadow-sm p-5">
            <h3 className="font-semibold text-slate-900">Our vision</h3>
            <p className="mt-2 text-sm text-slate-600">
              To become Egypt's leading smart locker network, transforming how
              people store, access, and protect their belongings in every city.
            </p>
          </div>
          <div className="bg-white rounded-2xl border shadow-sm p-5">
            <h3 className="font-semibold text-slate-900">Our values</h3>
            <p className="mt-2 text-sm text-slate-600">
              Security, innovation, and transparency — we build trust by
              delivering smart solutions that put the user in control at all
              times.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}