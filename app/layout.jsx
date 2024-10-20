
import Provider from '@components/Provider'
import Head from 'next/head';
import Nav from '@components/Nav'
import Footer from '@components/Footer'
import '@styles/globals.css';

export const RootLayout = ({ children }) => {
  // If loading a variable font, you don't need to specify the font weight

  return (
    
    <html lang="en">
      <head>
        {/* Add the Google Fonts link */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Provider>
          <div className="main">
              <div className="gradient" />
          </div>
          
            <main className="app">
              <Nav/>
              {children}
              <Footer/>
          </main>
          
        </Provider>
      </body>
      
    </html>
  );
}

export default RootLayout
