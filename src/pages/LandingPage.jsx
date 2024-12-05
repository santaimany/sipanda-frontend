import React, { useEffect, useState, useRef } from "react";
import Highcharts from "highcharts"; // Modul utama Highcharts
import HighchartsReact from "highcharts-react-official"; // Integrasi Highcharts dengan React
import HighchartsMap from "highcharts/modules/map"; // Modul peta Highcharts
import Exporting from "highcharts/modules/exporting"; // Modul untuk fitur ekspor grafik
import mapData from "@highcharts/map-collection/countries/id/id-all.geo.json";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper";
import Video from "../assets/landingpage/video.mp4";
import Logo from "../assets/logo.png";
import Kontak from "../assets/landingpage/kontak.png";
import Tentang from "../assets/landingpage/tentang.png";
import Fitur from "../assets/landingpage/fitur.jpg";
import Desa0 from "../assets/landingpage/desa0.png";
import Desa1 from "../assets/landingpage/desa1.png";
import Desa2 from "../assets/landingpage/desa2.png";
import Desa3 from "../assets/landingpage/desa3.png";
import Arrow from "../assets/landingpage/arrow.svg";
import Instagram from "../assets/Instagram.png";
import Twitter from "../assets/Twitter.png";
import Facebook from "../assets/Icon.png";
import Email from "../assets/Email.png";
import Kades1 from "../assets/landingpage/kades-cilellang1.png"
import Kades2 from "../assets/landingpage/kades-corawali1.png";
import Kades3 from "../assets/landingpage/kades-tompo1.png";
import Ijan from "../assets/landingpage/ijan2.png";
import Itsar from "../assets/landingpage/itsarjawa.png";
import Pram from "../assets/landingpage/pram.png";
import Santa from "../assets/landingpage/santa.png";
import Arman from "../assets/landingpage/arman.png";
import Logo2 from "../assets/landingpage/Group2.png";
import Kades4 from "../assets/landingpage/kades3.png";
import Kades5 from "../assets/landingpage/kades4.png";
import Kades6 from "../assets/landingpage/kades5.png";
import Peta from "../assets/icons/peta.svg";
import Dashboard from "../assets/icons/dasbord.svg";
import Akses from "../assets/icons/aksesibilitas.svg";
import Realtime from "../assets/icons/realtime.svg";
import Pendataan from "../assets/icons/data.svg";
import Transparansi from "../assets/icons/transparansi.svg";

// Data peta Indonesia

// Inisialisasi modul
if (typeof HighchartsMap === "function") {
  HighchartsMap(Highcharts);
}

if (typeof Exporting === "function") {
  Exporting(Highcharts);
}


