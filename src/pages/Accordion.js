import React, { useState } from "react";

const AccordionItem = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b w-[50vw] mx-auto mb-6">
      <div
        className="flex justify-between items-center cursor-pointer py-4"
        onClick={toggleAccordion}
      >
        <h3 className="text-xl font-semibold">{title}</h3>
        <span className="text-xl font-bold toggle-icon">
          {isOpen ? "-" : "+"}
        </span>
      </div>
      <p
        className={`text-gray-600 text-md mb-4 ${isOpen ? "block" : "hidden"}`}
      >
        {content}
      </p>
    </div>
  );
};

const Accordion = () => {
  const faqs = [
    {
      title: "Lorem ipsum dolor sit amet consectetur",
      content:
        "Lorem ipsum dolor sit amet consectetur. Pulvinar arcu mattis in at sodales condimentum. Gravida arcu aliquet rutrum erat varius. Tellus felis sed pretium in egestas.",
    },
    {
      title: "Consectetur adipiscing elit",
      content:
        "Pulvinar arcu mattis in at sodales condimentum. Gravida arcu aliquet rutrum erat varius. Tellus felis sed pretium in egestas.",
    },
    {
      title: "Sed do eiusmod tempor incididunt",
      content:
        "Pulvinar arcu mattis in at sodales condimentum. Gravida arcu aliquet rutrum erat varius. Tellus felis sed pretium in egestas.",
    },
  ];

  return (
    <section className="py-32">
      <div className="max-screen-2xl container mx-auto px-10">
        <h2 className="text-center text-3xl font-bold mb-10 text-[#102722]">
          Frequently Asked Questions
        </h2>
        {faqs.map((faq, index) => (
          <AccordionItem key={index} title={faq.title} content={faq.content} />
        ))}
      </div>
    </section>
  );
};

export default Accordion;
