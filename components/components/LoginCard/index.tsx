import Image from 'next/image';
import Card from '../Card';
import { Button } from '@heathmont/moon-core-tw';
import { GenericCheckRounded, GenericClose, SoftwareLogOut, SoftwareLogin } from '@heathmont/moon-icons-tw';
import { MouseEventHandler } from 'react';
import UseFormInput from '../UseFormInput';

const LoginCard = ({ step, onConnect, onConnectMetamask, onConnectPolkadot }: { step: number; onConnect: MouseEventHandler<HTMLButtonElement>; onConnectMetamask: MouseEventHandler<HTMLButtonElement>; onConnectPolkadot: MouseEventHandler<HTMLButtonElement> }) => {
  const [Email, EmailInput] = UseFormInput({
    defaultValue: '',
    type: 'email',
    placeholder: 'Email',
    id: ''
  });

  const [Password, PasswordInput] = UseFormInput({
    defaultValue: '',
    type: 'password',
    placeholder: 'Password',
    id: ''
  });

  const LoginForm = () => (
    <Card className="max-w-[480px]">
      <div className="flex w-full flex-col gap-10">
        <div className="flex flex-1 justify-between items-center relative text-moon-16">
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-2">
              <h6>Email</h6>
              {EmailInput}
            </div>
            <div className="flex flex-col gap-2">
              <h6>Password</h6>
              {PasswordInput}
            </div>
          </div>
        </div>
        <div className="flex w-full justify-end">
          <Button onClick={onConnect}>Next</Button>
        </div>
      </div>
    </Card>
  );

  const ConnectMetamaskButton = () => (
    <Card className="max-w-[480px]">
      <div className="flex w-full flex-col gap-10">
        <div className="flex items-center">
          <div className="rounded-moon-s-md border border-beerus p-2 mr-6">
            <Image height={64} width={64} src="https://metamask.io/images/metamask-logo.png" alt="" />
          </div>
          <p className="font-bold text-moon-20 flex-1">Metamask</p>
          <Button iconLeft={<SoftwareLogin />} onClick={onConnectMetamask}>
            Connect
          </Button>
        </div>
      </div>
    </Card>
  );

  const ConnectPolkadotButton = () => (
    <Card className="max-w-[480px] w-full">
      <div className="flex w-full flex-col gap-10">
        <div className="flex items-center">
          <div className="rounded-moon-s-md border border-beerus p-2 mr-6">
            <Image height={64} width={64} src="/images/polkadot.svg" alt="" />
          </div>
          <p className="font-bold text-moon-20 flex-1">Polkadot JS</p>
          <Button iconLeft={<SoftwareLogin />} onClick={onConnectPolkadot}>
            Connect
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <>
      {step === 1 && LoginForm()}
      {step === 2 && (
        <div className="flex flex-col gap-4 w-full items-center">
          {ConnectMetamaskButton()}
          <div>Or</div>
          {ConnectPolkadotButton()}
        </div>
      )}
    </>
  );
};

export default LoginCard;