const AnimatedText = ({ text }) => {
  const [visibleWordIndex, setVisibleWordIndex] = useState(-1); // Indeks kata yang terlihat
  const [isVisible, setIsVisible] = useState(false); // Kontrol visibilitas elemen
  const elementRef = useRef(null);

  const words = text.split(" "); // Pecah teks menjadi kata-kata

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true); // Mulai animasi jika elemen terlihat
        } else {
          setIsVisible(false); // Reset animasi jika elemen tidak terlihat
          setVisibleWordIndex(-1); // Reset ke tidak terlihat
        }
      },
      { threshold: 0.5 } // Elemen dianggap terlihat jika 50% area terlihat
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let timer;
    if (isVisible && visibleWordIndex < words.length - 1) {
      timer = setTimeout(() => {
        setVisibleWordIndex((prev) => prev + 1);
      }, 200); // Waktu antar kata (200ms)
    }
    return () => clearTimeout(timer); // Bersihkan timer saat komponen di-unmount
  }, [isVisible, visibleWordIndex, words.length]);

  return (
    <p
      ref={elementRef}
      className="flex flex-wrap text-lg lg:text-xl text-primary-tealBlue font-semibold"
    >
      {words.map((word, index) => (
        <span key={index} className="relative lg:mr-4 mr-2 leading-relaxed">
          {/* Kata yang tidak terlihat */}
          <span
            className={`absolute opacity-40 ${
              index <= visibleWordIndex ? "opacity-0" : ""
            }`}
            style={{ transition: "opacity 0.5s" }}
          >
            {word}
          </span>
          {/* Kata yang terlihat */}
          <span
            className={`${
              index <= visibleWordIndex && isVisible ? "opacity-1" : "opacity-0"
            }`}
            style={{
              opacity: index <= visibleWordIndex && isVisible ? 1 : 0,
              transition: "opacity 0.5s",
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </p>
  );
};

const CountUpAnimation = ({ target, duration }) => {
  const [count, setCount] = useState(0);
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);



  const countUp = () => {
      if (animated) return;
      let start = 0;
      const end = parseInt(target);
      const stepTime = duration / end;

      const incrementCount = () => {
          start += Math.ceil(end / 1000);
          setCount(start);
          if (start >= end) {
              clearInterval(timer);
              setCount(end);
              setAnimated(true);
          }
      };

      const timer = setInterval(incrementCount, stepTime);
  };

  useEffect(() => {
      const observer = new IntersectionObserver(
          (entries, observer) => {
              entries.forEach((entry) => {
                  if (entry.isIntersecting && !animated) {
                      countUp();
                      observer.unobserve(ref.current);
                  }
              });
          },
          {
              threshold: 0.5,
          }
      );

      if (ref.current) {
          observer.observe(ref.current);
      }

      return () => {
          observer.disconnect();
      };
  }, []);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};



const LandingPage = () => {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  

  

  useEffect(() => {
    Highcharts.mapChart("map-container", {
      chart: {
        map: mapData,
        backgroundColor: "#EAF8EF",
      },
      title: {
        text: "Indeks Kelaparan Global (GHI)",
        style: {
          color: "#102722",
          fontSize: "18px",
        },
      },
      subtitle: {
        text: "Visualisasi Indeks Kelaparan di Indonesia",
        style: {
          color: "#102722",
          fontSize: "14px",
        },
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: "bottom",
          theme: {
            fill: "#73b39b",
            "stroke-width": 1,
            stroke: "#ffffff",
            r: 0,
            states: {
              hover: {
                fill: "#4caf50",
              },
            },
          },
        },
      },
      colorAxis: {
        min: 0,
        max: 100,
        stops: [
          [0, "#003d33"],
          [0.2, "#16634a"],
          [0.4, "#2c6f62"],
          [0.6, "#4e897f"],
          [0.8, "#73b39b"],
          [1, "#a5dbc4"],
        ],
        labels: {
          style: {
            color: "#555555",
          },
        },
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          return `
            <div class="tooltip-title">${this.point.name}</div>
            <div class="tooltip-content">
              <span>Persentase GHI:</span> <b>${
                this.point.value || "Tidak Ada Data"
              }%</b>
            </div>
          `;
        },
      },
      series: [
        {
          data: [
            ["id-3700", 10],
            ["id-ac", 20],
            ["id-jt", 35],
            ["id-be", 45],
            ["id-bt", 60],
            ["id-kb", 75],
            ["id-bb", 25],
            ["id-ba", 50],
            ["id-ji", 100],
            ["id-ks", 80],
            ["id-nt", 15],
            ["id-se", 55],
            ["id-kr", 40],
            ["id-ib", 65],
            ["id-su", 90],
            ["id-ri", 70],
            ["id-sw", 85],
            ["id-ku", 10],
            ["id-la", 40],
            ["id-sb", 60],
            ["id-ma", 50],
            ["id-nb", 35],
            ["id-sg", 20],
            ["id-st", 45],
            ["id-pa", 30],
            ["id-jr", 55],
            ["id-ki", 75],
            ["id-jk", 25],
            ["id-go", 50],
            ["id-yo", 45],
            ["id-sl", 40],
            ["id-sr", 15],
            ["id-ja", 35],
            ["id-kt", 30],
          ],
          name: "Indeks Kelaparan",
          nullColor: "#d7e6dc",
          states: {
            hover: {
              color: "#4caf50",
            },
          },
          dataLabels: {
            enabled: true,
            format: "{point.name}",
            style: {
              fontSize: "10px",
              color: "#333333",
            },
          },
        },
      ],
      credits: {
        enabled: false,
      },
    });
  }, []);

  const texts = {
    tentang: "TENTANG",
    sipanda: "SIPANDA",
    paragraph1:
      "SIPANDA (Sistem Informasi Pangan Daerah) hadir sebagai solusi untuk mengatasi tantangan dalam akses informasi pangan yang sering kali tersebar dan sulit diakses. Platform ini dirancang untuk memberikan data real-time mengenai ketersediaan, distribusi, dan harga pangan di daerah, membantu pemerintah, masyarakat, dan pelaku usaha untuk mengambil keputusan yang cepat dan tepat terkait distribusi serta produksi pangan.",
    paragraph2:
      "Dengan SIPANDA, transparansi informasi pangan meningkat, mendukung ketahanan pangan daerah dan kesejahteraan masyarakat. Kami percaya bahwa akses yang mudah terhadap data pangan dapat mencegah potensi krisis dan mendukung stabilitas sosial serta ekonomi, demi membangun kesejahteraan bersama.",
  };

  const text = [
    "Kami percaya bahwa setiap sistem yang sukses didukung oleh tim yang solid dan berdedikasi.",
    "Di sini, Anda dapat mengenal anggota tim kami yang menjadi motor penggerak di balik SIPANDA.","Dengan pengalaman dan komitmen yang kami miliki,",
    "Kami bertekad untuk mendukung pengelolaan pangan yang lebih baik di setiap daerah.",
    "Jangan ragu untuk menghubungi kami melalui tombol di bawah ini.",
    "Kami siap membantu Anda kapan saja!",
  ];

  

  const [hasAnimated, setHasAnimated] = useState(false); // Flag untuk mencegah looping animasi

  const typeText = (elementId, text, delay = 50, callback = null) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.textContent = ""; // Reset teks sebelum mengetik
    let index = 0;

    const type = () => {
      if (index < text.length) {
        element.textContent += text[index];
        index++;
        setTimeout(type, delay);
      } else if (callback) {
        callback();
      }
    };

    type();
  };

  const startTypingAnimation = () => {
    if (hasAnimated) return; // Cegah animasi jika sudah berjalan
    setHasAnimated(true); // Set flag menjadi true setelah animasi dimulai

    typeText("tentang", texts.tentang, 100, () => {
      typeText("sipanda", texts.sipanda, 100, () => {
        typeText("paragraph1", texts.paragraph1, 25, () => {
          typeText("paragraph2", texts.paragraph2, 25);
        });
      });
    });
  };

  useEffect(() => {
    const section = document.getElementById("tentang-section");
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            startTypingAnimation();
          }
        });
      },
      { threshold: 0.5 } // Animasi dimulai jika 50% elemen terlihat
    );

    observer.observe(section);

    return () => observer.disconnect(); // Bersihkan observer saat komponen unmount
  }, [hasAnimated]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      image: {Kades1} ,
      name: "Arman Suhada",
      title: "Kades Lowokwaru",
      description:
        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using "Content here, content here", making it look like readable English.',
    },
    {
      image: {Kades2},
      name: "Arman Suhada",
      title: "Kades Lowokwaru",
      description:
        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using "Content here, content here", making it look like readable English.',
    },
    {
      image: {Kades3},
      name: "Arman Suhada",
      title: "Kades Lowokwaru",
      description:
        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using "Content here, content here", making it look like readable English.',
    },
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  };

  useEffect(() => {
    const swiperWrapper = document.querySelector(".swiper-wrapper");
    const slides = Array.from(swiperWrapper.children);
    const nextButton = document.querySelector(".swiper-button-next");
    const prevButton = document.querySelector(".swiper-button-prev");

    let currentIndex = 0;

    function updateSlides() {
      swiperWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
      swiperWrapper.style.transition = "transform 0.3s ease-in-out";
    }

    nextButton.addEventListener("click", () => {
      if (currentIndex < slides.length - 1) {
        currentIndex++;
        updateSlides();
      } else {
        currentIndex = 0; // Loop back to the first slide
        updateSlides();
      }
    });

    prevButton.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlides();
      } else {
        currentIndex = slides.length - 1; // Loop back to the last slide
        updateSlides();
      }
    });

    return () => {
      nextButton.removeEventListener("click", updateSlides);
      prevButton.removeEventListener("click", updateSlides);
    };
  }, []);

  function Card({ name, title, text, image }) {
    return (
      <div className="bg-white rounded-lg p-6 w-96 h-[400px] flex flex-col items-center justify-center text-center shadow">
        <div
          className="w-16 aspect-square bg-gray-300 rounded-full mb-4 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        ></div>
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="mt-2 text-gray-600 text-md">{text}</p>
      </div>
    );
  }

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const items = [
    {
      question: "Apa saja manfaat menggunakan SIPANDA bagi pelaku usaha di sektor pangan?",
      answer:
        "SIPANDA membantu pelaku usaha pangan dengan memberikan data akurat tentang pasokan dan kebutuhan pangan, mempermudah pemantauan stok, meningkatkan efisiensi distribusi, dan mendukung perencanaan bisnis yang lebih baik, serta memastikan kepatuhan terhadap regulasi distribusi pangan yang adil.",
    },
    {
      question: "Bagaimana SIPANDA dapat mencegah potensi krisis pangan?",
      answer:
        "Dapat mencegah potensi krisis pangan dengan mempermudah pendataan dan pemantauan stok pangan di tingkat desa. Dengan data yang akurat dan real-time, pemerintah daerah bisa mengidentifikasi daerah yang mengalami kekurangan pangan dan segera mengambil tindakan distribusi yang tepat, seperti mengalihkan stok dari daerah surplus ke daerah kekurangan.",
    },
    {
      question: "Bagaimana SIPANDA membantu ketahanan pangan di daerah?",
      answer:
        "SIPANDA mendukung ketahanan pangan dengan menyediakan data real-time yang mempermudah pemantauan distribusi pangan, memastikan pasokan merata ke daerah yang kekurangan, dan membantu pemerintah dalam merencanakan intervensi yang cepat untuk mencegah krisis pangan.",
    },
  ];

  const [activeCircleIndex, setActiveCircleIndex] = useState(0); // Indeks lingkaran yang aktif
  const circlesRef = useRef([]); // Referensi untuk semua lingkaran

  // Animasi otomatis untuk beralih lingkaran setiap 2 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCircleIndex((prevIndex) =>
        (prevIndex + 1) % circlesRef.current.length
      );
    }, 2000);
  
    return () => clearInterval(interval); // Bersihkan interval saat tidak aktif
  }, []);

  // Tambahkan kelas atau gaya untuk elemen yang aktif
  useEffect(() => {
    circlesRef.current.forEach((circle, index) => {
      if (circle) {
        if (index === activeCircleIndex) {
          circle.classList.add("active-circle");
        } else {
          circle.classList.remove("active-circle");
        }
      }
    });
  }, [activeCircleIndex]);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-feature");
          }
        });
      },
      { threshold: 0.2 } // Animasi dimulai jika 20% elemen terlihat
    );
  
    const featureCards = document.querySelectorAll(".feature-card");
    featureCards.forEach((card) => observer.observe(card));
  
    return () => observer.disconnect(); // Bersihkan observer saat komponen tidak aktif
  }, []);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 } // Animasi dipicu ketika 20% dari section terlihat
    );

    const sections = document.querySelectorAll(".section");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect(); // Bersihkan observer saat komponen unmount
  }, []);
  
  const images = [
   Desa0, Desa1, Desa2, Desa3
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 1000); // Ganti gambar setiap 3 detik
    return () => clearInterval(interval);
  }, []);


  

  return (
    <>
      <div className="h-screen w-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 z-[-1] w-full h-full object-cover opacity-90"
        >
          <source src={Video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Navbar */}
        <section
          id="navbar"
          className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
            isScrolled ? "bg-[#102722]" : "bg-transparent"
          }`}
        >
          <div className="h-[10vh]">
            <div className="container mx-auto max-w-screen-2xl px-10">
              <div className="flex items-center justify-between h-[10vh]">
                <img src={Logo} className="h-10" alt="Logo" />
                <ul className="flex items-center font-bold text-white">
                  <li
                    className="mx-2 cursor-pointer"
                    onClick={() => scrollToSection("hero-section")}
                  >
                    Beranda
                  </li>
                  <li
                    className="mx-2 cursor-pointer"
                    onClick={() => scrollToSection("tentang-section")}
                  >
                    Tentang
                  </li>
                  <li
                    className="mx-2 cursor-pointer"
                    onClick={() => scrollToSection("fitur-section")}
                  >
                    Fitur
                  </li>
                  <li
                    className="mx-2 cursor-pointer"
                    onClick={() => scrollToSection("tim-section")}
                  >
                    Team
                  </li>
                  <li className="mx-2 cursor-pointer">
                    <a href="login">Login</a>
                  </li>
                  <li className="mx-2 cursor-pointer">
                    <a href="register">Mulai Sekarang</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <div className="h-[90vh]" id="hero-section">
          <div className="container max-w-screen-2xl px-10 mx-auto">
            <div className="flex items-center h-[90vh]">
              <div className="section hero-text" >
                <h1 className=" text-white text-4xl font-bold mb-4">
                  Sistem Informasi Distribusi <br />
                  Pangan Daerah
                </h1>
                <p className="text-xl text-white">
                  SIPANDA (Sistem Informasi Pangan Daerah) hadir <br />
                  sebagai solusi untuk mengatasi tantangan dalam <br />
                  akses informasi pangan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
     
      {/* end hero */}
      {/* indexs */}
      <section className="section py-32">
        <div className="h-[100vh] overflow-hidden">
          <div className="h-[10vh]">
            <div className="container max-w-screen-2xl px-10 mx-auto">
              <div className="flex flex-col items-center">
                <h2 className="text-3xl font-semibold mb-6 text-[#102722]">
                  INDEKS KELAPARAN (GHI)
                </h2>
                <div className="flex items-center space-x-4 mb-6">
                <table className="w-full text-left">
                    <thead>
                    <tr className="border-b">
                        <th className="pb-4 pt-2">Indeks Kelaparan (GHI)</th>
                        <th className="pb-4 pt-2 px-4">Peringkat</th>
                        <th className="pb-4 pt-2">Jumlah Penduduk yang Kelaparan</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="pt-4 px-4"><CountUpAnimation target="12" duration={1500} /></td>
                        <td className="pt-4 px-4"><CountUpAnimation target="77" duration={1500} /></td>
                        <td className="pt-4 px-4"><CountUpAnimation target="16413550" duration={1500} /></td>
                    </tr>
                    </tbody>
                </table>
                </div>
              </div>
            </div>
          </div>
          <div class="h-[90vh] mt-20">
            <div id="map-container"></div>
          </div>
        </div>
      </section>
      {/* end indexs */}
      {/* about */}
      <section id="tentang-section" className="section py-32 bg-[#eaf8ef]">
        <div className="container max-w-screen-2xl px-10 mx-auto">
          <div className="grid grid-cols-2 gap-8">
            <div
              className="bg-cover bg-no-repeat bg-center h-[450px] rounded-lg"
              style={{ backgroundImage: `url(${Tentang})` }}
            ></div>
            <div className="place-self-center">
              <span className="flex mb-4 space-x-4 text-[#102722]">
                <h1 className="font-bold text-3xl ">
                  <span id="tentang"></span>
                </h1>
                <h1 className="font-bold text-3xl underline underline-offset-4">
                  <span id="sipanda"></span>
                </h1>
              </span>
              <p className="text-lg leading-loose mb-4" id="paragraph1"></p>
              <p className="text-lg leading-loose" id="paragraph2"></p>
            </div>
          </div>
        </div>
      </section>
      {/* end about */}
      {/* fitur */}
      <section id="fitur-section" className="py-32">
  <div className="container max-w-screen-2xl px-10 mx-auto">
    <h1 className="text-center font-bold text-3xl mb-10 text-[#102722]">
      FITUR KAMI
    </h1>
    <div className="grid grid-cols-3 grid-rows-3 grid-flow-col gap-y-10">
       
      <div
        className="feature-card bg-cover bg-center bg-no-repeat bg-[#EAF8EF] rounded-md h-[200px] w-[300px] text-center flex items-center justify-center opacity-0 translate-y-10"
      >
         <img src={Peta } alt="Peta" />

        Peta Index GHI
      </div>
      <div
        className="feature-card bg-cover bg-center bg-no-repeat bg-[#EAF8EF] rounded-md h-[200px] w-[300px] text-center flex items-center justify-center opacity-0 translate-y-10"
      >
        <img src={Dashboard} alt="Dashboard" />
        Dashboard yang Interaktif dan Responsif
      </div>
      <div
        className="feature-card bg-cover bg-center bg-no-repeat bg-[#EAF8EF] rounded-md h-[200px] w-[300px] text-center flex items-center justify-center opacity-0 translate-y-10"
      >
        <img src={Akses} alt="Akses" />
        Aksesibilitas Pengajuan
      </div>
      <div className="row-span-3 place-content-center">
        <img src={Fitur} alt="Fitur Gambar" />
      </div>
      <div
        className="feature-card bg-cover bg-center bg-no-repeat bg-[#EAF8EF] rounded-md h-[200px] w-[300px] place-self-end text-center flex items-center justify-center opacity-0 translate-y-10"
      >
        <img src={Realtime} alt="Realtime" />
        Real Time Data
      </div>
      <div
        className="feature-card bg-cover bg-center bg-no-repeat bg-[#EAF8EF] rounded-md h-[200px] w-[300px] place-self-end text-center flex items-center justify-center opacity-0 translate-y-10"
      >
        <img src={Pendataan} alt="Pendataan" />
        Pendataan Akurat
      </div>
      <div
        className="feature-card bg-cover bg-center bg-no-repeat bg-[#EAF8EF] rounded-md h-[200px] w-[300px] place-self-end text-center flex items-center justify-center opacity-0 translate-y-10"
      >
        <img src={Transparansi} alt="Transparansi" />
        Transparansi
      </div>
    </div>
  </div>
</section>

      {/* end fitur */}
      {/* tim */}
      <section id="tim-section" className="py-32 bg-[#eaf8ef] section">
  <div className="container max-w-screen-2xl px-10 mx-auto">
    <div className="grid grid-cols-2 gap-14">
      {/* Teks dengan Animasi */}
      <div className="place-self-center">
        <h1 className="font-bold text-3xl mb-6 text-[#102722]">
          TEMUKAN TIM HEBAT KAMI
        </h1>
        <div className="flex flex-col gap-5">
          {text.map((text, index) => (
            <AnimatedText key={index} text={text} />
          ))}
        </div>
      </div>
      {/* Lingkaran Gambar dengan Efek */}
      <div className="grid grid-cols-3 gap-10">
        {[
          { image: Santa, name: "Santa", role: "Fullstack Developer" },
          { image: Itsar, name: "Itsar", role: "Backend Developer" },
          { image: Arman, name: "Arman", role: "UI/UX Designer" },
          { image: Pram, name: "Pram", role: "UI/UX Analyst" },
          { image: Ijan, name: "Ijan", role: "Frontend Developer" },
        ].map((member, index) => (
          <div
            key={index}
            ref={(el) => (circlesRef.current[index] = el)}
            className={`circle w-full h-64 bg-center bg-cover bg-no-repeat rounded-3xl shadow-lg transition-all duration-300 ease-in-out ${
              activeCircleIndex === index ? "active-circle " : ""
            }`}
            style={{ backgroundImage: `url(${member.image})` }}
          >
            <div className="overlay">
              <h3 className="text-lg font-bold">{member.name}</h3>
              <p className="text-sm font-light">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* end tim  */}
      {/* Kepala Desa */}
      <section className="py-32">
        <div className="container max-w-screen-2xl px-10 mx-auto">
          <h1 className="text-3xl font-bold text-center mb-10 text-[#102722]">
            Apa Kata Kepala Desa?
          </h1>
          <Swiper
            spaceBetween={30} // Jarak antar slide
            slidesPerView={1} // Banyaknya slide yang ditampilkan sekaligus
            navigation // Aktifkan navigasi
          >
            {/* Slide 1 */}
            <SwiperSlide>
              <div className="flex items-center justify-center gap-14 py-2">
                <Card
                  name="Ana Muamanah"
                  title="Bupati Bojonegoro"
                  text="Sistem SIPANDA memberikan kami kontrol penuh terhadap stok pangan yang ada, membantu dalam perencanaan cadangan pangan yang lebih baik, serta mencegah potensi krisis pangan. Dengan informasi yang cepat dan terupdate, kami dapat membuat keputusan lebih tepat dalam menentukan prioritas distribusi, sehingga kebutuhan pangan masyarakat dapat terpenuhi dengan optimal."
                  image={Kades6}
                />
                <Card
                  name="Suhardi. A"
                  title="Kades Jetis"
                  text="SIPANDA mendukung pengelolaan pangan yang lebih cerdas dengan menyediakan data yang valid dan mudah dipahami. Kami bisa memantau secara langsung jumlah pangan yang tersedia, memperkirakan kebutuhan mendatang, serta merencanakan strategi distribusi agar tidak ada daerah yang mengalami kekurangan pangan. Dengan sistem ini, kami lebih siap menghadapi tantangan ketahanan pangan."
                  image={Kades5}
                />
                <Card
                  name="Muhammad Joko"
                  title="Kades Dau"
                  text="Dengan adanya SIPANDA, kami bisa meningkatkan koordinasi antara pemerintah desa, daerah, dan pusat dalam pengelolaan pangan. Data yang diperoleh memungkinkan kami untuk merencanakan intervensi yang lebih efektif dan cepat jika ada kekurangan pasokan. Sistem ini juga memberikan transparansi dalam proses distribusi pangan, menjaga kepercayaan masyarakat terhadap pengelolaan pangan."
                  image={Kades4}
                />
              </div>
            </SwiperSlide>

            {/* Slide 2 */}
            <SwiperSlide>
              <div className="flex items-center justify-center gap-14 py-2">
                <Card
                  name="Budi Hartono"
                  title="Kades Cilaleng"
                  text="“SIPANDA adalah sebuah terobosan yang sangat bermanfaat bagi masyarakat dan pemerintah daerah. Sebagai Kepala Desa, saya melihat langsung bagaimana pentingnya data yang akurat untuk memastikan ketersediaan pangan di desa kami. Dengan adanya SIPANDA, kami bisa memantau stok pangan secara real-time, melihat harga pasar terkini, serta mengatur distribusi pangan dengan lebih baik.”"
                  image={Kades1}
                />
                <Card
                  name="Suhardi B"
                  title="Kades Tompo"
                  text="“SIPANDA memberikan perubahan besar bagi pengelolaan pangan di desa kami. Dengan data yang selalu diperbarui, kami dapat dengan mudah mengidentifikasi kebutuhan pangan di masyarakat. Informasi harga dan distribusi yang sebelumnya sulit dijangkau kini lebih mudah dipahami, membantu kami mengambil langkah yang lebih strategis dalam menjaga ketahanan pangan desa. Saya yakin bahwa SIPANDA akan menjadi bagian penting dari perencanaan pangan di masa depan.”"
                  image={Kades2}
                />
                <Card
                  name="Muhammad Ilyas"
                  title="Kades Lowokwaru"
                  text="“SIPANDA menghadirkan itu dengan sangat baik. Sebagai Kepala Desa, saya dapat memastikan bahwa setiap keputusan yang diambil terkait pangan berdasarkan data yang akurat dan terkini. Ini memberi kami kepercayaan diri dalam mengelola sumber daya pangan dengan lebih baik. SIPANDA tidak hanya mempermudah pekerjaan kami, tetapi juga memberi rasa aman bagi masyarakat karena mereka tahu bahwa informasi yang ada dapat diandalkan.”"
                  image={Kades3}
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>
      {/* End Kepala Desa */}
      {/* Kepala Desa 2 */}
      <section className="py-32 bg-[#eaf8ef]">
      <div className="container max-w-screen2xl px-10 mx-auto">
        <div className="grid grid-cols-2 gap-10">
          <span className="flex items-center place-content-between">
            <h1 className="text-3xl place-content-center text-[#102722]">
              <b>KAMI</b> TELAH <b>BEKERJA SAMA</b> <br />
              DENGAN BEBERAPA <b>DESA</b>
            </h1>
            <img src={Arrow} className="w-min h-min" />
          </span>
          <div className="grid grid-cols-4 gap-8">
            {images.map((image, index) => (
              <div
                key={index}
                className={`transition-opacity duration-700 ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <img src={image} alt={`Desa ${index}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
      {/* End Kepala Desa 2 */}
      {/* ask */}
      <section className="py-32">
        <div className="max-screen-2xl container mx-auto px-10">
          <h2 className="text-center text-3xl font-bold mb-10 text-[#102722]">
            Frequently Asked Questions
          </h2>

          {items.map((item, index) => (
            <div key={index} className="border-b w-[50vw] mx-auto mb-6">
              <div
                className="flex justify-between items-center cursor-pointer py-4"
                onClick={() => toggleAccordion(index)}
              >
                <h3 className="text-xl font-semibold">{item.question}</h3>
                <span className="text-xl font-bold toggle-icon">
                  {activeIndex === index ? "+" : "-"}
                </span>
              </div>
              {activeIndex === index && (
                <p className="text-gray-600 text-md mb-4">{item.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>
      {/* end ask */}
      {/* contact */}
      <section className="py-32 bg-[#EAF8EF]">
        <div className="max-w-screen-2xl px-10 mx-auto container">
          <span className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-[#102722]">
              Hubungi Kami
            </h1>
            <p className="text-gray-600 mb-10">
            SIPANDA selalu berusaha menjadi lebih baik. Kami sangat menghargai kritik dan saran Anda untuk pengembangan platform ini. <br/> Silakan berikan masukan agar kami dapat terus meningkatkan kualitas layanan kami. Terima kasih!
            </p>
          </span>
          <div className="flex gap-10 place-items-center">
            <div className="bg-[#EAF8EF] rounded-lg p-4 shadow-2xl h-fit flex-1">
              <form className="grid grid-cols-2 gap-4">
                <input
                  className="bg-white p-2 rounded-md"
                  placeholder="Nama Depan"
                />
                <input
                  className="bg-white p-2 rounded-md"
                  placeholder="Nama Belakang"
                />
                <input
                  className="col-span-2 bg-white p-2 rounded-md"
                  placeholder="Email"
                />
                <textarea
                  className="col-span-2 bg-white p-2 rounded-md h-[200px]"
                  placeholder="Write Your Message"
                  defaultValue={""}
                />
              </form>
            </div>
            <img src={Kontak}  className="flex-1" />
          </div>
        </div>
      </section>
      {/* end contact */}
      {/* footer  */}
      <footer className="p-10 bg-[#102722] section footer">
        <div className="max-w-screen-2xl px-10 mx-auto container text-white">
          <div className="grid grid-cols-3 gap-10">
            <div>
              <h1 className="text-xl font-semibold underline underline-offset-8 mb-4">
                TENTANG
              </h1>
              <p className="text-md text-gray-200">
                SIPANDA (Sistem Informasi Pangan Daerah) adalah platform yang
                menyediakan data real-time tentang ketersediaan, distribusi, dan
                harga pangan di daerah. Sistem ini membantu pemerintah,
                masyarakat, dan pelaku usaha dalam pengambilan keputusan cepat
                dan tepat terkait pangan, meningkatkan transparansi, serta
                mendukung ketahanan pangan dan kesejahteraan masyarakat. SIPANDA
                berperan dalam mencegah krisis pangan dan mendukung stabilitas
                sosial-ekonomi.
              </p>
              <div>
                <h1 className="text-md font-semibold underline underline-offset-8 my-4">
                  FOLLOW US ON
                </h1>
                <div className="flex space-x-2">
                  <span className="bg-[#EAF8EF] rounded-full p-2">
                    <img src={Email} />
                  </span>
                  <span className="bg-[#EAF8EF] rounded-full p-2">
                    <img src={Instagram} />
                  </span>
                  <span className="bg-[#EAF8EF] rounded-full p-2">
                    <img src={Facebook} />
                  </span>
                  <span className="bg-[#EAF8EF] rounded-full p-2">
                    <img src={Twitter} />
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-semibold underline underline-offset-8 mb-4">
                NAVIGASI
              </h1>
              <p className="text-md text-gray-200">
              Beranda <br/>
              Infografis <br/>
              Fitur
              </p>
            </div>
            <div className="space-y-48">
              <div className="">
              <h1 className="text-xl font-semibold underline underline-offset-8 mb-4">
                ALAMAT
              </h1>
              <p className="text-md text-gray-200 mb-8">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500..
              </p>

              </div>
              <img src={Logo2} width={200} />
            </div>
          </div>
        </div>
      </footer>
      {/*  end footer */}
    </>
  );
};

export default LandingPage;
