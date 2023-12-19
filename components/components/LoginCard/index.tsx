import Image from 'next/image';
import Card from '../Card/Card';
import { Button } from '@heathmont/moon-core-tw';
import { GenericCheckRounded, GenericClose, SoftwareLogOut, SoftwareLogin } from '@heathmont/moon-icons-tw';
import { MouseEventHandler } from 'react';

const LoginCard = ({ isConnected, hasMetamask, onConnect, onDisconnect, onInstall }: { isConnected: boolean; hasMetamask: boolean; onConnect: MouseEventHandler<HTMLButtonElement>; onDisconnect: MouseEventHandler<HTMLButtonElement>; onInstall: MouseEventHandler<HTMLButtonElement> }) => {
  const LoginButton = () => (
    <>
      <div className="flex flex-col">
        <p className="font-semibold">Metamask</p>
        <div className="flex text-dodoria items-center">
          <GenericClose fontSize={32} />
          Disconnected
        </div>
      </div>
      <Button iconLeft={<SoftwareLogin />} onClick={onConnect}>
        Connect
      </Button>
    </>
  );

  const LogoutButton = () => (
    <>
      <div className="flex flex-col">
        <p className="font-semibold">Metamask</p>
        <div className="flex text-hit items-center">
          <GenericCheckRounded fontSize={32} />
          Connected
        </div>
      </div>
      <Button iconLeft={<SoftwareLogOut />} onClick={onDisconnect}>
        Disconnect
      </Button>
    </>
  );

  const InstallMetamaskButton = () => (
    <>
      <div className="flex flex-col">
        <p className="font-semibold">Metamask</p>
        <div className="flex text-dodoria items-center">
          <GenericClose fontSize={32} />
          Disconnected
        </div>
      </div>
      <Button iconLeft={<SoftwareLogin />} onClick={onInstall}>
        Install
      </Button>{' '}
    </>
  );

  return (
    <Card className="max-w-[720px]">
      <div className="flex w-full">
        <div className="rounded-moon-s-md border border-beerus p-4">
          <Image height={64} width={64} src="https://metamask.io/images/metamask-logo.png" alt="" />
        </div>
        <div className="flex flex-1 justify-between items-center relative px-5 text-moon-16">{!hasMetamask ? InstallMetamaskButton() : isConnected ? LogoutButton() : LoginButton()}</div>
      </div>
    </Card>
  );
};

export default LoginCard;
