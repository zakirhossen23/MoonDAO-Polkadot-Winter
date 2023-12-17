import { Button } from '@heathmont/moon-core-tw';
import Link from 'next/link';

export const NavItem = ({ link, label }: { link: string, label: string}) => (
    <li>
        <Link href={link}>
            <Button style={{ background: 'none', border: '0px', color: 'white', fontWeight: 400 }}>
                { label }
            </Button>
        </Link>
    </li>
);

export default NavItem;
