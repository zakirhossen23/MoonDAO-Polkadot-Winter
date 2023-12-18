import { Button, IconButton, Modal } from '@heathmont/moon-core-tw';
import { ControlsClose, ControlsPlus, GenericPicture } from '@heathmont/moon-icons-tw';
import Head from 'next/head';
import NavLink from 'next/link';
import { NFTStorage } from 'nft.storage';
import { useState } from 'react';
import UseFormInput from '../../components/components/UseFormInput';
import UseFormTextArea from '../../components/components/UseFormTextArea';
import isServer from '../../components/isServer';
import useContract from '../../services/useContract';

export default function CreateGoalModal({ open, onClose }) {
  const [GoalImage, setGoalImage] = useState([]);
  const { contract, signerAddress, sendTransaction } = useContract();

  //Storage API for images and videos
  const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJDMDBFOGEzZEEwNzA5ZkI5MUQ1MDVmNDVGNUUwY0Q4YUYyRTMwN0MiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NDQ3MTgxOTY2NSwibmFtZSI6IlplbmNvbiJ9.6znEiSkiLKZX-a9q-CKvr4x7HS675EDdaXP622VmYs8';
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

  //Input fields
  const [GoalTitle, GoalTitleInput] = UseFormInput({
    defaultValue: '',
    type: 'text',
    placeholder: 'Goal name',
    id: ''
  });

  const [GoalDescription, GoalDescriptionInput] = UseFormTextArea({
    defaultValue: '',
    placeholder: 'Goal Description',
    id: '',
    rows: 4
  });

  const [EndDate, EndDateInput] = UseFormInput({
    defaultValue: '',
    type: 'datetime-local',
    placeholder: 'End date',
    id: 'enddate'
  });

  const [Budget, BudgetInput] = UseFormInput({
    defaultValue: '',
    type: 'text',
    placeholder: 'Budget',
    id: 'goal'
  });
  let id = -1;

  let StructureLeft = {
    0: 'Representatives Berlin',
    1: 'Community',
    2: 'Children'
  };
  let StructureRight = {
    0: '20%',
    1: '70%',
    2: '10%'
  };

  async function CheckTransaction() {
    let params = new URL(window.location).searchParams;
    if (params.get('transactionHashes') !== null) {
      window.location.href = `/daos`;
    }
  }

  if (!isServer()) {
    // All this kinda stuff should be in useEffects()
    CheckTransaction();
  }

  //Function after clicking Create Goal Button
  async function createGoal() {
    var CreateGoalBTN = document.getElementById('CreateGoalBTN');
    CreateGoalBTN.disabled = true;
    let allFiles = [];
    for (let index = 0; index < GoalImage.length; index++) {
      //Gathering all files link
      const element = GoalImage[index];
      const metadata = await client.storeBlob(element);
      const urlImageGoal = {
        url: 'https://' + metadata + '.ipfs.nftstorage.link',
        type: element.type
      };
      allFiles.push(urlImageGoal);
    }

    //Creating an object of all information to store in EVM
    const createdObject = {
      title: 'Asset Metadata',
      type: 'object',
      properties: {
        Title: {
          type: 'string',
          description: GoalTitle
        },
        Description: {
          type: 'string',
          description: GoalDescription
        },
        Budget: {
          type: 'string',
          description: Budget
        },
        End_Date: {
          type: 'string',
          description: EndDate
        },
        wallet: {
          type: 'string',
          description: signerAddress
        },
        logo: {
          type: 'string',
          description: allFiles[0]
        },
        allFiles
      }
    };
    console.log('======================>Creating Goal');

    try {
      // Creating Goal in Smart contract
      await sendTransaction(await window.contract.populateTransaction.create_goal(JSON.stringify(createdObject), Number(id), signerAddress.toLocaleLowerCase()));
      onClose();
    } catch (error) {
      console.error(error);
      return;
      // window.location.href = "/login?[/]"; //If found any error then it will let the user to login page
    }
    window.location.href = `/daos/dao?[${id}]`; //After the success it will redirect the user to dao page
  }

  function CreateGoalBTN() {
    return (
      <>
        <div className="flex gap-4 justify-end">
          <Button id="CreateGoalBTN justify-end" onClick={createGoal}>
            <ControlsPlus className="text-moon-24" />
            Create goal
          </Button>
        </div>
      </>
    );
  }
  function FilehandleChange(goal) {
    // If user uploaded images/videos
    var allNames = [];
    for (let index = 0; index < goal.target.files.length; index++) {
      const element = goal.target.files[index].name;
      allNames.push(element);
    }
    for (let index2 = 0; index2 < goal.target.files.length; index2++) {
      setGoalImage((pre) => [...pre, goal.target.files[index2]]);
    }
  }
  if (!isServer()) {
    const regex = /\[(.*)\]/g;
    const str = decodeURIComponent(window.location.search);
    let m;

    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      id = m[1];
    }
  }
  function AddBTNClick(goal) {
    //Clicking on +(Add) Function
    var GoalImagePic = document.getElementById('GoalImage');
    GoalImagePic.click();
  }

  function DeleteSelectedImages(goal) {
    //Deleting the selected image
    var DeleteBTN = goal.currentTarget;
    var idImage = Number(DeleteBTN.getAttribute('id'));
    var newImages = [];
    var allUploadedImages = document.getElementsByName('deleteBTN');
    for (let index = 0; index < GoalImage.length; index++) {
      if (index != idImage) {
        const elementDeleteBTN = allUploadedImages[index];
        elementDeleteBTN.setAttribute('id', newImages.length.toString());
        const element = GoalImage[index];
        newImages.push(element);
      }
    }
    setGoalImage(newImages);
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Backdrop />
      <Modal.Panel className="bg-gohan w-[90%] max-w-[600px] max-h-[90vh]">
        <div className={`flex items-center justify-center flex-col`}>
          <div className="flex justify-between items-center w-full border-b border-beerus py-4 px-6">
            <h1 className="text-moon-20 font-semibold">Create goal</h1>
            <IconButton className="text-trunks" variant="ghost" icon={<ControlsClose />} onClick={onClose} />
          </div>
          <div className="flex flex-col gap-6 w-full p-6  max-h-[calc(90vh-162px)] overflow-auto">
            <div className="flex flex-col gap-2">
              <h6>Goal name</h6>
              {GoalTitleInput}
            </div>

            <div className="flex flex-col gap-2">
              <h6>Description</h6>
              {GoalDescriptionInput}
            </div>
            <div className="flex gap-8 w-full">
              <div className="flex flex-col gap-2 w-full">
                <h6>Budget</h6>
                {BudgetInput}
              </div>
            </div>
            <div className="flex gap-8 w-full">
              <div className="flex-1">
                <h6>End Date</h6>
                {EndDateInput}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h6>Content</h6>
              <div style={{ borderColor: '#6578F2' }} className="border-4 border-dashed content-start flex flex-row flex-wrap gap-4 h-full inset-0 justify-start m-auto overflow-auto p-1 relative text-center text-white w-full z-20">
                <input className="file-input" hidden onChange={FilehandleChange} id="GoalImage" name="GoalImage" type="file" multiple="multiple" />
                <div className="flex gap-4">
                  {GoalImage.map((item, i) => {
                    return (
                      <div key={i} className="flex gap-4">
                        <button onClick={DeleteSelectedImages} name="deleteBTN" id={i}>
                          {item.type.includes('image') ? (
                            <img src={URL.createObjectURL(item)} />
                          ) : (
                            <>
                              <div className="Goal-Uploaded-File-Container">
                                <span className="Goal-Uploaded-File-name">{item.name.substring(0, 10)}...</span>
                              </div>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                  <div className="Goal-ImageAdd">
                    <Button id="Add-Image" onClick={AddBTNClick} variant="secondary" style={{ height: 80, padding: '1.5rem' }} iconLeft="true" size="lg">
                      <GenericPicture className="text-moon-24" />
                      Add image
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h6>Structure</h6>
              <div className="flex gap-8">
                <div className="bg-white rounded-lg flex flex-1 flex-col gap-1 text-moon-18 font-semibold pb-0 gap-6 pt-3">
                  <h6
                    onInput={(e) => {
                      StructureLeft[0] = e.currentTarget.innerText;
                    }}
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    className=" hover:cursor-pointer bg-white flex items-center rounded-lg w-full outline-none"
                  >
                    Representatives
                  </h6>
                  <h6
                    onInput={(e) => {
                      StructureLeft[1] = e.currentTarget.innerText;
                    }}
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    className=" hover:cursor-pointer bg-white flex items-center rounded-lg w-full outline-none"
                  >
                    Community
                  </h6>
                  <h6
                    onInput={(e) => {
                      StructureLeft[2] = e.currentTarget.innerText;
                    }}
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    className=" hover:cursor-pointer bg-white flex items-center rounded-lg w-full outline-none"
                  >
                    Children
                  </h6>
                </div>
                <div className="bg-white rounded-lg flex flex-1 flex-col gap-2 p-2  pb-2 w-48 pb-0">
                  <h6
                    onInput={(e) => {
                      StructureRight[0] = e.currentTarget.innerText;
                    }}
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    className="border border-beerus hover:cursor-pointer bg-white flex hover:bg-goku items-center p-2 rounded-lg w-full outline-none"
                  >
                    20%
                  </h6>
                  <h6
                    onInput={(e) => {
                      StructureRight[1] = e.currentTarget.innerText;
                    }}
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    className="border border-beerus hover:cursor-pointer bg-white flex hover:bg-goku items-center p-2 rounded-lg w-full outline-none"
                  >
                    70%
                  </h6>
                  <h6
                    onInput={(e) => {
                      StructureRight[2] = e.currentTarget.innerText;
                    }}
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    className="border border-beerus hover:cursor-pointer bg-white flex hover:bg-goku items-center p-2 rounded-lg w-full outline-none"
                  >
                    10%
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between border-t border-beerus w-full p-6">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button id="CreateGoalBTN" onClick={createGoal}>
            <ControlsPlus className="text-moon-24" />
            Create goal
          </Button>
        </div>
      </Modal.Panel>
    </Modal>
  );
}
