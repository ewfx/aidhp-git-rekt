// import React, { useState } from 'react';


// function ContactPage() {
//   const [darkMode, setDarkMode] = useState(false);

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//     if (!darkMode) {
//       document.documentElement.setAttribute('data-theme', 'dark');
//     } else {
//       document.documentElement.setAttribute('data-theme', 'light');
//     }
//   };

//   const validate = (e) => {
//     e.preventDefault();
//     const name = document.getElementById('name');
//     const email = document.getElementById('email');
//     const message = document.getElementById('message');
//     const errorElement = document.getElementById('error');
//     const successMsg = document.getElementById('success-msg');

//     if (name.value.length < 3) {
//       errorElement.innerHTML = 'Your name should be at least 3 characters long.';
//       return false;
//     }

//     if (!(email.value.includes('.') && email.value.includes('@'))) {
//       errorElement.innerHTML = 'Please enter a valid email address.';
//       return false;
//     }

//     if (!emailIsValid(email.value)) {
//       errorElement.innerHTML = 'Please enter a valid email address.';
//       return false;
//     }

//     if (message.value.length < 15) {
//       errorElement.innerHTML = 'Please write a longer message.';
//       return false;
//     }

//     errorElement.innerHTML = '';
//     successMsg.innerHTML = 'Thank you! I will get back to you as soon as possible.';

//     e.preventDefault();
//     setTimeout(function () {
//       successMsg.innerHTML = '';
//       document.getElementById('contact-form').reset();
//     }, 6000);

//     return true;
//   };

//   const emailIsValid = (email) => {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   };

//   // Define your inline styles as JavaScript objects
//   const containerStyle = {
//     display: 'flex',
//     width: '100vw',
//     height: '100vh',
//     background: darkMode ? '#010712' : '#FCFDFD',
//   };

//   const leftColStyle = {
//     width: '45vw',
//     height: '100%',
//     backgroundImage: 'url("https://images.pexels.com/photos/931018/pexels-photo-931018.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500")',
//     backgroundSize: 'cover',
//     backgroundRepeat: 'no-repeat',
//   };

//   const rightColStyle = {
//     background: '#FCFDFD',
//     width: '50vw',
//     height: '100vh',
//     padding: '5rem 3.5rem',
//   };

//   return (
//     <div style = {containerStyle} className={`contact-container ${darkMode ? 'dark-theme' : ''}` }>
//       <div className="left-col" style={leftColStyle}>
//         <img className="logo" src="https://www.indonesia.travel/content/dam/indtravelrevamp/en/logo.png" alt="Logo" />
//       </div>
//       <div className="right-col" style={rightColStyle}>
//         <div className="theme-switch-wrapper">
//           <label className="theme-switch" htmlFor="checkbox">
//             <input type="checkbox" id="checkbox" checked={darkMode} onChange={toggleDarkMode} />
//             <div className="slider round"></div>
//           </label>
//           <div className="description">Dark Mode</div>
//         </div>

//         <h1>Contact us</h1>
//         <p>If you have any questions or need assistance, please feel free to reach out to us using the form below:</p>

//         <form id="contact-form" method="post">
//           <label htmlFor="name">Full name</label>
//           <input type="text" id="name" name="name" placeholder="Your Full Name" required />
//           <label htmlFor="email">Email Address</label>
//           <input type="email" id="email" name="email" placeholder="Your Email Address" required />
//           <label htmlFor="message">Message</label>
//           <textarea rows="6" placeholder="Your Message" id="message" name="message" required></textarea>
//           <button type="submit" id="submit" name="submit">Send</button>
//         </form>
//         <div id="error"></div>
//         <div id="success-msg"></div>
//       </div>
//     </div>
//   );
// }

// export default ContactPage;
