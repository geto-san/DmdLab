import { Mail, MapPin, Github, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: '#f8f9fa',
      color: '#6c757d',
      fontSize: '14px',
      lineHeight: '1.5'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px 20px 20px'
      }}>

        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          marginBottom: '30px'
        }}>
          
          {/* About Section */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <img 
                src="/logo-7402580_1920.png"
                alt="DMRLab Logo"
                style={{
                  width: '32px',
                  height: '32px',
                  marginRight: '10px'
                }}
              />
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#343a40'
                }}>
                  DMRLab
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: '12px',
                  color: '#6c757d'
                }}>
                  Research & Innovation
                </p>
              </div>
            </div>
            <p style={{
              margin: '0 0 15px 0',
              maxWidth: '300px',
              color: '#6c757d'
            }}>
              DeepsMinds ResearchLab is dedicated to advancing machine learning and artificial intelligence research through innovative projects and collaborative discussions.
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '12px',
              color: '#28a745'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#28a745',
                borderRadius: '50%',
                marginRight: '8px'
              }}></span>
              Active
            </div>
          </div>

          {/* Research Areas */}
          <div>
            <h4 style={{
              margin: '0 0 15px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: '#343a40'
            }}>
              Research Focus
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{ marginBottom: '10px' }}>
                <div style={{ color: '#495057', fontWeight: '500' }}>Deep Learning</div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>Neural Networks & AI</div>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <div style={{ color: '#495057', fontWeight: '500' }}>Machine Learning</div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>Algorithms & Models</div>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <div style={{ color: '#495057', fontWeight: '500' }}>Data Science</div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>Analysis & Visualization</div>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
         <div>
           <h4 style={{
             margin: '0 0 15px 0',
             fontSize: '16px',
             fontWeight: '600',
             color: '#343a40'
           }}>
             Contact
           </h4>
           <div style={{ marginBottom: '15px' }}>
             <div style={{
               display: 'flex',
               alignItems: 'flex-start',
               marginBottom: '10px'
             }}>
               <Mail style={{
                 width: '16px',
                 height: '16px',
                 marginRight: '8px',
                 marginTop: '2px',
                 color: '#6c757d'
               }} />
               <div>
                 <a href="mailto:contact@dmrlab.org" style={{ color: '#495057', textDecoration: 'none' }}>
                   kimrichies@gmail.com
                 </a>
                 <div style={{ fontSize: '12px', color: '#6c757d' }}>Dr.Richard Kimera</div>
               </div>
             </div>
             <div style={{
               display: 'flex',
               alignItems: 'flex-start',
               marginBottom: '10px'
             }}>
               <Phone style={{
                 width: '16px',
                 height: '16px',
                 marginRight: '8px',
                 marginTop: '2px',
                 color: '#6c757d'
               }} />
               <div>
                 <a href="tel:+256774437989" style={{ color: '#495057', textDecoration: 'none' }}>
                   +256 774 437989
                 </a>
                 <div style={{ fontSize: '12px', color: '#6c757d' }}>Dr. Richard Kimera</div>
               </div>
             </div>
             <div style={{
               display: 'flex',
               alignItems: 'flex-start'
             }}>
               <MapPin style={{
                 width: '16px',
                 height: '16px',
                 marginRight: '8px',
                 marginTop: '2px',
                 color: '#6c757d'
               }} />
               <div>
                 <div style={{ color: '#495057' }}>MUST</div>
                 <div style={{ fontSize: '12px', color: '#6c757d' }}>Kihumuro Campus</div>
               </div>
             </div>
           </div>
            
            {/* Social Links */}
            <div style={{
              display: 'flex',
              gap: '10px'
            }}>
              <a 
                href="https://github.com/" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #dee2e6',
                  borderRadius: '6px',
                  color: '#6c757d',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.borderColor = '#adb5bd';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.borderColor = '#dee2e6';
                }}
              >
                <Github style={{ width: '18px', height: '18px' }} />
              </a>
              <a 
                href="mailto:contact@dmrlab.org" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #dee2e6',
                  borderRadius: '6px',
                  color: '#6c757d',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.borderColor = '#adb5bd';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.borderColor = '#dee2e6';
                }}
              >
                <Mail style={{ width: '18px', height: '18px' }} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #e9ecef',
          paddingTop: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '15px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              fontSize: '13px',
              color: '#6c757d'
            }}>
              © {currentYear} DeepsMinds Research Lab. All rights reserved.
            </div>
            <div style={{
              fontSize: '12px',
              color: '#adb5bd'
            }}>
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

          /* Bottom bar */
          footer > div > div:last-child {
            padding-top: 14px;
          }

          footer > div > div:last-child > div {
            gap: 4px;
          }

          footer > div > div:last-child > div > div:first-child {
            font-size: 9px;
          }

          footer > div > div:last-child > div > div:last-child {
            font-size: 8px;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;