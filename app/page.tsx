"use client";

import React, { useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Github, Linkedin, Mail, MapPin, Phone, Briefcase, GraduationCap, Code2, Award, ChevronDown, User, Server, Globe } from "lucide-react";
import Image from "next/image";

// ─── 3D MOCKUP COMPONENT ─────────────────────────────────────────────────────────
function TiltMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full aspect-square max-w-lg mx-auto flex items-center justify-center cursor-pointer perspective-[1000px]"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full" style={{ transform: "translateZ(-50px)" }} />
      
      {/* Desktop Mockup */}
      <motion.div
        className="absolute w-[95%] h-[65%] bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl flex flex-col backdrop-blur-xl"
        style={{ transform: "translateZ(40px)" }}
      >
        <div className="h-6 w-full bg-slate-800/80 border-b border-slate-700/50 flex items-center px-3 gap-1.5 backdrop-blur-md">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/90 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/90 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/90 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
        </div>
        <div className="flex-1 bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-900 p-6 relative overflow-hidden flex items-center justify-center">
           {/* Abstract Code UI */}
           <div className="w-full h-full border border-slate-800/50 rounded-xl bg-slate-950/50 p-4">
             <div className="space-y-3 opacity-60">
               <div className="h-2.5 bg-indigo-500/40 rounded-full w-1/3"></div>
               <div className="h-2.5 bg-slate-500/40 rounded-full w-1/2"></div>
               <div className="h-2.5 bg-slate-500/40 rounded-full w-1/4"></div>
               <div className="h-2.5 bg-indigo-400/40 rounded-full w-2/3 mt-6"></div>
               <div className="h-2.5 bg-slate-500/40 rounded-full w-1/2"></div>
               <div className="h-2.5 bg-slate-500/40 rounded-full w-5/6"></div>
             </div>
           </div>
           {/* Floating elements */}
           <motion.div 
             animate={{ y: [0, -10, 0] }} 
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="absolute bottom-4 right-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"
           />
        </div>
      </motion.div>

      {/* iPhone 13 Mockup */}
      <motion.div
        className="absolute right-[0%] bottom-[0%] w-[32%] h-[65%] bg-slate-950 border-[5px] border-slate-700/80 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col"
        style={{ transform: "translateZ(100px)" }}
      >
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-5 bg-slate-700/80 rounded-b-xl w-[45%] mx-auto z-10" />
        <div className="w-full h-full bg-gradient-to-b from-indigo-900/40 to-slate-900 flex flex-col p-4 pt-10 gap-3 relative overflow-hidden">
            <div className="h-16 w-full bg-indigo-500/20 rounded-xl border border-indigo-500/10 backdrop-blur-md"></div>
            <div className="h-12 w-full bg-slate-800/50 rounded-xl border border-slate-700/50"></div>
            <div className="h-12 w-full bg-slate-800/50 rounded-xl border border-slate-700/50"></div>
            <div className="h-12 w-full bg-slate-800/50 rounded-xl border border-slate-700/50"></div>
            {/* Glossy overlay */}
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent pointer-events-none mix-blend-overlay"></div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── HERO SECTION ───────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-10 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 w-fit">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-medium tracking-wide">Available for Work</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-50 leading-[1.1]">
              Hi, I'm <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                Resa Swastyani
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-300 font-light max-w-xl">
              Web Developer & Software Engineer crafting high-performance, zero-error digital experiences.
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
              <a href="#contact" className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]">
                Contact Me
              </a>
              <a href="#experience" className="px-6 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-slate-300 font-medium transition-colors backdrop-blur-sm">
                View Work
              </a>
            </div>

            <div className="flex items-center gap-6 mt-6 text-slate-400">
              <a href="#" className="hover:text-indigo-400 transition-colors"><Github className="w-6 h-6" /></a>
              <a href="#" className="hover:text-indigo-400 transition-colors"><Linkedin className="w-6 h-6" /></a>
              <a href="mailto:resaarrazy@gmail.com" className="hover:text-indigo-400 transition-colors"><Mail className="w-6 h-6" /></a>
            </div>
          </motion.div>

          {/* 3D Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="w-full flex justify-center"
          >
            <TiltMockup />
          </motion.div>
        </div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
}

// ─── ABOUT SECTION ──────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section id="about" className="py-24 relative z-10 bg-slate-900/50 border-y border-slate-800/50">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-3xl overflow-hidden border-2 border-indigo-500/20 shadow-2xl shadow-indigo-500/10 relative"
          >
            {/* Menggunakan placeholder foto elegan karena path lokal tidak tersedia langsung. User bisa mengganti src dengan path foto yang sebenarnya di public/ (misal: /profile.jpg). */}
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop" 
              alt="Resa Swastyani"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent mix-blend-multiply" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <User className="w-8 h-8 text-indigo-400" />
              Tentang Saya
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed font-light">
              Saya seorang profesional web developer & software engineer. Saya percaya bahwa kualitas adalah kunci utama dalam menghasilkan produk teknologi yang memuaskan pengguna. Saya memiliki pengalaman dalam merancang dan mengimplementasikan pengembangan di proyek kampus dan luar kampus yang setiap fitur yang dirilis memiliki kinerja dan keandalan yang optimal dengan tingkat eror hampir 0%.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── COMPETENCIES SECTION ───────────────────────────────────────────────────────
