import Image from "next/image";
import { Nav } from "../Nav";
import styles from "./Header.module.scss";

export const Header = () => {
  return (
    <header className={`w-full px-8 py-4 gap-4 flex justify-between z-1 ${styles.header}`}>
      <a href="/" >
        <div className={`inline-flex ${styles.logo}`}>
          <Image
            height={48}
            width={119}
            src="/images/logo.png"
            alt="planetDAO"
            style={{
              maxWidth: "119px",
              height: "auto"
            }} />
        </div>
      </a>
      <Nav />
    </header>
  );
};

export default Header;
