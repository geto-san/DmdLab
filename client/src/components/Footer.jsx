import { Mail, MapPin, Github, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#f8f9fa] text-[#6c757d] text-sm leading-[1.5]">
      <div className="max-w-[1200px] mx-auto px-5 pt-10 pb-5">

        {/* Main Footer Content */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-[30px] mb-[30px]">

          {/* About Section */}
          <div>
            <div className="flex items-center mb-[15px]">
              <img
                src="/logo-7402580_1920.png"
                alt="DMRLab Logo"
                className="w-8 h-8 mr-[10px]"
              />
              <div>
                <h3 className="m-0 text-[18px] font-semibold text-[#343a40]">
                  DMRLab
                </h3>
                <p className="m-0 text-xs text-[#6c757d]">
                  Research & Innovation
                </p>
              </div>
            </div>
            <p className="m-0 mb-[15px] max-w-[300px] text-[#6c757d]">
              DeepsMinds ResearchLab is dedicated to advancing machine learning and artificial intelligence research through innovative projects and collaborative discussions.
            </p>
            <div className="flex items-center text-xs text-[#28a745]">
              <span className="w-2 h-2 bg-[#28a745] rounded-full mr-2"></span>
              Active
            </div>
          </div>

          {/* Research Areas */}
          <div>
            <h4 className="m-0 mb-[15px] text-base font-semibold text-[#343a40]">
              Research Focus
            </h4>
            <ul className="list-none p-0 m-0">
              <li className="mb-[10px]">
                <div className="text-[#495057] font-medium">Deep Learning</div>
                <div className="text-xs text-[#6c757d]">Neural Networks & AI</div>
              </li>
              <li className="mb-[10px]">
                <div className="text-[#495057] font-medium">Machine Learning</div>
                <div className="text-xs text-[#6c757d]">Algorithms & Models</div>
              </li>
              <li className="mb-[10px]">
                <div className="text-[#495057] font-medium">Data Science</div>
                <div className="text-xs text-[#6c757d]">Analysis & Visualization</div>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
         <div>
           <h4 className="m-0 mb-[15px] text-base font-semibold text-[#343a40]">
             Contact
           </h4>
           <div className="mb-[15px]">
             <div className="flex items-start mb-[10px]">
               <Mail className="w-4 h-4 mr-2 mt-0.5 text-[#6c757d]" />
               <div>
                 <a href="mailto:contact@dmrlab.org" className="text-[#495057] no-underline">
                   kimrichies@gmail.com
                 </a>
                 <div className="text-xs text-[#6c757d]">Dr.Richard Kimera</div>
               </div>
             </div>
             <div className="flex items-start mb-[10px]">
               <Phone className="w-4 h-4 mr-2 mt-0.5 text-[#6c757d]" />
               <div>
                 <a href="tel:+256774437989" className="text-[#495057] no-underline">
                   +256 774 437989
                 </a>
                 <div className="text-xs text-[#6c757d]">Dr. Richard Kimera</div>
               </div>
             </div>
             <div className="flex items-start">
               <MapPin className="w-4 h-4 mr-2 mt-0.5 text-[#6c757d]" />
               <div>
                 <div className="text-[#495057]">MUST</div>
                 <div className="text-xs text-[#6c757d]">Kihumuro Campus</div>
               </div>
             </div>
           </div>

            {/* Social Links */}
            <div className="flex gap-[10px]">
              <a
                href="https://github.com/"
                className="flex items-center justify-center w-9 h-9 bg-white border border-[#dee2e6] rounded-md text-[#6c757d] no-underline transition-all duration-200 ease-in-out hover:bg-[#f8f9fa] hover:border-[#adb5bd]"
              >
                <Github className="w-[18px] h-[18px]" />
              </a>
              <a
                href="mailto:contact@dmrlab.org"
                className="flex items-center justify-center w-9 h-9 bg-white border border-[#dee2e6] rounded-md text-[#6c757d] no-underline transition-all duration-200 ease-in-out hover:bg-[#f8f9fa] hover:border-[#adb5bd]"
              >
                <Mail className="w-[18px] h-[18px]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#e9ecef] pt-5 text-center">
          <div className="flex justify-center items-center gap-[15px] flex-wrap">
            <div className="text-[13px] text-[#6c757d]">
              © {currentYear} DeepsMinds Research Lab. All rights reserved.
            </div>
            <div className="text-xs text-[#adb5bd]">
              Version 9.1.0
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        /* Desktop Styles (Default) */
        @media (min-width: 1024px) {
          footer {
            font-size: 14px;
          }

          footer > div {
            padding: 40px 20px 20px 20px;
          }

          footer > div > div:first-child {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin-bottom: 30px;
          }
        }

        /* Tablet Styles */
        @media (max-width: 1023px) and (min-width: 768px) {
          footer {
            font-size: 13px;
          }

          footer > div {
            padding: 35px 16px 18px 16px;
          }

          footer > div > div:first-child {
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 25px;
            margin-bottom: 25px;
          }

          /* Logo and title adjustments */
          footer img {
            width: 28px;
            height: 28px;
          }

          footer h3 {
            font-size: 16px;
          }

          footer h4 {
            font-size: 15px;
          }

          /* Contact icons */
          footer svg {
            width: 14px;
            height: 14px;
          }

          /* Social links */
          footer a {
            width: 32px;
            height: 32px;
          }

          footer a svg {
            width: 16px;
            height: 16px;
          }
        }

        /* Mobile Styles */
        @media (max-width: 767px) and (min-width: 480px) {
          footer {
            font-size: 13px;
          }

          footer > div {
            padding: 30px 16px 16px 16px;
          }

          footer > div > div:first-child {
            grid-template-columns: 1fr;
            gap: 25px;
            margin-bottom: 25px;
          }

          /* Logo and title adjustments */
          footer img {
            width: 26px;
            height: 26px;
          }

          footer h3 {
            font-size: 15px;
          }

          footer h4 {
            font-size: 14px;
          }

          /* Contact section layout */
          footer > div > div:first-child > div:nth-child(3) {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
          }

          footer > div > div:first-child > div:nth-child(3) > div:first-child {
            flex: 1;
            margin-right: 20px;
          }

          /* Social links */
          footer > div > div:first-child > div:nth-child(3) > div:last-child {
            display: flex;
            gap: 8px;
          }

          footer a {
            width: 30px;
            height: 30px;
          }

          footer a svg {
            width: 14px;
            height: 14px;
          }

          /* Bottom bar */
          footer > div > div:last-child {
            padding-top: 18px;
          }

          footer > div > div:last-child > div {
            flex-direction: column;
            gap: 8px;
          }

          footer > div > div:last-child > div > div:first-child {
            font-size: 12px;
          }

          footer > div > div:last-child > div > div:last-child {
            font-size: 11px;
          }
        }

        /* Small Mobile Styles */
        @media (max-width: 479px) {
          footer {
            font-size: 12px;
          }

          footer > div {
            padding: 25px 12px 14px 12px;
          }

          footer > div > div:first-child {
            grid-template-columns: 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }

          /* Logo and title adjustments */
          footer img {
            width: 24px;
            height: 24px;
          }

          footer h3 {
            font-size: 14px;
          }

          footer h4 {
            font-size: 13px;
          }

          /* About section */
          footer > div > div:first-child > div:first-child p {
            max-width: 100%;
            font-size: 12px;
          }

          /* Research areas */
          footer ul li {
            margin-bottom: 8px;
          }

          footer ul li div:first-child {
            font-size: 13px;
          }

          footer ul li div:last-child {
            font-size: 11px;
          }

          /* Contact section */
          footer > div > div:first-child > div:nth-child(3) {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          footer > div > div:first-child > div:nth-child(3) > div:first-child {
            margin-right: 0;
          }

          /* Contact icons */
          footer svg {
            width: 12px;
            height: 12px;
          }

          /* Social links */
          footer > div > div:first-child > div:nth-child(3) > div:last-child {
            display: flex;
            justify-content: center;
            gap: 12px;
          }

          footer a {
            width: 32px;
            height: 32px;
          }

          footer a svg {
            width: 16px;
            height: 16px;
          }

          /* Bottom bar */
          footer > div > div:last-child {
            padding-top: 16px;
          }

          footer > div > div:last-child > div {
            flex-direction: column;
            gap: 6px;
          }

          footer > div > div:last-child > div > div:first-child {
            font-size: 11px;
            text-align: center;
          }

          footer > div > div:last-child > div > div:last-child {
            font-size: 10px;
            text-align: center;
          }
        }

        /* Extra Small Screens */
        @media (max-width: 360px) {
          footer > div {
            padding: 20px 10px 12px 10px;
          }

          footer > div > div:first-child {
            gap: 16px;
            margin-bottom: 16px;
          }

          footer h3 {
            font-size: 13px;
          }

          footer h4 {
            font-size: 12px;
          }

          footer p {
            font-size: 11px;
          }

          footer ul li div:first-child {
            font-size: 12px;
          }

          footer ul li div:last-child {
            font-size: 10px;
          }

          footer a {
            width: 28px;
            height: 28px;
          }

          footer a svg {
            width: 14px;
            height: 14px;
          }

          footer > div > div:last-child > div > div:first-child {
            font-size: 10px;
          }

          footer > div > div:last-child > div > div:last-child {
            font-size: 9px;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
