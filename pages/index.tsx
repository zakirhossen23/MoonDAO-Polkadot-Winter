import { Button } from '@heathmont/moon-core-tw';
import Head from 'next/head';
import Image from 'next/image';
import styles from './Home.module.scss';
import { useState } from 'react';
import CreateDaoModal from '../features/CreateDaoModal';

export default function Welcome() {
  const [showCreateDaoModal, setShowCreateDaoModal] = useState(false);

  function closeModal() {
    setShowCreateDaoModal(false);
  }

  function openModal() {
    setShowCreateDaoModal(true);
  }

  return (
    <>
      <Head>
        <title>PlanetDAO</title>
        <meta name="description" content="PlanetDAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.section}>
        <div className={styles.text}>
          <div className={`${styles.logo}`}>
            <Image
              width={160}
              height={160}
              src="/home/logo-square-black.svg"
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
            <Button onClick={openModal}>Create a DAO community</Button>
          </div>
        </div>
        <div className={styles.image}>
          <Image
            src={'/home/section-1-img.jpg'}
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
            src={'/home/section-2-img.jpg'}
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
              src="/home/logo-square-white.svg"
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
            <Button onClick={openModal}>Create a DAO community</Button>
          </div>
        </div>
      </div>

      <CreateDaoModal open={showCreateDaoModal} onClose={closeModal} />
    </>
  );
}
