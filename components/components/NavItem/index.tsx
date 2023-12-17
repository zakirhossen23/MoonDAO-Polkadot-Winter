import { Button } from '@heathmont/moon-core-tw';
import Link from 'next/link';

const NavItem = ({ link, label, highlight }: { link: string, label: string, highlight: boolean}) => (
    <li>
        <Link href={link}>
            <Button style={{ background: 'none', border: '0px', color: 'white', fontWeight: highlight ? 600 : 400 }}>
                { label }
            </Button>
        </Link>
    </li>
);

export default NavItem;
