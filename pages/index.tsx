import { Button } from '@heathmont/moon-core-tw';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './Home.module.scss';

declare let window: any;
export default function Welcome() {
  const router = useRouter();
  function letstartCLICK() {
    if (typeof window.ethereum === 'undefined') {
      window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn', '_blank');
    } else if (window?.ethereum?.selectedAddress?.toLocaleLowerCase().toString() == null || window.localStorage.getItem('login-type') === 'metamask') {
      router.push('/login?[/daos]');
    } else {
      router.push('/daos');
    }
  }

  return (
    <>
      <Head>
        <title>MoonDAO</title>
        <meta name="description" content="MoonDAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.section}>
        <div className={styles.text}>
          <div className={`${styles.logo}`}>
            <Image
              width={160}
              height={160}
              src="/home/logo.png"
              alt=""
              style={{
                maxWidth: '100%',
                height: 'auto'
              }}
            />
          </div>
          <h1 className="text-moon-32 font-bold pt-2">Empower Your Community with Trust</h1>
          <p>PlanetDAO is Software-as-a-Service (SaaS) platform designed to empower communities with trust through the utilization of a decentralized autonomous organization (DAO) framework.</p>
          <p>PlanetDAO is built on the Polkadot infrastructure with the principles of transparency, collaboration, and fairness.</p>
          <p>PlanetDAO enables communities to govern themselves, make decisions collectively, have a transparency payments process and build trust-based ecosystems. Everything in just a couple clicks.</p>
          <p>Start your DAO today and give everyone in your community a voice!</p>
          <div>
            <Button onClick={letstartCLICK}>Create a DAO community</Button>
          </div>
        </div>
        <div className={styles.image}>
          <Image
            src={'/home/section-1-img.png'}
            alt=""
            fill
            sizes="100vw"
            style={{
              objectFit: 'cover'
            }}
          />
        </div>
      </div>
      <div className={`${styles.section} ${styles['section-dark']}`}>
        <div className={styles.image}>
          <Image
            src={'/home/section-2-img.png'}
            alt=""
            fill
            sizes="100vw"
            style={{
              objectFit: 'cover'
            }}
          />
        </div>
        <div className={styles.text}>
          <div className={`${styles.logo}`}>
            <Image
              width={160}
              height={160}
              src="/home/logo-inverse.png"
              alt=""
              style={{
                maxWidth: '100%',
                height: 'auto'
              }}
            />
          </div>
          <p>PlanetDAO is Software-as-a-Service (SaaS) platform designed to empower communities with trust through the utilization of a decentralized autonomous organization (DAO) framework.</p>
          <p>PlanetDAO is built on the Polkadot infrastructure with the principles of transparency, collaboration, and fairness.</p>
          <p>PlanetDAO enables communities to govern themselves, make decisions collectively, have a transparency payments process and build trust-based ecosystems. Everything in just a couple clicks.</p>
          <p>Start your DAO today and give everyone in your community a voice!</p>
          <div>
            <Button onClick={letstartCLICK}>Create a DAO community</Button>
          </div>
        </div>
      </div>
    </>
  );
}
