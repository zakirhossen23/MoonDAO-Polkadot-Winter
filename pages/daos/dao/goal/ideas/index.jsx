import { Button } from '@heathmont/moon-core-tw';
import { GenericEdit, GenericHeart, ShopCryptoCoin } from '@heathmont/moon-icons-tw';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import CommentBox from '../../../../../components/components/CommentBox';
import SlideShow from '../../../../../components/components/Slideshow';
import UseFormTextArea from '../../../../../components/components/UseFormTextArea';
import DonateCoinModal from '../../../../../features/DonateCoinModal';
import VoteConviction from '../../../../../components/components/modal/VoteConviction';
import useContract from '../../../../../services/useContract';
import Image from 'next/image';
import Loader from '../../../../../components/components/Loader';

export default function GrantIdeas() {
  const [ideaId, setIdeasId] = useState(-1);
  const [Goal_id, setGoal_id] = useState(-1);
  const [PollIndex, setPollIndex] = useState(-1);
  const [imageList, setimageList] = useState([]);
  const [IdeasURI, setIdeasURI] = useState({ ideasId: '', Title: '', Description: '', Referenda: 0, wallet: '', logo: '', End_Date: '', voted: 0, delegAmount: 0, delegDated: '', isVoted: true, isOwner: true, allfiles: [] });
  const [DonatemodalShow, setDonatemodalShow] = useState(false);
  const [VotingShow, setVotingShow] = useState(false);
  const [AccountAddress, setAccountAddress] = useState('');
  const { contract, signerAddress, sendTransaction, saveReadMessage } = useContract();

  const [Comment, CommentInput, setComment] = UseFormTextArea({
    defaultValue: '',
    placeholder: 'Add a comment',
    id: '',
    name: 'comment',
    rows: 1,
    minHeight: 54
  });
  const [emptydata, setemptydata] = useState([]);

  const [CommentsList, setCommentsList] = useState([
    {
      id: 0,
      comment: '',
      address: '',
      date: '',
      replies: [
        {
          id: 0,
          message: '',
          address: '',
          date: ''
        }
      ]
    }
  ]);

  let m;
  let id = ''; //Ideas id from url
  let Goalid = ''; //Goal id

  useEffect(() => {
    const regex = /\[(.*)\]/g;
    const str = decodeURIComponent(window.location.search);

    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches

      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      id = m[1];
    }

    fetchContractData();
  }, [contract]);

  // useEffect(() => {
  //   function SetReadSettings() {
  //     var messages = document.querySelectorAll('.read-message');
  //     for (let i = 0; i < messages.length; i++) {
  //       const element = messages[i];
  //       observerMessage.observe(element);
  //     }
  //     var replys = document.querySelectorAll('.read-reply');
  //     for (let i = 0; i < replys.length; i++) {
  //       const element = replys[i];
  //       observerReply.observe(element);
  //     }
  //   }
  // }, [emptydata]);

  useEffect(() => {
    DesignSlide();
  });

  async function fetchContractData() {
    try {
      if (contract && id) {
        setIdeasId(id); //setting Ideas id
        id = Number(id);

        const ideaURI = await contract.ideas_uri(Number(id)); //Getting ideas uri
        const object = JSON.parse(ideaURI); //Getting ideas uri
        Goalid = await contract.get_goal_id_from_ideas_uri(ideaURI);
        setGoal_id(Goalid);
        const goalURI = JSON.parse(await contract.goal_uri(Number(Goalid))); //Getting goal URI
        let isvoted = false;
        const Allvotes = await contract.get_ideas_votes_from_goal(Number(Goalid), Number(id)); //Getting all votes
        for (let i = 0; i < Allvotes.length; i++) {
          const element = Allvotes[i];
          if (element === signerAddress) isvoted = true;
        }

        setAccountAddress(object.properties.wallet.description);
        setPollIndex(object.properties?.Referenda?.description);
        setIdeasURI({
          ideasId: id,
          Title: object.properties.Title.description,
          Description: object.properties.Description.description,
          Referenda: object.properties?.Referenda?.description,
          wallet: object.properties.wallet.description,
          logo: object.properties.logo.description?.url,
          End_Date: goalURI.properties.End_Date?.description,
          votesAmount: Object.keys(Allvotes).length,
          donation: Number((await contract._ideas_uris(Number(id))).donation) / 1e18,
          isVoted: isvoted,
          isOwner: object.properties.wallet.description.toString().toLocaleLowerCase() === signerAddress.toString().toLocaleLowerCase() ? true : false,
          allfiles: object.properties.allFiles
        });

        setimageList(object.properties.allFiles);

        // Comments and Replies
        const totalComments = await contract.getMsgIDs(Number(id)); //Getting total comments (Number) of this idea

        totalComments.forEach(async (comment) => {
          //total comments number Iteration
          const commentId = Number(comment);
          let commentInfo = await contract.all_messages(commentId);

          const object = JSON.parse(commentInfo.message);
          let newComment = {
            address: object.address,
            message: object.message,
            date: object.date,
            id: object.id,
            replies: []
          };

          const totalReplies = await contract.getReplyIDs(Number(commentId)); //Getting total replies (Number) of this comment

          totalReplies.forEach(async (reply) => {
            const replyId = Number(reply);
            let replyInfo = await contract.all_replies(replyId);
            const object = JSON.parse(replyInfo.message);
            let newReply = {
              id: object.id,
              message: object.message,
              address: object.address,
              date: object.date
            };
            newComment.replies.push(newReply);
            // console.log('LIST', CommentsList);
          });

          CommentsList.push(newComment);
          console.log(CommentsList);
        });
        removeElementFromArrayBYID(emptydata, 0, setemptydata);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function DesignSlide() {
    if (document.querySelector('[data-type="prev"]') !== null) {
      document.querySelector('[data-type="prev"]').innerHTML =
        '<div className="undefined nav " data-type="prev" aria-label="Previous Slide" style="width: 45px;margin-right: -50px;cursor: pointer;"><div className="undefined nav " data-type="prev" aria-label="Previous Slide" style="color: black;cursor: pointer;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 79 79"><svg xmlns="http://www.w3.org/2000/svg" width="79" height="79" fill="none"><g filter="url(#filter0_b_48_4254)"><circle cx="39.5" cy="39.5" r="39.5" fill="white"></circle><circle cx="39.5" cy="39.5" r="39.25" stroke="#C4C4C4" stroke-width="0.5"></circle></g><path d="M29.0556 39.9087L42.3821 26.6582C42.8187 26.2244 43.5256 26.2251 43.9615 26.6605C44.3971 27.0958 44.3959 27.801 43.9592 28.2353L31.426 40.6971L43.9597 53.1588C44.3963 53.5931 44.3974 54.2979 43.9619 54.7333C43.7434 54.9515 43.4572 55.0606 43.1709 55.0606C42.8854 55.0606 42.6002 54.9522 42.3821 54.7355L29.0556 41.4854C28.8453 41.2768 28.7273 40.9929 28.7273 40.6971C28.7273 40.4013 28.8456 40.1177 29.0556 39.9087Z" fill="black"></path><defs><filter id="filter0_b_48_4254" x="-4" y="-4" width="87" height="87" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feGaussianBlur in="BackgroundImageFix" stdDeviation="2"></feGaussianBlur><feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_48_4254"></feComposite><feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_48_4254" result="shape"></feBlend></filter></defs></svg></svg></div></div>';
      document.querySelector('[data-type="next"]').innerHTML =
        '<div className="undefined nav " data-type="next" aria-label="Next Slide" style="width: 45px;margin-left: -17px;cursor: pointer;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 79 79" fill="#2e2e2e"><svg width="79" height="79" viewBox="0 0 79 79" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_b_48_4262)"><circle cx="39.5" cy="39.5" r="39.5" fill="white"></circle><circle cx="39.5" cy="39.5" r="39.25" stroke="#C4C4C4" stroke-width="0.5"></circle></g><path d="M43.9596 41.4853L30.6331 54.7358C30.1965 55.1697 29.4896 55.169 29.0537 54.7336C28.6181 54.2982 28.6192 53.593 29.0559 53.1588L41.5892 40.697L29.0555 28.2352C28.6188 27.801 28.6177 27.0962 29.0532 26.6608C29.2717 26.4425 29.558 26.3334 29.8443 26.3334C30.1298 26.3334 30.4149 26.4418 30.633 26.6585L43.9596 39.9087C44.1699 40.1173 44.2879 40.4012 44.2879 40.697C44.2879 40.9928 44.1696 41.2763 43.9596 41.4853Z" fill="black"></path><defs><filter id="filter0_b_48_4262" x="-4" y="-4" width="87" height="87" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feGaussianBlur in="BackgroundImageFix" stdDeviation="2"></feGaussianBlur><feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_48_4262"></feComposite><feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_48_4262" result="shape"></feBlend></filter></defs></svg></svg></div>';
      document.querySelector('.react-slideshow-zoom-wrapper').classList.add('rounded-xl');
      document.querySelector('.react-slideshow-container').classList.add('overflow-hidden rounded-xl');
      document.querySelector('.react-slideshow-container').style.height = '500px';
    }
  }

  async function VoteIdea() {
    if (IdeasURI.Referenda != 0) {
      setVotingShow(true);
      return;
    }
    try {
      await sendTransaction(await window.contract.populateTransaction.create_goal_ideas_vote(Number(Goalid), Number(id), signerAddress));
    } catch (error) {
      console.error(error);
      return;
    }
    window.location.reload();
  }

  async function DonateToAddress() {
    setDonatemodalShow(true);
  }

  async function removeElementFromArrayBYID(all, specificid, seting) {
    seting([]);
    var storing = [];
    for (let index = 0; index < all.length; index++) {
      const element = all[index];
      if (element.id == specificid) {
        continue;
      }
      storing.push(element);
    }

    seting(storing);
  }

  async function PostComment(e) {
    e.preventDefault();

    let messLatestId = Number(await contract._message_ids());
    let newComment = {
      address: window?.ethereum?.selectedAddress?.toLocaleLowerCase().toString(),
      message: Comment,
      date: new Date().toISOString(),
      id: messLatestId
    };
    await saveMessage(newComment);
    newComment.replies = [];
    CommentsList.push(newComment);
    setComment('');
    removeElementFromArrayBYID(emptydata, 0, setemptydata);
  }

  async function saveMessage(newComment) {
    await sendTransaction(await window.contract.populateTransaction.sendMsg(Number(ideaId), JSON.stringify(newComment), window?.ethereum?.selectedAddress?.toLocaleLowerCase()));
    removeElementFromArrayBYID(emptydata, 0, setemptydata);
    console.log('Saved Messages');
  }

  async function sendReply(replyText, MessageId, MessageIndex) {
    let replyLatestId = Number(await contract._reply_ids());
    let newReply = {
      id: replyLatestId,
      message: replyText,
      address: window?.ethereum?.selectedAddress?.toLocaleLowerCase().toString(),
      date: new Date().toISOString()
    };
    CommentsList[MessageIndex].replies.push(newReply);
    await sendTransaction(await window.contract.populateTransaction.sendReply(Number(MessageId), JSON.stringify(newReply), Number(ideaId), window?.ethereum?.selectedAddress?.toLocaleLowerCase()));
    removeElementFromArrayBYID(emptydata, 0, setemptydata);
    console.log('Saved Reply');
  }

  const uniqueAndSort = (comments) => Array.from(new Map(comments.map((item) => [item.id, item])).values()).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <>
      <Head>
        <title>{IdeasURI.Title}</title>
        <meta name="description" content={IdeasURI.Title} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex items-center flex-col gap-8">
        <div className={`gap-8 flex flex-col w-full bg-gohan pt-10 pb-6 border-beerus border`}>
          <div className="container flex w-full justify-between relative">
            <div className="flex flex-col gap-1">
              <h5 className="font-semibold">Harvard University &gt; Goals &gt; Ideas</h5>
              <h1 className="text-moon-32 font-bold">{IdeasURI.Title}</h1>
              <h3 className="flex gap-2 whitespace-nowrap">
                <div>
                  Donated <span className="text-hit font-semibold">DEV {IdeasURI.donation}</span>
                </div>
                <div>•</div>
                <div>
                  <span className="text-hit font-semibold">{IdeasURI.votesAmount}</span> votes
                </div>
                <div>•</div>
                <div className="flex">
                  Created by &nbsp;<span className="truncate text-piccolo max-w-[120px]">{IdeasURI.wallet}</span>
                </div>
              </h3>
            </div>
            <div className="flex flex-col gap-2">
              <Button iconLeft={<ShopCryptoCoin />} onClick={DonateToAddress}>
                Donate
              </Button>

              <Button iconLeft={IdeasURI.isVoted ? <GenericHeart fill="red" color="red" /> : <GenericHeart />} variant="secondary" onClick={VoteIdea}>
                Vote
              </Button>
              {IdeasURI.isOwner && (
                <Button iconLeft={<GenericEdit />} variant="secondary" className="w-full">
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="container flex flex-col gap-6">
          <p>{IdeasURI.Description}</p>
          <Loader
            element={
              imageList.length > 1 ? (
                <>
                  <SlideShow images={imageList} />
                </>
              ) : (
                <>
                  <div className="flex-1 rounded-xl overflow-hidden flex" style={{ height: '500px' }}>
                    <Image type={imageList[0]?.type} src={imageList[0]?.url} alt="" />
                  </div>
                </>
              )
            }
            width={800}
            height={500}
          />{' '}
          <div className="full-w">
            <form onSubmit={PostComment} className="full-w flex flex-col gap-2">
              {CommentInput}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button data-element-id="btn_donate" style={{ width: '135px' }} data-analytic-event-listener="true" type="submit">
                  Post Comment
                </Button>
              </div>
            </form>
          </div>
          <div className="flex flex-col gap-6 pb-8">{uniqueAndSort(CommentsList).map((listItem, index) => (listItem.address !== '' ? <CommentBox address={listItem.address} MessageID={listItem.id} MessageIndex={index} date={listItem.date} sendReply={sendReply} message={listItem.message} replies={listItem.replies} id={listItem.id} key={listItem.id} /> : <></>))}</div>
        </div>
      </div>

      <DonateCoinModal
        ideasid={ideaId}
        show={DonatemodalShow}
        onHide={() => {
          setDonatemodalShow(false);
        }}
        address={AccountAddress}
      />
      <VoteConviction
        goal_id={Goal_id}
        idea_id={ideaId}
        PollIndex={PollIndex}
        show={VotingShow}
        onHide={() => {
          setVotingShow(false);
        }}
        address={AccountAddress}
      />
    </>
  );
}