function CompetenciesSection() {
  const skills = [
    { title: "Next.js", category: "Frontend", icon: Globe },
    { title: "Laravel", category: "Backend", icon: Server },
    { title: "Python", category: "Data/Backend", icon: Code2 },
    { title: "PHP", category: "Backend", icon: Code2 },
    { title: "Web Development", category: "Fullstack", icon: Globe },
    { title: "Data Management", category: "Analytics", icon: Server },
    { title: "Target Oriented", category: "Soft Skill", icon: Award },
    { title: "Leadership", category: "Soft Skill", icon: User },
  ];

  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Competencies</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Keahlian teknis dan manajerial yang mendukung pengembangan produk berkualitas.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:bg-slate-800 hover:border-indigo-500/50 transition-all duration-300 backdrop-blur-sm"
            >
              <skill.icon className="w-8 h-8 text-indigo-400/70 group-hover:text-indigo-400 mb-4 transition-colors" />
              <h3 className="font-semibold text-slate-100">{skill.title}</h3>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{skill.category}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── EXPERIENCE SECTION ─────────────────────────────────────────────────────────
function ExperienceSection() {
  const experiences = [
    {
      role: "Leader Programmer",
      company: "CV Seven Smart Indonesia",
      date: "Juli 2025 - Sekarang",
      desc: "Memimpin dan mengoordinasikan tim developer dalam pengembangan aplikasi marketplace dan berbagai produk digital dengan arsitektur modern. Bertanggung jawab atas pengembangan backend menggunakan Laravel 12 dan frontend dengan Next.js.",
    },
    {
      role: "Fullstack Developer",
      company: "PT Agile Sapta Cahaya",
      date: "Agustus - Oktober 2025",
      desc: "Mengembangkan aplikasi pencatatan meteran air yang terintegrasi dengan sistem pengiriman tagihan otomatis serta pengingat melalui WhatsApp. Menggunakan Next.js sebagai bahasa pemrograman utama.",
    },
    {
      role: "Tim Penelitian Aplikasi Prediksi",
      company: "STMIK El Rahma Yogyakarta",
      date: "Februari - Juni 2025",
      desc: "Membuat aplikasi prediksi kelulusan mahasiswa dengan metodologi CRISP-DM, menggunakan algoritma KNN, Decision Tree, dan Naïve Bayes. Implementasi machine learning menggunakan Python (Scikit-learn, Pandas) dan Streamlit.",
    },
    {
      role: "Backend Developer",
      company: "PT Dewa Nusa utama",
      date: "Februari - April 2025",
      desc: "Bertanggung jawab untuk sistem backend website perumahan menggunakan Laravel, mencakup pengelolaan data properti, user management, dan integrasi pembayaran.",
    },
    {
      role: "Tim Pemateri Pelatihan AI",
      company: "LPPM STMIK El Rahma",
      date: "September 2024",
      desc: "Kegiatan pelatihan merancang administrasi guru dengan Artificial Intelligence (AI) bagi guru-guru MGMP Bahasa Inggris Kabupaten Sleman.",
    },
    {
      role: "Full Stack Web Developer",
      company: "Maharani Transport",
      date: "Februari - Maret 2023",
      desc: "Mengembangkan dan memelihara situs web perusahaan, yang menawarkan layanan penyewaan mobil. Dibangun menggunakan Bootstrap, SQL, dan PHP.",
    }
  ];

  return (
    <section id="experience" className="py-24 relative z-10 bg-slate-900/30 border-y border-slate-800/50">
      <div className="container mx-auto px-6 lg:px-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center flex items-center justify-center gap-3">
          <Briefcase className="w-8 h-8 text-indigo-400" />
          Professional Experience
        </h2>

        <div className="max-w-4xl mx-auto space-y-8">
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative pl-8 md:pl-0"
            >
              <div className="md:grid md:grid-cols-4 md:gap-8 items-start">
                {/* Timeline dot and line for desktop */}
                <div className="hidden md:flex flex-col items-end pt-1">
                  <span className="text-sm font-medium text-indigo-400">{exp.date}</span>
                </div>
                
                {/* Mobile date */}
                <span className="md:hidden text-xs font-medium text-indigo-400 mb-2 block">{exp.date}</span>

                <div className="md:col-span-3 bg-slate-900/80 border border-slate-800 p-6 md:p-8 rounded-2xl shadow-xl hover:border-slate-700 transition-colors">
                  <h3 className="text-xl font-bold text-slate-100">{exp.role}</h3>
                  <h4 className="text-md text-slate-400 font-medium mb-4">{exp.company}</h4>
                  <p className="text-slate-300 font-light leading-relaxed text-sm md:text-base">
                    {exp.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── EDUCATION & CERTIFICATIONS ────────────────────────────────────────────────
function EducationSection() {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Education */}
          <div>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-indigo-400" />
              Education
            </h2>
            <div className="space-y-6">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-slate-900 to-slate-900/50 p-6 rounded-2xl border border-slate-800"
              >
                <div className="text-xs text-indigo-400 mb-1">2021 - 2025</div>
                <h3 className="text-lg font-bold">Bachelor of Computer Science</h3>
                <p className="text-slate-400 text-sm">STMIK El Rahma Yogyakarta</p>
                <div className="mt-3 inline-block px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full border border-yellow-500/20">
                  Wisudawati Terbaik TA 2024/2025
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-slate-900 to-slate-900/50 p-6 rounded-2xl border border-slate-800"
              >
                <div className="text-xs text-indigo-400 mb-1">2018 - 2021</div>
                <h3 className="text-lg font-bold">MIPA (Matematika Ilmu Pengetahuan Alam)</h3>
                <p className="text-slate-400 text-sm">SMA Negeri 5 Surakarta</p>
              </motion.div>
            </div>
          </div>

          {/* Certifications & Organization */}
          <div>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Award className="w-6 h-6 text-indigo-400" />
              Certifications & Org
            </h2>
            <div className="space-y-4">
              {[
                { title: "MTCNA (MikroTik Certified Network Associate)", issuer: "MikroTik (2025)" },
                { title: "HackerRank Software Engineer", issuer: "HackerRank (2025)" },
                { title: "Peraih Pendanaan PM2W", issuer: "Ditjen Diktiristek (2023)" },
                { title: "Ketua Umum HIMATIKA", issuer: "STMIK El Rahma (2023 - 2024)" }
              ].map((cert, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-800"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 text-indigo-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-200">{cert.title}</h4>
                    <p className="text-sm text-slate-500">{cert.issuer}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer id="contact" className="relative z-10 border-t border-slate-800/50 bg-slate-950 pt-20 pb-10 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-12 relative">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Mari Bekerja Sama</h2>
          <p className="text-slate-400 max-w-xl mb-10">
            Saya selalu terbuka untuk mendiskusikan proyek baru, ide kreatif, atau peluang untuk menjadi bagian dari visi Anda.
          </p>
          <a href="mailto:resaarrazy@gmail.com" className="px-8 py-4 rounded-full bg-slate-50 text-slate-950 font-bold hover:bg-slate-200 transition-colors shadow-xl shadow-white/5">
            resaarrazy@gmail.com
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-slate-800/50">
          <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400">
            <Phone className="w-4 h-4" />
            <span className="text-sm">+62 8570 2212 770</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <MapPin className="w-4 h-4" />
            <span className="text-sm text-center">Ngesrep, Ngemplak, Boyolali 57375</span>
          </div>
          <div className="flex items-center justify-center md:justify-end gap-6 text-slate-400">
            <a href="#" className="hover:text-indigo-400 transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="hover:text-indigo-400 transition-colors"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function PortfolioPage() {
  return (
    <main className="bg-slate-950 text-slate-50 min-h-screen font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      <CompetenciesSection />
      <ExperienceSection />
      <EducationSection />
      <Footer />
    </main>
  );
}
