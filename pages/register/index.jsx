import Head from 'next/head';
import { useEffect, useState } from 'react';
import UseFormInput from '../../components/components/UseFormInput';
import { FilesGeneric } from '@heathmont/moon-icons-tw';
import { NavLink,Button } from 'react-bootstrap';

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


  function RegisterBTN() {
    return (
      <>
        <div className="flex gap-4 justify-end">
          <Button id="RegisterBTN"  className='btn btn-primary p-2'>
            Register
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Register</title>
        <meta name="description" content="PlanetDAO - Register" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='flex flex-col h-full items-center pt-10 w-full'>
        <div className='align-middle bg-gohan inline-block max-h-[95vh] max-w-[600px] opacity-100 rounded-xl scale-100 shadow-moon-lg transform transition-all w-[90%]'>
          <div className="flex items-center justify-center flex-col">
            <div className="flex justify-between items-center w-full border-b border-beerus py-4 px-6">
              <h1 className="text-moon-20 font-semibold">Register</h1>
            </div>
            <div className="flex flex-col gap-6 w-full p-6">
              <div className="upload">
                <img src="/images/noprofil.jpg" width={450} height={450} alt="" />
                <div className="round flex items-center justify-center round">
                  <input type="file" />
                  <FilesGeneric width={25} height={25} color='#ffff' />
                </div>
              </div>


            </div>

            <div className="flex flex-col gap-6 w-full p-6">
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

            <div className="flex justify-between border-t border-beerus w-full p-6">
         

              <RegisterBTN />
            </div>
          </div >
        </div>
      </div>


    </>
  );
}
