import { Button } from "@heathmont/moon-core-tw";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./Home.module.scss";

declare let window: any;
export default function Welcome() {
  const router = useRouter();
  function letstartCLICK() {
    if (typeof window.ethereum === "undefined") {
      window.open(
        "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
        "_blank"
      );
    } else  if (window?.ethereum?.selectedAddress?.toLocaleLowerCase().toString()  == null || window.localStorage.getItem("login-type") === "metamask") {
      router.push("/login?[/daos]");
    } else {
      router.push("/daos");
    }
  }

  return <>
    <Head>
      <title>MoonDAO</title>
      <meta name="description" content="MoonDAO" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className={styles.section}>
      <div className={styles.text}>
        <div className={`${styles.logo} pb-4`}>
          <Image
            width={256}
            height={256}
            src="/favicon.png"
            alt=""
            style={{
              maxWidth: "100%",
              height: "auto"
            }} />
        </div>
        <h1 className="text-moon-32 font-bold pt-2 pb-4">
        DAO as a service – Empower Your Community with Trust
        </h1>
        <p className="py-4">
MoonDAO is an innovative Software-as-a-Service (SaaS) platform designed to empower communities with trust through the utilization of a decentralized autonomous organization (DAO) framework. MoonDAO is built on the Moonbase infrastructure with the principles of transparency, collaboration, and fairness. MoonDAO enables communities to govern themselves, make decisions collectively, have a transparency payments process and build trust-based ecosystems. Everything in just a couple clicks. Start your DAO today and give everyone in your community a voice.

        </p>
        <div className="pt-4">
          <Button onClick={letstartCLICK}> Let's create DAO</Button>
        </div>
      </div>
      <div className={styles.image}>
        <Image
          src={'/home/section-1-img.jpg'}
          alt=""
          fill
          sizes="100vw"
          style={{
            objectFit: "cover"
          }} />
      </div>
    </div>
    <div className={`${styles.section} ${styles["section-dark"]}`}>
      <div className={styles.image}>
        <Image
          src={'/home/section-2-img.jpg'}
          alt=""
          fill
          sizes="100vw"
          style={{
            objectFit: "cover"
          }} />
      </div>
      <div className={styles.text}>
        <div className={`${styles.logo} pb-4`}>
          <Image
            width={256}
            height={256}
            src="/favicon.png"
            alt=""
            style={{
              maxWidth: "100%",
              height: "auto"
            }} />
        </div>
        <h1 className="text-moon-32 font-bold pb-4">DAO as a service – Empower Your Community with Trust</h1>
        <p className="py-4">

MoonDAO is an innovative Software-as-a-Service (SaaS) platform designed to empower communities with trust through the utilization of a decentralized autonomous organization (DAO) framework. MoonDAO is built on the Moonbase infrastructure with the principles of transparency, collaboration, and fairness. MoonDAO enables communities to govern themselves, make decisions collectively, have a transparency payments process and build trust-based ecosystems. Everything in just a couple clicks. Start your DAO today and give everyone in your community a voice.

        </p>
        <div className="pt-4">
          <Button onClick={letstartCLICK}> Let's create DAO</Button>
        </div>
      </div>
    </div>
  </>;
}
