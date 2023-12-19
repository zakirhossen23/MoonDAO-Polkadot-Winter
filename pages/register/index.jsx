import Head from 'next/head';
import UseFormInput from '../../components/components/UseFormInput';
import { FilesGeneric } from '@heathmont/moon-icons-tw';
import Card from '../../components/components/Card';
import { Button, IconButton } from '@heathmont/moon-core-tw';

export default function Register() {
  //Input fields
  const [Fullname, FullnameInput] = UseFormInput({
    defaultValue: '',
    type: 'text',
    placeholder: 'Full Name',
    id: ''
  });

  const [Email, EmailInput] = UseFormInput({
    defaultValue: '',
    type: 'text',
    placeholder: 'Email',
    id: ''
  });

  const [Password, PasswordInput] = UseFormInput({
    defaultValue: '',
    type: 'password',
    placeholder: 'Password',
    id: ''
  });

  return (
    <>
      <Head>
        <title>Register</title>
        <meta name="description" content="PlanetDAO - Register" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex items-center flex-col gap-8">
        <div className="gap-8 flex flex-col w-full bg-gohan pt-10 pb-6 border-beerus border">
          <div className="container flex w-full justify-between">
            <div className="flex flex-col gap-1 overflow-hidden">
              <h1 className="text-moon-32 font-bold">Register your account</h1>
              <h3 className="flex gap-2 whitespace-nowrap">It just takes a couple of clicks</h3>
            </div>
          </div>
        </div>
        <Card className="max-w-[480px]">
          <div className="flex items-center justify-center flex-col w-full gap-6">
            <div className="flex flex-col gap-6 w-full p-6">
              <div className="upload">
                <img src="/images/noprofil.jpg" width={120} height={120} alt="" />
                <div className="flex items-center justify-center round">
                  <input type="file" />
                  <IconButton size="xs" icon={<FilesGeneric className="text-gohan" color="#ffff" />}></IconButton>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 w-full">
              <div className="flex flex-col gap-2">
                <h6>Full Name</h6>
                {FullnameInput}
              </div>
              <div className="flex flex-col gap-2">
                <h6>Email</h6>
                {EmailInput}
              </div>
              <div className="flex flex-col gap-2">
                <h6>Password</h6>
                {PasswordInput}
              </div>
            </div>

            <div className="flex w-full justify-end">
              <Button id="RegisterBTN" onClick={null}>
                Register
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
