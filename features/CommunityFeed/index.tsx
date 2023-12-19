import ActivityCard from '../../components/components/ActivityCard';
import { Activity } from '../../data-model/activity';
import { Idea } from '../../data-model/idea';

const mockItems = [
  {
    date: new Date('2023-12-17T18:29:14+0000'),
    type: 'join',
    data: {
      name: '@arjenvgaal'
    }
  },
  {
    date: new Date('2023-12-17T18:29:14+0000'),
    type: 'vote',
    data: {
      votesAmount: 250,
      idea: {
        Title: 'Free WiFi for all students'
      }
    }
  }
] as Activity[];

const CommunityFeed = () => {
  return (
    <div className="container flex flex-col gap-2 w-full items-center">
      {mockItems.map((item, index) => (
        <ActivityCard key={index} date={item.date} type={item.type} data={item.data}></ActivityCard>
      ))}
    </div>
  );
};

export default CommunityFeed;
