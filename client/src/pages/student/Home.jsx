import React from 'react'
import Hero from '../../components/student/Hero'
import { Companies } from '../../components/student/Companies'
import CoursesSection from '../../components/student/CoursesSection'
import TestimonialsSection from '../../components/student/TestimonialsSection'
import CallToAction from '../../components/student/CallToAction'
import Footer from '../../components/student/Footer'
import PracticeSection from '../../components/student/PracticeSection'
import TopicExplorerSection from '../../components/student/TopicExplorerSection'
import WeeklySprintSection from '../../components/student/WeeklySprintSection'
import RevealOnScroll from '../../components/student/RevealOnScroll'
import ResumeLaunchpadSection from '../../components/student/ResumeLaunchpadSection'
import JobApplyHubSection from '../../components/student/JobApplyHubSection'
import MentorOneOnOneSection from '../../components/student/MentorOneOnOneSection'
const Home = () => {
  return (
    <div className="flex flex-col items-center text-center pb-10 md:pb-14">
      <Hero />
      <div className="section-divider my-5 md:my-7" />
      <RevealOnScroll className="w-full" delayMs={40}>
        <WeeklySprintSection />
      </RevealOnScroll>
      <div className="section-divider my-4 md:my-6" />
      <RevealOnScroll className="w-full" delayMs={80}>
        <Companies />
      </RevealOnScroll>
      <div className="section-divider my-4 md:my-6" />
      <RevealOnScroll className="w-full" delayMs={120}>
        <PracticeSection />
      </RevealOnScroll>
      <RevealOnScroll className="w-full" delayMs={140}>
        <ResumeLaunchpadSection />
      </RevealOnScroll>
      <RevealOnScroll className="w-full" delayMs={170}>
        <JobApplyHubSection />
      </RevealOnScroll>
      <RevealOnScroll className="w-full" delayMs={185}>
        <MentorOneOnOneSection />
      </RevealOnScroll>
      <div className="section-divider my-4 md:my-6" />
      <RevealOnScroll className="w-full" delayMs={160}>
        <TopicExplorerSection />
      </RevealOnScroll>
      <RevealOnScroll className="ui-section-wrap" delayMs={200}>
        <CoursesSection />
      </RevealOnScroll>
      <RevealOnScroll className="ui-section-wrap mt-2 md:mt-4" delayMs={240}>
        <TestimonialsSection />
      </RevealOnScroll>
      <RevealOnScroll className="ui-section-wrap mt-2 md:mt-4" delayMs={280}>
        <CallToAction />
      </RevealOnScroll>
      <Footer />
    </div>
  )
}

export default Home