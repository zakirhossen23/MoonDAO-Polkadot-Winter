import { formatDuration, intervalToDuration } from 'date-fns';
import Card from '../Card';
import { Activity } from '../../../data-model/activity';
import { Avatar, IconButton } from '@heathmont/moon-core-tw';
import { GenericHeart, GenericPending, GenericUser } from '@heathmont/moon-icons-tw';
import IdeaCard from '../IdeaCard';

const JoinActivity = ({ data }) => (
  <div className="flex gap-4 w-full items-center">
    <Avatar size="lg" className="rounded-full bg-goku">
      <GenericUser className="text-moon-32" />
    </Avatar>
    <p>
      <span className="text-piccolo">{data.name}</span> just joined this community
    </p>
  </div>
);

const VoteActivity = ({ data }) => (
  <div className="flex flex-col gap-3">
    <div className="flex gap-4 w-full items-center">
      <Avatar size="lg" className="rounded-full bg-dodoria-60 text-bulma">
        <GenericHeart className="text-moon-32" />
      </Avatar>
      <p>
        <span className="font-bold">{data.votesAmount} people voted</span> on an idea for the goal {data.idea.Title}
      </p>
    </div>
    <IdeaCard item={data.idea} hideDonate hideVote />
  </div>
);

const ActivityCard = ({ date, type, data }: Activity) => {
  const duration = intervalToDuration({ start: new Date(), end: date });

  // Format the duration
  const formattedDuration = formatDuration(duration, { format: ['days', 'hours'], zero: false });

  return (
    <Card className="max-w-[720px] flex flex-col">
      <div className="w-full text-trunks flex justify-between">
        <p className="text-moon-14">{formattedDuration} ago</p>
        <IconButton variant="ghost" icon={<GenericPending className="text-moon-32 text-trunks" />}></IconButton>
      </div>
      {type === 'join' && <JoinActivity data={data} />}
      {type === 'vote' && <VoteActivity data={data} />}
    </Card>
  );
};

export default ActivityCard;
