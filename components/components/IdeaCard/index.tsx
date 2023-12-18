import Image from 'next/image';
import { Idea } from '../../../data-model/idea';
import Card from '../Card/Card';
import Link from 'next/link';
import { Button } from '@heathmont/moon-core-tw';
import { ArrowsRightShort, GenericHeart, ShopCryptoCoin } from '@heathmont/moon-icons-tw';

const IdeaCard = ({ item, onClickVote, onClickDonate }: { item: Idea; onClickVote; onClickDonate }) => {
  return (
    <Card className="max-w-[720px]">
      <div className="flex w-full">
        <div className="rounded-moon-s-md overflow-hidden" style={{ position: 'relative', width: '188px', minWidth: '188px', height: '188px' }}>
          <Image layout="fill" objectFit="cover" src="/placeholders/idea.png" alt="" />
        </div>
        <div className="flex flex-1 flex-col gap-2 relative px-5 text-moon-16">
          <p className="font-semibold text-moon-18">{item.Title}</p>
          <div>
            <p className="font-semibold text-moon-20 text-hit">DEV 200</p>
            <p>in donations</p>
          </div>
          <div>
            <p className="font-semibold text-moon-20 text-hit">4</p>
            <p>Votes</p>
          </div>
          <div className="absolute bottom-0 right-0 flex gap-2">
            <Button variant="secondary" iconLeft={<GenericHeart />} onClick={onClickVote}>
              Vote
            </Button>
            <Button variant="secondary" iconLeft={<ShopCryptoCoin />} onClick={onClickDonate}>
              Donate
            </Button>
            <Link href={`/daos/dao/goal/ideas?[${item.ideasId}]`}>
              <Button iconLeft={<ArrowsRightShort />}>Go to idea</Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default IdeaCard;
