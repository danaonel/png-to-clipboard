import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import { format } from "date-fns";
import { toBlob } from "html-to-image";
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
    const [cbAccess, setCBAccess] = useState(null)
    const [pngInProgress, setPngInProgress] = useState(false)
    const [pngSuccess, setPngSuccess] = useState(false)
    useEffect( async () => {
        const queryOpts = { name: 'clipboard-write', allowWithoutGesture: true };
        if ( navigator && navigator.permissions ) {
            
            const permissionStatus = await navigator.permissions.query(queryOpts);
    
            if (permissionStatus.state === "granted") setCBAccess(true)
            else if (permissionStatus.state === "prompt") setCBAccess(false)
            else if (permissionStatus.state === "denied") setCBAccess(false)
            
            // Listen for changes to the permission state
            permissionStatus.onchange = () => {
              if (permissionStatus.state === "granted") setCBAccess(true)
            };
            
        }
        
    });
    
    const onPrintToPng = e => {
        e.preventDefault();
        
        if ( cbAccess ) {
            setPngInProgress(true)
            setPngSuccess(false)
            toBlob(document.getElementById("grid"),{backgroundColor: 'white'})
            .then((dataBlob) => {
      
              writeToCB(dataBlob)
            })
            .then(() => {
                setPngInProgress(false)
                setPngSuccess(true)
                setTimeout(resetPngBtn, 10000);
            });
  
        } else {
          alert("You do not have clipboard access")
        }
    }
    
    const writeToCB = async (dataBlob) => {
        const ClipboardItem = window.ClipboardItem
        const cbi = new ClipboardItem({
          'image/png': dataBlob
        });

        try {
          await navigator.clipboard.write([cbi]);
          console.log(`copied image to clipboard`);
        } catch (error) {
          console.error(error);
        }
    }
 
    const resetPngBtn = () => {
        setPngInProgress(false)
        setPngSuccess(false)
    };
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Png to clipboard</title>
        <meta name="description" content="Png to clipboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Clipboard permission
        </h1>
      
        <button
          className="btn btn-primary to-png"
          onClick={onPrintToPng}
        >
          {pngInProgress && (
            <Image
              src="/exporting.gif"
              width={20}
              height={20}
              alt="PNG in progress"
              className="gif-icon"
            />
          )}
          {pngSuccess && (
            <Image
              src="/success.png"
              width={20}
              height={20}
              alt="PNG is copied to clipboard"
              className="gif-icon"
            />
          )}
          Export as PNG
        </button>

          <div id="grid">
            <p className={styles.description}>
              Get started by editing{' '}
              <code className={styles.code}>pages/index.js</code>
            </p>

            <div className={styles.grid}>
              <a href="https://nextjs.org/docs" className={styles.card}>
                <h2>Documentation &rarr;</h2>
                <p>Find in-depth information about Next.js features and API.</p>
              </a>

              <a href="https://nextjs.org/learn" className={styles.card}>
                <h2>Learn &rarr;</h2>
                <p>Learn about Next.js in an interactive course with quizzes!</p>
              </a>

              <a
                href="https://github.com/vercel/next.js/tree/master/examples"
                className={styles.card}
              >
                <h2>Examples &rarr;</h2>
                <p>Discover and deploy boilerplate example Next.js projects.</p>
              </a>

              <a
                href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                className={styles.card}
              >
                <h2>Deploy &rarr;</h2>
                <p>
                  Instantly deploy your Next.js site to a public URL with Vercel.
                </p>
              </a>
            </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
