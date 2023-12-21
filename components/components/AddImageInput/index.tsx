import { Button } from '@heathmont/moon-core-tw';
import { GenericPicture } from '@heathmont/moon-icons-tw';

const AddImageInput = ({ onClick }) => (
  <Button className="bg-goku min-h-[128px] w-[180px] text-trunks border-beerus shadow-none" onClick={onClick} variant="secondary" style={{padding: '1.5rem' }} iconLeft={<GenericPicture className="text-moon-24" />} size="lg">
    Add image
  </Button>
);

export default AddImageInput;
